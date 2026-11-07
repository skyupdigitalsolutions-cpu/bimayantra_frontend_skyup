// Figma 245:19500 · CS3 · Consent proof
import Icon from '../../components/Icon'
import { ConsentPage, Drawer, DrawerHead, Btn, SmallBtn, Label } from './_parts'
import signature from '../../assets/flow-consent/signature.svg'

const ROWS = [
  ['How', 'Signed consent form'],
  ['Recorded by', 'You (Suresh Rao)'],
  ['Recorded on', '04 Sep 2026, 11:20'],
  ['Also covers', 'Email'],
]

export default function ConsentProof() {
  return (
    <ConsentPage
      overlay={
        <Drawer
          footer={
            <>
              <Btn to="/x/05b-customer-consent">Close</Btn>
              <Btn variant="danger" icon="x" to="/x/cs4-withdraw-consent">Withdraw consent</Btn>
            </>
          }
        >
          <DrawerHead title="WhatsApp consent" sub="Kavya Hegde · Self" />
          <div className="flex h-[76px] items-center gap-3 rounded-[18px] bg-linear-to-r from-[#d4f1e7] to-[#b9e8d7] px-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="check" size={20} /></span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[17px] font-bold text-ink">Given</span>
              <span className="text-[12px] font-medium text-[#2f6b55]">Since 04 Sep 2026 · still active</span>
            </span>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[16px] bg-panel p-3.5">
            {ROWS.map(([k, v]) => (
              <div key={k} className="flex h-4 items-center justify-between">
                <span className="text-[12px] font-medium text-muted">{k}</span>
                <span className="text-[13px] font-bold text-ink">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Proof</Label>
            <div className="relative h-[220px] rounded-[14px] border border-line bg-white">
              <span className="absolute top-6 left-6 h-2.5 w-[180px] rounded-[4px] bg-[#c9d2df]" />
              {[52, 74, 96, 118, 140].map((t) => (
                <span key={t} className="absolute left-6 h-[7px] w-[380px] rounded-[3px] bg-[#e7ebf2]" style={{ top: t }} />
              ))}
              <img src={signature} alt="" className="absolute top-[160px] left-[280px] h-10 w-[120px]" />
            </div>
            <div className="flex gap-2">
              <SmallBtn variant="outline" icon="eye" className="pr-3.5">View full size</SmallBtn>
              <SmallBtn icon="download">Download</SmallBtn>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>History</Label>
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-[#16845b]" />
              <span className="flex flex-col gap-px">
                <span className="text-[12px] font-bold text-ink">Given · signed form</span>
                <span className="text-[11px] font-medium text-muted">04 Sep 2026 · You</span>
              </span>
            </div>
          </div>
        </Drawer>
      }
    />
  )
}
