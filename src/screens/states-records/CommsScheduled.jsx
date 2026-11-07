// Figma 286:35199 · CM1 · Communications — Scheduled
import { CommsLayout } from './_parts'
import { scheduledMessages } from '../../data/states-records'

export default function CommsScheduled() {
  return (
    <CommsLayout items={scheduledMessages} rowProps={{ cancelTo: '/x/cm4-cancel-scheduled-message' }} status="scheduled" floatStatus>
    </CommsLayout>
  )
}
