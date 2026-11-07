// Figma 286:35386 · CM2 · Communications — Sent
import { CommsLayout } from './_parts'
import { sentMessages } from '../../data/states-records'

export default function CommsSent() {
  return (
    <CommsLayout items={sentMessages} rowProps={{ to: '/x/cm3-message-detail' }} status="sent" floatStatus>
    </CommsLayout>
  )
}
