// /campaigns/guide · Connection guide (live). How an advisor connects each lead channel, what it needs, how to test it
// and what to do when leads don't arrive. Advisor-facing only: SkyUp's own app setup and server secrets live in
// docs/INTEGRATIONS.md, never here. The real webhook URL and key of a connection are shown in its Settings on
// Campaigns, so nothing on this page is a value to copy.
//   GET /campaigns/platforms   which sign-ins SkyUp has set up (Meta / LinkedIn one-click sign-in)
//   GET /campaigns/connections what this account already has connected
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, HeadButton, SegTabs, StatusChip, Panel, PanelHead } from '../screens/catalogue/_parts'
import { api, useQuery } from '../api'
import { useAuth } from '../auth/AuthProvider'
import { label } from './kit'

const CHANNELS = ['META', 'GOOGLE', 'LINKEDIN', 'WEBSITE']
const LOOK = {
  META: { name: 'Meta Ads', sub: 'Facebook and Instagram lead forms', icon: 'chart', bg: 'bg-[#e8f0fd]', time: 'About 3 minutes' },
  GOOGLE: { name: 'Google Ads', sub: 'Lead form assets', icon: 'search', bg: 'bg-[#fde8ec]', time: 'About 2 minutes per form' },
  LINKEDIN: { name: 'LinkedIn Ads', sub: 'Lead Gen Forms', icon: 'users', bg: 'bg-[#eef1f5]', time: 'About 3 minutes' },
  WEBSITE: { name: 'Website form', sub: 'Your site or landing page', icon: 'grid', bg: 'bg-[#f0ecfb]', time: 'About 5 minutes' },
}

/** Steps shared by every channel: the details asked in the Connect form. */
const DETAILS_STEP = { title: 'Fill in the details', body: 'Give it a name you’ll recognise, choose the pipeline new leads go to and the stage they start in. Ad set, parent campaign and category are optional and only group things on the Campaigns page.' }

