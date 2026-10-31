
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'Create Report', to: '/create' },
  { label: 'My Reports', to: '/reports' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClasses = ({ isActive }) =>
    [
      'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2',
      isActive
        ? 'text-[#11493E]'
        : 'text-[#344B43] hover:bg-[#F0F5F2] hover:text-[#11493E]',
    ].join(' ')

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="relative z-50 border-b border-[#E1E8E5] bg-white text-[#10231D]">
      <div className="mx-auto max-w-7xl px-4 pt-[env(safe-area-inset-top)] sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Outdoor Reporter home"
            className="flex min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2"
          >
            <span className="text-xl font-bold leading-tight tracking-[-0.03em] sm:text-2xl">
              Outdoor{' '}
              <span className="font-normal text-[#477568]">Reporter</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navigation.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={linkClasses}
              >
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#D5DFDA] bg-white text-[#11493E] hover:bg-[#F0F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2 md:hidden"
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="space-y-1 border-t border-[#E1E8E5] py-3 md:hidden"
          >
            {navigation.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={linkClasses}
                onClick={closeMenu}
              >
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
