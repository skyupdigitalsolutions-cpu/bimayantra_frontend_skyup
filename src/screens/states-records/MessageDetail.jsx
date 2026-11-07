// Figma 286:35593 · CM3 · Message detail
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Scrim, Drawer } from '../catalogue/_parts'
import { CommsLayout } from './_parts'
import { sentMessages, messageTimeline } from '../../data/states-records'

export default function MessageDetail() {
  return (
    <CommsLayout items={sentMessages}
      status="sent"
      floatStatus
      overlay={
        <>
          <Scrim to="/x/cm2-communications-sent" />
          <Drawer title="Message detail" subtitle="Kavya Hegde · Email · Quotation R2" closeTo="/x/cm2-communications-sent">
            <div className="flex flex-col gap-2.5">
              {messageTimeline.map((s) => (
                <div key={s.title} className="flex items-center gap-3">
                  <span className={cx('flex size-6 items-center justify-center rounded-[12px]', s.done ? 'bg-[#16845b] text-white' : 'bg-panel text-[11px] font-bold text-muted')}>
                    {s.done ? <Icon name="check" size={12} /> : '–'}
                  </span>
                  <div className="flex flex-col gap-px">
                    <p className={cx('text-[13px] leading-[16px] font-bold', s.done ? 'text-ink' : 'text-muted')}>{s.title}</p>
                    <p className="text-[11px] leading-[14px] font-medium text-muted">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 rounded-[16px] bg-panel p-4">
              <p className="text-[13px] font-bold text-ink">Subject: Your quotation from Suresh Rao</p>
              <p className="text-[12px] font-medium text-muted">Hi Kavya, here is your CareFirst Family quotation…</p>
            </div>
          </Drawer>
        </>
      }
    >
    </CommsLayout>
  )
}
