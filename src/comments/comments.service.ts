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
  ) { }

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
  async createForPost(
    post: Post,
    dto: CreateCommentDto,
    user: User
  ): Promise<Comment> {

    const comment = this.commentRepo.create({
      content: dto.content,
      author: user,
    });

    if (dto.parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: dto.parentId },
        relations: ['post'],
      });

      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }


      comment.parent = parent;
      comment.post = parent.post; // inherited
    } else {
      // top-level comment
      comment.post = post;
    }

    return this.commentRepo.save(comment);
  }


  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentRepo.update(id, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.commentRepo.delete(id);
    return !!result.affected;
  }
}
