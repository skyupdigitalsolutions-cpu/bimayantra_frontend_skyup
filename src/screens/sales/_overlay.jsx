// Shared overlay helpers: overlays are viewport-fixed so they open in the user's current
// viewport no matter how far the page is scrolled. At 1440×1024 (scrolled to top) the
// positions equal the Figma frame (workspace panel starts at 156,24 in the advisor/admin shell).
import { useEffect, useLayoutEffect, useRef } from 'react'

/** Workspace-panel scrim footprint (sidebar stays undimmed) */
export const PANEL_SCRIM = 'fixed top-6 right-6 bottom-6 left-[156px] rounded-[40px]'
/** Right drawer footprint: 24px panel gutter + 24px drawer inset; content scrolls inside */
export const DRAWER_BOX = 'fixed top-12 right-12 bottom-12 overflow-y-auto overscroll-contain'
/** Panel left edge in the viewport — add to a Figma x measured from the panel */
export const PANEL_X = 156

/** Lock page scroll while an overlay is open */
export function useLockScroll(on = true) {
  useEffect(() => {
    if (!on) return
    const el = document.documentElement
    const prev = el.style.overflow
    el.style.overflow = 'hidden'
    return () => {
      el.style.overflow = prev
    }
  }, [on])
}

/**
 * Viewport-fixed dialog top: the Figma offset (panel-relative, panel top = 24) when it fits,
 * otherwise pulled up so the whole card is visible (min 24px; taller cards scroll inside).
 * Returns a ref for the dialog element; give the element `fixed` + DIALOG_MAX.
 */
export function useFitTop(figmaTop) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const place = () => {
      const h = el.offsetHeight
      el.style.top = `${Math.max(24, Math.min(figmaTop + 24, window.innerHeight - h - 24))}px`
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    window.addEventListener('resize', place)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', place)
    }
  }, [figmaTop])
  return ref
}

export const DIALOG_MAX = 'max-h-[calc(100vh-48px)] overflow-y-auto overscroll-contain'

/** Drawer footer that stays pinned to the drawer bottom when the drawer content scrolls (px-7 / pb-6 drawers) */
export const DRAWER_FOOT = 'sticky bottom-0 z-10 -mx-7 -mt-3 shrink-0 bg-white px-7 pt-3 shadow-[0_24px_0_0_#fff]'
