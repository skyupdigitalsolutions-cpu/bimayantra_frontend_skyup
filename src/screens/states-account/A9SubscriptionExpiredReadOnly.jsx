// Figma 281:28879 · A9 · Subscription — Expired (read-only)
import { SubscriptionDashboard } from './_parts'
import { banners } from '../../data/states-account'

export default function A9SubscriptionExpiredReadOnly() {
  return <SubscriptionDashboard banner={banners.expired} readOnly />
}
