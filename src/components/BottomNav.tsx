import { navigate } from '../lib/router'
import type { Route } from '../types'
import { Icon, type IconName } from './Icon'

export type NavSection = 'places' | 'products' | 'add'

interface NavItem {
  id: NavSection
  label: string
  icon: IconName
  route: Route
}

const items: NavItem[] = [
  {
    id: 'places',
    label: 'Lugares',
    icon: 'pin',
    route: { screen: 'search-places' },
  },
  {
    id: 'products',
    label: 'Productos',
    icon: 'bag',
    route: { screen: 'search-products' },
  },
  {
    id: 'add',
    label: 'Añadir',
    icon: 'plus',
    route: { screen: 'add-site' },
  },
]

interface BottomNavProps {
  active: NavSection
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Secciones principales">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="bottom-nav__item"
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => navigate(item.route)}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
