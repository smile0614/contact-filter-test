import { useEffect, useMemo, useState } from 'react'
import { fetchContacts } from './api/contactsApi'
import { ContactList } from './components/ContactList'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import type { Contact } from './types/contact'
import { loadFavoriteIds, saveFavoriteIds } from './utils/favorites'
import styles from './App.module.css'

function App() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => loadFavoriteIds())
  const debouncedSearch = useDebouncedValue(searchInput.trim().toLowerCase(), 300)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    const loadContacts = async () => {
      const loadingStartedAt = Date.now()

      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchContacts(controller.signal)
        if (isActive) {
          setContacts(data)
        }
      } catch (err) {
        if (isActive && (err as Error).name !== 'AbortError') {
          setError('Ошибка загрузки. Попробуйте позже.')
        }
      } finally {
        const elapsed = Date.now() - loadingStartedAt
        const minimumVisibleMs = 450
        const remaining = Math.max(minimumVisibleMs - elapsed, 0)

        if (remaining > 0) {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, remaining)
          })
        }

        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadContacts()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    saveFavoriteIds(favoriteIds)
  }, [favoriteIds])

  const filteredContacts = useMemo(() => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(debouncedSearch),
    )

    return [...filtered].sort((a, b) => {
      const aFavorite = favoriteIds.includes(a.id)
      const bFavorite = favoriteIds.includes(b.id)

      if (aFavorite === bFavorite) {
        return a.name.localeCompare(b.name)
      }

      return aFavorite ? -1 : 1
    })
  }, [contacts, debouncedSearch, favoriteIds])

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favoriteId) => favoriteId !== id) : [...prev, id],
    )
  }

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <h1 className={styles.title}>Список контактов</h1>
        <input
          className={styles.search}
          type="text"
          placeholder="Поиск по имени"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label="Поиск контактов"
        />

        {isLoading && (
          <div className={styles.state} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            <span>Загрузка...</span>
          </div>
        )}
        {error && !isLoading && <p className={styles.error}>{error}</p>}

        {!isLoading && !error && (
          <ContactList
            contacts={filteredContacts}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </section>
    </main>
  )
}

export default App
