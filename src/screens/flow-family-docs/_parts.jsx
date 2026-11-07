// Shared pieces for the family / add-document flow (FD1–FD6). The profile shell + family body
// live in ../customer-tabs/_parts.jsx and are reused here.
import { Fragment } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'

export * from '../customer-tabs/_parts'

/** 3-step header: Whose → Which → Upload. step = 1..3 (earlier steps render as done) */
export function DocSteps({ step }) {
  const labels = ['Whose', 'Which', 'Upload']
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => {
        const n = i + 1
        const done = n < step
        const cur = n === step
        return (
          <Fragment key={l}>
            {i > 0 && <span className={cx('h-0.5 w-10', n <= step ? 'bg-navy' : 'bg-line')} />}
            <span
              className={cx(
                'flex size-[26px] items-center justify-center rounded-full text-[11px] font-bold',
                done && 'bg-navy text-white',
                cur && 'border-2 border-blue bg-white text-blue',
                !done && !cur && 'bg-panel text-muted',
              )}
            >
              {done ? <Icon name="check" size={12} /> : n}
            </span>
            <span className={cx('text-[12px]', cur ? 'font-bold text-ink' : done ? 'font-semibold text-ink' : 'font-semibold text-muted')}>{l}</span>
          </Fragment>
        )
      })}
    </div>
  )
}

/** Labelled input box (#f4f6fb, h50, r16) */
export function FieldBox({ label, hint, focus, className = '', children }) {
  return (
    <label className={cx('flex min-w-0 flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <span
        className={cx(
          'flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 focus-within:ring-2 focus-within:ring-blue',
          focus && 'ring-2 ring-blue',
        )}
      >
        {children}
      </span>
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}

export const INPUT = 'min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint'
