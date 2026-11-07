// Figma 247:21602 · PP2 · Record existing policy
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { PageHeading, Btn, InputBox } from '../flow-consent/_parts'
import { CARD, CardHead, Field, SelectBox } from './_parts'

export default function RecordExistingPolicy() {
  const [f, setF] = useState({
    insurer: 'Care Health', product: 'Supreme Plus', number: '90031/HEALTH/2025/7781', insured: 'Kavya, Arjun',
    start: '15-01-2026', end: '14-01-2027', premium: '14,200',
  })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  return (
    <AppLayout active="policies">
      <PageHeading
        crumb="POLICY HOLDERS  /  KAVYA HEGDE  /  EXISTING POLICY"
        title="Record existing policy"
        chip={null}
        meta="Kavya Hegde · a policy bought before Bimayantra"
        actions={
          <button type="button" aria-label="Notifications" className="mt-1 flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
            <Icon name="bell" size={18.5} />
          </button>
        }
      />
      <div className="mt-[21px] flex items-start gap-5">
        <div className="flex w-[760px] flex-col gap-4">
          <section className={cx(CARD, 'flex flex-col gap-3.5 p-6')}>
            <CardHead title="Policy details" sub="Copy from the policy schedule" />
            <div className="flex gap-3.5">
              <Field label="Insurer *" className="w-[349px]"><SelectBox value={f.insurer} onChange={set('insurer')} options={['Care Health', 'Star Health', 'Niva Bupa', 'HDFC ERGO']} /></Field>
              <Field label="Product *" className="w-[349px]"><SelectBox value={f.product} onChange={set('product')} options={['Supreme Plus', 'Supreme', 'Care Classic']} /></Field>
            </div>
            <div className="flex gap-3.5">
              <Field label="Insurer policy number *" className="w-[349px]"><InputBox value={f.number} onChange={set('number')} /></Field>
              <Field label="Insured people *" className="w-[349px]"><SelectBox value={f.insured} onChange={set('insured')} options={['Kavya, Arjun', 'Kavya', 'Kavya, Arjun, Anya']} /></Field>
            </div>
            <div className="flex gap-3.5">
              <Field label="Start date *" className="w-[228px]"><InputBox value={f.start} onChange={set('start')} trailing="calendar" /></Field>
              <Field label="End date *" className="w-[228px]"><InputBox value={f.end} onChange={set('end')} trailing="calendar" /></Field>
              <Field label="Premium *" className="w-[228px]">
                <InputBox value={f.premium} onChange={set('premium')} leading={<span className="text-[14px] font-semibold text-muted">₹</span>} />
              </Field>
            </div>
          </section>
          <section className={cx(CARD, 'flex flex-col gap-3 p-6')}>
            <CardHead title="Policy document" sub="Required" />
            <div className="flex h-[70px] items-center gap-3 rounded-[16px] border border-[#c7ebda] bg-[#f5fbf8] px-3.5">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="folder" size={18} /></span>
              <span className="flex flex-col gap-px">
                <span className="text-[13px] font-bold text-ink">care-supreme-2026.pdf</span>
                <span className="text-[11px] font-medium text-[#127650]">Uploaded · 980 KB</span>
              </span>
            </div>
          </section>
        </div>
        <section className={cx(CARD, 'flex w-[400px] flex-col gap-2.5 bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] p-6')}>
          <p className="text-[15px] font-bold text-ink">Renewal tracking starts</p>
          <p className="text-[13px] leading-5 font-medium text-[#8a5a12]">A renewal cycle is created for 14 Jan 2027 when you save.</p>
        </section>
      </div>
      <div className="absolute top-[900px] right-10 left-10 flex h-[70px] items-center gap-3 rounded-[30px] bg-white py-3 pr-3 pl-6 shadow-[0px_18px_40px_-14px_rgba(19,41,75,0.1)]">
        <Link to="/x/05f-customer-policies" className="flex h-[46px] items-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink">Cancel</Link>
        <div className="flex-1" />
        <Btn variant="navy" icon="shield" to="/x/05f-customer-policies" className="flex-none">Save policy</Btn>
      </div>
    </AppLayout>
  )
}
