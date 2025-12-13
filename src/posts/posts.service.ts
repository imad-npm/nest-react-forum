import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { PostSort } from './dto/post-query.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) { }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    authorId?: number,
    sort?: PostSort,
  ): Promise<{
    data: Post[];
    count: number;
  }> {
    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.reactions', 'reactions');

    if (search) {
      query.where(
        new Brackets((qb) => {
          qb.where('post.title ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.content ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (authorId) {
      query.andWhere('post.author.id = :authorId', { authorId });
    }

    if (sort === PostSort.NEWEST) {
      query.orderBy('post.createdAt', 'DESC');
    } else if (sort === PostSort.OLDEST) {
      query.orderBy('post.createdAt', 'ASC');
    } else if (sort === PostSort.POPULAR) {
      query
        .addSelect('COUNT(reactions.id)', 'reactionCount')
        .groupBy('post.id')
        .orderBy('reactionCount', 'DESC');
    } else {
      query.orderBy('post.createdAt', 'DESC');
    }

    const [data, count] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data, count };
  }

  findOne(id: number): Promise<Post | null> {
    return this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'reactions'],
    });
  }

  create(title: string, content: string, author: User): Promise<Post> {
    const post = this.postsRepository.create({
      title,
      content,
      author,
    });
    return this.postsRepository.save(post);
  }
  async update(
    postUpdateData: {
      id: number;
      title?: string;
      content?: string;
      views?: number;
    },
  ): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id: postUpdateData.id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (postUpdateData.title !== undefined) post.title = postUpdateData.title;
    if (postUpdateData.content !== undefined) post.content = postUpdateData.content;
    if (postUpdateData.views !== undefined) post.views = postUpdateData.views;

    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<boolean> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new Error('Post not found'); // TODO: Use a more specific NestJS exception
    }
    const res = await this.postsRepository.remove(post);
    return !!res;
  }
}
