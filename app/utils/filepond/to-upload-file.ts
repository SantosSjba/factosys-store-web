export function toUploadFile(file: Blob & { name: string }): File {
  if (file instanceof File) return file
  const lastModified = 'lastModified' in file ? Number(file.lastModified) : Date.now()
  return new File([file], file.name, {
    type: file.type,
    lastModified,
  })
}
