export async function imageUrlToFile(imageUrl: string, filename: string) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const ext = blob.type.split("/")[1] || "png"

  return new File([blob], `${filename}.${ext}`, {
    type: blob.type || "image/png",
  })
}
