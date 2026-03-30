const FAVORITES_STORAGE_KEY = 'favoriteContacts'

export const loadFavoriteIds = (): number[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((id): id is number => typeof id === 'number')
  } catch {
    return []
  }
}

export const saveFavoriteIds = (favoriteIds: number[]) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
}
