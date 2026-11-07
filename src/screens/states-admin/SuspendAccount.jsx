// Figma 289:37632 · AA3 · Admin — Suspend account
import { useNavigate } from 'react-router-dom'
import { AccountDetailBase, PanelScrim, ADialog, DialogIcon, DialogTitle, DialogText, AField, AInput, DialogButtons, DangerButton } from './_parts'

export default function SuspendAccount() {
  const nav = useNavigate()
  return (
    <AccountDetailBase
      links={false}
      overlay={
        <PanelScrim onClose={() => nav('/x/aa2-admin-account-detail')}>
          <ADialog top={110}>
            <DialogIcon icon="alert" />
            <DialogTitle>Suspend Rao Insurance Services?</DialogTitle>
            <DialogText>The advisor and assistants are logged out and can’t sign in. Scheduled messages pause. Data is kept.</DialogText>
            <AField label="Reason *"><AInput value="Payment dispute under review" /></AField>
            <AField label="Your OTP *"><AInput leading="lock" value="3 9 1 _ _ _" focus autoFocus /></AField>
            <DialogButtons cancelTo="/x/aa2-admin-account-detail">
              <DangerButton to="/x/aa2-admin-account-detail" icon="alert">Suspend account</DangerButton>
            </DialogButtons>
          </ADialog>
        </PanelScrim>
      }
    />
  )
}
