import { useRef, useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'

const categories = [
  'Restaurante o comida',
  'Comercio',
  'Museo o atractivo turístico',
  'Otro',
]

export function AddSiteScreen() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [sent, setSent] = useState(false)
  const noticeRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !category) return

    setSent(true)
    setName('')
    setCategory('')
    setPhone('')
    setWhatsapp('')
    setInstagram('')

    requestAnimationFrame(() => {
      noticeRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }

  return (
    <div className="screen">
      <div className="screen__scroll">
        <h1 className="add-title">Añadir sitio</h1>

        {sent ? (
          <div className="success-banner" role="status" ref={noticeRef}>
            Tu sitio fue enviado y está en revisión
          </div>
        ) : null}

        <form id="add-site-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="site-name">Nombre del sitio</label>
            <input
              id="site-name"
              className="text-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Escribí el nombre"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="site-category">Categoría del sitio</label>
            <div className="select-wrap">
              <select
                id="site-category"
                className="text-input"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccioná una categoría
                </option>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={16} />
            </div>
            <p className="helper-text">
              Según la categoría, se muestran distintas pestañas en la ficha
              del lugar.
            </p>
          </div>

          <h2 className="form-section-title">Contacto y redes sociales</h2>

          <div className="form-field">
            <label htmlFor="site-phone">Teléfono</label>
            <input
              id="site-phone"
              className="text-input"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Número de teléfono"
            />
          </div>

          <div className="form-field">
            <label htmlFor="site-whatsapp">WhatsApp</label>
            <input
              id="site-whatsapp"
              className="text-input"
              type="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="Número de WhatsApp"
            />
          </div>

          <div className="form-field">
            <label htmlFor="site-instagram">Instagram</label>
            <input
              id="site-instagram"
              className="text-input"
              type="text"
              value={instagram}
              onChange={(event) => setInstagram(event.target.value)}
              placeholder="Usuario de Instagram"
            />
          </div>
        </form>
      </div>

      <div className="action-bar action-bar--add">
        <button
          type="submit"
          form="add-site-form"
          className="outline-button"
        >
          Añadir
        </button>
      </div>
    </div>
  )
}
