// Figma 286:35745 · CM4 · Cancel scheduled message
import { Scrim, Dialog, DialogButton } from '../catalogue/_parts'
import { CommsLayout } from './_parts'
import { scheduledMessages } from '../../data/states-records'

export default function CancelScheduledMessage() {
  return (
    <CommsLayout items={scheduledMessages}
      status="scheduled"
      floatStatus
      overlay={
        <>
          <Scrim to="/x/cm1-communications-scheduled" />
          <Dialog top={180} icon="x" iconBg="bg-[#fbebec]" iconColor="text-[#b4323c]" title="Cancel this reminder?" body="Kavya won’t get the 30-day renewal reminder. Later reminders still go out.">
            <div className="flex gap-2.5">
              <DialogButton to="/x/cm1-communications-scheduled">Cancel</DialogButton>
              <DialogButton variant="danger" icon="x" to="/communications">Cancel reminder</DialogButton>
            </div>
          </Dialog>
        </>
      }
    >
    </CommsLayout>
  )
}
