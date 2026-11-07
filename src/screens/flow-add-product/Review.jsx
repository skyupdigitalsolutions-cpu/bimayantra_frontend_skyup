// Figma 74:10360 · AP6 · Add product — Review and submit
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { Shell, StepCard, StepFooter, Btn, Box, Scrim, R } from './_parts'
import { review } from '../../data/flow-add-product'
import { FixedDialog } from '../catalogue/_overlay'

export default function Review() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const [ok, setOk] = useState(true)

  const dialog = open && (
    <>
      <Scrim onClick={() => setOpen(false)} />
      <FixedDialog top={240} left={370} width={520} frameClass="z-30" aria-modal="true" className="flex flex-col items-center gap-4 rounded-[28px] bg-white p-8 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]">
        <span className="flex size-[68px] items-center justify-center rounded-full bg-violet-50 text-violet">
          <Icon name="send" size={30} />
        </span>
        <h2 className="text-[21px] font-bold tracking-[-0.2px] text-ink">Publish Arogya Plus?</h2>
        <p className="w-full text-center text-[13px] leading-5 font-medium text-muted">
          It appears in your library right away and only you can see it. You can edit or withdraw it any time.
        </p>
        <label className="flex h-[50px] w-full cursor-pointer items-center gap-3 rounded-[16px] bg-panel px-3.5">
          <Box checked={ok} onChange={setOk} className="size-[22px]" />
          <span className="text-[13px] font-semibold text-ink">These details match the insurer’s brochure.</span>
        </label>
        <div className="flex w-full gap-2.5">
          <Btn variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn icon="send" className="w-[220px] disabled:opacity-50" disabled={!ok} onClick={() => navigate(R.published)}>Save product</Btn>
        </div>
      </FixedDialog>
    </>
  )

  return (
    <Shell step={7} subtitle="Health · Star Health · Arogya Plus" overlay={dialog}>
      <StepCard title="7 · Review and submit" subtitle="Saved straight to your library. Visible only in your account." className="w-[1180px]">
        <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
          {review.map(([k, v]) => (
            <div key={k} className="flex w-[260px] flex-col gap-1">
              <span className="text-[12px] font-medium text-muted">{k}</span>
              <span className="text-[14px] font-semibold whitespace-nowrap text-ink">{v}</span>
            </div>
          ))}
        </div>
        <StepFooter back={R.features} next={<Btn icon="send" onClick={() => setOpen(true)}>Save and publish</Btn>} />
      </StepCard>
    </Shell>
  )
}
