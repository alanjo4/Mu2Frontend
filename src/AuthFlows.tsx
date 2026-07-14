import { useEffect, useState, type FormEvent } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api'

type Language = 'es' | 'en'

const copy = {
  es: {
    forgotTitle: 'Recuperar contraseña',
    forgotDesc: 'Ingresá tu email y te mandamos un enlace para elegir una nueva contraseña.',
    email: 'Email',
    send: 'Enviar enlace',
    sending: 'Enviando...',
    forgotDone: 'Si el email está registrado, te llegó un enlace para restablecer la contraseña. Revisá tu bandeja (y el spam).',
    resetTitle: 'Nueva contraseña',
    resetDesc: 'Elegí tu nueva contraseña.',
    newPass: 'Nueva contraseña',
    confirmPass: 'Confirmar contraseña',
    reset: 'Restablecer',
    resetting: 'Guardando...',
    resetDone: '¡Listo! Tu contraseña se actualizó. Ya podés iniciar sesión.',
    noMatch: 'Las contraseñas no coinciden.',
    tooShort: 'La contraseña debe tener al menos 8 caracteres.',
    noToken: 'Falta el token o el enlace es inválido. Pedí uno nuevo desde "Recuperar contraseña".',
    verifyTitle: 'Verificar email',
    verifying: 'Verificando tu email...',
    verifyDone: '¡Email verificado! Gracias, tu cuenta ya está confirmada.',
    verifyErr: 'No pudimos verificar el email: el enlace es inválido o venció.',
    toLogin: 'Ir a iniciar sesión',
    toHome: 'Volver al inicio',
    genericErr: 'Ocurrió un error. Probá de nuevo en un momento.',
  },
  en: {
    forgotTitle: 'Reset password',
    forgotDesc: 'Enter your email and we will send you a link to choose a new password.',
    email: 'Email',
    send: 'Send link',
    sending: 'Sending...',
    forgotDone: 'If the email is registered, a reset link is on its way. Check your inbox (and spam).',
    resetTitle: 'New password',
    resetDesc: 'Choose your new password.',
    newPass: 'New password',
    confirmPass: 'Confirm password',
    reset: 'Reset',
    resetting: 'Saving...',
    resetDone: 'Done! Your password was updated. You can sign in now.',
    noMatch: 'Passwords do not match.',
    tooShort: 'Password must be at least 8 characters.',
    noToken: 'Missing or invalid token. Request a new one from "Reset password".',
    verifyTitle: 'Verify email',
    verifying: 'Verifying your email...',
    verifyDone: 'Email verified! Thanks, your account is confirmed.',
    verifyErr: 'We could not verify the email: the link is invalid or expired.',
    toLogin: 'Go to sign in',
    toHome: 'Back home',
    genericErr: 'Something went wrong. Try again in a moment.',
  },
} satisfies Record<Language, Record<string, string>>

function getToken(): string {
  return new URLSearchParams(window.location.search).get('token') ?? ''
}

function Shell({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className='page-shell flex min-h-screen items-center pt-28 pb-16'>
      <div className='mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#08111f]/88 p-8 shadow-[0_24px_74px_rgba(0,0,0,0.32)]'>
        <h1 className='font-medieval text-3xl text-white'>{title}</h1>
        {desc ? <p className='mt-3 text-sm leading-7 text-white/64'>{desc}</p> : null}
        <div className='mt-6'>{children}</div>
      </div>
    </section>
  )
}

const inputCls =
  'mt-2 h-12 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition-colors focus:border-[#d8b45f]/60'
const primaryBtn =
  'mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-6 text-sm font-semibold tracking-[0.14em] text-[#1d1403] uppercase disabled:opacity-70'
const linkBtn = 'mt-5 w-full text-center text-xs tracking-[0.08em] text-white/58 uppercase transition-colors hover:text-[#ead38a]'

