import { whatsappNumber } from '../data'

const missing = 'to be confirmed'

export function buildWhatsAppMessage({ apartmentName, checkIn, checkOut, guests } = {}) {
  const lines = ['Hello, I would like to enquire about availability at MS Homestays.']

  if (apartmentName) {
    lines.push(`Apartment: ${apartmentName}`)
  }

  lines.push(`Check in: ${checkIn || missing}`)
  lines.push(`Check out: ${checkOut || missing}`)
  lines.push(`Guests: ${guests || missing}`)

  return lines.join('\n')
}

export function buildWhatsAppUrl(context = {}) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(context))}`
}
