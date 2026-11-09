import { useRef, useState, type ChangeEvent } from 'react'
import { Icon } from '../components/Icon'
import { ImagePlaceholder } from '../components/ImagePlaceholder'
import { PlaceHeader } from '../components/PlaceHeader'
import { Stars } from '../components/Stars'
import { Tabs, type TabItem } from '../components/Tabs'
import { formatPrice } from '../lib/format'
import type { Place, PlaceTab, Product, Review } from '../types'

const placeTabItems: TabItem<PlaceTab>[] = [
  { id: 'info', label: 'Info' },
  { id: 'productos', label: 'Productos' },
  { id: 'ofertas', label: 'Ofertas' },
  { id: 'resenas', label: 'Reseñas' },
]

const productTabItems: TabItem<PlaceTab>[] = [
  { id: 'info', label: 'Info' },
  { id: 'productos', label: 'Productos' },
  { id: 'resenas', label: 'Reseñas' },
]

interface InfoPanelProps {
  place: Place
  productContext: boolean
}

function InfoPanel({ place, productContext }: InfoPanelProps) {
  return (
    <div className="tab-panel">
      <p className="data-note">Datos de ejemplo · no verificados</p>

      <section className="info-block">
        <h2>Descripción</h2>
        <p>{place.description}</p>
      </section>

      <section className="info-block">
        <h2>Dirección</h2>
        <p>{place.address}</p>
      </section>

      <section className="info-block">
        <h2>Horario</h2>
        <p>{place.hours}</p>
      </section>

      <section className="info-block">
        <h2>{productContext ? 'Teléfono / WhatsApp' : 'Teléfono'}</h2>
        <p>{productContext ? place.whatsapp : place.phone}</p>
      </section>
    </div>
  )
}

function ProductsPanel({ products }: { products: Product[] }) {
  return (
    <div className="tab-panel">
      <h2 className="panel-title">Productos</h2>
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-card__media">
              <ImagePlaceholder className="product-card__image" />
              {product.discountPercent ? (
                <span className="discount-badge">
                  {product.discountPercent}%
                </span>
              ) : null}
            </div>
            <h3 className="product-card__name">{product.name}</h3>
          </article>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="empty-state">
          Este lugar todavía no tiene productos cargados.
        </p>
      ) : null}
    </div>
  )
}

function OffersPanel({ products }: { products: Product[] }) {
  const offers = products.filter((product) => product.discountPercent)

  return (
    <div className="tab-panel">
      <h2 className="panel-title">Ofertas</h2>
      <div className="offers-list">
        {offers.map((product) => (
          <article className="offer-card" key={product.id}>
            <ImagePlaceholder className="offer-card__image" />
            <div className="offer-card__content">
              <h3 className="offer-card__name">{product.name}</h3>
              <span className="discount-badge">
                {product.discountPercent}%
              </span>
              <p className="offer-card__text">de descuento</p>
            </div>
          </article>
        ))}
      </div>
      {offers.length === 0 ? (
        <p className="empty-state">
          Este lugar no tiene ofertas por el momento.
        </p>
      ) : null}
    </div>
  )
}

interface ProductContextProps {
  place: Place
  product: Product
}

function ProductContext({ place, product }: ProductContextProps) {
  return (
    <section className="product-context">
      <p className="price-box">
        Precio estimado: <strong>{formatPrice(product.price)}</strong>
      </p>

      <h2 className="context-heading">Producto buscado</h2>
      <div className="context-product-card">
        <ImagePlaceholder className="context-thumb" />
        <div className="context-product-content">
          <span className="context-product-name">{product.name}</span>
          <span className="context-product-category">
            {product.category}
          </span>
        </div>
      </div>

      <h2 className="context-heading">Lugar que lo ofrece</h2>
      <div className="context-place-card">
        <ImagePlaceholder className="context-thumb" />
        <div className="context-place-content">
          <span className="context-place-name">{place.name}</span>
          <span className="context-place-category">{place.category}</span>
        </div>
      </div>
    </section>
  )
}

interface PlaceDetailScreenProps {
  place: Place
  activeTab: PlaceTab
  product?: Product
  addedReviews: Review[]
  onTabChange: (tab: PlaceTab) => void
  onBack: () => void
  onAddReview: (review: Review) => void
}

