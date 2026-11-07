// Figma 287:36354 · PV2 · Product — Add price version
import Icon from '../../components/Icon'
import { PriceVersionsPage, Drawer, Field, TextInput, Note, Btn, ROUTES } from './_parts'

export default function PV2ProductAddPriceVersion() {
  return (
    <PriceVersionsPage
      overlay={
        <Drawer
          title="Add price version"
          sub="CareFirst Family · Gold"
          closeTo={ROUTES.pv1}
          footer={
            <>
              <Btn variant="outline" center to={ROUTES.pv1} className="w-[220px] pl-5">Cancel</Btn>
              <Btn icon="check" center to={ROUTES.pv1} className="w-[214px]">Save price version</Btn>
            </>
          }
        >
          <Field label="Start date *" hint="Today makes it Current. A later date makes it Scheduled.">
            <TextInput trailing="calendar" defaultValue="01-12-2026" />
          </Field>
          <label className="flex h-[70px] cursor-pointer items-center gap-3 rounded-[16px] border border-[#c7ebda] bg-[#f5fbf8] p-3.5">
            <input type="file" accept=".csv" className="hidden" />
            <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="folder" size={18} /></span>
            <span className="flex flex-col gap-px">
              <span className="text-[13px] font-bold text-ink">rates-dec-2026.csv</span>
              <span className="text-[11px] font-medium text-[#127650]">48 rows · age bands × sum insured</span>
            </span>
          </label>
          <Note icon="clock">PV-3 closes on 30 Nov when this starts.</Note>
        </Drawer>
      }
    />
  )
}
