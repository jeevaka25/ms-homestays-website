import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Layout from '../components/Layout'
import Gallery from '../components/Gallery'
import Reveal from '../components/Reveal'
import { apartments } from '../data'
import { buildWhatsAppUrl } from '../components/whatsapp'
import { useAvailability } from '../hooks/useAvailability'
import { readSearchFilters } from '../utils/searchParams'

export default function ApartmentDetail() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const apartment = apartments.find((item) => item.slug === slug)
  const urlFilters = readSearchFilters(searchParams)
  const { filters, results, loading, syncedAt, error, hasInvalidDateRange, isAvailabilityKnown } = useAvailability(urlFilters)
  const isAvailable = apartment && results.some((item) => item.slug === apartment.slug)
  const availabilityKnown = apartment ? isAvailabilityKnown(apartment.slug) : true
  const returnPath = filters.checkIn && filters.checkOut ? `/search?${searchParams.toString()}` : '/'
  const hasSearchContext = Boolean(filters.checkIn || filters.checkOut || Number(filters.guests) > 1)
  const whatsappContext = {
    apartmentName: `${apartment?.room} - ${apartment?.title}`,
    ...(hasSearchContext ? { checkIn: filters.checkIn, checkOut: filters.checkOut, guests: filters.guests } : {}),
  }

  if (!apartment) {
    return null
  }

  return (
    <Layout whatsappContext={whatsappContext}>
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
            <p className="text-[10px] uppercase tracking-widestLuxury text-ink/45">Availability note</p>
            <div className="mt-4 text-sm text-ink/60">
              {hasInvalidDateRange ? 'Please select a check out date after the check in date.' : filters.checkIn && filters.checkOut ? (
                !availabilityKnown ? 'We could not fully verify this room across Airbnb and Google Calendar just now. Please confirm directly with the host.' : isAvailable ? 'This room matches your selected dates and guest count.' : 'This room does not match the selected search. Try another date or guest count.'
              ) : loading ? 'Syncing live Airbnb and Google Calendar availability...' : error ? 'Live calendar sync is temporarily unavailable. Please confirm directly with the host.' : 'Use the home page search to check dates and guest count before opening room details.'}
            </div>
            <Link to={returnPath} className="mt-6 inline-block text-[11px] uppercase tracking-widestLuxury text-ink/50 hover:text-ink">
              {filters.checkIn && filters.checkOut ? 'Back to search results' : 'Back to home search'}
            </Link>
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
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink/60">For final availability and pricing, contact the host directly. The calendar checks Airbnb and Google Calendar availability every 30 minutes{syncedAt ? ` and was last synced on ${new Date(syncedAt).toLocaleString()}` : ''}.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={buildWhatsAppUrl(whatsappContext)} target="_blank" rel="noreferrer" className="bg-ink px-7 py-4 text-[11px] uppercase tracking-widestLuxury text-white hover:bg-clay">WhatsApp host</a>
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
