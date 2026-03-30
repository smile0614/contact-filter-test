export const stringToColor = (value: string): string => {
  let hash = 0

  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 65% 45%)`
}

export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}
