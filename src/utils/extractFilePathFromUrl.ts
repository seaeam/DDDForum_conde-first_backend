/**
 * 从 Supabase 公共 URL 中提取文件路径
 * @param publicUrl - Supabase 存储文件的公共 URL
 * @param bucketName - 存储桶名称
 * @returns 文件在存储桶中的路径
 */
export function extractFilePathFromUrl(
  publicUrl: string,
  bucketName: string
): string | null {
  try {
    // Supabase 公共 URL 格式: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filepath]
    const url = new URL(publicUrl)
    const pathParts = url.pathname.split('/')

    // 找到 bucket 名称在路径中的位置
    const bucketIndex = pathParts.indexOf(bucketName)

    if (bucketIndex === -1) {
      console.log('======= bucket名称无效 =======\n')
      return null
    }

    // 获取 bucket 名称之后的所有路径部分
    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    return filePath || null
  } catch (error) {
    console.error('解析 URL 失败:', error)
    return null
  }
}
