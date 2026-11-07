// Figma 291:37862 · QX1 · Public quotation — Link expired or invalid
import Icon from '../../components/Icon'
import { PublicPage, SBtn } from '../public/_parts'
import { AdvisorBar } from '../public/PublicQuotation'

export function MessageCard({ iconBg, icon, iconColor, title, body, children }) {
  return (
    <div className="absolute top-[260px] left-[440px] flex w-[560px] flex-col items-center gap-3.5 rounded-[32px] bg-white p-10 text-center shadow-[0px_24px_48px_-16px_rgba(19,41,75,0.1)]">
      <span className="flex size-20 items-center justify-center rounded-full" style={{ background: iconBg }}>
        <Icon name={icon} size={36} style={{ color: iconColor }} />
      </span>
      <h1 className="text-[26px] font-bold tracking-[-0.3px] text-ink">{title}</h1>
      <p className="w-[480px] text-[14px] leading-[22px] font-medium text-muted">{body}</p>
      {children}
    </div>
  )
}

export default function QuotationLinkExpired() {
  return (
    <PublicPage blob={{ x: 900, y: -260, size: 620, color: 'rgba(242,157,176,0.3)' }}>
      <AdvisorBar className="absolute top-8 left-[120px] w-[1200px]" />
      <MessageCard
        iconBg="#fbf1e1"
        icon="clock"
        iconColor="#8a5a12"
        title="This quotation link has expired"
        body="It was valid until 08 Nov 2026. Ask Suresh Rao for an updated quotation."
      >
        <SBtn size="lg" icon="chat" className="h-[54px] text-[15px]">WhatsApp Suresh</SBtn>
      </MessageCard>
    </PublicPage>
  )
}
