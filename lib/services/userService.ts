// lib/services/userService.ts
import { prisma } from '@/lib/prisma'
import type { User } from '@/types/auth'

export class UserService {
  static async createUser(data: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }): Promise<User> {
    return await prisma.user.create({
      data: {
        ...data,
        subscriptionType: 'free',
        lettersGenerated: 0,
        lettersLimit: 3,
      }
    })
  }

  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    })
  }

  static async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data
    })
  }
}