// Figma 286:33182 · CU1 · Policy holder — Deactivate (blocked)
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { StatusChip, SmallButton, Scrim, Dialog, DialogButton } from '../catalogue/_parts'
import { HolderShell, HolderOverview, HOLDER_ACTIONS } from './_parts'

const BLOCKERS = [
  { icon: 'quote', title: 'QT-202610-00012 R2', sub: 'Shared · open quotation', to: '/quotations/1' },
  { icon: 'send', title: 'PR-202610-00005', sub: 'Submitted · awaiting issuance', to: '/proposals' },
]

export default function HolderDeactivateBlocked() {
  return (
    <HolderShell
      tab="overview"
      statusChip={<StatusChip tone="green" icon="check">Active</StatusChip>}
      before={<SmallButton variant="danger" className="px-3.5">Deactivate</SmallButton>}
      actions={HOLDER_ACTIONS}
      counts={{ family: 3, documents: 3, quotations: 2, policies: 1, renewals: 1 }}
      overlay={
        <>
          <Scrim to="/customers/1" />
          <Dialog top={140} icon="alert" iconBg="bg-[#fbf1e1]" iconColor="text-[#8a5a12]" title="Kavya can’t be deactivated yet" body="Close or cancel these first:">
            {BLOCKERS.map((b) => (
              <Link key={b.title} to={b.to} className="flex items-center gap-3 rounded-[14px] bg-panel p-3">
                <span className="flex size-8 items-center justify-center rounded-[16px] bg-white">
                  <Icon name={b.icon} size={15} className="text-ink" />
                </span>
                <div className="flex flex-1 flex-col gap-px">
                  <p className="text-[13px] font-bold text-ink">{b.title}</p>
                  <p className="text-[11px] font-medium text-muted">{b.sub}</p>
                </div>
                <Icon name="chev-right" size={16} className="text-muted" />
              </Link>
            ))}
            <div className="flex gap-2.5">
              <DialogButton to="/customers/1">Cancel</DialogButton>
              <DialogButton variant="navy" icon="arrow" to="/quotations/1">Open quotation</DialogButton>
            </div>
          </Dialog>
        </>
      }
    >
      <HolderOverview />
    </HolderShell>
  )
}
