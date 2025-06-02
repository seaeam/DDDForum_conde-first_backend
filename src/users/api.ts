import type { Request, Response } from 'express'
import prisma from '../client/prisma'

export async function createUser(req: Request, res: Response) {
  const {
    email,
    username,
    firstName = '',
    lastName = '',
    password = Math.random().toString(36).slice(-8),
  } = req.body

  if (!email || !username) {
    return res.status(400).json({
      error: 'ValidationError',
      data: undefined,
      success: false,
    })
  }

  try {
    const userByUsername = await prisma.user.findUnique({
      where: { username },
    })
    if (userByUsername) {
      return res
        .status(409)
        .json({ error: 'UsernameAlreadyTaken', data: undefined, success: false })
    }

    const emailByUseremail = await prisma.user.findUnique({
      where: { email },
    })
    if (emailByUseremail) {
      return res
        .status(409)
        .json({ error: 'EmailAlreadyInUse', data: undefined, success: false })
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password,
      },
    })

    return res.status(201).json({
      error: undefined,
      data: user,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({ error: 'Server error', data: error, success: false })
  }
}

export async function editUser(req: Request, res: Response) {
  const { userId } = req.query
  const { email, username, firstName, lastName } = req.body

  if (!email || !username || !firstName || !lastName) {
    return res.status(400).json({
      error: 'ValidationError',
      data: undefined,
      success: false,
    })
  }
  const id = Number(userId)

  try {
    const existingUser = await prisma.user.findUnique({
      where: { ID: id },
    })
    if (!existingUser) {
      return res.status(404).json({
        error: '用户未找到',
        data: undefined,
        success: false,
      })
    }

    const userByUsername = await prisma.user.findFirst({
      where: {
        username,
        ID: { not: id },
      },
    })
    if (userByUsername) {
      return res.status(409).json({
        error: 'UsernameAlreadyTaken',
        data: undefined,
        success: false,
      })
    }

    // 检查邮箱是否被其他用户使用
    const userByEmail = await prisma.user.findFirst({
      where: {
        email,
        ID: { not: id }, // 排除当前用户
      },
    })

    if (userByEmail) {
      return res.status(409).json({
        error: 'EmailAlreadyInUse',
        data: undefined,
        success: false,
      })
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { ID: id },
      data: {
        email,
        username,
        firstName,
        lastName,
      },
    })

    return res.status(200).json({
      error: undefined,
      data: {
        ID: updatedUser.ID,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
      success: true,
    })
  } catch (error) {
    console.log('======= editUser error =======\n', error)
    return res.status(500).json({
      error: '服务器错误',
      data: undefined,
      success: false,
    })
  }
}

export async function getUserByEmail(req: Request, res: Response) {
  const { email } = req.query
  if (!email) {
    return res.status(409).json({
      error: '邮箱为空',
      data: undefined,
      success: false,
    })
  } else if (typeof email !== 'string') {
    return res.status(409).json({
      error: '邮箱格式不正确',
      data: undefined,
      success: false,
    })
  }

  try {
    const userByEmail = await prisma.user.findUnique({
      where: { email },
    })
    if (!userByEmail) {
      return res
        .status(404)
        .json({ error: '用户未找到', data: undefined, success: false })
    }

    return res.status(200).json({
      data: userByEmail,
      success: true,
    })
  } catch (error) {
    console.log('======= getUserByEmail error =======\n', error)
    return res.status(500).json({
      error: '服务器错误',
      data: undefined,
      success: false,
    })
  }
}
