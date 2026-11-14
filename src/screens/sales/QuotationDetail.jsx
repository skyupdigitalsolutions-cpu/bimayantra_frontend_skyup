// Shared layout for 08 · Quotation detail and its states 08a / 08b / 08c.
//   state: 'awaiting' (08, 08a) | 'paid' (08b) | 'accepted' (08c)
//   drawer: true renders the "Record premium payment" drawer over the workspace (08a)
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { PillButton, SChip, SCard, SCardHead, KVItem, Ledger, NOWRAP } from './_parts'
import { quotation as Q, paymentModes } from '../../data/sales'
import { PANEL_SCRIM, DRAWER_BOX, DRAWER_FOOT, useLockScroll } from './_overlay'
import { useCtrlK } from '../tasks/_filter'

const NAVY_SH = 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]'

function PaymentCard({ state, drawer }) {
  const paid = state !== 'awaiting'
  return (
    <SCard>
      <div className="flex items-center gap-3">
        <p className="flex-1 text-[17px] font-bold text-ink">Premium payment</p>
        {paid ? <SChip tone="green" icon="check">Payment successful</SChip> : <SChip tone="violet" icon="clock">Awaiting payment</SChip>}
      </div>
      {paid && (
        <div className="flex h-10 items-center gap-2.5 rounded-[16px] bg-[#e7f4ee] px-4 text-[13px] font-semibold text-[#127650]">
          <Icon name="check" size={16} />
          {state === 'accepted' ? 'Quotation accepted.' : 'Payment successful.'}
        </div>
      )}
      <div className="flex h-[31px] w-max items-center gap-2 rounded-[12px] bg-[#e7f4ee] px-3 text-[12px] font-semibold text-[#127650]">
        <Icon name="shield" size={15} />
        Paid to Niva Bupa, recorded by you
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] font-medium text-muted">{paid ? 'Amount paid to Niva Bupa' : 'Amount on insurer portal'}</p>
        <p className="text-[28px] font-bold tracking-[-0.6px] text-ink">₹17,582.00</p>
      </div>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex h-10 items-center gap-2.5 rounded-[16px] bg-panel px-3.5 text-[13px] font-semibold text-ink hover:bg-[#edf1f8]"
      >
        <Icon name="link" size={16} className="text-muted" />
        <span className="flex-1">{paid ? 'UPI · UTR6271839934 · 26 Oct 2026' : 'pay.nivabupa.com/p/9LM4X'}</span>
        <Icon name="arrow" size={16} className="text-muted" />
      </a>
      <div className="flex flex-wrap gap-2.5">
        {paid ? (
          <>
            <PillButton variant="outline" size="sm" className="px-3.5" to={state === 'paid' ? '/x/py4-payment-reverse-undo' : undefined}>Undo payment</PillButton>
            <PillButton variant="ghost" size="sm" icon="download">Receipt</PillButton>
          </>
        ) : (
          <>
            <PillButton variant="navy" size="sm" icon="check" className={NAVY_SH} to={drawer ? '/x/p2-payment-record-payment' : '/x/08a-quotation-detail-record-payment'}>Record payment</PillButton>
            <PillButton variant="outline" size="sm" icon="x" className="pl-[13px] pr-[15px]" to={drawer ? undefined : '/x/py1-payment-mark-failed'}>Mark failed</PillButton>
          </>
        )}
      </div>
      {!paid && (
        <div className="flex h-10 items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 text-[13px] font-semibold text-blue">
          <Icon name="lock" size={16} />
          Record the payment to enable Mark accepted.
        </div>
      )}
      <p className="text-[12px] leading-[18px] font-medium text-muted">
        Bimayantra never collects premiums and does not check payments with insurers.
      </p>
    </SCard>
  )
}

