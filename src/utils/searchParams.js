export const normaliseGuests = (value) => Math.max(1, Number(value || 1))

export const buildSearchPath = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.checkIn) params.set('checkIn', filters.checkIn)
  if (filters.checkOut) params.set('checkOut', filters.checkOut)
  params.set('guests', String(normaliseGuests(filters.guests)))
  return `/search?${params.toString()}`
}

export const readSearchFilters = (searchParams) => ({
  checkIn: searchParams.get('checkIn') || '',
  checkOut: searchParams.get('checkOut') || '',
  guests: normaliseGuests(searchParams.get('guests') || 1),
})
