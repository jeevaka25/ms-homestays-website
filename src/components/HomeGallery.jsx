import { motion } from 'framer-motion'
import Reveal from './Reveal'

const galleryImages = [
  {
    src: '/images/home-gallery/garden-verandah.jpeg',
    alt: 'Shaded garden verandah at MS Homestays',
    className: 'md:col-span-7 h-[360px] md:h-[560px]'
  },
  {
    src: '/images/home-gallery/coconut-rainbow.jpeg',
    alt: 'Rainbow over the coconut grove near MS Homestays',
    className: 'md:col-span-5 h-[300px] md:h-[560px]'
  },
  {
    src: '/images/home-gallery/garden-path.jpeg',
    alt: 'Garden pathway with tropical planting',
    className: 'md:col-span-4 h-[280px] md:h-[390px]'
  },
  {
    src: '/images/home-gallery/villa-exterior.jpeg',
    alt: 'Villa exterior surrounded by palms and greenery',
    className: 'md:col-span-4 h-[280px] md:h-[390px]'
  },
  {
    src: '/images/home-gallery/garden-entry.jpeg',
    alt: 'Flower filled entrance to MS Homestays',
    className: 'md:col-span-4 h-[280px] md:h-[390px]'
  },
  {
    src: '/images/home-gallery/upper-balcony-palms.jpeg',
    alt: 'Upper balcony looking out to palm trees',
    className: 'md:col-span-5 h-[420px] md:h-[620px]'
  },
  {
    src: '/images/home-gallery/covered-garden-walkway.jpeg',
    alt: 'Covered walkway through the garden courtyard',
    className: 'md:col-span-7 h-[340px] md:h-[620px]'
  }
]

export default function HomeGallery() {
  return (
    <section className="bg-white px-5 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 md:grid-cols-[.85fr_1fr] md:items-end">
          <Reveal>
            <p className="text-[11px] uppercase tracking-widestLuxury text-ink/45">The grounds</p>
            <h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Lush gardens, shaded verandahs and open skies.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-base leading-8 text-ink/60">A calm tropical setting framed by palms, flowering vines and quiet outdoor corners, designed for slow mornings, relaxed evenings and easy access to the surrounding landscape.</p>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          {galleryImages.map((image, index) => (
            <motion.figure
              key={image.src}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.24) }}
              className={`group relative overflow-hidden bg-linen ${image.className}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index < 2 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover transition duration-[1600ms] ease-out group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-70" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
