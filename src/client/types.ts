export interface ApiResponse<T = any> {
  error?: string
  data?: T
  success: boolean
}
