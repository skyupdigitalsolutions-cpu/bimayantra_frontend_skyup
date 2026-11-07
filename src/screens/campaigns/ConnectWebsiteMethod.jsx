// Figma 300:40763 · CN8 · Connect website — Choose method
import { useState } from 'react'
import { cx } from '../../components/ui'
import { connections, websiteMethods, embedCode } from '../../data/campaigns'
import { Overview, WizardOverlay, ModalHead, SelectField, Btn, WizardFooter } from './_parts'

export default function ConnectWebsiteMethod() {
  const [method, setMethod] = useState(0)
  const [pipeline, setPipeline] = useState('Health')
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(embedCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Overview
      variant="backdrop"
      backdropLinks
      overlay={
        <WizardOverlay className="gap-4">
          <ModalHead guide="website" conn={connections.website} title="Connect your website" sub="Enquiries from your site become leads with source Website" />
          {websiteMethods.map((m, i) => {
            const on = method === i
            return (
              <button
                key={m.title}
                type="button"
                onClick={() => setMethod(i)}
                className={cx('flex w-full items-center gap-3 rounded-[16px] p-3.5 text-left', on ? 'border border-[#1f5fd6] bg-[#f3f7ff]' : 'bg-panel')}
              >
                <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
                <div className="flex flex-col gap-px">
                  <p className="text-[14px] font-bold text-ink">{m.title}</p>
                  <p className="text-[12px] font-medium text-muted">{m.sub}</p>
                </div>
              </button>
            )
          })}
          <div className="flex flex-col gap-2 rounded-[16px] bg-[#0e1f3b] p-4">
            <p className="font-sans text-[12px] leading-[18px] font-medium text-[#c9d6ea]">{embedCode}</p>
            <div className="flex gap-2">
              <Btn variant="pink" size="sm" icon="link" onClick={copy}>{copied ? 'Copied' : 'Copy code'}</Btn>
              <Btn size="sm" icon="mail">Email to my developer</Btn>
            </div>
          </div>
          <div className="flex gap-3">
            <SelectField label="Pipeline" value={pipeline} onChange={setPipeline} options={['Health', 'Motor', 'Life and Term', 'Travel']} />
            <SelectField label="Lead source" value="Website (automatic)" locked />
          </div>
          <WizardFooter backLabel="Cancel" backTo="/campaigns" nextLabel="Next: Send a test lead" nextTo="/x/cn9-connect-website-test-lead-received" />
        </WizardOverlay>
      }
    />
  )
}
