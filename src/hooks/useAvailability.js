import { useEffect, useMemo, useState } from 'react'
import { apartments } from '../data'

const SYNC_INTERVAL_MS = 30 * 60 * 1000

const addDays = (dateString, days) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const dateRange = (start, end) => {
  if (!start || !end || end <= start) return []
  const dates = []
  let cursor = start
  while (cursor < end) {
    dates.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return dates
}

export function useAvailability(initial = {}) {
  const [filters, setFilters] = useState({ checkIn: '', checkOut: '', guests: 1, ...initial })
  const [calendarData, setCalendarData] = useState({ apartments: {}, syncedAt: null, errors: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const syncCalendars = async () => {
      try {
        const response = await fetch('/.netlify/functions/sync-calendar')
        if (!response.ok) {
          throw new Error('Unable to load live Airbnb calendar availability.')
        }
        const data = await response.json()
        if (!cancelled) {
          setCalendarData({ apartments: data.apartments || {}, syncedAt: data.syncedAt || null, errors: data.errors || [] })
          setError(null)
        }
      } catch (syncError) {
        if (!cancelled) {
          setError(syncError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    syncCalendars()
    const intervalId = window.setInterval(syncCalendars, SYNC_INTERVAL_MS)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [])

  const hasInvalidDateRange = Boolean(filters.checkIn && filters.checkOut && filters.checkOut <= filters.checkIn)
  const hasActiveSearch = Boolean(filters.checkIn || filters.checkOut || Number(filters.guests || 1) > 1)

  const results = useMemo(() => {
    if (hasInvalidDateRange) return []

    const requestedDates = dateRange(filters.checkIn, filters.checkOut)

    return apartments.filter((apartment) => {
      const requestedGuests = Math.max(1, Number(filters.guests || 1))
      const canHostGuests = requestedGuests <= Number(apartment.guests || 1)
      const liveRecord = calendarData.apartments?.[apartment.slug]
      const blockedDates = Array.isArray(liveRecord?.blockedDates) ? liveRecord.blockedDates : apartment.unavailable || []
      const isAvailable = requestedDates.every((date) => !blockedDates.includes(date))
      return canHostGuests && isAvailable
    })
  }, [filters, calendarData, hasInvalidDateRange])

  const getBlockedDates = (slug) => {
    const liveRecord = calendarData.apartments?.[slug]
    const apartment = apartments.find((item) => item.slug === slug)
    return Array.isArray(liveRecord?.blockedDates) ? liveRecord.blockedDates : apartment?.unavailable || []
  }

  return { filters, setFilters, results, loading, error, syncedAt: calendarData.syncedAt, calendarErrors: calendarData.errors, getBlockedDates, hasActiveSearch, hasInvalidDateRange }
}
