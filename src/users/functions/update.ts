import { Prisma } from '@prisma/client'
import prisma from '../../client/prisma'
import { uploadAvatar } from './upload'

export async function updateUser(options: Prisma.UserUpdateArgs) {
  return prisma.user.update(options)
}

export async function updateUserAvatar(userId: string, file: Express.Multer.File) {
  const result = await uploadAvatar(userId, file)

  if (!result.success) throw result.error

  return await updateUser({
    where: {
      id: Number(userId),
    },
    data: {
      avatar: result.data,
    },
  })
}
