// Figma 245:19182 · CS2 · Consent recorded
import { ConsentPage, Toast } from './_parts'

export default function ConsentRecorded() {
  return (
    <ConsentPage
      overrides={{ 'arjun.email': 'given' }}
      overlay={
        <Toast to="/x/cs3-consent-proof" action="View proof">Email consent recorded for Arjun · proof saved</Toast>
      }
    />
  )
}
