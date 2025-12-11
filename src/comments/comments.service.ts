import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    authorId?: number,
  ): Promise<{ data: Comment[]; count: number }> {
    const query = this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.parent', 'parent');

    if (search) {
      query.where('comment.content ILIKE :search', { search: `%${search}%` });
    }

    if (authorId) {
      query.andWhere('comment.author.id = :authorId', { authorId });
    }

    query.orderBy('comment.createdAt', 'DESC');

    const [data, count] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data, count };
  }

  async findByPost(
    postId: number,
    page = 1,
    limit = 10,
  ): Promise<{ data: Comment[]; count: number }> {
    const [data, count] = await this.commentRepo.findAndCount({
      where: { post: { id: postId } },
      relations: ['author', 'post', 'parent'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, count };
  }

  findOne(id: number) {
    return this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'post', 'parent'],
    });
  }

  async createForPost(
    post: Post,
    content: string,
    user: User,
    parentId?: number,
  ) {
    const comment = this.commentRepo.create({
      content,
      author: user,
    });

    if (parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: parentId },
        relations: ['post'],
      });
      if (!parent) throw new NotFoundException('Parent comment not found');
      comment.parent = parent;
      comment.post = parent.post;
    } else {
      comment.post = post;
    }

    return this.commentRepo.save(comment);
  }

  async update(comment: Comment, content?: string) {
    if (content != undefined)
      comment.content = content;

    return this.commentRepo.save(comment);
  }

  async remove(comment: Comment) {
    await this.commentRepo.remove(comment);
    return true;
  }
}
