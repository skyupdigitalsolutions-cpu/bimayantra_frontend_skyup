// Figma 281:27172 · A3 · Login — Number locked
import { Link } from 'react-router-dom'
import { AuthShell, AuthButton, StatusHead } from '../auth/_parts'
import { account } from '../../data/states-account'

export default function A3LoginNumberLocked() {
  return (
    <AuthShell>
      <StatusHead icon="lock" circle="bg-[#fbebec] text-[#b4323c]" title="Too many wrong codes">
        For your safety, {account.mobileFull} is locked for 30 minutes. Try again at 11:42 AM.
      </StatusHead>
      <AuthButton as={Link} to="/x/a1-login-mobile-number" variant="secondary" className="mt-6 px-5">Back to log in</AuthButton>
    </AuthShell>
  )
}
