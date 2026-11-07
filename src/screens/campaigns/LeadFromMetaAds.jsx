// Figma 300:41547 · CL1 · Lead from Meta Ads (auto-created)
import AppLayout from '../../components/AppLayout'
import { cx } from '../../components/ui'
import { cl1Origin, cl1Answers, cl1Auto } from '../../data/campaigns'
import { Icon, PageHead, Pill, Btn, CardHead, ChannelBadge, cardCls } from './_parts'

export default function LeadFromMetaAds() {
  return (
    <AppLayout active="leads">
      <PageHead
        crumb="LEADS  /  NIKHIL SHETTY"
        title="Nikhil Shetty"
        chip={<Pill tone="blue">New</Pill>}
        sub="LD-2610-00061 · Health pipeline · arrived 10 min ago"
        actions={
          <>
            <Btn icon="phone">Log contact</Btn>
            <Btn variant="pink" icon="user-plus" to="/x/f2-convert-lead-to-customer">Convert to policy holder</Btn>
          </>
        }
      />

      <div className="mt-[21px] flex items-start gap-5">
        <div className="flex w-[760px] shrink-0 flex-col gap-5">
          <div className="flex flex-col gap-3.5 rounded-[28px] bg-linear-to-r from-[#e8f0fd] to-[#dce8fc] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <CardHead title="Where this lead came from" sub="Filled automatically from Meta" right={<ChannelBadge channel="meta" className="bg-white" />} />
            <div className="flex flex-wrap gap-2.5">
              {cl1Origin.map(([k, v]) => (
                <div key={k} className="flex h-14 w-[226px] flex-col gap-0.5 rounded-[14px] bg-white/80 p-3">
                  <p className="text-[11px] font-medium text-muted">{k}</p>
                  <p className="text-[13px] font-bold text-ink">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={cx('flex flex-col gap-2.5 p-6', cardCls)}>
            <CardHead title="Form answers" sub="Exactly as submitted" />
            {cl1Answers.map(([k, v]) => (
              <div key={k} className="flex h-4 items-center justify-between text-[13px]">
                <span className="font-medium text-muted">{k}</span>
                <span className="font-bold text-ink">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cx('flex min-w-0 flex-1 flex-col gap-3 p-6', cardCls)}>
          <CardHead title="Done automatically" />
          {cl1Auto.map(([icon, text]) => (
            <div key={text} className="flex h-7 items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]">
                <Icon name={icon} size={13} />
              </span>
              <p className="text-[13px] font-semibold text-ink">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
