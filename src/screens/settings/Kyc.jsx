// Figma 47:7203 · S03 · Settings — KYC
import Icon from '../../components/Icon'
import { Chip, Field, Input, cx } from '../../components/ui'
import { SettingsLayout, SCard, SHead, DocTile, SNote } from './_parts'

function Step({ state, label, sub, n }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cx(
          'flex size-9 items-center justify-center rounded-full',
          state === 'done' && 'bg-navy text-white',
          state === 'on' && 'border-2 border-violet bg-white text-violet',
          state === 'todo' && 'bg-panel text-[13px] font-bold text-muted',
        )}
      >
        {state === 'done' ? <Icon name="check" size={16} /> : state === 'on' ? <Icon name="clock" size={16} /> : n}
      </span>
      <div className="flex flex-col gap-px">
        <p className="text-[13px] font-bold text-ink">{label}</p>
        <p className="text-[11px] font-medium text-muted">{sub}</p>
      </div>
    </div>
  )
}

export default function Kyc() {
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  KYC"
      title="KYC"
      titleExtra={<Chip tone="violet" icon="clock">Pending review</Chip>}
      subtitle="SkyUp verifies you once. Changes to PAN or licence send it back for review."
      contentClass="gap-[18px]"
    >
      <SCard className="gap-4 p-6">
        <SHead title="Review status" subtitle="Submitted 24 Oct 2026 · target 2 working days" />
        <div className="flex items-center gap-2.5">
          <Step state="done" label="Submitted" sub="24 Oct" />
          <span className="h-0.5 w-[140px] bg-navy" />
          <Step state="on" label="Under review" sub="SkyUp" />
          <span className="h-0.5 w-[140px] bg-line" />
          <Step state="todo" n="3" label="Verified" sub="—" />
        </div>
        <SNote>KYC is not needed to share quotations while that setting is off (CFG-100).</SNote>
      </SCard>

      <SCard className="gap-4 p-6">
        <SHead
          title="Documents"
          subtitle="Locked while under review"
          right={<Chip className="bg-[#eef1f5] text-ink-2" icon="lock">Read only</Chip>}
        />
        <div className="flex gap-3.5">
          <Field label="PAN *"><Input defaultValue="ABCPR1234K" readOnly /></Field>
          <Field label="Name as on PAN *"><Input defaultValue="Suresh Rao" readOnly /></Field>
        </div>
        <div className="flex gap-3.5">
          <DocTile bg="bg-violet-100" icon="card" title="PAN card" sub="pan-card.jpg · uploaded" />
          <DocTile bg="bg-amber-100" icon="shield" title="IRDAI licence" sub="licence.pdf · uploaded" />
        </div>
      </SCard>
    </SettingsLayout>
  )
}
