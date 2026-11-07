// Shared pieces for the "SkyUp product reaches advisors" flow (admin Add product wizard).
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { AdminLayout, AdminHeader, HButton } from '../admin/_parts'
import { ADD_STEPS } from '../../data/flow-skyup'

/** 7-step wizard stepper card (1180×97). `current` is 1-based. */
export function AddStepper({ current }) {
  return (
    <div className="mt-[31px] rounded-[28px] bg-white px-7 py-5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <div className="flex items-center">
        {ADD_STEPS.map((s, i) => {
          const n = i + 1
          const done = n < current
          const on = n === current
          return (
            <div key={s} className="contents">
              {i > 0 && <span className={cx('h-0.5 w-[86.5px] shrink-0 rounded-[1px]', n <= current ? 'bg-navy' : 'bg-line')} />}
              <div className="flex w-[86.5px] shrink-0 flex-col items-center gap-2">
                <span
                  className={cx(
                    'flex size-[34px] items-center justify-center rounded-full text-[13px] font-bold',
                    done && 'bg-navy text-white',
                    on && 'border-2 border-blue bg-white text-blue shadow-[0px_0px_0px_5px_rgba(31,95,214,0.2)]',
                    !done && !on && 'bg-panel text-muted',
                  )}
                >
                  {done ? <Icon name="check" size={16} /> : n}
                </span>
                <span className={cx('text-[12px] whitespace-nowrap', done && 'font-semibold text-ink-2', on && 'font-bold text-ink', !done && !on && 'font-semibold text-muted')}>{s}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Admin "Add product" page: header + stepper + body. */
export function AddProductShell({ subtitle, step, children }) {
  return (
    <AdminLayout active="catalogue">
      <AdminHeader title="Add product" subtitle={subtitle} actions={<HButton variant="outline" icon="download">Save draft</HButton>} />
      <AddStepper current={step} />
      {children}
    </AdminLayout>
  )
}

export const BODY_CARD = 'rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