const GUIDE = {
  META: {
    intro: 'Leads from your Facebook and Instagram lead forms arrive in your pipeline within seconds of being submitted.',
    needs: [
      'A Facebook account that is an admin or advertiser on your business Page',
      'At least one lead form on that Page (Meta Ads Manager → Instant forms)',
      'Only for “Use my own Meta app”: the Page ID, a Page access token with leads_retrieval and pages_manage_metadata, and your app’s App secret',
    ],
    ways: [
      {
        title: 'Sign in with Facebook (recommended)', when: 'signIn',
        steps: [
          { title: 'Open Campaigns → Meta Ads → Connect' },
          DETAILS_STEP,
          { title: 'Sign in, then pick your Pages', body: 'Choose “Sign in with Facebook” and log in. You come back to Bimayantra on the Forms screen: tick the Pages and lead forms to import leads from.' },
          { title: 'Allow leads access, if your business restricts it', body: 'Meta Business Suite → Settings → Integrations → Leads access → your Page → CRMs → assign the app. Skip this if you never turned leads access on.' },
        ],
      },
      {
        title: 'Use my own Meta app',
        steps: [
          { title: 'Open Campaigns → Meta Ads → Connect → “Use my own Meta app”' },
          DETAILS_STEP,
          { title: 'Paste the Page ID, Page access token and App secret', body: 'Lead form IDs are optional: leave them blank to import every form on the Page.' },
          { title: 'Point your app’s webhook at Bimayantra', body: 'After you connect, copy the Callback URL and Verify token shown (the token is shown once). In your Meta app → Webhooks → Page, paste both, verify, and subscribe to the leadgen field.' },
        ],
      },
    ],
    test: ['Open Meta’s Lead Ads Testing Tool, pick your Page and form, and create a test lead.', 'It appears under Campaigns and in Leads within a minute, with the form answers on the lead.'],
    problems: [
      ['No leads arrive', 'Check the connection says Connected on Campaigns. If your business uses Leads access, make sure the app is assigned (step 4). Leads Meta couldn’t deliver show under “Not imported” with a Retry button.'],
      ['“Reconnect needed”', 'Your Facebook password changed or the access was removed. Press Sign in again on the connection; leads sent meanwhile are fetched again.'],
      ['Only some forms import', 'Lead form IDs limit what’s imported. Open the connection’s Settings and clear them, or add the missing form.'],
    ],
  },
  GOOGLE: {
    intro: 'Google Ads sends each lead from your lead form assets straight to Bimayantra through a webhook.',
    needs: ['Access to the Google Ads account that runs the campaign', 'A campaign with a lead form asset'],
    ways: [
      {
        title: 'Webhook from the lead form',
        steps: [
          { title: 'Open Campaigns → Google Ads → Connect' },
          DETAILS_STEP,
          { title: 'Create the webhook key', body: 'Press Generate (or type your own: 16 to 100 letters, digits, - or _). Campaign ID and Form ID are optional filters; blank accepts every lead.' },
          { title: 'Copy the Webhook URL and key', body: 'They’re shown once after you connect, with Copy buttons. You can replace the key later from the connection.' },
          { title: 'Paste them in Google Ads', body: 'Google Ads → your campaign → Assets → Lead form → Lead delivery → Webhook integration: paste the URL and the key, then save.' },
        ],
      },
    ],
    test: ['In the same Google Ads screen press “Send test data”.', 'A test lead appears under Campaigns within a minute.'],
    problems: [
      ['Test data fails', 'The key in Google Ads must match exactly (no spaces). Copy it again, or press “Key …” on the connection to make a new one and paste that.'],
      ['Leads show as “Skipped”', 'They came from a campaign or form not in your filters. Add the IDs in the connection’s Settings, then import them from “Not imported”.'],
    ],
  },
  LINKEDIN: {
    intro: 'Leads from your LinkedIn Lead Gen Forms are added to your pipeline as they come in.',
    needs: [
      'A LinkedIn account with access to the ad account or company page',
      'Only for “Use my own LinkedIn app”: the ad account or organization URN, an access token and the app’s client secret',
    ],
    ways: [
      {
        title: 'Sign in with LinkedIn (recommended)', when: 'signIn',
        steps: [
          { title: 'Open Campaigns → LinkedIn Ads → Connect' },
          DETAILS_STEP,
          { title: 'Sign in, then pick the ad accounts', body: 'Choose “Sign in with LinkedIn” and log in. You come back to Bimayantra on the Forms screen: tick the ad accounts and forms to import.' },
        ],
      },
      {
        title: 'Use my own LinkedIn app',
        steps: [
          { title: 'Open Campaigns → LinkedIn Ads → Connect → “Use my own LinkedIn app”' },
          DETAILS_STEP,
          { title: 'Paste the account URN, access token and client secret', body: 'The URN looks like urn:li:sponsoredAccount:123456789. Lead form URNs are optional.' },
          { title: 'Point your app’s webhook at Bimayantra', body: 'After you connect, copy the Callback URL shown and add it as the lead notification webhook in your LinkedIn app.' },
        ],
      },
    ],
    test: ['Submit a test lead on your Lead Gen Form preview.', 'It appears under Campaigns within a minute.'],
    problems: [
      ['“Reconnect needed”', 'LinkedIn access tokens expire. Press Sign in again (or paste a new token in Settings).'],
      ['Nothing arrives', 'Check the connection says Connected and that the form belongs to the ad account you picked.'],
    ],
  },
  WEBSITE: {
    intro: 'Enquiries from your website or landing page become leads, with the visitor’s answers on the lead.',
    needs: ['Someone who can edit your website', 'For your own form: a developer who can send the form to a web address'],
    ways: [
      {
        title: 'Use our ready-made form',
        steps: [
          { title: 'Open Campaigns → Website form → Connect' },
          DETAILS_STEP,
          { title: 'Open Forms on the connection', body: 'Choose the fields to ask. You get a link and an embed code for the form, which includes the consent tick box.' },
          { title: 'Add it to your site', body: 'Paste the embed code on your contact page, or share the link. No secret is needed on your site.' },
        ],
      },
      {
        title: 'Send from your own form',
        steps: [
          { title: 'Open Campaigns → Website form → Connect' },
          DETAILS_STEP,
          { title: 'Create the webhook secret', body: 'Press Generate. After you connect, copy the Webhook URL and secret (shown once).' },
          { title: 'Have your developer post the form', body: 'POST each enquiry to the Webhook URL from your server with the header X-Bimayantra-Key set to the secret. Send the fields by name (name, mobile, email, city, message…); match them to lead fields under Forms.' },
        ],
      },
    ],
    test: ['Submit your form once with your own name and mobile.', 'The lead appears under Campaigns and in Leads straight away.'],
    problems: [
      ['Nothing arrives from my own form', 'The X-Bimayantra-Key header must carry the secret exactly. Never put the secret in the page’s HTML; send from your server.'],
      ['Leads have no mobile number', 'Map your form’s phone field to Mobile under Forms on the connection.'],
    ],
  },
}

