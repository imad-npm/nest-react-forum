import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordResetService {
  private  TOKEN_EXPIRATION_MINUTES : number;

  constructor(
    @InjectRepository(PasswordResetToken)
    private repo: Repository<PasswordResetToken>,
    private config: ConfigService,
  ) {
    this.TOKEN_EXPIRATION_MINUTES=config.get<number>("TOKEN_EXPIRATION_MINUTES") ?? 15
  }

  /** Public API **/

  async generateToken(userId: number) {
    const token = this.generateTokenValue();
    const expiresAt = this.calculateExpiration();

    await this.saveToken(userId, token, expiresAt);

    return { token, expiresAt };
  }

  async validateToken(token: string) {
    const tokenRow = await this.findValidToken(token);

    if (!tokenRow) throw new BadRequestException('Invalid or expired token');

    await this.deleteToken(tokenRow.id);

    return tokenRow.userId;
  }

  public generateResetLink(token: string): string {
    const frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
    );
    const resetPath = '/reset-password';
    return `${frontendUrl}${resetPath}?token=${token}`;
  }
  /** Private helpers **/

  private generateTokenValue(): string {
    return randomBytes(32).toString('hex');
  }

  private calculateExpiration(): Date {
    const now = new Date();
    return new Date(now.getTime() + this.TOKEN_EXPIRATION_MINUTES * 60_000);
  }

  private async saveToken(userId: number, token: string, expiresAt: Date) {
    const entity = this.repo.create({ userId, token, expiresAt });
    await this.repo.save(entity);
  }

  private async findValidToken(
    token: string,
  ): Promise<PasswordResetToken | null> {
    return this.repo.findOne({
      where: { token, expiresAt: MoreThan(new Date()) },
    });
  }

  private async deleteToken(id: number) {
    await this.repo.delete(id);
  }
}
