// Figma 46:7366 · N3 · Renewal — Not renewing
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { Btn, Scrim, Field, TextArea, SelectBox } from './_kit'
import { RenewalDetail, PanelDialog } from './_parts'
import { notRenewingReasons, P } from '../../data/flow-policy'

function NotRenewingDialog() {
  const nav = useNavigate()
  return (
    <>
      <Scrim onClick={() => nav(P.n1)} />
      <PanelDialog left={380} top={200} width={500} className="gap-4 p-[30px]">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#fbebec] text-[#b4323c]"><Icon name="alert" size={26} /></span>
        <p className="text-[21px] leading-[26px] font-bold tracking-[-0.2px] text-ink">Mark as not renewing?</p>
        <p className="text-[13px] leading-5 font-medium text-muted">Customer reminders stop. You can reopen it until the grace period ends on 02 Jan 2027.</p>
        <Field label="Reason *" className="flex-none"><SelectBox options={notRenewingReasons} defaultValue="Bought elsewhere" /></Field>
        <Field label="Note" className="flex-none"><TextArea defaultValue="Moved to her employer’s group cover." /></Field>
        <div className="flex gap-2.5">
          <Btn variant="white" to={P.n1} className="flex-1 justify-center">Cancel</Btn>
          <Btn variant="danger" icon="x" to={P.rs2} className="w-[213px] justify-center">Mark not renewing</Btn>
        </div>
      </PanelDialog>
    </>
  )
}

export default function RenewalNotRenewing() {
  return <RenewalDetail overlay={<NotRenewingDialog />} />
}
