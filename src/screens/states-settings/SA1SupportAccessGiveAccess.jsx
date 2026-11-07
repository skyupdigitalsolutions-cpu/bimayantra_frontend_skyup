// Figma 287:36713 · SA1 · Support access — Give access
import { useState } from 'react'
import { cx } from '../../components/ui'
import { SupportPage, Drawer, Field, TextInput, Note, Btn, ROUTES } from './_parts'

const DURATIONS = ['1 hour', '4 hours', '24 hours']

export default function SA1SupportAccessGiveAccess() {
  const [dur, setDur] = useState(2)
  return (
    <SupportPage
      overlay={
        <Drawer
          title="Give SkyUp support access"
          sub="Read only. Every record they open is logged."
          closeTo={ROUTES.support}
          footer={
            <>
              <Btn variant="outline" center to={ROUTES.support} className="w-[220px] pl-5">Cancel</Btn>
              <Btn icon="check" center to={ROUTES.support} className="w-[214px]">Give access</Btn>
            </>
          }
        >
          <Field label="SkyUp person *"><TextInput trailing="chev-down" defaultValue="Rahul N · Support" /></Field>
          <Field label="Reason *"><TextInput defaultValue="Ticket #4471 · quotation PDF shows wrong name" /></Field>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink">For how long *</span>
            <div className="flex w-fit gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
              {DURATIONS.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDur(i)}
                  className={cx('h-[34px] rounded-[21px] px-4 text-[13px] font-semibold', i === dur ? 'bg-navy text-white' : 'text-slate hover:bg-panel')}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Field label="OTP sent to your mobile *"><TextInput focus leading="lock" defaultValue="4 8 2 7 _ _" autoFocus /></Field>
          <Note icon="clock">You can end it any time. It ends on its own after {DURATIONS[dur]}.</Note>
        </Drawer>
      }
    />
  )
}
