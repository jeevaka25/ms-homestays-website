import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from './whatsapp'

export default function WhatsAppButton({ context = {} }) {
  return (
    <a
      href={buildWhatsAppUrl(context)}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact MS Homestays on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-olive text-white shadow-2xl transition duration-300 hover:scale-105 hover:bg-ink"
    >
      <MessageCircle size={24} strokeWidth={1.4} />
    </a>
  )
}
