import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bike, Clock3, Droplets, PlaneLanding, PlaneTakeoff, Shirt, Utensils, Waves, Wifi, Zap } from 'lucide-react'
import Layout from '../components/Layout'
import SearchBar from '../components/SearchBar'
import ApartmentCard from '../components/ApartmentCard'
import Reveal from '../components/Reveal'
import HomeGallery from '../components/HomeGallery'
import { apartments, homestayAmenities, site } from '../data'
import { buildWhatsAppUrl } from '../components/whatsapp'
import { useAvailability } from '../hooks/useAvailability'
import { buildSearchPath } from '../utils/searchParams'

const amenityIcons = {
  'Free fast Wi-Fi': Wifi,
  'Free drinking water': Droplets,
  'Electric scooter rental': Bike,
  'Home cooked pure vegetarian meals': Utensils,
  'Free washing machine': Shirt,
  'Yoga practice space': Waves,
  '24 hour check-in service': Clock3,
  'Airport pick up': PlaneLanding,
  'Airport drop off': PlaneTakeoff,
}

export default function Home() {
  const navigate = useNavigate()
  const { filters, setFilters, results, loading, syncedAt, hasActiveSearch, hasInvalidDateRange } = useAvailability()
  const displayApartments = hasActiveSearch ? results : apartments
  const whatsappContext = hasActiveSearch ? { checkIn: filters.checkIn, checkOut: filters.checkOut, guests: filters.guests } : {}

  const handleSearch = () => {
    navigate(buildSearchPath(filters))
  }

  return (
    <Layout whatsappContext={whatsappContext}>
      <section className="relative z-10 min-h-screen overflow-visible pt-24">
        <div className="absolute inset-0">
          <img src="/images/hero-coconut-grove.jpeg" alt="Coconut grove view at MS Homestays" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-linen" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-16 md:px-10">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-[11px] uppercase tracking-widestLuxury text-white/80">{site.location}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: .1 }} className="mt-5 max-w-4xl font-serif text-6xl font-normal leading-[.96] text-white md:text-8xl">{site.strapline}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: .25 }} className="mt-8 max-w-2xl text-base leading-8 text-white/82">{site.intro}</motion.p>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: .4 }} className="relative z-30 mt-10 max-w-5xl">
            <SearchBar filters={filters} setFilters={setFilters} onSearch={handleSearch} maxGuests={4} />
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="grid gap-10 md:grid-cols-[.75fr_1.25fr] md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">Amenities at MS Homestays</p>
              <h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Thoughtful services for a calm and practical stay.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ink/60">From daily essentials to local transport and simple meal support, these amenities are designed to keep your stay near Adiyogi smooth, flexible and quietly comfortable.</p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {homestayAmenities.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} className="border border-ink/10 bg-white px-6 py-7 shadow-sm shadow-ink/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linen text-ink/65">
                  {(() => {
                    const Icon = amenityIcons[item.title] || Zap
                    return <Icon size={18} strokeWidth={1.6} />
                  })()}
                </div>
                <h3 className="mt-3 font-serif text-3xl leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/60">{item.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HomeGallery />

      <section id="discovery" className="px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">Discovery</p>
              <h2 className="mt-4 font-serif text-5xl">Choose your apartment</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ink/55">
              {hasInvalidDateRange ? 'Please select a check out date after the check in date.' : `Showing ${displayApartments.length} available option${displayApartments.length === 1 ? '' : 's'} based on your current search.`}
              {loading ? ' Syncing Airbnb and Google calendars...' : syncedAt ? ` Last calendar sync: ${new Date(syncedAt).toLocaleString()}` : ''}
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
            {displayApartments.map((apartment, index) => <ApartmentCard key={apartment.slug} apartment={apartment} index={index} />)}
          </div>
          {displayApartments.length === 0 && (
            <div className="border border-ink/10 bg-white p-10 text-center">
              <h3 className="font-serif text-3xl">No exact match found</h3>
              <p className="mt-3 text-sm text-ink/60">Try a different date range or reduce the guest count.</p>
            </div>
          )}
        </div>
      </section>

      <section id="enquire" className="bg-white px-5 py-28 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_.9fr] md:items-center">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">Enquire</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight">Planning a visit to Adiyogi?</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-ink/60">Share your dates, guest count and stay preference. The host can confirm the most suitable room and any additional services, including meals or scooter rental where available.</p>
          </Reveal>
          <Reveal delay={.1} className="bg-linen p-8 md:p-12">
            <a href={buildWhatsAppUrl(whatsappContext)} target="_blank" rel="noreferrer" className="inline-flex bg-ink px-8 py-4 text-[11px] uppercase tracking-widestLuxury text-white transition hover:bg-clay">Enquire on WhatsApp</a>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
