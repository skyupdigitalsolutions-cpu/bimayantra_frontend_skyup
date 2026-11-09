// One place that knows about the header "Search anything · Ctrl K" pill.
//
// Several headers render the pill (catalogue Header, ui PageHeader, settings, admin, flows…) and three page hooks
// listen to it (screens/tasks/_filter, screens/admin/_filter, screens/customer-tabs/_search). This bus gives them:
//  - PILL_SEL / isPill / visiblePills: how to find the pill;
//  - registerConsumer(): a page that filters its own list with the pill says so while it is mounted. When no page
//    does, the pill is a global search instead (components/GlobalSearch.jsx): leads, customers, family members,
//    quotations and policies from GET /search.
// Listeners are attached to `document` (event delegation), not to the input itself, so they keep working when the
// header re-renders or mounts after the page's data loads.

export const PILL_SEL = 'input[placeholder^="Search anything"]'

export const isPill = (el) => !!el && typeof el.matches === 'function' && el.matches(PILL_SEL)

const shown = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
export const visiblePills = () => (typeof document === 'undefined' ? [] : [...document.querySelectorAll(PILL_SEL)].filter(shown))

let consumers = 0
const subs = new Set()
const notify = () => {
  if (typeof document !== 'undefined') document.documentElement.dataset.searchConsumers = String(consumers)
  subs.forEach((fn) => fn(consumers))
}

/** A page that filters its list with the pill calls this while mounted; returns the unregister function. */
export function registerConsumer() {
  consumers += 1
  notify()
  let done = false
  return () => {
    if (done) return
    done = true
    consumers -= 1
    notify()
  }
}
export const hasConsumer = () => consumers > 0
export function subscribe(fn) {
  subs.add(fn)
  return () => subs.delete(fn)
}

/** Puts `value` in every pill that is not being typed in (a pill re-mounted after loading shows the live query). */
export function syncPills(value) {
  if (typeof document === 'undefined') return
  for (const el of document.querySelectorAll(PILL_SEL)) {
    if (el !== document.activeElement && el.value !== value) el.value = value
  }
}
export function clearPills() {
  if (typeof document === 'undefined') return
  for (const el of document.querySelectorAll(PILL_SEL)) el.value = ''
}
