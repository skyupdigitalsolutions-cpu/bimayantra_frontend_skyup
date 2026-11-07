// Figma 72:9670 · N1b · Renewal quotation
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Shell, Header, Btn, Pill, Card, CardHead, Field, TextBox, SelectBox, Check, Divider, ActionBar, KV, SH_CARD } from './_kit'
import { carriedOver, renewalRiders, termOptions, sumInsuredOptions, P } from '../../data/flow-policy'

const num = (s) => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0
const inr = (n, dp = 0) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: dp, maximumFractionDigits: dp })
const LAST_YEAR = 21340

function RiderRow({ rider, onChange }) {
  const on = rider.on
  return (
    <div className={cx('flex items-center gap-3 rounded-[14px] px-3.5', on ? 'h-[60px] border border-blue bg-[#f3f7ff]' : 'h-[58px] bg-panel')}>
      <Check on={on} onChange={(v) => onChange({ ...rider, on: v })} />
      <p className="flex-1 text-[13px] font-semibold text-ink">{rider.name}</p>
      <label className="flex h-[38px] w-[140px] items-center gap-1.5 rounded-[12px] border border-line bg-white px-3 focus-within:border-blue">
        <span className="text-[13px] font-semibold text-muted">₹</span>
        <input
          value={rider.price}
          placeholder="0"
          onChange={(e) => onChange({ ...rider, price: e.target.value.replace(/[^\d,]/g, '') })}
          className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-ink outline-none placeholder:font-medium placeholder:text-faint"
        />
      </label>
    </div>
  )
}

