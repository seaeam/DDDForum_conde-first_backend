import { Prisma } from '@prisma/client'
import prisma from '../../client/prisma'

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
  })
}

export async function getUserFirstByCustom(options: Prisma.UserFindFirstArgs) {
  return prisma.user.findFirst(options)
}
