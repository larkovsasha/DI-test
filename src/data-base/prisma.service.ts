import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
  client: PrismaClient = new PrismaClient();
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}
  async connect() {
    try {
      await this.client.$connect();
      this.logger.log('[PrismaService] DB was connected');
    } catch (e) {
      if (e instanceof Error)
        this.logger.warn('[PrismaService] Cannot connect to DB' + e.message);
      else this.logger.warn('[PrismaService] Cannot connect to DB');
    }
  }
  async disconnect() {
    await this.client.$disconnect();
  }
}
