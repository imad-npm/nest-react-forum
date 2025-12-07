import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  findByPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['author', 'post'],
    });
  }

  findOne(id: number) {
    return this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
  }

  async createForPost(post: Post, dto: CreateCommentDto, user: User) {
    const comment = this.commentRepo.create({
      content: dto.content,
      author: user,
    });

    if (dto.parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: dto.parentId },
        relations: ['post'],
      });
      if (!parent) throw new NotFoundException();
      comment.parent = parent;
      comment.post = parent.post;
    } else {
      comment.post = post;
    }

    return this.commentRepo.save(comment);
  }

  async update(comment: Comment, dto: UpdateCommentDto) {
    Object.assign(comment, dto);
    return this.commentRepo.save(comment);
  }

  async remove(comment: Comment) {
    await this.commentRepo.remove(comment);
    return true;
  }
}
