import type { Contact } from '../types/contact'

export const fetchContacts = async (signal?: AbortSignal): Promise<Contact[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    signal,
  })

  if (!response.ok) {
    throw new Error('Не удалось загрузить контакты')
  }

  return (await response.json()) as Contact[]
}
