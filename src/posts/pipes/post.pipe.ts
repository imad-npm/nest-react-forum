import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts.service';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostPipe implements PipeTransform<string, Promise<Post>> {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  async transform(value: string): Promise<Post> {
    const post = await this.postsService.findOne(+value);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
