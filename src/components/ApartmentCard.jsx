import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function ApartmentCard({ apartment, index = 0, search = '' }) {
  return (
    <Reveal delay={index * 0.08}>
      <Link to={`/apartments/${apartment.slug}${search}`} className="group block">
        <div className="h-[420px] overflow-hidden bg-mist">
          <img src={apartment.images[0]} alt={apartment.title} loading="lazy" className="h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-105" />
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">{apartment.room}</p>
            <h3 className="mt-2 font-serif text-3xl">{apartment.title}</h3>
          </div>
          <p className="pt-2 text-sm text-ink/55">Up to {apartment.guests} guests</p>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-7 text-ink/60">{apartment.subtitle}</p>
      </Link>
    </Reveal>
  )
}