export default function RenewalQuotation() {
  const [base, setBase] = useState('16,890')
  const [riders, setRiders] = useState(renewalRiders)
  const riderSum = riders.filter((r) => r.on).reduce((s, r) => s + num(r.price), 0)
  const gst = (num(base) + riderSum) * 0.18
  const total = num(base) + riderSum + gst
  const delta = ((total / LAST_YEAR - 1) * 100).toFixed(1)

  return (
    <Shell active="renewals" panelClass="!pb-6">
      <Header
        crumb="RENEWALS  /  KAVYA HEGDE  /  RENEWAL QUOTATION"
        title="Renewal quotation"
        chips={<>
          <Pill>Draft</Pill>
          <Pill tone="blue" icon="refresh">Same policy</Pill>
          <Link to={P.rn0} className="flex items-center gap-1 text-[12px] font-bold text-blue hover:underline"><Icon name="edit" size={12} />Change</Link>
        </>}
        sub="Kavya Hegde · Star Health FamilySure · Plus"
        actions={<Btn variant="white" icon="download" to={P.n1}>Save and exit</Btn>}
      />

      <div className="mt-[21px] flex h-[84px] items-center gap-3.5 rounded-[24px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] px-[22px]">
        <span className="flex size-12 items-center justify-center rounded-full bg-white text-[#8a5a12]"><Icon name="refresh" size={22} /></span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[15px] leading-[19px] font-bold text-ink">Renewal of 2245/88/26/0001842 · ends 03 Dec 2026</p>
          <p className="text-[12px] leading-[15px] font-medium text-[#8a5a12]">Same customer, product, people and sum insured. Withdrawn products are still allowed for renewals.</p>
        </div>
        <Pill tone="amber" icon="clock">38 days left</Pill>
      </div>

      <div className="mt-3 flex items-start gap-5">
        <div className="flex w-[760px] flex-col gap-4">
          <Card className="gap-3.5">
            <CardHead title="Carried over from the policy" sub="Locked for a renewal" right={<Pill icon="lock">Locked</Pill>} />
            <div className="flex gap-2.5">
              {carriedOver.map(([k, v]) => (
                <div key={k} className="flex flex-1 flex-col gap-0.5 rounded-[14px] bg-panel p-3">
                  <p className="text-[11px] leading-[14px] font-medium text-muted">{k}</p>
                  <p className="text-[13px] leading-4 font-bold text-ink">{v}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="gap-3.5">
            <CardHead title="Renewal terms" sub="Check with Kavya before you share" />
            <div className="flex items-start gap-3.5">
              <Field label="Renewal start date *" hint="Day after the current policy ends"><TextBox trailing="calendar" defaultValue="04-12-2026" /></Field>
              <Field label="Sum insured *" hint="Upgrading may add waiting periods"><SelectBox options={sumInsuredOptions} defaultValue="₹10 lakh" /></Field>
              <Field label="Policy term"><SelectBox options={termOptions} defaultValue="1 year" /></Field>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] leading-4 font-semibold text-ink">Riders</p>
              {riders.map((r) => (
                <RiderRow key={r.name} rider={r} onChange={(nr) => setRiders((rs) => rs.map((x) => (x.name === r.name ? nr : x)))} />
              ))}
            </div>
          </Card>
        </div>

        <div className="flex w-[400px] flex-col gap-4">
          <div className="flex flex-col gap-3.5 rounded-[28px] bg-linear-to-b from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
            <CardHead title="Renewal premium" sub="From Star Health’s renewal notice" right={<Pill tone="amber" icon="edit">Enter manually</Pill>} />
            <div className="flex h-[58px] items-center gap-2.5 rounded-[16px] border border-line bg-white px-3">
              <Icon name="folder" size={16} className="text-muted" />
              <p className="flex-1 truncate text-[12px] font-bold text-ink">renewal-notice-FamilySure.pdf</p>
              <label className="flex h-9 cursor-pointer items-center gap-2 rounded-[18px] pr-3.5 pl-3 text-[13px] font-semibold text-ink hover:bg-panel">
                <Icon name="upload" size={16} />Upload<input type="file" accept="application/pdf" className="hidden" />
              </label>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4">
              <p className="text-[12px] leading-[18px] font-medium text-muted">Copy the renewal premium from the notice. Riders below have their own prices.</p>
              <Field label="Base premium before GST *"><TextBox focused prefix="₹" value={base} onChange={(e) => setBase(e.target.value.replace(/[^\d,.]/g, ''))} /></Field>
              {riders.filter((r) => r.on).map((r) => <KV key={r.name} k={`${r.name} (rider)`} v={inr(num(r.price))} className="h-4" />)}
              <KV k="GST 18%" v={inr(Math.round(gst))} className="h-4" />
              <Divider />
              <div className="flex h-[25px] items-center justify-between">
                <span className="text-[14px] font-bold text-ink">Total</span>
                <span className="text-[20px] font-bold text-ink">{inr(total, 2)}</span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <div className="flex flex-1 flex-col gap-0.5 rounded-[16px] bg-white/60 p-3">
                <p className="text-[11px] leading-[14px] font-semibold text-rose-ink">Last year</p>
                <p className="text-[17px] leading-[21px] font-bold text-ink">{inr(LAST_YEAR)}</p>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 rounded-[16px] bg-white/90 p-3">
                <p className="text-[11px] leading-[14px] font-semibold text-rose-ink">This year</p>
                <p className="text-[17px] leading-[21px] font-bold text-ink">{inr(Math.floor(total))}</p>
              </div>
            </div>
            <p className="text-[12px] font-semibold text-rose-ink">{delta >= 0 ? '+' : ''}{delta}% on last year. Arjun moved to the next age band.</p>
          </div>
          <Card className={cx('gap-3', SH_CARD)}>
            <CardHead title="Payment link" sub="Optional · must be on starhealth.in" />
            <Field label="Link"><TextBox icon="link" defaultValue="https://pay.starhealth.in/r/4KD9" /></Field>
          </Card>
        </div>
      </div>

      <ActionBar className="mt-6">
        <Btn variant="white" to={P.n1}>Back to renewal</Btn>
        <span className="flex-1" />
        <Btn icon="sparkle" to={P.n1c}>Generate renewal quotation</Btn>
      </ActionBar>
    </Shell>
  )
}
