// Figma 291:37961 · RX1 · Referral link — Expired or revoked
import { PublicPage } from '../public/_parts'
import { MessageCard } from './QuotationLinkExpired'

export default function ReferralLinkExpired() {
  return (
    <PublicPage blob={{ x: -160, y: 520, size: 560, color: 'rgba(52,120,246,0.2)' }}>
      <MessageCard
        iconBg="#eef1f5"
        icon="link"
        iconColor="#44526a"
        title="This referral link no longer works"
        body="It may have expired or been replaced. Ask the person who shared it for a new link."
      />
    </PublicPage>
  )
}
