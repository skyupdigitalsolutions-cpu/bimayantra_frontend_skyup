// Figma 42:5644 · C3 · Comparison — Customer chose
import Icon from '../../components/Icon'
import ComparisonPage, { Btn, Pill } from './_parts'
import { C } from '../../data/comparison'
import { PANEL_SCRIM, DIALOG_MAX, useFitTop, useLockScroll } from '../sales/_overlay'

export default function ComparisonCustomerChose() {
  useLockScroll()
  const ref = useFitTop(260)
  return (
    <ComparisonPage chip={<Pill tone="green" icon="check">Product chosen</Pill>} subtitle="Kavya chose CareFirst Family · Gold">
      {/* Scrim covers the workspace panel only (as in the frame) */}
      <div data-overlay="scrim" className={`${PANEL_SCRIM} z-10 bg-[rgba(14,31,59,0.4)]`} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        data-overlay="dialog"
        style={{ top: 284 }}
        className={`fixed left-[526px] z-20 flex w-[520px] ${DIALOG_MAX} flex-col items-center gap-[18px] rounded-[28px] bg-white p-8 text-center shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]`}
      >
        <span className="flex size-[72px] items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]">
          <Icon name="check" size={34} />
        </span>
        <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">Kavya chose CareFirst Family · Gold</p>
        <p className="text-[13px] leading-[20px] font-medium text-muted">
          Create the quotation now? It is priced again with every check and gets its own number. The comparison stays as a record.
        </p>
        <div className="flex w-full gap-2.5">
          <Btn variant="outline" to={C.shared} className="w-[226px] justify-center">Later</Btn>
          <Btn icon="quote" to={C.createQuote} className="flex-1 justify-center">Create quotation</Btn>
        </div>
      </div>
    </ComparisonPage>
  )
}
