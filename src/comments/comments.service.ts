import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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

  createForPost(postId: number, createCommentDto: CreateCommentDto) {
    const comment = this.commentRepo.create({
      ...createCommentDto,
      post: { id: postId },
    });
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
