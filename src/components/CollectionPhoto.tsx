import { useState } from 'react'

export default function CollectionPhoto({ src, name, className = 'aspect-[3/4]' }: { src?: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`${className} overflow-hidden bg-panel`}>
      {src && !failed ? (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className="w-full h-full object-contain" />
      ) : (
        <div className="placeholder h-full px-4 text-center">Foto {name} belum tersedia</div>
      )}
    </div>
  )
}
