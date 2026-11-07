// Loading / error panels shared by the live screens.
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'

export function LoadingPanel({ active }) {
  return (
    <AppLayout active={active}>
      <div className="flex h-[600px] items-center justify-center">
        <span className="size-10 animate-spin rounded-full border-4 border-white border-t-navy" aria-label="Loading" />
      </div>
    </AppLayout>
  )
}

export function ErrorPanel({ active, error, back = '/' }) {
  return (
    <AppLayout active={active}>
      <div className="mx-auto mt-24 flex w-[520px] flex-col items-center gap-3 rounded-[28px] bg-white p-8 text-center shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#fbebec] text-[#b4323c]"><Icon name="alert" size={26} /></span>
        <p className="text-[19px] font-bold text-ink">{error?.status === 404 ? 'Not found' : 'Could not load this page'}</p>
        <p className="text-[13px] leading-5 font-medium text-muted">{error?.message}</p>
        {error?.requestId && <p className="text-[11px] font-medium text-faint">Request {error.requestId}</p>}
        <Link to={back} className="mt-2 flex h-[42px] items-center rounded-[22px] bg-navy px-5 text-[13px] font-semibold text-white">Go back</Link>
      </div>
    </AppLayout>
  )
}