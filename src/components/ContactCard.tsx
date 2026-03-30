import type { Contact } from '../types/contact'
import { getInitials, stringToColor } from '../utils/avatar'
import styles from './ContactCard.module.css'

type ContactCardProps = {
  contact: Contact
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export const ContactCard = ({
  contact,
  isFavorite,
  onToggleFavorite,
}: ContactCardProps) => {
  return (
    <li className={styles.card}>
      <div
        className={styles.avatar}
        style={{ backgroundColor: stringToColor(contact.name) }}
        aria-hidden="true"
      >
        {getInitials(contact.name)}
      </div>
      <div className={styles.info}>
        <h2>{contact.name}</h2>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <p>{contact.address.city}</p>
      </div>
      <button
        type="button"
        className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
        onClick={() => onToggleFavorite(contact.id)}
        aria-label={
          isFavorite
            ? `Убрать ${contact.name} из избранного`
            : `Добавить ${contact.name} в избранное`
        }
      >
        ★
      </button>
    </li>
  )
}
