// Figma 42:5774 · P1 · Payment — Add payment link
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select } from '../../components/ui'
import { paymentQuote as q } from '../../data/payment'
import { P, Btn, QuoteHeader, QuoteBehind, Drawer, DrawerNote, DField, DInput, PaymentLayout, ChipShared } from './_parts'

export default function AddPaymentLink() {
  const nav = useNavigate()
  const [method, setMethod] = useState('Insurer payment link')
  const [link, setLink] = useState(`https://pay.${q.insurerDomain}/p/7KQ2M`)
  const [until, setUntil] = useState('02-11-2026')
  const [amount, setAmount] = useState(q.totalExact)
  const matches = amount.replace(/[^\d.]/g, '') === q.totalExact.replace(/[^\d.]/g, '')
  const close = () => nav(P.quote)

  return (
    <PaymentLayout>
      <QuoteHeader
        rev
        chip={<ChipShared />}
        subtitle={`${q.customer} · ${q.product} · ${q.plan} · total ${q.total}`}
        action={<Btn icon="check" onClick={() => nav(P.record)}>Mark accepted</Btn>}
      />
      <QuoteBehind />

      <Drawer
        title="Add payment link"
        subtitle={`${q.id} ${q.revision} · ${q.insurer} · ${q.total}`}
        onClose={close}
        footer={
          <>
            <Btn variant="outline" className="flex-1 px-5" onClick={close}>Cancel</Btn>
            <Btn icon="check" className="flex-1" onClick={() => nav(P.record)}>Save payment link</Btn>
          </>
        }
      >
        <DrawerNote icon="link">Create the link on the {q.insurer} portal, then paste it here.</DrawerNote>
        <DField label="Payment method *">
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            options={['Insurer payment link', 'UPI', 'Net banking', 'Card', 'Cheque', 'Cash']}
          />
        </DField>
        <DField label="Payment link *" hint={`Allowed: ${q.insurerDomain}`}>
          <DInput focus leading="link" value={link} onChange={(e) => setLink(e.target.value)} />
        </DField>
        <DField label="Link valid until">
          <DInput trailing="calendar" value={until} onChange={(e) => setUntil(e.target.value)} />
        </DField>
        <DField label="Amount shown on the insurer portal *">
          <DInput prefix="₹" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </DField>
        {matches ? (
          <DrawerNote tone="green" icon="check">Matches this quotation (₹{q.totalExact}).</DrawerNote>
        ) : (
          <DrawerNote tone="amber" icon="alert">Does not match this quotation (₹{q.totalExact}).</DrawerNote>
        )}
      </Drawer>
    </PaymentLayout>
  )
}
