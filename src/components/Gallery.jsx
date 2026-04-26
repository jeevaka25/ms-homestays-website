import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Gallery({ images = [], title = '' }) {
  const [active, setActive] = useState(images[0])

  return (
    <section className="grid gap-4 md:grid-cols-[1.5fr_.7fr]">
      <motion.div className="image-mask h-[56vh] min-h-[420px] overflow-hidden bg-mist" key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}>
        <img src={active} alt={title} loading="eager" className="h-full w-full object-cover" />
      </motion.div>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
        {images.map((image, index) => (
          <button key={image} type="button" onClick={() => setActive(image)} className={`h-28 overflow-hidden bg-mist md:h-[calc((56vh-2rem)/3)] ${active === image ? 'ring-1 ring-ink' : 'opacity-70 hover:opacity-100'}`}>
            <img src={image} alt={`${title} ${index + 1}`} loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  )
}
