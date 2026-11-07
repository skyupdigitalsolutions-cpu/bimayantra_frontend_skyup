// Figma 128:15182 · AP2c · Add product — Reading brochure
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Shell, StepCard, StepFooter, PreviewCard, Btn, Chip, R } from './_parts'
import { reading, previewByStep } from '../../data/flow-add-product'

export default function ReadingBrochure() {
  const stages = []
  reading.stages.forEach((s, i) => {
    if (i > 0) stages.push(<span key={`l${i}`} className={cx('h-0.5 flex-1', s.state === 'todo' ? 'bg-line' : 'bg-navy')} />)
    stages.push(
      <span key={s.label} className="flex items-center gap-2">
        <span
          className={cx(
            'flex size-[26px] items-center justify-center rounded-full',
            s.state === 'done' && 'bg-navy text-white',
            s.state === 'active' && 'border-2 border-violet bg-white text-violet',
            s.state === 'todo' && 'bg-panel text-[11px] font-bold text-muted',
          )}
        >
          {s.state === 'done' ? <Icon name="check" size={13} /> : s.state === 'active' ? <Icon name="clock" size={13} /> : i + 1}
        </span>
        <span className={cx('text-[12px] font-semibold', s.state === 'todo' ? 'text-muted' : 'text-ink')}>{s.label}</span>
      </span>,
    )
  })

  return (
    <Shell
      step={3}
      subtitle="Health"
      headChip={<Chip tone="violet" icon="sparkle">Reading brochure</Chip>}
      aside={<PreviewCard values={previewByStep.read} sparkle />}
    >
      <StepCard title="3 · Reading the brochure" subtitle="Usually under a minute. You can leave this page; we’ll notify you." chip={<Chip tone="violet" icon="clock">Reading</Chip>}>
        <div className="flex flex-col gap-3.5 rounded-[22px] bg-violet-cta p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-white text-violet">
              <Icon name="sparkle" size={22} />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[15px] font-bold text-ink">{reading.title}</p>
              <p className="text-[12px] font-medium text-violet">{reading.sub}</p>
            </div>
            <span className="w-10 text-right text-[18px] font-bold text-violet">{reading.pct}%</span>
          </div>
          <div className="h-2 overflow-clip rounded-[4px] bg-white/70">
            <div className="h-full w-[512px] rounded-[4px] bg-violet" />
          </div>
        </div>

        <div className="flex h-[26px] items-center gap-2.5">{stages}</div>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-semibold text-ink">Found so far</p>
          {reading.found.map((f) => (
            <div key={f.label} className="flex h-[42px] items-center gap-2.5 rounded-[14px] bg-panel px-3.5">
              <span className={cx('flex size-[22px] items-center justify-center rounded-full', f.done ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-violet-50 text-violet')}>
                <Icon name={f.done ? 'check' : 'clock'} size={12} />
              </span>
              <span className="flex-1 text-[12px] font-medium text-muted">{f.label}</span>
              <span className="text-[13px] font-bold text-ink">{f.value}</span>
            </div>
          ))}
        </div>

        <StepFooter back={R.brochure} next={<Btn icon="arrow" to={R.product}>Review filled details</Btn>} />
      </StepCard>
    </Shell>
  )
}
