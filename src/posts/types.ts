import type { Request } from 'express'

export interface GetRecentPostsQuery extends Request {
  query: {
    sort: string
  }
}
