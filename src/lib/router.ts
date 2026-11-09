import { useEffect, useState } from 'react'
import type { PlaceTab, ProductTab, Route } from '../types'

const placeTabs: PlaceTab[] = ['info', 'productos', 'ofertas', 'resenas']
const productTabs: ProductTab[] = ['info', 'productos', 'resenas']

const isPlaceTab = (value: string): value is PlaceTab =>
  (placeTabs as string[]).includes(value)

const isProductTab = (value: string): value is ProductTab =>
  (productTabs as string[]).includes(value)

export function parseRoute(hash: string): Route {
  const parts = hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((part) => decodeURIComponent(part))

  if (parts[0] === 'lugares' && parts.length >= 3) {
    return {
      screen: 'place',
      placeId: parts[1],
      tab: isPlaceTab(parts[2]) ? parts[2] : 'info',
    }
  }

  if (parts[0] === 'lugares') return { screen: 'search-places' }

  if (parts[0] === 'productos' && parts.length >= 4) {
    return {
      screen: 'product',
      placeId: parts[1],
      productId: parts[2],
      tab: isProductTab(parts[3]) ? parts[3] : 'info',
    }
  }

  if (parts[0] === 'productos') return { screen: 'search-products' }

  if (parts[0] === 'anadir') return { screen: 'add-site' }

  return { screen: 'search-places' }
}

export function routeToHash(route: Route): string {
  switch (route.screen) {
    case 'search-places':
      return '#/lugares'
    case 'place':
      return `#/lugares/${encodeURIComponent(route.placeId)}/${route.tab}`
    case 'search-products':
      return '#/productos'
    case 'product':
      return `#/productos/${encodeURIComponent(route.placeId)}/${encodeURIComponent(route.productId)}/${route.tab}`
    case 'add-site':
      return '#/anadir'
  }
}

export function navigate(route: Route, replace = false) {
  const target = routeToHash(route)

  if (replace) {
    window.history.replaceState(null, '', target)
    window.dispatchEvent(new Event('hashchange'))
    return
  }

  if (window.location.hash !== target) {
    window.location.hash = target.slice(1)
  }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.hash),
  )

  useEffect(() => {
    const syncRoute = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', syncRoute)

    if (!window.location.hash.startsWith('#/')) {
      window.history.replaceState(null, '', '#/lugares')
    }

    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  return route
}