function CustomerLinkCard() {
  const [copied, setCopied] = useState(false)
  const tiles = [
    { icon: 'mail', label: 'Email' },
    { icon: 'chat', label: 'WhatsApp' },
    { icon: 'link', label: copied ? 'Copied' : 'Copy link', onClick: () => { setCopied(true); setTimeout(() => setCopied(false), 1500) } },
    { icon: 'download', label: 'PDF' },
  ]
  return (
    <SCard>
      <SCardHead title="Customer link" subtitle="First shared 24 Oct 2026" />
      <div className="flex h-[88px] items-center gap-3.5 rounded-[20px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] px-4">
        <span className="flex size-14 flex-col items-center justify-center rounded-full bg-white text-[#5b3fb8]">
          <span className="text-[18px] leading-[23px] font-bold">13</span>
          <span className="text-[10px] leading-[13px] font-semibold">days</span>
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-[14px] font-bold text-ink">Valid until 08 Nov 2026</p>
          <p className="text-[12px] font-medium text-[#5b3fb8]">Later shares do not extend it</p>
        </div>
      </div>
      <div className="flex gap-2.5 max-md:gap-2">
        {tiles.map((t) => (
          <button key={t.icon} type="button" onClick={t.onClick}
            className="flex h-16 w-20 flex-col items-center justify-center gap-1.5 rounded-[18px] bg-panel text-ink hover:bg-[#edf1f8] max-md:h-14 max-md:w-0 max-md:min-w-0 max-md:flex-1 max-md:rounded-[14px]">
            <Icon name={t.icon} size={20} />
            <span className="text-[11px] font-semibold">{t.label}</span>
          </button>
        ))}
      </div>
    </SCard>
  )
}

