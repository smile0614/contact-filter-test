import type { Contact } from '../types/contact'
import { ContactCard } from './ContactCard'
import styles from './ContactList.module.css'

type ContactListProps = {
  contacts: Contact[]
  favoriteIds: number[]
  onToggleFavorite: (id: number) => void
}

export const ContactList = ({
  contacts,
  favoriteIds,
  onToggleFavorite,
}: ContactListProps) => {
  if (contacts.length === 0) {
    return <p className={styles.empty}>Ничего не найдено</p>
  }

  return (
    <ul className={styles.list}>
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          isFavorite={favoriteIds.includes(contact.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  )
}
