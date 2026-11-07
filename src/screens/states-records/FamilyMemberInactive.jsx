// Figma 286:33736 · FM1 · Family — member inactive
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { StatusChip, SmallButton, Panel, PanelHead, RingAvatar, Toast } from '../catalogue/_parts'
import { HolderShell, HOLDER_ACTIONS, SH8 } from './_parts'
import { familyMembers } from '../../data/states-records'

function Pill({ icon, children, warn }) {
  return (
    <div className="flex h-[35px] w-[156px] items-center gap-2 rounded-[14px] bg-panel px-3">
      <Icon name={icon} size={15} className="text-muted" />
      <p className={cx('text-[12px] font-semibold whitespace-nowrap', warn ? 'text-[#b4323c]' : 'text-ink')}>{children}</p>
    </div>
  )
}

function MemberCard({ m }) {
  const navigate = useNavigate()
  const body = (
    <>
      <div className="flex items-center gap-3.5">
        <RingAvatar initials={m.initials} bg={m.bg} size={52} text={17} />
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[15px] font-bold text-ink">{m.name}</p>
          <p className="text-[12px] font-medium text-muted">{m.sub}</p>
        </div>
        <Link to="/x/pf3-edit-family-member" aria-label="Edit member" onClick={(e) => e.stopPropagation()} className="text-muted hover:text-ink">
          <Icon name="more" size={18} />
        </Link>
      </div>
      {m.inactive && <StatusChip tone="neutral" icon="x" className="self-start">Inactive</StatusChip>}
      <div className="flex gap-2.5">
        <Pill icon="calendar" warn={m.dobWarn}>{m.dob}</Pill>
        <Pill icon="phone">{m.phone}</Pill>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[12px] font-bold text-muted">Documents</p>
          {m.addDocTo ? (
            <Link to={m.addDocTo} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[12px] font-bold text-blue">
              <Icon name="plus" size={13} />Document
            </Link>
          ) : (
            <button type="button" className="flex items-center gap-1 text-[12px] font-bold text-blue">
              <Icon name="plus" size={13} />Document
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {m.docs.length === 0 && <p className="text-[12px] font-medium text-faint">No documents yet</p>}
          {m.docs.map((d) => <StatusChip key={d.label} tone={d.tone} icon={d.icon}>{d.label}</StatusChip>)}
        </div>
      </div>
      {m.inactive && <SmallButton variant="outline" icon="refresh" to="/x/05a-customer-family" className="self-start">Reactivate</SmallButton>}
    </>
  )
  const cls = cx('flex w-[370px] flex-col gap-3.5 rounded-[28px] bg-white p-6', SH8, m.inactive && 'opacity-60')
  return (
    <div className={cx(cls, m.to && 'cursor-pointer')} onClick={m.to ? () => navigate(m.to) : undefined}>
      {body}
    </div>
  )
}

export default function FamilyMemberInactive() {
  return (
    <HolderShell
      tab="family"
      crumb="FAMILY"
      statusChip={<StatusChip tone="green" icon="check">Active</StatusChip>}
      actions={HOLDER_ACTIONS}
      counts={{ family: 3, documents: 3, quotations: 3, policies: 2, renewals: 1 }}
      overlay={<Toast>Shanta Hegde marked inactive</Toast>}
    >
      <div className="mt-6 flex items-start gap-5">
        <div className="flex w-[760px] flex-wrap items-start gap-5">
          {familyMembers.map((m) => <MemberCard key={m.name} m={m} />)}
        </div>
        <div className="flex w-[400px] flex-col">
          <div className={cx('flex flex-col gap-3 rounded-[28px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] p-6', SH8)}>
            <PanelHead title="Default nominee" right={<SmallButton variant="outline" to="/x/pf1-change-default-nominee" className="px-3.5">Change</SmallButton>} />
            <div className="flex items-center gap-3">
              <RingAvatar initials="AH" bg="bg-white" size={44} text={14} />
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-bold text-ink">Arjun Hegde</p>
                <p className="text-[12px] font-medium text-[#2f6b55]">Spouse · 100%</p>
              </div>
            </div>
            <p className="text-[12px] font-medium text-[#2f6b55]">Suggested on new proposals only. Never changes a policy.</p>
          </div>
          <Panel className={cx('mt-[33px] flex flex-col gap-3', SH8)}>
            <PanelHead title="Linked customers" right={<SmallButton variant="outline" icon="link" to="/x/pf2-link-a-policy-holder">Link</SmallButton>} />
            <div className="flex w-[192px] items-center gap-3 rounded-[16px] bg-panel p-3">
              <RingAvatar initials="SR" bg="bg-[#e9e3fc]" size={38} text={12} />
              <div className="flex flex-col gap-0.5 whitespace-nowrap">
                <p className="text-[13px] font-bold text-ink">Shanthi Rao</p>
                <p className="text-[12px] font-medium text-muted">Parent · CU-000322</p>
              </div>
            </div>
          </Panel>
          <div className="mt-3 flex flex-col gap-2.5">
            <Link to="/x/fd1-add-family-member" className="flex h-[46px] items-center justify-center gap-2 rounded-[24px] bg-linear-to-r from-[#f9c6d0] to-[#f29db0] text-[14px] font-semibold text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]">
              <Icon name="user-plus" size={18} />Add family member
            </Link>
            <Link to="/x/fd3-add-document-whose-document" className="flex h-[46px] items-center justify-center gap-2 rounded-[24px] border border-line bg-white text-[14px] font-semibold text-ink">
              <Icon name="upload" size={18} />Add document
            </Link>
          </div>
        </div>
      </div>
    </HolderShell>
  )
}
