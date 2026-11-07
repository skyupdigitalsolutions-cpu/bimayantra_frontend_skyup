// Figma 219:17917 · CQ8 · Comparison — Review
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import CqPage, { StepCard, Note, Pill } from './_parts'
import { CQ, cqOptions, WHY_GOLD } from '../../data/flow-comparative'

function Feature({ label, yes, dark }) {
  return (
    <div className="flex h-5 items-center gap-2">
      <span
        className={cx(
          'flex size-5 shrink-0 items-center justify-center rounded-full',
          dark ? (yes ? 'bg-[#f7b9c4] text-navy' : 'bg-white/10 text-faint') : yes ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-chip text-faint',
        )}
      >
        <Icon name={yes ? 'check' : 'x'} size={11} />
      </span>
      <span className={cx('text-[12px] font-semibold', dark ? (yes ? 'text-white' : 'text-[#7f8faa]') : yes ? 'text-ink' : 'text-faint')}>{label}</span>
    </div>
  )
}

function Preview({ o, index, recommended }) {
  return (
    <article
      className={cx(
        'flex w-[368px] shrink-0 flex-col gap-2.5 rounded-[26px] p-5',
        recommended ? 'h-[307px] bg-rail' : 'h-[309px] border border-line bg-white',
      )}
    >
      {recommended ? (
        <Pill tone="pink" icon="star" className="self-start">Recommended</Pill>
      ) : (
        <Pill tone="gray" className="self-start">Option {index + 1}</Pill>
      )}
      <p className={cx('text-[16px] leading-[20px] font-bold', recommended ? 'text-white' : 'text-ink')}>{o.product}</p>
      <p className={cx('text-[12px] leading-[15px] font-medium', recommended ? 'text-[#c9d6ea]' : 'text-muted')}>{o.variant} · {o.insurer}</p>
      <p className={cx('text-[26px] leading-[33px] font-bold tracking-[-0.3px]', recommended ? 'text-white' : 'text-ink')}>{o.total}</p>
      <p className={cx('text-[11px] leading-[14px] font-medium', recommended ? 'text-[#c9d6ea]' : 'text-muted')}>per year incl. GST</p>
      {o.features.map(([label, yes]) => <Feature key={label} label={label} yes={yes} dark={recommended} />)}
    </article>
  )
}

export default function ComparisonReview() {
  return (
    <CqPage step={7}>
      <StepCard
        title="8 · Review"
        subtitle="Exactly what Kavya will see"
        back={CQ.recommend}
        next={CQ.generated}
        nextLabel="Generate comparison"
        nextIcon="sparkle"
        className="w-[1180px]"
      >
        <div className="flex items-start gap-4">
          {cqOptions.map((o, i) => <Preview key={o.key} o={o} index={i} recommended={o.key === 'gold'} />)}
        </div>
        <div className="flex w-fit items-center gap-3 rounded-[16px] bg-violet-cta px-4 py-3.5">
          <Icon name="star" size={16} className="text-[#5b3fb8]" />
          <p className="text-[13px] font-semibold text-ink">Why Gold: {WHY_GOLD}</p>
        </div>
        <Note icon="lock">Comparisons never carry a payment link. Validity: 15 days from first share.</Note>
      </StepCard>
    </CqPage>
  )
}
