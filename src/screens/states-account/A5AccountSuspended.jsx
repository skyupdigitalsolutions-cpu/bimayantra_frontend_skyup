// Figma 281:27404 · A5 · Account suspended
import { AuthShell, AuthButton, StatusHead } from '../auth/_parts'
import { account } from '../../data/states-account'

export default function A5AccountSuspended() {
  return (
    <AuthShell>
      <StatusHead icon="alert" circle="bg-[#fbf1e1] text-[#8a5a12]" title="Your account is suspended">
        SkyUp suspended {account.agency} on 20 Oct 2026. Reason: payment dispute. Your data is safe.
      </StatusHead>
      <AuthButton as="a" href="mailto:support@skyup.in" icon="chat" className="mt-6">Contact SkyUp support</AuthButton>
    </AuthShell>
  )
}
