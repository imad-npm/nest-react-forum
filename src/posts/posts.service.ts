import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['author', 'comments', 'reactions'],
    });
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

  async update(post: Post, title?: string, content?: string): Promise<Post> {
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    return this.postsRepository.save(post);
  }

  async remove(post: Post): Promise<boolean> {
    const res = await this.postsRepository.remove(post);
    return !!res;
  }
}