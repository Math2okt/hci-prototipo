import type { Place, PlaceFilter, Product, ProductFilter } from '../types'

export interface ProductResult {
  place: Place
  product: Product
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const getTokens = (query: string) =>
  normalize(query)
    .split(/\s+/)
    .filter((token) => token.length >= 3)

const getPlaceHaystack = (place: Place) =>
  normalize(
    [
      place.name,
      place.category,
      place.summary,
      place.description,
      ...place.keywords,
      ...place.products.flatMap((product) => [
        product.name,
        product.category,
        ...product.keywords,
      ]),
    ].join(' '),
  )

const getProductHaystack = (product: Product) =>
  normalize(
    [product.name, product.category, ...product.keywords].join(' '),
  )

const getMinPrice = (place: Place) => {
  if (place.products.length === 0) return Number.POSITIVE_INFINITY
  return Math.min(...place.products.map((product) => product.price))
}

const matchesQuery = (haystack: string, tokens: string[]) =>
  tokens.length === 0 || tokens.some((token) => haystack.includes(token))

const sortPlaces = (result: Place[], filters: PlaceFilter[]) => {
  if (filters.includes('cercano')) {
    return [...result].sort(
      (a, b) =>
        a.distanceMeters - b.distanceMeters ||
        getMinPrice(a) - getMinPrice(b),
    )
  }

  if (filters.includes('precio')) {
    return [...result].sort((a, b) => getMinPrice(a) - getMinPrice(b))
  }

  return result
}

const sortProducts = (result: ProductResult[], filters: ProductFilter[]) => {
  if (filters.includes('cercano')) {
    return [...result].sort(
      (a, b) =>
        a.place.distanceMeters - b.place.distanceMeters ||
        a.product.price - b.product.price,
    )
  }

  if (filters.includes('precio')) {
    return [...result].sort((a, b) => a.product.price - b.product.price)
  }

  return result
}

export function findPlaces(
  allPlaces: Place[],
  query: string,
  filters: PlaceFilter[],
): Place[] {
  const tokens = getTokens(query)

  const result = allPlaces.filter((place) => {
    if (!matchesQuery(getPlaceHaystack(place), tokens)) return false
    if (
      filters.includes('descuentos') &&
      !place.products.some((product) => product.discountPercent)
    ) {
      return false
    }
    if (filters.includes('reintegros') && !place.reintegros) return false
    return true
  })

  return sortPlaces(result, filters)
}

export function findProducts(
  allPlaces: Place[],
  query: string,
  filters: ProductFilter[],
): ProductResult[] {
  const tokens = getTokens(query)

  const result: ProductResult[] = []

  allPlaces.forEach((place) => {
    if (place.products.length === 0) return
    if (!matchesQuery(getPlaceHaystack(place), tokens)) return
    if (filters.includes('abierto') && !place.openNow) return

    const product =
      place.products.find((candidate) =>
        tokens.length === 0
          ? false
          : matchesQuery(getProductHaystack(candidate), tokens),
      ) ?? place.products[0]

    result.push({ place, product })
  })

  return sortProducts(result, filters)
}
