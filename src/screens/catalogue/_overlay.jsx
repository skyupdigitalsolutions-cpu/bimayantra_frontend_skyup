// Viewport-pinned overlay primitives shared by the advisor screens.
// Overlays used to be `absolute` inside the workspace panel at their Figma coordinates, so on a
// scrolled / tall page they opened off-screen. Everything here is `position: fixed`:
//  - the scrim covers the workspace panel area only (sidebar stays undimmed, like Figma)
//  - dialogs keep their Figma left/top relative to the panel (panel = 156px from the left,
//    24px from the top) but are never pushed below the fold — on a short viewport the top gap
//    shrinks first, then the dialog scrolls internally
//  - drawers are pinned top/right/bottom 48px and scroll internally
//  - toasts sit at their Figma spot measured from the viewport bottom
// While a scrim / dialog / drawer is mounted the page scroll is locked.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../components/ui'

/** Standard advisor shell: workspace panel starts at x=156 (28 gutter + 100 rail + 28 gap), 24px insets. */
export const PANEL_LEFT = 156
export const PANEL_TOP = 24

let locks = 0
let prevOverflow = ''
/** Locks document scroll while mounted (ref-counted so stacked overlays don't fight). */
export function useScrollLock(on = true) {
  useEffect(() => {
    if (!on) return undefined
    const el = document.documentElement
    if (locks === 0) {
      prevOverflow = el.style.overflow
      el.style.overflow = 'hidden'
    }
    locks += 1
    return () => {
      locks -= 1
      if (locks === 0) el.style.overflow = prevOverflow
    }
  }, [on])
}

/** Fixed scrim class over the workspace panel area (#0e1f3b @ 40%). */
export const SCRIM_CLS = 'fixed top-6 right-6 bottom-6 left-[156px] rounded-[40px] bg-[#0e1f3b]/40'

/** Fixed workspace scrim. `to` renders a close link, otherwise a div with `onClick`. */
export function FixedScrim({ to, onClick, className = '', z = 'z-40', ...rest }) {
  useScrollLock()
  const cls = cx(SCRIM_CLS, z, className)
  return to
    ? <Link to={to} aria-label="Close" data-overlay="scrim" className={cls} {...rest} />
    : <div data-overlay="scrim" className={cls} onClick={onClick} {...rest} />
}

/**
 * Fixed dialog positioned at Figma panel coords (`left`/`top` relative to the workspace panel).
 * Renders a pointer-transparent frame over the panel area; a spacer of `top` px shrinks when the
 * viewport is short so the dialog always stays fully on screen (and scrolls inside if needed).
 */
export function FixedDialog({ top = 140, left = 360, width, className = '', style, frameClass = 'z-50', kind = 'dialog', as: Tag = 'div', children, ...rest }) {
  useScrollLock()
  return (
    <div className={cx('pointer-events-none fixed top-6 right-6 bottom-6 left-[156px] flex flex-col', frameClass)}>
      <div className="min-h-0 shrink" style={{ flex: `0 1 ${top}px` }} />
      <Tag
        role="dialog"
        data-overlay={kind}
        className={cx('pointer-events-auto relative max-h-full shrink-0 overflow-y-auto', className)}
        style={{ marginLeft: left, width, ...style }}
        {...rest}
      >
        {children}
      </Tag>
    </div>
  )
}

/** Fixed right drawer: 500×(100vh−96) at 48px from the viewport edges, scrolls internally. */
export const DRAWER_POS = 'fixed top-12 right-12 bottom-12 overflow-y-auto overscroll-contain'

/** Toast at Figma panel (40, 900) h48 → 196px from the left, 52px from the viewport bottom. */
export const TOAST_POS = 'fixed bottom-[52px] left-[196px]'
