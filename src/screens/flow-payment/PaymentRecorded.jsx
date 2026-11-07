// Figma 42:6143 · P3 · Payment — Recorded
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { CardHead } from '../flow-comparative/_parts'
import { paymentQuote as q, recordedPayment as r, proposalChecklist } from '../../data/payment'
import { P, Pill, Btn, QuoteHeader, PaymentLayout } from './_parts'

export default function PaymentRecorded() {
  const nav = useNavigate()
  return (
    <PaymentLayout>
      <QuoteHeader
        rev
        chip={<Pill tone="green" icon="check">Accepted</Pill>}
        subtitle={`${q.customer} · ${q.product} · ${q.plan}`}
        action={<Btn icon="send" to={P.proposal}>Start proposal</Btn>}
      />

      {/* Paid hero */}
      <section className="mt-[21px] flex h-[132px] items-center gap-[22px] rounded-[34px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-8 shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)]">
        <span className="flex size-[76px] shrink-0 items-center justify-center rounded-full bg-white text-[#127650]">
          <Icon name="check" size={36} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">Payment recorded. Quotation accepted.</p>
          <p className="text-[13px] font-medium text-[#2f6b55]">
            {r.amount} by {r.mode} · {r.utr} · {r.dateLong} · recorded by you
          </p>
        </div>
        <button
          type="button"
          onClick={() => nav(P.record)}
          className="flex h-9 shrink-0 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile"
        >
          Undo payment
        </button>
      </section>

      {/* Next */}
      <section className="mt-[58px] flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
        <CardHead title="Ready for proposal" subtitle={`Submit the proposal on the ${q.insurer} portal, then record it here.`} />
        <div className="flex gap-3.5">
          {proposalChecklist.map((s) => (
            <div key={s.title} className={cx('flex h-32 flex-1 flex-col gap-2.5 rounded-[22px] p-[18px]', s.tint)}>
              <span className="flex size-10 items-center justify-center rounded-full bg-white/80 text-ink">
                <Icon name={s.icon} size={18} />
              </span>
              <p className="text-[14px] font-bold text-ink">{s.title}</p>
              <p className="text-[11px] font-medium text-slate">{s.sub}</p>
            </div>
          ))}
        </div>
        <Btn icon="arrow" to={P.proposal} className="self-start">Start proposal {q.proposalId}</Btn>
      </section>
    </PaymentLayout>
  )
}
