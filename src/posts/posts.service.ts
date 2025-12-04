// posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  // load relations: author and comments
  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['author', 'comments',"reactions"], // eager load related entities
    });
  }

  findOne(id: number): Promise<Post | null> {
    return this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments','reactions'],
    });
  }

  create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post | null> {
    await this.postsRepository.update(id, updatePostDto);
    return this.findOne(id); // return post with relations
  }

async remove(id: number): Promise<boolean> {
  const result = await this.postsRepository.delete(id);
  return !!result.affected; // converts undefined/null/0 to false, >0 to true
}
}
