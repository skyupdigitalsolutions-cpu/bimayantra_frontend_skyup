// Figma 281:27045 · A2 · Login — Wrong or expired code
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthShell, AuthButton, OtpInput, StepChip } from '../auth/_parts'
import { Note } from './_parts'
import { wrongCode } from '../../data/states-account'

export default function A2LoginWrongOrExpiredCode() {
  const [otp, setOtp] = useState(wrongCode)
  return (
    <AuthShell>
      <StepChip>Step 2 of 2</StepChip>
      <h2 className="mt-[18px] text-[38px] font-bold tracking-[-0.8px] text-ink">Enter the code</h2>
      <Note icon="alert" className="mt-4 w-[440px] bg-[#fbebec] text-[#b4323c]">That code is wrong. 2 tries left before the number is locked.</Note>
      <div className="mt-4"><OtpInput value={otp} onChange={setOtp} error autoFocus={false} /></div>
      <Note icon="clock" className="mt-4 bg-blue-50 text-blue">Code expired? It lasts 5 minutes. Tap Resend for a new one.</Note>
      <AuthButton as={Link} to="/login" variant="secondary" icon="refresh" className="mt-5">Resend code</AuthButton>
    </AuthShell>
  )
}
