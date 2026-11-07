// Figma 128:14921 · AP2b · Add product — Brochure (Premium)
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { Shell, StepCard, StepFooter, PreviewCard, Btn, RoundBtn, Chip, R } from './_parts'
import { brochureFile, willFill, previewByStep } from '../../data/flow-add-product'

export function NormalPlanLink() {
  return (
    <Link to={R.brochureNormal} className="absolute top-[240px] left-[820px] flex items-center gap-1.5 text-[12px] font-semibold text-muted hover:text-ink">
      <Icon name="eye" size={14} />
      Preview: Normal plan view
    </Link>
  )
}

export default function BrochurePremium() {
  const [file, setFile] = useState(brochureFile)
  const input = useRef(null)
  const pick = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile({ name: f.name, meta: `${(f.size / 1048576).toFixed(1)} MB · uploaded` })
  }

  return (
    <Shell step={3} subtitle="Health" aside={<PreviewCard values={previewByStep.company} />} extra={<NormalPlanLink />}>
      <StepCard title="3 · Upload the brochure" subtitle="We read it and fill in the next steps for you" chip={<Chip tone="pink" icon="sparkle">Premium · auto-fill</Chip>}>
        <div
          className="flex flex-col items-center gap-2.5 rounded-[24px] border border-dashed border-[#9db8ee] bg-[#f7f9ff] p-7"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            pick({ target: { files: e.dataTransfer.files } })
          }}
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue">
            <Icon name="upload" size={28} />
          </span>
          <p className="text-[16px] leading-5 font-bold text-ink">Drop the brochure here</p>
          <p className="text-[12px] leading-[15px] font-medium text-muted">PDF, JPG or PNG · up to 20 MB</p>
          <div className="flex gap-2">
            <Btn size="sm" icon="folder" onClick={() => input.current?.click()}>Choose file</Btn>
            <Btn variant="outline" size="sm" icon="phone" onClick={() => input.current?.click()}>Camera</Btn>
          </div>
          <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={pick} />
        </div>

        {file && (
          <div className="flex items-center gap-3 rounded-[18px] bg-panel p-3.5">
            <span className="flex h-12 w-10 items-center justify-center rounded-[12px] bg-pink-100 text-[#b4325a]">
              <Icon name="folder" size={18} />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[14px] font-bold text-ink">{file.name}</span>
              <span className="text-[12px] font-medium text-[#127650]">{file.meta}</span>
            </div>
            <RoundBtn icon="x" color="text-muted" onClick={() => setFile(null)} aria-label="Remove file" />
          </div>
        )}

        <p className="text-[13px] font-semibold text-ink">We’ll fill these for you</p>
        <div className="flex gap-2.5">
          {willFill.map((w) => (
            <span key={w.label} className="flex flex-1 items-center gap-2 rounded-[14px] bg-violet-50 px-3 py-2.5 text-[12px] font-bold text-violet">
              <Icon name={w.icon} size={14} />
              {w.label}
            </span>
          ))}
        </div>
        <Link to={R.product} className="flex items-center gap-2 self-start text-[13px] font-bold text-blue hover:underline">
          <Icon name="edit" size={15} />
          Skip and fill in manually
        </Link>

        <StepFooter back={R.company} next={<Btn icon="sparkle" to={R.reading}>Read brochure</Btn>} />
      </StepCard>
    </Shell>
  )
}
