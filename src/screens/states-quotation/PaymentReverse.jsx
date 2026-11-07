// Figma 283:32712 · PY4 · Payment — Reverse (undo)
import { useState } from 'react'
import { cx } from '../../components/ui'
import { QuoteDetailBase, CHIPS, Btn, Scrim, Dialog, DialogIcon, DialogTitle, DialogText, DialogActions, DangerButton, TextField } from './_parts'
import { paidActivity, reverseOptions } from '../../data/states-quotation'

function Option({ o, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cx('flex w-full items-center gap-3 rounded-[14px] p-3 text-left', selected ? 'border border-blue bg-[#f3f7ff]' : 'bg-panel hover:bg-[#edf1f8]')}
    >
      <span className={cx('size-[22px] shrink-0 rounded-full bg-white', selected ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[13px] font-bold text-ink">{o.title}</span>
        {!selected && o.key === 'refund' && <span className="text-[11px] font-medium text-muted">{o.sub}</span>}
      </span>
    </button>
  )
}

export default function PaymentReverse() {
  const [sel, setSel] = useState('mistake')
  return (
    <QuoteDetailBase chip={CHIPS.shared} actions={[Btn.reject(), Btn.reviseOutline(), Btn.accept()]} activity={paidActivity} payment="paid">
      <Scrim to="/x/08b-quotation-detail-payment-successful" />
      <Dialog top={90}>
        <DialogIcon icon="refresh" />
        <DialogTitle>Reverse this payment?</DialogTitle>
        <DialogText>Use this if it was recorded by mistake or the insurer refunded it. Allowed only while the policy is awaiting issuance.</DialogText>
        {reverseOptions.map((o) => <Option key={o.key} o={o} selected={sel === o.key} onSelect={() => setSel(o.key)} />)}
        <TextField label="Reason *" defaultValue="Wrong UTR entered" />
        <DialogActions
          cancelTo="/x/08b-quotation-detail-payment-successful"
          confirm={<DangerButton icon="refresh" to="/x/py5-payment-reversed">Reverse payment</DangerButton>}
        />
      </Dialog>
    </QuoteDetailBase>
  )
}