export function PlaceDetailScreen({
  place,
  activeTab,
  product,
  addedReviews,
  onTabChange,
  onBack,
  onAddReview,
}: PlaceDetailScreenProps) {
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const [published, setPublished] = useState(false)
  const [formError, setFormError] = useState('')
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(() => new Set())
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const noticeRef = useRef<HTMLDivElement>(null)

  const reviews = [...addedReviews, ...place.reviews]
  const tabItems = product ? productTabItems : placeTabItems

  const handleRatingChange = (value: number) => {
    setRating((current) => (current === value ? 0 : value))
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setAttachmentName(file ? file.name : null)
  }

  const toggleHelpful = (reviewId: string) => {
    setHelpfulIds((current) => {
      const next = new Set(current)
      if (next.has(reviewId)) {
        next.delete(reviewId)
      } else {
        next.add(reviewId)
      }
      return next
    })
  }

  const handlePublish = () => {
    const text = reviewText.trim()

    if (!text) {
      setFormError('Escribí tu experiencia para publicar tu reseña.')
      textareaRef.current?.focus()
      return
    }

    onAddReview({
      id: `review-${Date.now()}`,
      author: 'Vos',
      rating,
      text,
      helpfulCount: 0,
    })

    setReviewText('')
    setRating(5)
    setAttachmentName(null)
    setFormError('')
    setPublished(true)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

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
        <button type="button" className="back-button" onClick={onBack}>
          <Icon name="back" size={16} />
          <span>Volver</span>
        </button>

        {product ? (
          <ProductContext place={place} product={product} />
        ) : (
          <PlaceHeader place={place} />
        )}

        <Tabs
          items={tabItems}
          active={activeTab}
          onChange={onTabChange}
          label={`Secciones de ${place.name}`}
        />

        {activeTab === 'info' ? (
          <InfoPanel place={place} productContext={Boolean(product)} />
        ) : null}

        {activeTab === 'productos' ? (
          <ProductsPanel products={place.products} />
        ) : null}

        {activeTab === 'ofertas' ? (
          <OffersPanel products={place.products} />
        ) : null}

        {activeTab === 'resenas' ? (
          <div className="tab-panel">
            <h2 className="panel-title">Dejar una reseña</h2>

            <label className="visually-hidden" htmlFor="review-text">
              Tu experiencia
            </label>
            <textarea
              id="review-text"
              ref={textareaRef}
              className="review-textarea"
              value={reviewText}
              onChange={(event) => {
                setReviewText(event.target.value)
                if (formError) setFormError('')
              }}
              placeholder="Escribí tu experiencia"
            />

            <div className="rating-row">
              <Stars value={rating} size={17} onChange={handleRatingChange} />
              <span className="rating-hint">1 a 5 · Opcional</span>
            </div>

            {formError ? (
              <p className="form-error" role="alert">
                {formError}
              </p>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="attach-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="paperclip" size={14} />
              <span>Adjuntar producto o servicio (opcional)</span>
            </button>
            {attachmentName ? (
              <p className="attachment-name">
                Archivo adjunto: {attachmentName}
              </p>
            ) : null}

            <div className="reviews-list">
              {reviews.map((review) => {
                const isHelpful = helpfulIds.has(review.id)

                return (
                  <article className="review-item" key={review.id}>
                    <span className="review-avatar">
                      <Icon name="user" size={15} />
                    </span>
                    <div className="review-content">
                      <span className="visually-hidden">
                        Reseña de {review.author}.{' '}
                      </span>
                      <Stars value={review.rating} size={13} />
                      <p className="review-text">{review.text}</p>
                      <button
                        type="button"
                        className="helpful-button"
                        aria-pressed={isHelpful}
                        onClick={() => toggleHelpful(review.id)}
                      >
                        {isHelpful ? 'Te resultó útil' : 'Me resultó útil'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            {reviews.length === 0 ? (
              <p className="empty-state">
                Todavía no hay reseñas de este lugar.
              </p>
            ) : null}

            {published ? (
              <div
                className="success-banner"
                role="status"
                ref={noticeRef}
              >
                Se ha publicado tu reseña
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {activeTab === 'resenas' ? (
        <div className="action-bar action-bar--publish">
          <button
            type="button"
            className="publish-button"
            onClick={handlePublish}
          >
            Publicar
          </button>
        </div>
      ) : null}
    </div>
  )
}
