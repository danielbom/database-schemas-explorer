import { PrismaClient } from '@prisma/client'

export class Database {
  constructor(public readonly prisma: PrismaClient) {}

  static create() {
    const prisma = new PrismaClient()
    return new Database(prisma)
  }

  connect(): Promise<void> {
    return this.prisma.$connect()
  }

  disconnect(): Promise<void> {
    return this.prisma.$disconnect()
  }
}
