import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function NotFound() {
  return (
    <Layout>
      <section className="flex min-h-screen items-center justify-center px-5 pt-24 text-center">
        <div>
          <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">404</p>
          <h1 className="mt-4 font-serif text-6xl">Page not found</h1>
          <Link to="/" className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] uppercase tracking-widestLuxury text-white">Return home</Link>
        </div>
      </section>
    </Layout>
  )
}
