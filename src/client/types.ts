export type ApiResponse<Data, Reason> =
  | {
    data: Data
    success: true
  }
  | {
    error: Reason
    success: false
  }
