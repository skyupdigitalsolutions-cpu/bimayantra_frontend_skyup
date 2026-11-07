// Figma 246:21492 · PD2 · Document versions
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Drawer, DrawerHead, SmallBtn } from '../flow-consent/_parts'
import { DocumentsPage, Chip } from './_parts'

const VERSIONS = [
  { v: 'v2', title: 'Current version', sub: '24 Oct 2026 · Priya', chip: <Chip className="bg-[#fbf1e1] text-[#8a5a12]">Unconfirmed</Chip>, current: true },
  { v: 'v1', title: 'Earlier version', sub: '04 Sep 2026 · You', chip: <Chip className="bg-[#e7f4ee] text-[#127650]">Confirmed</Chip> },
]

function RoundBtn({ icon, label }) {
  return (
    <button type="button" aria-label={label} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
      <Icon name={icon} size={13.4} />
    </button>
  )
}

export default function DocumentVersions() {
  return (
    <DocumentsPage
      overlay={
        <Drawer>
          <DrawerHead title="Aadhaar · versions" sub="Kavya Hegde · never deleted" close="/x/05c-customer-documents" />
          {VERSIONS.map((r) => (
            <div key={r.v} className={cx('flex items-center gap-3 rounded-[16px] px-3.5', r.current ? 'h-[70px] border border-[#c9daf8] bg-[#f7f9ff]' : 'h-[68px] bg-panel')}>
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-[12px] font-bold text-ink">{r.v}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[13px] font-bold text-ink">{r.title}</span>
                <span className="text-[11px] font-medium text-muted">{r.sub}</span>
              </span>
              {r.chip}
              <RoundBtn icon="eye" label="View" />
              <RoundBtn icon="download" label="Download" />
            </div>
          ))}
          <div className="flex h-16 items-center gap-3 rounded-[16px] bg-panel px-3.5">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[13px] font-bold text-ink">Label: Aadhaar</span>
              <span className="text-[11px] font-medium whitespace-nowrap text-muted">Advisor only. Change it if the wrong type was picked.</span>
            </span>
            <SmallBtn variant="outline" icon="edit" to="/x/dl1-document-change-label" className="pr-3.5">Change label</SmallBtn>
          </div>
          <button type="button" className="flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]">
            <Icon name="upload" size={18} />Upload new version
          </button>
        </Drawer>
      }
    />
  )
}
