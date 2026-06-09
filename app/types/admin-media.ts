export type MediaAsset = {
  id: string
  fileName: string
  storageKey: string
  url: string
  mimeType: string
  sizeBytes: number
  folder: string | null
  alt: string | null
  createdAt: string
  uploadedBy: {
    id: string
    email: string
    name: string | null
  } | null
}

export type ListMediaParams = {
  page?: number
  limit?: number
  search?: string
  folder?: string
}
