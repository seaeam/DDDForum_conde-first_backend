import type { Request, Response } from 'express'
import type { ApiResponse } from '../client/types'

export interface CreateUserRequest extends Request {
  body: {
    email: string
    username: string
    firstName?: string
    lastName?: string
    password?: string
  }
}

export interface EditUserRequest extends Request {
  body: {
    email: string
    username: string
    firstName: string
    lastName: string
    avatar: string
  }
  query: {
    userId: string
  }
}

export interface GetUserByEmailRequest extends Request {
  query: {
    email: string
  }
}
export interface UpdateAvatarRequest extends Request {
  query: {
    userId: string
  }

  body: {
    file: Express.Multer.File
  }
}

interface UserResponse {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
}

export type CreateUserResponse = Response<ApiResponse<UserResponse, string>>
export type EditUserResponse = Response<ApiResponse<Partial<UserResponse>, string>>
export type GetUserByEmailResponse = Response<ApiResponse<UserResponse, string>>
export type UpdateAvatarResponse = Response<ApiResponse<string, string>>

export type UploadAvatarReturnType = Promise<
  { success: true; data: string } | { success: false; error: string }
>
