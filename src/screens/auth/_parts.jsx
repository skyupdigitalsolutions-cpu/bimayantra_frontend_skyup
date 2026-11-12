// Shared auth layout (Login 8:389 and account states A1–A6): brand panel + right-hand form column.
import { useEffect, useRef, useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import logo from '../../assets/logo-full.png'

export function BrandPanel() {
  return (
    <div className="relative h-[976px] w-[660px] shrink-0 overflow-hidden rounded-[40px] bg-linear-to-b from-[#1a3460] to-[#0b1830]">
      {/* glows */}
      <span className="pointer-events-none absolute top-[-120px] left-[300px] size-[520px] rounded-full bg-[#f29db0]/35 blur-[160px]" />
      <span className="pointer-events-none absolute top-[640px] left-[-120px] size-[420px] rounded-full bg-[#3478f6]/35 blur-[160px]" />

      <div className="absolute top-14 left-14 flex items-center rounded-[20px] bg-white px-5 py-3 shadow-[0px_14px_30px_-8px_rgba(0,0,0,0.25)]">
        <img src={logo} alt="BimaYantra" className="h-[40px] w-auto" />
      </div>

      <div className="absolute top-[190px] left-14 flex flex-col gap-4">
        <h1 className="text-[46px] leading-[56px] font-bold tracking-[-0.92px] text-white">
          Every policy.<br />Every renewal.<br />Never missed.
        </h1>
        <p className="w-[470px] text-[16px] leading-[26px] font-medium text-[#c9d6ea]">
          The workspace for insurance advisors: leads, quotations, payments, policies and renewals in one place.
        </p>
      </div>

      {/* Preview / Best fit */}
      <div className="absolute top-[546.92px] left-14 flex h-[125.93px] w-[255.57px] items-center justify-center">
        <div className="flex w-[250px] -rotate-3 flex-col gap-3 rounded-[24px] bg-white p-[18px] shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.05)]">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-[20px] border-2 border-white bg-pink-200 text-[13px] font-bold text-navy">KH</span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">Kavya Hegde</p>
              <p className="text-[11px] font-medium text-muted">Best fit ranked</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-[5px] rounded-[14px] bg-pink-100 py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#b4325a]">
              <Icon name="sparkle" size={13} />Score 89
            </span>
            <span className="rounded-[14px] bg-blue-50 px-3 py-[5px] text-[12px] font-semibold text-blue">3 products</span>
          </div>
        </div>
      </div>

      {/* Preview / Renewal */}
      <div className="absolute top-[640px] left-[321.98px] flex h-[131.46px] w-[247.44px] items-center justify-center">
        <div className="flex w-[240px] rotate-4 flex-col gap-2.5 rounded-[24px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] p-[18px] shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.05)]">
          <p className="text-[12px] font-semibold text-[#8a5a12]">Renewal due</p>
          <p className="text-[15px] font-bold text-ink">FamilySure · Health</p>
          <div className="flex gap-2">
            <span className="flex items-center gap-[5px] rounded-[14px] bg-[#fbf1e1] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#8a5a12]">
              <Icon name="clock" size={13} />38 days
            </span>
            <span className="rounded-[14px] bg-[#eef1f5] px-3 py-[5px] text-[12px] font-semibold text-ink-2">₹21,340</span>
          </div>
        </div>
      </div>

      <div className="absolute top-[880px] left-14 flex items-center gap-2.5 rounded-[20px] border border-white/20 bg-white/10 px-4 py-3">
        <Icon name="lock" size={18} className="text-[#f7b9c4]" />
        <p className="text-[12px] font-semibold text-white">OTP login · PAN and Aadhaar always masked</p>
      </div>
    </div>
  )
}

export function OtpInput({ length = 6, value, onChange, error = false, autoFocus = true }) {
  const refs = useRef([])
  const [focus, setFocus] = useState(-1)

  useEffect(() => {
    if (!autoFocus) return
    const first = value.findIndex((d) => !d)
    refs.current[first === -1 ? length - 1 : first]?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setAt = (i, d) => {
    const next = [...value]
    next[i] = d
    onChange(next)
  }

  const fill = (start, text) => {
    const digits = text.replace(/\D/g, '').slice(0, length - start).split('')
    if (!digits.length) return
    const next = [...value]
    digits.forEach((d, k) => { next[start + k] = d })
    onChange(next)
    refs.current[Math.min(start + digits.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          onFocus={(e) => { setFocus(i); e.target.select() }}
          onBlur={() => setFocus(-1)}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '')
            if (v.length > 1) return fill(i, v)
            setAt(i, v)
            if (v && i < length - 1) refs.current[i + 1]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !d && i > 0) {
              e.preventDefault()
              setAt(i - 1, '')
              refs.current[i - 1]?.focus()
            } else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
            else if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
          }}
          onPaste={(e) => {
            e.preventDefault()
            fill(i, e.clipboardData.getData('text'))
          }}
          className={cx(
            'h-[56px] w-[44px] rounded-[16px] bg-white text-center text-[22px] font-bold text-ink caret-blue outline-none sm:h-[68px] sm:w-[62px] sm:rounded-[18px] sm:text-[24px]',
            error ? 'border-[1.5px] border-[#b4323c] bg-[#fff7f7] text-[#b4323c] caret-[#b4323c]' : focus === i ? 'border-2 border-blue shadow-[0px_0px_0px_4px_rgba(31,95,214,0.18)]' : 'border-[1.5px] border-line',
          )}
        />
      ))}
    </div>
  )
}


