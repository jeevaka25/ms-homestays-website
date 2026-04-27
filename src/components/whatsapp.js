import { whatsappNumber } from '../data'

export function buildWhatsAppMessage({ apartmentName, checkIn, checkOut, guests } = {}) {
  const lines = ['Hello, I would like to enquire about availability at MS Homestays.']

  if (apartmentName) {
    lines.push(`Apartment: ${apartmentName}`)
  }

  lines.push(`Check in: ${checkIn || ''}`)
  lines.push(`Check out: ${checkOut || ''}`)
  lines.push(`Guests: ${guests || ''}`)

  return lines.join('\n')
}

export function buildWhatsAppUrl(context = {}) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(context))}`
}
