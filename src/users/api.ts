import type {
  CreateUserRequest,
  CreateUserResponse,
  EditUserRequest,
  EditUserResponse,
  GetUserByEmailRequest,
  GetUserByEmailResponse,
  UpdateAvatarRequest,
  UpdateAvatarResponse,
} from './types'
import { getUserByEmail, getUserById, getUserFirstByCustom } from './functions/get'
import { createNewUser } from './functions/create'
import { updateUser, updateUserAvatar } from './functions/update'
import { deleteAvatarByUrl } from './functions/upload'

export async function createUser(req: CreateUserRequest, res: CreateUserResponse) {
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
      success: false,
    })
  }

  try {
    const emailByUseremail = await getUserByEmail(email)
    if (emailByUseremail) {
      return res.status(409).json({ error: 'EmailAlreadyInUse', success: false })
    }

    const user = await createNewUser({ email, firstName, lastName, password, username })

    return res.status(201).json({
      data: user,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({ error: `Server error:${error}`, success: false })
  }
}

export async function editUser(req: EditUserRequest, res: EditUserResponse) {
  const { userId } = req.query
  const { email, username, firstName, lastName } = req.body

  if (!email || !username || !firstName || !lastName) {
    return res.status(400).json({
      error: 'ValidationError',
      success: false,
    })
  }
  const id = Number(userId)

  try {
    const existingUser = await getUserById(id)

    if (!existingUser) {
      return res.status(404).json({
        error: '用户未找到',
        success: false,
      })
    }

    const userByUsername = await getUserFirstByCustom({
      where: {
        username,
        id: { not: id },
      },
    })
    if (userByUsername) {
      return res.status(409).json({
        error: 'UsernameAlreadyTaken',
        success: false,
      })
    }

    // 检查邮箱是否被其他用户使用
    const userByEmail = await getUserFirstByCustom({
      where: {
        email,
        id: { not: id }, // 排除当前用户
      },
    })

    if (userByEmail) {
      return res.status(409).json({
        error: 'EmailAlreadyInUse',
        success: false,
      })
    }

    // 更新用户信息
    const updatedUser = await updateUser({
      where: { id },
      data: {
        email,
        username,
        firstName,
        lastName,
      },
    })

    return res.status(200).json({
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      error: `服务器错误:${error}`,
      success: false,
    })
  }
}

export async function fetchUserByEmail(
  req: GetUserByEmailRequest,
  res: GetUserByEmailResponse
) {
  const { email } = req.query
  if (!email) {
    return res.status(409).json({
      error: '邮箱为空',
      success: false,
    })
  }

  try {
    const userByEmail = await getUserByEmail(email)

    if (!userByEmail) {
      return res.status(404).json({ error: '用户未找到', success: false })
    }

    return res.status(200).json({
      data: userByEmail,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      error: `服务器错误:${error}`,
      success: false,
    })
  }
}

export async function editUserAvatar(
  req: UpdateAvatarRequest,
  res: UpdateAvatarResponse
) {
  const { userId } = req.query
  const file = req.file

  if (!userId || !file) {
    return {
      success: false,
      error: '用户ID/头像文件未正确上传',
    }
  }

  try {
    const user = await getUserById(Number(userId))
    if (!user) throw '用户 ID 不存在'

    const updatedUser = await updateUserAvatar(userId, file)

    if (user?.avatar) {
      deleteAvatarByUrl(user.avatar, 'dddfourm-avatar').catch((err) => {
        console.warn('删除旧头像失败:', err)
      })
    }

    return res.status(200).json({
      success: true,
      data: updatedUser.avatar as string,
    })
  } catch (error) {
    return res.status(500).json({
      error: `更新用户头像失败:${error}`,
      success: false,
    })
  }
}