/** Page shell: brand panel on the left, form column starting at x=830 / y=180, footer links at y=956. */
export function AuthShell({ children, onSubmit }) {
  const Form = onSubmit ? 'form' : 'div'
  return (
    <div className="flex min-h-screen flex-col bg-white lg:min-w-[1280px] lg:flex-row lg:py-6 lg:pl-6">
      {/* Phones and tablets: a logo bar instead of the brand panel; the form takes the full width */}
      <div className="flex items-center px-5 pt-6 pb-2 lg:hidden"><img src={logo} alt="BimaYantra" className="h-[34px] w-auto" /></div>
      <div className="hidden lg:block"><BrandPanel /></div>
      <div className="relative flex flex-1 flex-col">
        <Form onSubmit={onSubmit} className="mx-auto flex w-full max-w-[440px] flex-col items-start px-5 pt-8 pb-10 lg:absolute lg:top-[156px] lg:left-[146px] lg:mx-0 lg:w-[440px] lg:p-0">
          {children}
        </Form>
        <p className="mt-auto px-5 pb-6 text-[12px] font-medium text-muted lg:absolute lg:top-[932px] lg:left-[146px] lg:mt-0 lg:p-0">Terms · Privacy · Disclaimer</p>
      </div>
    </div>
  )
}

const CHIP = {
  violet: 'bg-violet-50 text-violet',
  green: 'bg-[#e7f4ee] text-[#127650]',
}

export function StepChip({ tone = 'violet', icon, children }) {
  return (
    <span className={cx('flex items-center gap-[5px] rounded-[14px] py-[5px] pr-3 text-[12px] font-semibold', icon ? 'pl-2' : 'pl-3', CHIP[tone])}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** 54px full-width button: navy (primary) or white outline (secondary). */
export function AuthButton({ variant = 'primary', icon, className = '', children, as: As = 'button', ...rest }) {
  return (
    <As
      {...(As === 'button' ? { type: 'button' } : {})}
      {...rest}
      className={cx(
        'flex h-[54px] w-full items-center justify-center gap-2 rounded-[24px] pr-5 pl-4 text-[15px] font-semibold transition',
        variant === 'primary'
          ? 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700'
          : 'border border-line bg-white text-ink hover:bg-panel',
        className,
      )}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </As>
  )
}

/** Big round icon + title + paragraph (locked / suspended / closed states). */
export function StatusHead({ icon, circle, title, children }) {
  return (
    <>
      <span className={cx('flex size-[72px] items-center justify-center rounded-[36px]', circle)}>
        <Icon name={icon} size={32} />
      </span>
      <h2 className="mt-[18px] text-[32px] font-bold tracking-[-0.6px] text-ink">{title}</h2>
      <p className="mt-2.5 w-[440px] text-[15px] leading-[24px] font-medium text-muted">{children}</p>
    </>
  )
}