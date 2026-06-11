export function getJwtExpiryMs(accessToken: string): number | null {
  try {
    const segment = accessToken.split('.')[1]
    if (!segment) return null

    const payload = JSON.parse(atob(segment.replace(/-/g, '+').replace(/_/g, '/'))) as {
      exp?: number
    }

    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function isAccessTokenExpiringSoon(
  accessToken: string,
  skewMs = 60_000,
): boolean {
  const expiresAt = getJwtExpiryMs(accessToken)
  if (!expiresAt) return false
  return Date.now() + skewMs >= expiresAt
}
