// Figma 47:7716 · S05 · Settings — WhatsApp wallet
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SettingsLayout, SCard, SHead, SBtn, SChip } from './_parts'
import { walletTx } from '../../data/settings'
import { matches, clearHeaderSearch, NoMatches } from '../admin/_filter'

const AMOUNTS = ['₹500', '₹1,000', '₹2,000', 'Custom']

export default function Wallet() {
  const [amt, setAmt] = useState('₹1,000')
  const [q, setQ] = useState('')
  const txs = walletTx.filter((t) => matches(q, t.title, t.when, t.amount))
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  WHATSAPP WALLET"
      title="WhatsApp wallet"
      titleExtra={<SChip icon="star" className="bg-pink-100 text-[#b4325a]">Premium</SChip>}
      subtitle="Pays for automated WhatsApp greetings and reminders. Premium only."
      contentClass="gap-[18px]"
      onSearch={setQ}
    >
      <div className="flex items-start gap-[18px]">
        <div className="flex w-[440px] flex-col gap-3 rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6 shadow-[0px_24px_44px_-14px_rgba(19,41,75,0.3)]">
          <div className="flex items-center gap-2.5">
            <p className="flex-1 text-[14px] font-semibold text-[#c9d6ea]">Balance</p>
            <span className="rounded-[12px] bg-[#f3f0fa] px-2.5 py-[5px] text-[11px] font-bold text-violet">Paid to SkyUp</span>
          </div>
          <p className="text-[38px] font-bold tracking-[-0.8px] text-white">₹342.00</p>
          <p className="text-[12px] font-medium text-[#c9d6ea]">About 342 messages at ₹1.00 each · alert below ₹100</p>
        </div>
        <SCard className="w-[442px] gap-3.5 p-6">
          <SHead title="Recharge" subtitle="Smallest recharge ₹500" />
          <div className="flex gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmt(a)}
                className={cx('h-9 flex-1 rounded-[16px] text-[13px] font-bold', amt === a ? 'bg-navy text-white' : 'bg-panel text-ink')}
              >
                {a}
              </button>
            ))}
          </div>
          <SBtn size="lg" icon="card" className="w-full" to="/x/wl1-wallet-recharge-pending">
            Pay {amt === 'Custom' ? '₹1,000' : amt} + GST
          </SBtn>
        </SCard>
      </div>

      <SCard className="gap-2.5 p-6">
        <SHead title="Transactions" />
        {txs.length === 0 && <NoMatches onClear={() => { clearHeaderSearch(); setQ('') }} hint={`No transactions match “${q}”.`} />}
        {txs.map((t) => (
          <div key={t.title} className="flex items-center gap-3.5 rounded-[18px] bg-panel p-3.5">
            <span className={cx('flex size-[38px] items-center justify-center rounded-full', t.credit ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-white text-ink')}>
              <Icon name={t.credit ? 'download' : 'chat'} size={16} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">{t.title}</p>
              <p className="text-[12px] font-medium text-muted">{t.when}</p>
            </div>
            <p className={cx('text-[14px] font-bold', t.credit ? 'text-[#127650]' : 'text-ink')}>{t.amount}</p>
          </div>
        ))}
      </SCard>
    </SettingsLayout>
  )
}
