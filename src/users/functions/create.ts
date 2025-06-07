import prisma from '../../client/prisma'

export async function createNewUser({
  email,
  username,
  firstName,
  lastName,
  password,
}: {
  email: string
  username: string
  firstName: string
  lastName: string
  password: string
}) {
  return prisma.user.create({
    data: {
      email,
      username,
      firstName,
      lastName,
      password,
    },
  })
}