export function ForgotPasswordPage({ language, onNavigate }: { language: Language; onNavigate: (h: string) => void }) {
  const t = copy[language]
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setState('sending')
    try {
      await fetch(`${apiBaseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
    } catch {
      /* siempre mostramos el mismo mensaje (no revela si el email existe) */
    }
    setState('done')
  }

  return (
    <Shell title={t.forgotTitle} desc={state === 'done' ? undefined : t.forgotDesc}>
      {state === 'done' ? (
        <>
          <p className='rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100'>{t.forgotDone}</p>
          <button type='button' onClick={() => onNavigate('/register')} className={linkBtn}>{t.toLogin}</button>
        </>
      ) : (
        <form onSubmit={submit}>
          <label className='block text-xs tracking-[0.18em] text-white/52 uppercase'>{t.email}</label>
          <input type='email' required autoComplete='email' value={email} onChange={(e) => setEmail(e.currentTarget.value)} className={inputCls} />
          <button type='submit' disabled={state === 'sending'} className={primaryBtn}>
            {state === 'sending' ? t.sending : t.send}
          </button>
          <button type='button' onClick={() => onNavigate('/register')} className={linkBtn}>{t.toLogin}</button>
        </form>
      )}
    </Shell>
  )
}

export function ResetPasswordPage({ language, onNavigate }: { language: Language; onNavigate: (h: string) => void }) {
  const t = copy[language]
  const [token] = useState(getToken)
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (pass.length < 8) return setError(t.tooShort)
    if (pass !== confirm) return setError(t.noMatch)
    setState('saving')
    try {
      const res = await fetch(`${apiBaseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: pass }),
      })
      if (!res.ok) throw new Error(await res.text())
      setState('done')
    } catch {
      setState('idle')
      setError(t.genericErr)
    }
  }

  if (!token) {
    return (
      <Shell title={t.resetTitle}>
        <p className='rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200'>{t.noToken}</p>
        <button type='button' onClick={() => onNavigate('/forgot-password')} className={linkBtn}>{t.forgotTitle}</button>
      </Shell>
    )
  }

  return (
    <Shell title={t.resetTitle} desc={state === 'done' ? undefined : t.resetDesc}>
      {state === 'done' ? (
        <>
          <p className='rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100'>{t.resetDone}</p>
          <button type='button' onClick={() => onNavigate('/register')} className={primaryBtn}>{t.toLogin}</button>
        </>
      ) : (
        <form onSubmit={submit}>
          <label className='block text-xs tracking-[0.18em] text-white/52 uppercase'>{t.newPass}</label>
          <input type='password' required autoComplete='new-password' value={pass} onChange={(e) => setPass(e.currentTarget.value)} className={inputCls} />
          <label className='mt-5 block text-xs tracking-[0.18em] text-white/52 uppercase'>{t.confirmPass}</label>
          <input type='password' required autoComplete='new-password' value={confirm} onChange={(e) => setConfirm(e.currentTarget.value)} className={inputCls} />
          {error ? <p className='mt-4 text-sm text-[#ffb6bc]'>{error}</p> : null}
          <button type='submit' disabled={state === 'saving'} className={primaryBtn}>
            {state === 'saving' ? t.resetting : t.reset}
          </button>
        </form>
      )}
    </Shell>
  )
}

export function VerifyEmailPage({ language, onNavigate }: { language: Language; onNavigate: (h: string) => void }) {
  const t = copy[language]
  const [state, setState] = useState<'verifying' | 'done' | 'error'>('verifying')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setState('error')
      return
    }
    let cancelled = false
    fetch(`${apiBaseUrl}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (cancelled) return
        setState(res.ok ? 'done' : 'error')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Shell title={t.verifyTitle}>
      {state === 'verifying' ? (
        <p className='text-sm text-white/64'>{t.verifying}</p>
      ) : state === 'done' ? (
        <>
          <p className='rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100'>{t.verifyDone}</p>
          <button type='button' onClick={() => onNavigate('/')} className={primaryBtn}>{t.toHome}</button>
        </>
      ) : (
        <>
          <p className='rounded-lg border border-rose-400/30 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100'>{t.verifyErr}</p>
          <button type='button' onClick={() => onNavigate('/register')} className={linkBtn}>{t.toLogin}</button>
        </>
      )}
    </Shell>
  )
}
