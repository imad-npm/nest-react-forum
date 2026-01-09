import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { PostSort } from './dto/post-query.dto';
import { CommunityType } from 'src/communities/types';
import { Community } from 'src/communities/entities/community.entity';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';
import { CommunityMembershipRole } from 'src/community-memberships/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostCreatedEvent } from './events/post-created.event';
import { buffer } from 'stream/consumers';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityMembership)
    private readonly membershipRepository: Repository<CommunityMembership>,
    private eventEmitter: EventEmitter2,
  ) {}
  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      authorId?: number;
      sort?: PostSort;
      dateRange?: string;
      currentUserId?: number;
      communityId?: number;
      status?: PostStatus | "all";
    },
  ): Promise<{
    data: Post[];
    count: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      authorId,
      sort,
      dateRange,
      currentUserId,
      communityId,
      status = PostStatus.APPROVED,
    } = options;
    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.community', 'community');

    // Handle status filtering and authorization
    if(status!="all"){

    if (status === PostStatus.PENDING || status === PostStatus.REJECTED) {
      if (!currentUserId) {
        throw new ForbiddenException('You must be logged in to view pending or rejected posts.');
      }
      if (!communityId) {
        throw new BadRequestException('Cannot query for pending or rejected posts without a community ID.');
      }
      const isCommunityModerator = await this.isModerator(currentUserId, communityId);
      const isAuthor = authorId === currentUserId; // Assuming authorId is passed if filtering by author

      if (!isCommunityModerator && !isAuthor) {
        throw new ForbiddenException('You do not have permission to view this type of post in this community.');
      }

      // If user is author, they can see their own pending/rejected posts
      // If user is moderator, they can see all pending/rejected posts in their community
      if (status === PostStatus.PENDING) {
        query.andWhere('post.status = :status', { status: PostStatus.PENDING });
      } else if (status === PostStatus.REJECTED) {
        query.andWhere('post.status = :status', { status: PostStatus.REJECTED });
      }
    } else { // status === PostStatus.APPROVED
      query.andWhere('post.status = :status', { status: PostStatus.APPROVED });
    }
  }
    if (currentUserId) {
      query.leftJoinAndMapOne(
        'post.userReaction',
        'post.reactions',
        'userReaction',
        'userReaction.userId = :currentUserId',
        { currentUserId },
      );
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('post.title LIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.content LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (authorId) {
      query.andWhere('post.author.id = :authorId', { authorId });
    }

    if (communityId) {
      query.andWhere('post.community.id = :communityId', { communityId });
    }

    if (dateRange && dateRange !== 'all_time') {
      const now = new Date();
      let startDate: Date | undefined;

      switch (dateRange) {
        case 'past_day':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'past_week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'past_month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'past_year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = undefined;
      }

      if (startDate) {
        query.andWhere('post.createdAt >= :startDate', { startDate });
      }
    }

    if (sort === PostSort.POPULAR) {
      query
        .leftJoin('post.reactions', 'allReactions') // Join all reactions for the post
        .addSelect('COUNT(allReactions.id)', 'reactionCount')
        .groupBy('post.id')
        .orderBy('reactionCount', 'DESC');
    } else if (sort === PostSort.NEWEST) {
      query.orderBy('post.publishedAt', 'DESC');
    } else if (sort === PostSort.OLDEST) {
      query.orderBy('post.createdAt', 'ASC');
    } else if (sort === PostSort.PUBLISHED_AT) {
      query.orderBy('post.publishedAt', 'DESC');
    } else {
      query.orderBy('post.createdAt', 'DESC');
    }

    // Community visibility rules for APPROVED posts
    if (status === PostStatus.APPROVED && !currentUserId) {
      // Not logged in → hide PRIVATE communities
      query.andWhere('community.communityType != :privateType', {
        privateType: 'private',
      });
    } else if (status === PostStatus.APPROVED && currentUserId) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('community.communityType != :privateType', {
            privateType: 'private',
          }).orWhere(
            `EXISTS (
          SELECT 1
          FROM community_memberships cs
          WHERE cs.communityId = community.id
          AND cs.userId = :currentUserId
        )`,
          );
        }),
      ).setParameter('privateType', 'private')
        .setParameter('currentUserId', currentUserId);
    }

    const [data, count] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data: data, count };
  }


  async findOne(id: number, currentUserId?: number): Promise<Post | null> {
    // Start building query
    const query = this.postsRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.community', 'community');

    // Optionally join user's reaction if currentUserId is provided
    if (currentUserId) {
      query.leftJoinAndMapOne(
        'post.userReaction',
        'post.reactions',
        'userReaction',
        'userReaction.userId = :currentUserId',
        { currentUserId },
      );
    }

    // Filter by post ID
    query.where('post.id = :id', { id });

    const post = await query.getOne();

    if (!post) {
      return null;
    }

    // Authorization for PENDING/REJECTED posts in findOne
    if (post.status === PostStatus.PENDING || post.status === PostStatus.REJECTED) {
      if (!currentUserId) {
        throw new ForbiddenException('You must be logged in to view this post.');
      }
      const isCommunityModerator = post.communityId ? await this.isModerator(currentUserId, post.communityId) : false;
      const isAuthor = post.authorId === currentUserId;
      console.log(isAuthor,isCommunityModerator,currentUserId,post.communityId);
      

      if (!isCommunityModerator && !isAuthor) {
        throw new ForbiddenException('You do not have permission to view this post.');
      }
    }


    // Community visibility rules for APPROVED posts
    if (post.status === PostStatus.APPROVED && !currentUserId) {
      // Not logged in and post is in a private community
      if (post.community?.communityType === CommunityType.PRIVATE) {
        return null; // Hide private community posts
      }
    } else if (post.status === PostStatus.APPROVED && currentUserId && post.community?.communityType === CommunityType.PRIVATE) {
      const isMember = await this.membershipRepository.exist({
        where: { communityId: post.communityId, userId: currentUserId },
      });
      if (!isMember) {
        throw new ForbiddenException('You are not a member of this private community.');
      }
    }


    return post;
  }

  async create(
    { title, content, authorId, communityId }: { title: string; content: string; authorId: number; communityId: number },
  ): Promise<Post> {
    const community = await this.communityRepository.findOneBy({ id: communityId });
    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }
    // Check if user can contribute based on community rules
    await this.assertUserCanPostToCommunity(authorId, community);
    const membership = await this.membershipRepository.findOne({
      where: { userId: authorId, communityId },
    });

    const isModerator = membership?.role === CommunityMembershipRole.MODERATOR;
    const shouldAutoApprove =
      isModerator || community.communityType === CommunityType.PUBLIC;

    const post = this.postsRepository.create({
      title,
      content,
      authorId,
      community,
      status: shouldAutoApprove ? PostStatus.APPROVED : PostStatus.PENDING,
      publishedAt: shouldAutoApprove ? new Date() : null,
    });

    const savedPost = await this.postsRepository.save(post);

    this.eventEmitter.emit('post.created', new PostCreatedEvent(savedPost));

    return savedPost;
  }
  async update(userId:number ,
    postUpdateData: {
      id: number;
      title?: string;
      content?: string;
    },
  ): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id: postUpdateData.id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

 const isMod=await this.isModerator(userId,post.communityId)
  if (userId !== post.authorId || !isMod ) {
    throw new ForbiddenException('You cannot manage this post.');
  }
    if (postUpdateData.title !== undefined) post.title = postUpdateData.title;
    if (postUpdateData.content !== undefined) post.content = postUpdateData.content;

    return this.postsRepository.save(post);
  }

  async remove(id: number,userId:number): Promise<boolean> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post not found'); // TODO: Use a more specific NestJS exception
    }
 const isMod=await this.isModerator(userId,post.communityId)
  if (userId !== post.authorId || !isMod ) {
    throw new ForbiddenException('You cannot manage this post.');
  }
    const res = await this.postsRepository.remove(post);
    return !!res;
  }


  async updatePostStatus(postId: number, newStatus: PostStatus, userId: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['community'] });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Only allow createdBy/moderator to change status
    await this.canManagePosts(userId, post.community.id);

    post.status = newStatus;
    if (newStatus === PostStatus.APPROVED) {
      post.publishedAt = new Date();
    }
    return this.postsRepository.save(post);
  }

  async updateCommentsLockedStatus(userId: number,postId: number, commentsLocked: boolean): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const isMod=await this.isModerator(userId,post.communityId)
  if (userId !== post.authorId || !isMod ) {
    throw new ForbiddenException('You cannot manage this post.');
  }
    post.commentsLocked = commentsLocked;
    return this.postsRepository.save(post);
  }

  private async isModerator(userId: number, communityId: number): Promise<boolean> {
    const community = await this.communityRepository.findOne({ where: { id: communityId } });
    if (!community) {
      return false;
    }
   /* if (community.createdById === userId) {
      return true;
    }
*/
    const membership = await this.membershipRepository.findOne({
      where: { communityId, userId },
    });

    if (membership && membership.role === CommunityMembershipRole.MODERATOR) {
      return true;
    }

    return false;
  }

  private async canManagePosts(userId: number, communityId: number) {
    const community = await this.communityRepository.findOne({ where: { id: communityId } });
    if (!community) {
      throw new NotFoundException('Community not found');
    }
  /*  if (community.createdById === userId) {
      return true;
    }
*/
    const membership = await this.membershipRepository.findOne({
      where: { communityId, userId },
    });

    if (membership && membership.role === CommunityMembershipRole.MODERATOR) {
      return true;
    }

    throw new ForbiddenException('You do not have permission to manage posts in this community.');
  }

  async incrementViews(postId: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'views', 1);
  }

  async assertUserCanPostToCommunity(
    userId: number,
    community: Community,
  ): Promise<void> {
    switch (community.communityType) {
      case CommunityType.PUBLIC:
        return;

      case CommunityType.RESTRICTED:
      case CommunityType.PRIVATE:
        const isMember = await this.membershipRepository.exist({
          where: {
            userId,
            communityId: community.id,
          },
        });

        if (!isMember) {
          throw new ForbiddenException('You cannot post in this community');
        }
        return;

      default:
        throw new ForbiddenException('Posting not allowed');
    }
  }


}
