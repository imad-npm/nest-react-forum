import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostSort } from './dto/post-query.dto';
import { CommunitiesService } from 'src/communities/communities.service'; // Import CommunitiesService
import { CommunityAccessService } from 'src/community-access/community-access.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private readonly accessService: CommunityAccessService,

    private readonly communitiesService: CommunitiesService, // Inject CommunitiesService
  ) { }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      authorId?: number;
      sort?: PostSort;
      startDate?: Date;
      endDate?: Date;
      currentUserId?: number;
      communityId?: number;
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
      startDate,
      endDate,
      currentUserId,
      communityId,
    } = options;

    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.community', 'community');


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
      query.where(
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

    if (startDate) {
      query.andWhere('post.createdAt >= :startDate', { startDate });
    }


    if (endDate) {
      query.andWhere('post.createdAt <= :endDate', { endDate });
    }

    if (sort === PostSort.POPULAR) {
      query
        .leftJoin('post.reactions', 'allReactions') // Join all reactions for the post
        .addSelect('COUNT(allReactions.id)', 'reactionCount')
        .groupBy('post.id')
        .orderBy('reactionCount', 'DESC');
    } else if (sort === PostSort.NEWEST) {
      query.orderBy('post.createdAt', 'DESC');
    } else if (sort === PostSort.OLDEST) {
      query.orderBy('post.createdAt', 'ASC');
    } else {
      query.orderBy('post.createdAt', 'DESC');
    }

    // Community visibility rules
    if (!currentUserId) {
      // Not logged in → hide PRIVATE communities
      query.andWhere('community.communityType != :privateType', {
        privateType: 'private',
      });
    } else {
      // Logged in → allow:
      // - public
      // - restricted
      // - private ONLY if user is a member
      query.andWhere(
        new Brackets((qb) => {
          qb.where('community.communityType != :privateType', {
            privateType: 'private',
          }).orWhere(
            `EXISTS (
          SELECT 1
          FROM community_subscriptions cs
          WHERE cs.communityId = community.id
          AND cs.userId = :currentUserId
          AND cs.status = 'approved'
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

    // Execute query
    const post = await query.getOne();

    if (!post) return null;

    const { community } = post;
    await this.accessService.assertUserCanViewCommunity(currentUserId, community.id)
    return post;
  }

  async create(
    { title, content, authorId, communityId }: { title: string; content: string; authorId: number; communityId: number },
  ): Promise<Post> {
    const community = await this.communitiesService.findOne(communityId);
    if (!community) {
      throw new NotFoundException(`Community with ID ${communityId} not found`);
    }
    // Check if user can contribute based on community rules
    await this.accessService.assertUserCanContribute(authorId, communityId);


    const post = this.postsRepository.create({
      title,
      content,
      authorId,
      community,
    });
    return this.postsRepository.save(post);
  }
  async update(
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

    if (postUpdateData.title !== undefined) post.title = postUpdateData.title;
    if (postUpdateData.content !== undefined) post.content = postUpdateData.content;

    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<boolean> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post not found'); // TODO: Use a more specific NestJS exception
    }
    const res = await this.postsRepository.remove(post);
    return !!res;
  }


  async incrementCommentsCount(postId: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'commentsCount', 1);
  }

  async decrementCommentsCount(postId: number): Promise<void> {
    await this.postsRepository.decrement({ id: postId }, 'commentsCount', 1);
  }

  async incrementLikesCount(postId: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'likesCount', 1);
  }

  async decrementLikesCount(postId: number): Promise<void> {
    await this.postsRepository.decrement({ id: postId }, 'likesCount', 1);
  }

  async incrementDislikesCount(postId: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'dislikesCount', 1);
  }

  async decrementDislikesCount(postId: number): Promise<void> {
    await this.postsRepository.decrement({ id: postId }, 'dislikesCount', 1);
  }

  async incrementViews(postId: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'views', 1);
  }



}
