import type { Response } from 'express'
import type { GetRecentPostsQuery } from './types'
import prisma from '../client/prisma'

export async function getRecentPosts(req: GetRecentPostsQuery, res: Response) {
  try {
    const { sort } = req.query

    if (sort !== 'recent') {
      return res
        .status(400)
        .json({ error: 'ClientError', data: undefined, success: false })
    }

    // Get the posts
    const postsWithVotes = await prisma.post.findMany({
      include: {
        votes: true,
        memberPostedBy: {
          include: {
            user: true,
          },
        },
        comments: true,
      },
      orderBy: {
        dateCreated: 'desc',
      },
    })

    return res.json({ error: undefined, data: { posts: postsWithVotes }, success: true })
  } catch (error) {
    return res.status(500).json({ error, data: undefined, success: false })
  }
}
