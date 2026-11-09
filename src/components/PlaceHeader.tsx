import type { Place } from '../types'
import { Icon } from './Icon'
import { ImagePlaceholder } from './ImagePlaceholder'

interface ContactLinksProps {
  place: Place
}

function ContactLinks({ place }: ContactLinksProps) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name}, ${place.address}, Encarnación, Paraguay`,
  )}`
  const whatsappNumber = place.whatsapp.replace(/\D/g, '')
  const phoneNumber = place.phone.replace(/\s+/g, '')

  return (
    <div className="contact-links" aria-label="Contacto del lugar">
      <a
        className="contact-link"
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Ver ${place.name} en el mapa`}
        title="Ver en el mapa"
      >
        <Icon name="pin" size={17} />
      </a>
      <a
        className="contact-link"
        href={`tel:${phoneNumber}`}
        aria-label={`Llamar al ${place.phone}`}
        title={place.phone}
      >
        <Icon name="phone" size={17} />
      </a>
      <a
        className="contact-link"
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`Escribir por WhatsApp al ${place.whatsapp}`}
        title="WhatsApp"
      >
        <Icon name="whatsapp" size={17} />
      </a>
      {place.instagram ? (
        <a
          className="contact-link"
          href={`https://www.instagram.com/${place.instagram}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Ver Instagram de ${place.name}`}
          title="Instagram"
        >
          <Icon name="instagram" size={17} />
        </a>
      ) : null}
    </div>
  )
}

interface PlaceHeaderProps {
  place: Place
}

export function PlaceHeader({ place }: PlaceHeaderProps) {
  return (
    <header className="place-header">
      <ImagePlaceholder className="place-header__image" />
      <div className="place-header__content">
        <h1 className="place-header__name">{place.name}</h1>
        <p className="place-header__category">{place.category}</p>
        <ContactLinks place={place} />
      </div>
    </header>
  )
}
