import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * App-wide navigation behaviour:
 * 1. Every route change starts at the top of the page (browser back/forward keeps
 *    its natural position).
 * 2. Any notification bell button anywhere in the app opens the Notifications page,
 *    even on screens where the bell has no explicit link.
 */
export default function NavBehavior() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      // Walk up from the click target to the small control that holds a bell icon.
      let el = e.target instanceof Element ? e.target : null
      for (let i = 0; el && i < 4; i++, el = el.parentElement) {
        const r = el.getBoundingClientRect()
        if (r.width > 72 || r.height > 72) return // left the control — not a bell click
        if (el.querySelector?.('svg[data-icon="bell"]') || el.matches?.('svg[data-icon="bell"]')) {
          const link = el.closest('a[href]')
          if (link && link.getAttribute('href') !== '/' && !link.getAttribute('href').startsWith('/x/01b')) return // explicit link wins
          e.preventDefault()
          if (pathname !== '/notifications') navigate('/notifications')
          return
        }
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate, pathname])

  return null
}
