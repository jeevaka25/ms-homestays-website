import { Link, NavLink } from 'react-router-dom'
import WhatsAppButton from './WhatsAppButton'
import { apartments, site } from '../data'

export default function Layout({ children, whatsappContext = {} }) {
  return (
    <div className="min-h-screen bg-linen text-ink">
      <header className="fixed left-0 top-0 z-40 w-full border-b border-white/20 bg-linen/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
          <Link to="/" className="font-serif text-2xl tracking-wide">{site.name}</Link>
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-widestLuxury md:flex">
            <NavLink to="/" className="luxury-link">Home</NavLink>
            <a href="/#discovery" className="luxury-link">Apartments</a>
            <a href="/#enquire" className="luxury-link">Enquire</a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-ink/10 px-5 py-12 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-widestLuxury text-ink/50">{site.location}</p>
            <h2 className="mt-3 font-serif text-4xl">{site.name}</h2>
          </div>
          <div className="text-sm leading-7 text-ink/65">
            {apartments.slice(0, 3).map((item) => <Link key={item.slug} to={`/apartments/${item.slug}`} className="block hover:text-ink">{item.room}</Link>)}
          </div>
          <div className="text-sm leading-7 text-ink/65">
            {apartments.slice(3).map((item) => <Link key={item.slug} to={`/apartments/${item.slug}`} className="block hover:text-ink">{item.room}</Link>)}
          </div>
        </div>
      </footer>
      <WhatsAppButton context={whatsappContext} />
    </div>
  )
}
