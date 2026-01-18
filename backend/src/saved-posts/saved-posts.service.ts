// backend/src/saved-posts/saved-posts.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SavedPost } from "./entities/saved-post.entity";

@Injectable()
export class SavedPostsService {
  constructor(
    @InjectRepository(SavedPost)
    private savedPostRepo: Repository<SavedPost>,
  ) {}

  // Create (idempotent using INSERT ... OR IGNORE)
  async createSave(userId: number, postId: number) {
    console.log("create");
    
    const insertResult = await this.savedPostRepo
      .createQueryBuilder()
      .insert()
      .values({ userId, postId })
      .orIgnore() // will not throw on duplicate due to unique constraint
                 .updateEntity(false) // Include this one
      .execute();

    // If a row was inserted, identifiers will be non-empty (often)
    const created = (insertResult.identifiers?.length ?? 0) > 0;
    return { saved: created || true }; // return true (idempotent)
  }

  // Remove (efficient delete without loading entity)
  async removeSave(userId: number, postId: number) {
    const deleteResult = await this.savedPostRepo
      .createQueryBuilder()
      .delete()
      .where("userId = :userId AND postId = :postId", { userId, postId })
      .execute();

    const removed = (deleteResult.affected ?? 0) > 0;
    return { saved: !removed, removed };
  }

  // Optional helper
  async isSaved(userId: number, postId: number) {
    const count = await this.savedPostRepo.count({ where: { userId, postId } });
    return count > 0;
  }

  // Paginated fetch (efficient join to posts + relations)
  async findAll( options: {userId: number, page: number; limit: number }) {
    const qb = this.savedPostRepo
      .createQueryBuilder('sp')
      .innerJoinAndSelect('sp.post', 'post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.community', 'community')
      .where('sp.userId = :userId', { userId: options.userId })
      .orderBy('sp.savedAt', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit);

    const [data, count] = await Promise.all([qb.getMany(), qb.getCount()]);
    return { data, count };
  }
}
