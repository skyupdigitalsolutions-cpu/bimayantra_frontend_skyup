// Figma 12:1559 · 14 · Communications
import { CommsLayout } from '../states-records/_parts'
import { notSentMessages } from '../../data/states-records'

export default function Communications() {
  return (
    <CommsLayout items={notSentMessages} status="notsent">
    </CommsLayout>
  )
}
