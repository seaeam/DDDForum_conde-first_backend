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

interface UserResponse {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
}

export type CreateUserResponse = Response<ApiResponse<UserResponse | unknown>>
export type EditUserResponse = Response<ApiResponse<Partial<UserResponse | unknown>>>
export type GetUserByEmailResponse = Response<ApiResponse<UserResponse | unknown>>
