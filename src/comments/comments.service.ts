import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) { }

async findAll(options: {
  postId?: number;
  authorId?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Comment[]; count: number }> {
  const { postId, authorId, search, page = 1, limit = 10 } = options;

  const query = this.commentRepo
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.author', 'author')
    .leftJoinAndSelect('comment.post', 'post')
    .leftJoinAndSelect('comment.parent', 'parent');

  if (search) {
    query.andWhere('comment.content ILIKE :search', { search: `%${search}%` });
  }
  if (authorId) {
    query.andWhere('comment.author.id = :authorId', { authorId });
  }
  if (postId) {
    query.andWhere('comment.post.id = :postId', { postId });
  }

  query.orderBy('comment.createdAt', 'DESC');

  const [data, count] = await query.take(limit).skip((page - 1) * limit).getManyAndCount();

  return { data, count };
}


  findOne(id: number) {
    return this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'post', 'parent'],
    });
  }

  async createComment(
    postId: number,
    content: string,
    userId: number,
    parentId?: number,
  ) {
    const post = await this.commentRepo.manager.findOneBy(Post, { id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepo.create({
      content,
      authorId: userId,
    });

    if (parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: parentId },
        relations: ['post'],
      });
      if (!parent)
        throw new NotFoundException('Parent comment not found');
      if (parent.post.id !== postId) {
        throw new BadRequestException(
          'Parent comment does not belong to this post',
        );
      }

      comment.parent = parent;
      comment.post = parent.post;
    } else {
      comment.post = post;
    }

    return this.commentRepo.save(comment);
  }

  async update(
    updateCommentData: { id: number; content?: string },
  ): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({
      id: updateCommentData.id,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (updateCommentData.content !== undefined)
      comment.content = updateCommentData.content;

    return this.commentRepo.save(comment);
  }

  async remove(id: number): Promise<boolean> {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentRepo.remove(comment);
    return true;
  }
}
