import type { Post, User } from '@prisma/client'
import process from 'node:process'
import prisma from '../src/client/prisma'

const initialUsers: Omit<User, 'id'>[] = [
  {
    email: 'bobvance@gmail.com',
    firstName: 'Bob',
    lastName: 'Vance',
    username: 'bobvance',
    password: '123',
  },
  {
    email: 'tonysoprano@gmail.com',
    firstName: 'Tony',
    lastName: 'Soprano',
    username: 'tonysoprano',
    password: '123',
  },
  {
    email: 'billburr@gmail.com',
    firstName: 'Bill',
    lastName: 'Burr',
    username: 'billburr',
    password: '123',
  },
]

async function seed() {
  // 清空现有数据
  await prisma.vote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.member.deleteMany()
  await prisma.user.deleteMany()

  // 创建用户和成员，并存储成员ID
  const memberIds: number[] = []

  for (const userData of initialUsers) {
    const user = await prisma.user.create({
      data: userData,
    })

    const member = await prisma.member.create({
      data: {
        userId: user.id,
      },
    })

    memberIds.push(member.id)
  }

  // 创建帖子
  const initialPosts = [
    {
      title: 'First post!',
      content: 'This is bob vances first post',
      postType: 'Text',
      memberId: memberIds[0], // Bob's member ID
    },
    {
      title: 'Second post!',
      content: 'This is bobs second post',
      postType: 'Text',
      memberId: memberIds[0], // Bob's member ID
    },
    {
      title: 'another post',
      content: 'This is tonys first post',
      postType: 'Text',
      memberId: memberIds[1], // Tony's member ID
    },
    {
      title: 'Links',
      content: 'This is a link post',
      postType: 'https://khalilstemmler.com',
      memberId: memberIds[1], // Tony's member ID
    },
  ]

  const createdPosts: Post[] = []
  for (const postData of initialPosts) {
    const post = await prisma.post.create({
      data: postData,
    })
    createdPosts.push(post)
  }

  // 创建投票
  const initialPostVotes = [
    { postId: createdPosts[0].id, voteType: 'Upvote', memberId: memberIds[0] },
    { postId: createdPosts[1].id, voteType: 'Upvote', memberId: memberIds[0] },
    { postId: createdPosts[2].id, voteType: 'Upvote', memberId: memberIds[1] },
    { postId: createdPosts[3].id, voteType: 'Upvote', memberId: memberIds[1] },
    { postId: createdPosts[2].id, voteType: 'Upvote', memberId: memberIds[0] },
    { postId: createdPosts[1].id, voteType: 'Downvote', memberId: memberIds[2] },
  ]

  for (const voteData of initialPostVotes) {
    await prisma.vote.create({
      data: voteData,
    })
  }

  // 创建评论
  const initialPostComments = [
    { text: 'I posted this!', memberId: memberIds[0], postId: createdPosts[0].id, parentCommentId: null },
    { text: 'Nice', memberId: memberIds[1], postId: createdPosts[1].id, parentCommentId: null },
  ]

  for (const commentData of initialPostComments) {
    await prisma.comment.create({
      data: commentData,
    })
  }

  console.log('Seed completed successfully!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