export default function LiveCampaignGuide() {
  const [sp, setSp] = useSearchParams()
  const { user } = useAuth() ?? {}
  const canConnect = user?.role === 'ADV' // assistants can read the guide; only the advisor connects
  const ch = CHANNELS.includes(sp.get('channel')) ? sp.get('channel') : 'META'
  const platforms = useQuery('campaigns:platforms', () => api.campaigns.platforms())
  const conns = useQuery('campaigns:connections', () => api.campaigns.connections())
  const g = GUIDE[ch]
  const look = LOOK[ch]
  const mine = (conns.data || []).filter((c) => c.channel === ch)
  const signInReady = !!platforms.data?.[ch]?.configured
  const ways = g.ways.filter((w) => w.when !== 'signIn' || signInReady)

  return (
    <AppLayout active="campaigns">
      <Header back="/campaigns" breadcrumb="CAMPAIGNS  /  CONNECTION GUIDE" title="Connection guide" search={false}
        subtitle="How to bring leads from your ads and website into Bimayantra."
        actions={canConnect && <HeadButton icon="plus" to={`/campaigns?connect=${ch}`}>Connect {look.name}</HeadButton>} />
      <SegTabs className="mt-[13px]" items={CHANNELS.map((k) => ({ key: k, label: LOOK[k].name }))} value={ch}
        onChange={(k) => setSp({ channel: k }, { replace: true })} />

      <div className="mt-5 flex items-start gap-5">
        <div className="flex w-[760px] shrink-0 flex-col gap-5">
          <Panel className="flex items-center gap-4">
            <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-full', look.bg)}><Icon name={look.icon} size={22} className="text-ink" /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[17px] font-bold text-ink">{look.name}</p>
              <p className="text-[13px] font-medium text-muted">{g.intro}</p>
            </div>
            <span className="shrink-0 rounded-[12px] bg-panel px-3 py-1.5 text-[12px] font-semibold text-ink-2">{look.time}</span>
          </Panel>

          {ways.map((w) => (
            <Panel key={w.title} className="flex flex-col gap-3">
              <PanelHead title={w.title} subtitle={ways.length > 1 ? 'One of the ways to connect' : undefined} />
              <ol className="flex flex-col gap-3">
                {w.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e8f0fd] text-[12px] font-bold text-blue">{i + 1}</span>
                    <div className="flex min-w-0 flex-col gap-0.5 pt-1">
                      <p className="text-[14px] font-bold text-ink">{s.title}</p>
                      {s.body && <p className="text-[13px] leading-5 font-medium text-ink-2">{s.body}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>
          ))}
          {!signInReady && g.ways.some((w) => w.when === 'signIn') && platforms.data && (
            <p className="rounded-[18px] bg-[#fbf1e1] px-4 py-3 text-[13px] font-medium text-[#8a5a12]">
              One-click sign-in for {look.name} isn’t switched on yet, so connect with your own app for now.
            </p>
          )}

          <Panel className="flex flex-col gap-3">
            <PanelHead title="If leads don’t arrive" />
            {g.problems.map(([p, fix]) => (
              <div key={p} className="flex flex-col gap-0.5 border-t border-line pt-3 first:border-0 first:pt-0">
                <p className="text-[14px] font-bold text-ink">{p}</p>
                <p className="text-[13px] leading-5 font-medium text-ink-2">{fix}</p>
              </div>
            ))}
          </Panel>
        </div>

        <div className="flex w-[400px] shrink-0 flex-col gap-5">
          <Panel className="flex flex-col gap-3">
            <PanelHead title="You’ll need" />
            {g.needs.map((n) => (
              <p key={n} className="flex gap-2.5 text-[13px] leading-5 font-medium text-ink-2"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-[#127650]" />{n}</p>
            ))}
          </Panel>
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Check it works" />
            {g.test.map((t, i) => <p key={t} className="text-[13px] leading-5 font-medium text-ink-2"><span className="font-bold text-ink">{i + 1}.</span> {t}</p>)}
          </Panel>
          <Panel className="flex flex-col gap-3">
            <PanelHead title={`Your ${look.name} connections`} />
            {conns.loading && !conns.data && <p className="text-[13px] font-medium text-muted">Loading…</p>}
            {conns.data && !mine.length && <p className="text-[13px] font-medium text-muted">None yet.</p>}
            {mine.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-[13px]">
                <span className="min-w-0 flex-1 truncate font-semibold text-ink">{c.name ?? look.name}</span>
                <StatusChip tone={c.status === 'CONNECTED' || c.status === 'ACTIVE' ? 'green' : c.status === 'DISCONNECTED' ? 'neutral' : 'amber'}>{label(c.status)}</StatusChip>
              </div>
            ))}
            <p className="text-[12px] font-medium text-muted">The webhook URL and key of each connection are in its Settings on Campaigns.</p>
          </Panel>
        </div>
      </div>
    </AppLayout>
  )
}
