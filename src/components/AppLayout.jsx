import Sidebar, { TabletRail, MobileAppBar, MobileTabBar } from './Sidebar'
import SubscriptionBanner from './SubscriptionBanner'

/**
 * App frame used by every advisor screen (Figma frames are 1440×1024):
 *   - 28px outer gutter, 100px rail, 28px gap
 *   - Workspace panel: #f4f6fb, radius 40, padding 36/40
 *
 * Props
 *   active     — sidebar key to highlight
 *   aside      — optional content rendered between the rail and the panel
 *                (Dashboard puts "Quick actions" here)
 *   panelClass — extra classes for the panel (e.g. "px-10")
 *   sidebar    — override the whole rail (admin / referrer shells)
 *
 * Responsive mode (opt-in, Figma R1–R5) — `responsive`:
 *   ≥1280 (xl)   identical to the desktop frame above (sticky 100px rail)
 *   768–1279     72px sticky icon rail (R1), panel r32 / padding 24
 *   <768         white app bar + fixed bottom tab bar (R2/R4), no rail
 *   mobileTitle / mobileBack / mobileTab (bottom-bar key, null hides it) / lockScroll (overlay open)
 *   mobileSearch — false hides the app bar's search button (the dashboard has no search)
 */
export default function AppLayout({ active, aside, children, panelClass = '', sidebar, responsive = true, mobileTitle, mobileBack, mobileTab, lockScroll, mobileSearch = true }) {
  if (!responsive) {
    return (
      <div className="flex min-h-screen min-w-[1280px] gap-7 bg-white py-6 pr-6 pl-7">
        {/* Rail stays pinned while the workspace scrolls */}
        <div className="sticky top-7 h-fit self-start">{sidebar ?? <Sidebar active={active} />}</div>
        {aside}
        <main
          className={`relative min-h-[976px] min-w-0 flex-1 rounded-[40px] bg-panel px-10 pt-9 pb-10 ${panelClass}`}
        >
          <SubscriptionBanner />
          {children}
        </main>
      </div>
    )
  }

  const tab = mobileTab === undefined ? active : mobileTab
  return (
    <div
      className={`flex min-h-screen flex-col bg-panel md:flex-row md:gap-4 md:bg-white md:p-4 xl:min-w-[1280px] xl:gap-7 xl:py-6 xl:pr-6 xl:pl-7 ${lockScroll ? 'h-screen overflow-clip' : ''}`}
    >
      <div className="md:hidden">
        <MobileAppBar title={mobileTitle} back={mobileBack} actions={!mobileBack} search={mobileSearch} />
      </div>
      {/* Rail stays pinned while the workspace scrolls (tablet + desktop) */}
      <div className="sticky top-4 hidden h-fit shrink-0 self-start md:block xl:top-7">
        <div className="hidden xl:block">{sidebar ?? <Sidebar active={active} />}</div>
        <div className="xl:hidden"><TabletRail active={active} /></div>
      </div>
      {aside}
      <main
        className={`relative min-w-0 flex-1 px-4 md:self-start xl:self-stretch pt-4 pb-[120px] md:rounded-[32px] md:bg-panel md:p-6 xl:min-h-[976px] xl:rounded-[40px] xl:px-10 xl:pt-9 xl:pb-10 ${panelClass}`}
      >
        <SubscriptionBanner />
        {children}
      </main>
      {tab && <div className="md:hidden"><MobileTabBar active={tab} /></div>}
    </div>
  )
}