function DrawerField({ label, className = 'flex-1 basis-0', children }) {
  return (
    <label className={cx('flex min-w-0 flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
    </label>
  )
}

const inputCls = 'flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink focus-within:ring-2 focus-within:ring-blue'

function RecordPaymentDrawer() {
  useLockScroll()
  const [mode, setMode] = useState('UPI')
  const [amount, setAmount] = useState('17,582.00')
  const [date, setDate] = useState('26-10-2026')
  const [utr, setUtr] = useState('UTR6271839934')
  const [checked, setChecked] = useState(true)
  return (
    <>
      <Link to="/quotations/1" aria-label="Close" data-overlay="scrim" className={cx(PANEL_SCRIM, 'z-30 bg-[#0e1f3b]/40')} />
      <div role="dialog" data-overlay="drawer" className={cx(DRAWER_BOX, 'z-40 flex w-[520px] flex-col gap-[18px] rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)] max-md:w-full max-md:gap-4')}>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[20px] font-bold tracking-[-0.2px] text-ink max-md:text-[18px]">Record premium payment</p>
            <p className="text-[12px] font-medium text-muted">QT-202610-00012 R2 · Niva Bupa · ₹17,582</p>
          </div>
          <Link to="/quotations/1" className="flex size-9 items-center justify-center rounded-full bg-panel text-ink hover:bg-line" aria-label="Close">
            <Icon name="x" size={16} />
          </Link>
        </div>
        <div className="flex h-10 items-center gap-2.5 rounded-[16px] bg-[#e7f4ee] px-3.5 text-[12px] font-semibold text-[#127650]">
          <Icon name="shield" size={16} />
          Kavya paid Niva Bupa directly. Bimayantra does not verify it.
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-semibold text-ink">Mode *</p>
          <div className="flex flex-wrap gap-2">
            {paymentModes.map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={cx('inline-flex h-[34px] items-center gap-1.5 rounded-[18px] border text-[13px] font-semibold',
                  mode === m ? 'border-blue bg-[#e8f0fd] pr-3.5 pl-2.5 text-blue' : 'border-line bg-white px-3.5 text-muted hover:text-ink')}>
                {mode === m && <Icon name="check" size={14} />}
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 max-md:flex-col">
          <DrawerField label="Amount *">
            <span className={inputCls}>
              <span className="text-muted">₹</span>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" />
            </span>
          </DrawerField>
          <DrawerField label="Payment date *">
            <span className={inputCls}>
              <input value={date} onChange={(e) => setDate(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" />
              <Icon name="calendar" size={18} className="text-muted" />
            </span>
          </DrawerField>
        </div>
        <DrawerField className="flex-none" label={mode === 'Cheque' ? 'Cheque number *' : 'UTR / reference *'}>
          <span className={cx(inputCls, 'ring-2 ring-blue')}>
            <input value={utr} onChange={(e) => setUtr(e.target.value)} className="min-w-0 flex-1 bg-transparent pl-0.5 outline-none" />
          </span>
        </DrawerField>
        <label className="flex cursor-pointer items-center gap-3 text-[13px] font-semibold text-ink">
          <button type="button" role="checkbox" aria-checked={checked} onClick={() => setChecked((v) => !v)}
            className={cx('flex size-[22px] items-center justify-center rounded-[7px]', checked ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white')}>
            {checked && <Icon name="check" size={14} />}
          </button>
          I have checked this payment.
        </label>
        <div className="flex-1" />
        <div className={cx(DRAWER_FOOT, 'flex gap-2.5')}>
          <PillButton variant="outline" className="flex-1 justify-center px-5" to="/quotations/1">Cancel</PillButton>
          <PillButton
            variant="navy"
            icon="check"
            className={cx('flex-1 justify-center', NAVY_SH, !checked && 'pointer-events-none opacity-50')}
            to="/x/08b-quotation-detail-payment-successful"
          >
            Record payment
          </PillButton>
        </div>
      </div>
    </>
  )
}

export default function QuotationDetailLayout({ state = 'awaiting', drawer = false }) {
  useCtrlK()
  const paid = state !== 'awaiting'
  const activity = paid ? [Q.paymentEvent, ...Q.activity] : Q.activity

  const actions =
    state === 'accepted' ? (
      <PillButton variant="navy" icon="send" className={cx(NAVY_SH, 'max-md:h-10 max-md:rounded-[20px] max-md:text-[13px]')} to="/x/r1-proposal-members">Start proposal</PillButton>
    ) : (
      <>
        <PillButton variant="outline" icon="x" className="pl-[17px] max-md:hidden" to={paid || drawer ? undefined : '/x/qs3-quotation-mark-rejected'}>Mark rejected</PillButton>
        <PillButton variant="outline" icon="edit" className="pl-[17px] max-md:h-10 max-md:rounded-[20px] max-md:text-[13px]" to={paid || drawer ? '/x/q6-quotation-details' : '/x/qs8-quotation-revise'}>Revise</PillButton>
        {paid ? (
          <PillButton variant="navy" icon="check" className={cx(NAVY_SH, 'max-md:h-10 max-md:rounded-[20px] max-md:text-[13px]')} to="/x/08c-quotation-detail-accepted">Mark accepted</PillButton>
        ) : (
          <span title="Record the payment first" className="flex h-[46px] cursor-not-allowed items-center gap-2 rounded-[24px] bg-[#eef1f5] pr-5 pl-4 text-[14px] font-semibold text-faint max-md:hidden">
            <Icon name="lock" size={18} />
            Mark accepted
          </span>
        )}
      </>
    )

  return (
    // Figma frames clip the workspace at 976px; extra content scrolls inside the panel.
    <AppLayout active="quotations" panelClass="h-[976px] overflow-y-auto pb-5! [scrollbar-width:none] max-md:h-auto">
      <PageHeader
        className={NOWRAP}
        breadcrumb={'QUOTATIONS  /  QT-202610-00012  R2'}
        title={Q.id}
        titleExtra={state === 'accepted' ? <SChip tone="green" icon="check">Accepted</SChip> : <SChip tone="blue" icon="send">Shared</SChip>}
        subtitle={Q.meta}
        actions={actions}
      />

      <div className="mt-[37px] flex items-start gap-5 max-md:mt-4 max-md:flex-col">
        <div className="flex w-[760px] shrink-0 flex-col gap-5 max-md:!w-full max-md:!shrink max-md:min-w-0">
          <SCard>
            <SCardHead title="Quotation" subtitle="Everything printed on the PDF" right={<PillButton variant="ghost" size="sm" icon="download">PDF</PillButton>} />
            <div className="flex flex-wrap gap-x-5 gap-y-[18px] max-md:gap-x-3 max-md:gap-y-3">
              {Q.kv.map(([k, v]) => <KVItem key={k} k={k} v={v} className="w-[220px] max-md:w-[calc(50%-6px)]" />)}
            </div>
          </SCard>

          <SCard>
            <SCardHead title="Premium" subtitle="Base → riders → override → discount → GST" />
            <Ledger rows={Q.ledger} total={Q.total} />
          </SCard>

          <SCard gap="gap-3.5">
            <p className="text-[17px] font-bold text-ink">Activity</p>
            {activity.map((a) => (
              <div key={a.title} className="flex items-center gap-3.5">
                <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full text-ink" style={{ background: a.bg }}>
                  <Icon name={a.icon} size={17} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-semibold text-ink">{a.title}</p>
                  <p className="text-[12px] font-medium text-muted">{a.meta}</p>
                </div>
              </div>
            ))}
          </SCard>
        </div>

        <div className="flex w-[400px] flex-col gap-5 max-md:w-full">
          <PaymentCard state={state} drawer={drawer} />
          <CustomerLinkCard />
        </div>
      </div>

      {drawer && <RecordPaymentDrawer />}
    </AppLayout>
  )
}