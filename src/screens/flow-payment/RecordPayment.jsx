// Figma 42:5954 · P2 · Payment — Record payment
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToggleChip, Checkbox } from '../../components/ui'
import { paymentQuote as q, paymentModes, recordedPayment as r } from '../../data/payment'
import { P, Pill, Btn, QuoteHeader, QuoteBehind, Drawer, DrawerNote, DField, DInput, PaymentLayout } from './_parts'

export default function RecordPayment() {
  const nav = useNavigate()
  const [mode, setMode] = useState(r.mode)
  const [amount, setAmount] = useState(q.totalExact)
  const [date, setDate] = useState(r.date)
  const [utr, setUtr] = useState(r.utr)
  const [checked, setChecked] = useState(true)
  const close = () => nav(P.quote)

  return (
    <PaymentLayout>
      <QuoteHeader
        rev
        chip={<Pill tone="violet" icon="clock">Awaiting payment</Pill>}
        subtitle={`${q.customer} · ${q.product} · ${q.plan} · total ${q.total}`}
        action={<Btn icon="check" onClick={() => nav(P.recorded)}>Mark accepted</Btn>}
      />
      <QuoteBehind />

      <Drawer
        title="Record premium payment"
        subtitle={`${q.id} ${q.revision} · ${q.insurer} · ${q.total}`}
        onClose={close}
        footer={
          <>
            <Btn variant="outline" className="flex-1 px-5" onClick={close}>Cancel</Btn>
            <Btn icon="check" className="flex-1" disabled={!checked || !utr} onClick={() => nav(P.recorded)}>Record payment</Btn>
          </>
        }
      >
        <DrawerNote tone="green" icon="shield" className="px-3.5 text-[12px]">{q.customer.split(' ')[0]} paid {q.insurer} directly. Bimayantra does not verify it.</DrawerNote>

        <DField label="Mode *">
          <div className="flex flex-wrap gap-2">
            {paymentModes.map((m) => (
              <ToggleChip key={m} selected={mode === m} onClick={() => setMode(m)}>{m}</ToggleChip>
            ))}
          </div>
        </DField>

        <div className="flex gap-3">
          <DField label="Amount *" className="flex-1">
            <DInput prefix="₹" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </DField>
          <DField label="Payment date *" className="flex-1">
            <DInput trailing="calendar" value={date} onChange={(e) => setDate(e.target.value)} />
          </DField>
        </div>

        <DField label={mode === 'Cheque' ? 'Cheque number *' : mode === 'Cash' ? 'Receipt number *' : 'UTR / reference *'}>
          <DInput focus value={utr} onChange={(e) => setUtr(e.target.value)} />
        </DField>

        <div className="flex items-center gap-3">
          <Checkbox checked={checked} onChange={setChecked} className="size-[22px] rounded-[7px]" />
          <button type="button" onClick={() => setChecked(!checked)} className="text-[13px] font-semibold text-ink">
            I have checked this payment.
          </button>
        </div>
      </Drawer>
    </PaymentLayout>
  )
}
