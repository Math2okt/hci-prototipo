export type PlaceTab = 'info' | 'productos' | 'ofertas' | 'resenas'

export type ProductTab = 'info' | 'productos' | 'resenas'

export type PlaceFilter = 'cercano' | 'precio' | 'descuentos' | 'reintegros'

export type ProductFilter = 'cercano' | 'precio' | 'abierto'

export type Route =
  | { screen: 'search-places' }
  | { screen: 'place'; placeId: string; tab: PlaceTab }
  | { screen: 'search-products' }
  | { screen: 'product'; placeId: string; productId: string; tab: ProductTab }
  | { screen: 'add-site' }

export interface Product {
  id: string
  name: string
  category: string
  price: number
  discountPercent?: number
  keywords: string[]
}

export interface Review {
  id: string
  author: string
  rating: number
  text: string
  helpfulCount: number
}

export interface Place {
  id: string
  name: string
  category: string
  summary: string
  distanceMeters: number
  description: string
  address: string
  hours: string
  phone: string
  whatsapp: string
  instagram?: string
  openNow: boolean
  reintegros: boolean
  keywords: string[]
  products: Product[]
  reviews: Review[]
}
