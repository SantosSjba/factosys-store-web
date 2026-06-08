export function toUploadFile(file: Blob & { name: string }): File {
  if (file instanceof File) return file
  return new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  })
}
