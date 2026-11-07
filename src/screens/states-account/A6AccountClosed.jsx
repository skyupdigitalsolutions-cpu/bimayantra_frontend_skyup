// Figma 281:27509 · A6 · Account closed
import { AuthShell, AuthButton, StatusHead } from '../auth/_parts'

export default function A6AccountClosed() {
  return (
    <AuthShell>
      <StatusHead icon="x" circle="bg-[#eef1f5] text-ink-2" title="This account is closed">
        It was closed on 01 Oct 2026 after the read-only period ended. Records are kept as the law requires. Contact SkyUp to request a copy.
      </StatusHead>
      <AuthButton as="a" href="mailto:support@skyup.in" variant="secondary" icon="chat" className="mt-6">Contact SkyUp support</AuthButton>
    </AuthShell>
  )
}
