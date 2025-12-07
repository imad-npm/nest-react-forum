import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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

  create(dto: CreatePostDto, author: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...dto,
      author,
    });

    return this.postsRepository.save(post);
  }

  async update(post: Post, dto: UpdatePostDto): Promise<Post> {
    Object.assign(post, dto);
    return this.postsRepository.save(post);
  }

  async remove(post: Post): Promise<boolean> {
    const res = await this.postsRepository.remove(post);
    return !!res;
  }
}
