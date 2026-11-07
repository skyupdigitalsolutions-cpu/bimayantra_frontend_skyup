// Figma 289:37787 · AA4 · Admin — Record subscription payment
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { AccountDetailBase, PanelScrim, AField, AInput, ASelect, DialogButtons, NavyButton, ADrawer, DrawerFoot } from './_parts'

export default function RecordPayment() {
  const nav = useNavigate()
  return (
    <AccountDetailBase
      links={false}
      overlay={
        <PanelScrim onClose={() => nav('/x/aa2-admin-account-detail')}>
          <ADrawer>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-[3px]">
                <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">Record subscription payment</p>
                <p className="text-[12px] font-medium text-muted">Offline payment received by SkyUp</p>
              </div>
              <Link to="/x/aa2-admin-account-detail" aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-panel">
                <Icon name="x" size={16} className="text-ink" />
              </Link>
            </div>
            <div className="flex gap-3">
              <AField label="Plan *" className="flex-1"><ASelect options={['Premium', 'Normal']} /></AField>
              <AField label="Period *" className="flex-1"><ASelect options={['12 months', '6 months', '3 months']} /></AField>
            </div>
            <div className="flex gap-3">
              <AField label="Start date *" className="flex-1"><AInput value="29-10-2026" trailing="calendar" /></AField>
              <AField label="End date" className="flex-1"><AInput value="28-10-2027" trailing="calendar" /></AField>
            </div>
            <AField label="Amount received *" hint="GST is added on the invoice (IGST outside Karnataka).">
              <AInput prefix="₹" value="9,990" />
            </AField>
            <AField label="Payment reference *"><AInput value="NEFT-77812091" /></AField>
            <AField label="Your OTP *"><AInput leading="lock" placeholder="_ _ _ _ _ _" className="[&_input]:placeholder:text-ink" /></AField>
            <span className="flex-1" />
            <DrawerFoot>
              <DialogButtons cancelTo="/x/aa2-admin-account-detail">
                <NavyButton to="/x/aa2-admin-account-detail" icon="check">Record payment</NavyButton>
              </DialogButtons>
            </DrawerFoot>
          </ADrawer>
        </PanelScrim>
      }
    />
  )
}
