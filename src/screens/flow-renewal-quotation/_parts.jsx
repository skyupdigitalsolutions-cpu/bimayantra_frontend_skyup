// Shared shell for Flow · Renewal quotation — new quotation wizard (Figma 255:21703 … 255:22144).
// Header · horizontal stepper card (1180w) · step body (760w) + optional live summary (400w).
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Shell, Header, Btn, Pill, Card, CardHead, KV, StepFooter } from '../flow-policy/_kit'
import { P } from '../../data/flow-policy'

const STEPS = ['Product', 'Details and premium', 'Review']

function Stepper({ current }) {
  return (
    <Card className="px-7 py-5">
      <div className="flex h-[57px] items-center">
        {STEPS.map((s, i) => {
          const done = i < current
          const on = i === current
          return (
            <div key={s} className="contents">
              {i > 0 && <span className={cx('h-0.5 flex-1 rounded-[1px]', i <= current ? 'bg-navy' : 'bg-line')} />}
              <div className="flex w-[224.8px] shrink-0 flex-col items-center gap-2">
                <span
                  className={cx(
                    'flex size-[34px] items-center justify-center rounded-full text-[13px] font-bold',
                    done && 'bg-navy text-white',
                    on && 'border-2 border-blue bg-white text-blue shadow-[0px_0px_0px_5px_rgba(31,95,214,0.2)]',
                    !done && !on && 'bg-panel text-muted',
                  )}
                >
                  {done ? <Icon name="check" size={16} /> : i + 1}
                </span>
                <span className={cx('text-[12px] leading-[15px] whitespace-nowrap', on ? 'font-bold text-ink' : done ? 'font-semibold text-ink-2' : 'font-semibold text-muted')}>{s}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export function LiveSummary({ rows }) {
  return (
    <div className="flex w-[400px] shrink-0 flex-col gap-3.5 rounded-[28px] bg-linear-to-b from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
      <CardHead title="Renewal · new quotation" sub="Replaces FamilySure from 04 Dec 2026" right={<Pill tone="pink">Draft</Pill>} />
      <div className="flex flex-col gap-2.5 rounded-[20px] bg-white/80 p-4">
        {rows.map(([k, v]) => <KV key={k} k={k} v={v} kClass="text-rose-ink" className="h-4" />)}
      </div>
    </div>
  )
}

/** step: 0-based; summary: rows for LiveSummary (omit for none). */
export function NewQuoteWizard({ step, title, sub, backTo, next, summary, children }) {
  return (
    <Shell active="renewals">
      <Header
        crumb="RENEWALS  /  KAVYA HEGDE  /  NEW QUOTATION"
        title="New quotation for renewal"
        chips={<Pill tone="violet" icon="quote">New quotation</Pill>}
        sub="Kavya Hegde · replaces Star Health FamilySure (ends 03 Dec 2026)"
        actions={<Btn variant="white" icon="download" to={P.n1}>Save and exit</Btn>}
      />
      <div className="mt-[21px]"><Stepper current={step} /></div>
      <div className="mt-[35px] flex items-start gap-5">
        <Card className="w-[760px] gap-4">
          <CardHead title={`${step + 1} · ${title}`} sub={sub} />
          {children}
          <StepFooter backTo={backTo} next={next} />
        </Card>
        {summary && <LiveSummary rows={summary} />}
      </div>
    </Shell>
  )
}
