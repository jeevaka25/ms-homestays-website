import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Layout from '../components/Layout'
import Gallery from '../components/Gallery'
import SearchBar from '../components/SearchBar'
import Reveal from '../components/Reveal'
import { apartments } from '../data'
import { buildWhatsAppUrl } from '../components/whatsapp'
import { useAvailability } from '../hooks/useAvailability'
import { buildSearchPath } from '../utils/searchParams'

export default function ApartmentDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const apartment = apartments.find((item) => item.slug === slug)
  const { filters, setFilters, results, loading, syncedAt, error, hasInvalidDateRange } = useAvailability()
  const isAvailable = apartment && results.some((item) => item.slug === apartment.slug)
  const handleSearch = () => navigate(buildSearchPath(filters))

  if (!apartment) {
    return null
  }

  return (
    <Layout whatsappContext={{ apartmentName: `${apartment.room} - ${apartment.title}`, checkIn: filters.checkIn, checkOut: filters.checkOut, guests: filters.guests }}>
      <section className="px-5 pb-16 pt-32 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widestLuxury text-ink/55 hover:text-ink"><ArrowLeft size={14} /> Back to all stays</Link>
          <Reveal className="mt-10 grid gap-8 md:grid-cols-[1fr_.55fr] md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">{apartment.room}</p>
              <h1 className="mt-4 font-serif text-6xl leading-tight md:text-8xl">{apartment.title}</h1>
            </div>
            <p className="text-base leading-8 text-ink/60">{apartment.subtitle}</p>
          </Reveal>
          <div className="mt-12">
            <Gallery images={apartment.images} title={apartment.title} />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[.75fr_1.25fr]">
          <aside className="h-fit bg-white p-6 shadow-xl shadow-ink/5 md:sticky md:top-28">
            <SearchBar filters={filters} setFilters={setFilters} compact onSearch={handleSearch} />
            <div className="mt-6 border-t border-ink/10 pt-6 text-sm text-ink/60">
              {hasInvalidDateRange ? 'Please select a check out date after the check in date.' : filters.checkIn && filters.checkOut ? (
                isAvailable ? 'This room matches your selected dates and guest count.' : 'This room does not match the selected search. Try another date or guest count.'
              ) : loading ? 'Syncing live Airbnb calendar availability...' : error ? 'Live Airbnb calendar sync is temporarily unavailable. Please confirm directly with the host.' : 'Enter dates to check live Airbnb availability.'}
            </div>
          </aside>
          <div>
            <Reveal>
              <div className="grid gap-4 border-y border-ink/10 py-8 md:grid-cols-4">
                <Spec label="Guests" value={`Up to ${apartment.guests}`} />
                <Spec label="Beds" value={apartment.beds} />
                <Spec label="Baths" value={apartment.baths} />
                <Spec label="Type" value={apartment.type} />
              </div>
            </Reveal>
            <Reveal delay={.1} className="mt-14">
              <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">Amenities</p>
              <div className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
                {apartment.amenities.map((amenity) => (
                  <div key={amenity} className="border-b border-ink/10 pb-4 text-sm text-ink/70">{amenity}</div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={.2} className="mt-16 bg-white p-8 md:p-12">
              <h2 className="font-serif text-4xl">Ready to enquire?</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink/60">For final availability and pricing, contact the host directly. The calendar checks Airbnb availability every 30 minutes{syncedAt ? ` and was last synced on ${new Date(syncedAt).toLocaleString()}` : ''}.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={buildWhatsAppUrl({ apartmentName: `${apartment.room} - ${apartment.title}`, checkIn: filters.checkIn, checkOut: filters.checkOut, guests: filters.guests })} target="_blank" rel="noreferrer" className="bg-ink px-7 py-4 text-[11px] uppercase tracking-widestLuxury text-white hover:bg-clay">WhatsApp host</a>
                <a href={apartment.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-ink/20 px-7 py-4 text-[11px] uppercase tracking-widestLuxury hover:border-ink">View Airbnb <ExternalLink size={13} /></a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function Spec({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widestLuxury text-ink/40">{label}</p>
      <p className="mt-3 text-sm leading-6 text-ink/70">{value}</p>
    </div>
  )
}
