import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const pad = (value) => String(value).padStart(2, '0')
const toIsoDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const parseIsoDate = (value) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}
const addDays = (value, days) => {
  const date = parseIsoDate(value) || new Date()
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}
const todayIso = () => toIsoDate(new Date())

const formatDisplayDate = (value) => {
  const date = parseIsoDate(value)
  if (!date) return ''
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function DatePicker({ label, value, placeholder, minDate, onChange }) {
  const wrapperRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = parseIsoDate(value)
    const min = parseIsoDate(minDate)
    const base = selected || min || new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  useEffect(() => {
    const selected = parseIsoDate(value)
    if (selected) setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
  }, [value])

  useEffect(() => {
    const handleClickAway = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickAway)
    return () => document.removeEventListener('mousedown', handleClickAway)
  }, [])

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ]
  }, [visibleMonth])

  const moveMonth = (direction) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  const selectedIso = value
  const minimum = minDate || todayIso()

  return (
    <div ref={wrapperRef} className="relative">
      <span className="text-[10px] uppercase tracking-widestLuxury text-ink/45">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between gap-3 bg-transparent text-left text-sm outline-none"
      >
        <span className={value ? 'text-ink' : 'text-ink/35'}>{value ? formatDisplayDate(value) : placeholder}</span>
        <CalendarDays size={15} strokeWidth={1.5} className="text-ink/45" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-4 w-[19rem] border border-ink/10 bg-white p-4 shadow-2xl shadow-ink/15">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => moveMonth(-1)} className="p-2 text-ink/50 transition hover:text-ink" aria-label="Previous month">
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <p className="font-serif text-xl">{MONTH_LABELS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</p>
            <button type="button" onClick={() => moveMonth(1)} className="p-2 text-ink/50 transition hover:text-ink" aria-label="Next month">
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 text-center text-[10px] uppercase tracking-widestLuxury text-ink/35">
            {DAY_LABELS.map((day) => <div key={day}>{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) return <div key={`blank-${index}`} />
              const iso = toIsoDate(date)
              const disabled = iso < minimum
              const selected = iso === selectedIso
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso)
                    setOpen(false)
                  }}
                  className={`aspect-square text-sm transition ${selected ? 'bg-ink text-white' : 'hover:bg-linen'} ${disabled ? 'cursor-not-allowed text-ink/20 hover:bg-transparent' : 'text-ink/70'}`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchBar({ filters, setFilters, compact = false, onSearch }) {
  const update = (field, value) => setFilters((current) => ({ ...current, [field]: value }))

  const handleCheckIn = (value) => {
    setFilters((current) => ({
      ...current,
      checkIn: value,
      checkOut: current.checkOut && current.checkOut <= value ? '' : current.checkOut,
    }))
  }

  const handleGuests = (value) => {
    const guests = Math.max(1, Number(value || 1))
    update('guests', guests)
  }

  return (
    <div className={`grid gap-3 bg-white/95 p-4 shadow-2xl shadow-ink/10 backdrop-blur md:grid-cols-[1fr_1fr_.8fr_auto] ${compact ? 'border border-ink/10' : ''}`}>
      <DatePicker label="Check in" value={filters.checkIn} placeholder="Select date" minDate={todayIso()} onChange={handleCheckIn} />
      <DatePicker label="Check out" value={filters.checkOut} placeholder="Select date" minDate={filters.checkIn ? addDays(filters.checkIn, 1) : todayIso()} onChange={(value) => update('checkOut', value)} />
      <label className="block">
        <span className="text-[10px] uppercase tracking-widestLuxury text-ink/45">Guests</span>
        <input min="1" type="number" value={filters.guests} onChange={(e) => handleGuests(e.target.value)} className="mt-2 w-full bg-transparent text-sm outline-none" />
      </label>
      <button type="button" onClick={onSearch} className="flex items-center justify-center gap-2 bg-ink px-8 py-4 text-[11px] uppercase tracking-widestLuxury text-white transition hover:bg-clay">
        <Search size={16} strokeWidth={1.5} /> Search
      </button>
    </div>
  )
}
