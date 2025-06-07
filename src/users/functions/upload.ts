import supabase from '../../client/supabase'
import { extractFilePathFromUrl } from '../../utils/extractFilePathFromUrl'
import { UploadAvatarReturnType } from '../types'

async function uploadAvatarImpl(file: File, userId: string): UploadAvatarReturnType {
  const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop() || 'unknown'}`

  const { data, error } = await supabase.storage
    .from('dddfourm-avatar')
    .upload(fileName, file)

  if (error) {
    return { success: false, error: error.message }
  }
  if (!data) {
    return { success: false, error: 'Upload failed: no data returned' }
  }

  // 获取公共 URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('dddfourm-avatar').getPublicUrl(data.path)

  return { success: true, data: publicUrl }
}
export async function uploadAvatar(
  userId: string,
  file: Express.Multer.File
): UploadAvatarReturnType {
  try {
    const fileObj = new File([file.buffer], file.originalname, {
      type: file.mimetype,
    })

    const result = await uploadAvatarImpl(fileObj, userId)

    return result
  } catch (error) {
    return {
      success: false,
      error: `上传失败: ${error}`,
    }
  }
}

/**
 * 根据公共 URL 删除 Supabase 存储中的文件
 */
export async function deleteAvatarByUrl(publicUrl: string, bucketName: string) {
  const filePath = extractFilePathFromUrl(publicUrl, bucketName)

  if (!filePath) {
    throw new Error('无法从 URL 中提取文件路径')
  }

  const { error } = await supabase.storage.from(bucketName).remove([filePath])

  if (error) {
    throw new Error(`删除文件失败: ${error.message}`)
  }

  return { success: true, message: '文件删除成功' }
}
