import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import Layout from '../components/Layout'
import SearchBar from '../components/SearchBar'
import ApartmentCard from '../components/ApartmentCard'
import Reveal from '../components/Reveal'
import { useAvailability } from '../hooks/useAvailability'
import { buildSearchPath, readSearchFilters } from '../utils/searchParams'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const urlFilters = readSearchFilters(searchParams)
  const { filters, setFilters, results, loading, error, syncedAt, hasInvalidDateRange, hasActiveSearch } = useAvailability(urlFilters)
  const hasCompleteDateSearch = Boolean(filters.checkIn && filters.checkOut && !hasInvalidDateRange)

  useEffect(() => {
    setFilters(urlFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = () => {
    navigate(buildSearchPath(filters))
  }

  const statusText = (() => {
    if (hasInvalidDateRange) return 'Please select a check out date after the check in date.'
    if (!hasCompleteDateSearch) return 'Please select both a check in and check out date to see available apartments.'
    if (loading) return 'Checking Airbnb and Google Calendar availability for your selected dates.'
    if (error) return 'Live calendar sync is temporarily unavailable. Please confirm availability directly on WhatsApp before accepting a booking.'
    if (results.length === 0) return 'No apartments are currently available for the selected dates and guest count.'
    return `Showing ${results.length} available apartment${results.length === 1 ? '' : 's'} for your selected dates.`
  })()

  return (
    <Layout whatsappContext={{ checkIn: filters.checkIn, checkOut: filters.checkOut, guests: filters.guests }}>
      <section className="px-5 pb-16 pt-32 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widestLuxury text-ink/55 hover:text-ink"><ArrowLeft size={14} /> Back home</Link>
          <Reveal className="mt-10 grid gap-8 md:grid-cols-[1fr_.65fr] md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">Availability search</p>
              <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">Available apartments</h1>
            </div>
            <p className="text-base leading-8 text-ink/60">Select your dates and number of guests. The website checks the linked Airbnb and Google calendars and only shows apartments that are free across both.</p>
          </Reveal>

          <div className="relative z-30 mt-12">
            <SearchBar filters={filters} setFilters={setFilters} compact onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 border-y border-ink/10 py-7 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm"><CalendarDays size={18} strokeWidth={1.5} /></div>
              <div>
                <p className="text-sm leading-7 text-ink/70">{statusText}</p>
                {syncedAt && !error && <p className="mt-1 text-xs text-ink/45">Last calendar sync: {new Date(syncedAt).toLocaleString()}</p>}
              </div>
            </div>
            {hasActiveSearch && <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">{filters.guests} guest{Number(filters.guests) === 1 ? '' : 's'}</p>}
          </div>

          {hasCompleteDateSearch && !loading && results.length > 0 && (
            <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
              {results.map((apartment, index) => <ApartmentCard key={apartment.slug} apartment={apartment} index={index} />)}
            </div>
          )}

          {hasCompleteDateSearch && !loading && results.length === 0 && (
            <div className="bg-white p-10 text-center shadow-xl shadow-ink/5">
              <h2 className="font-serif text-4xl">No exact match found</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/60">Try a different date range or reduce the number of guests. You can also enquire on WhatsApp and the host can suggest the best available room.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
