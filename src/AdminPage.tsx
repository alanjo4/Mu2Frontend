import { useCallback, useEffect, useState } from 'react'
import { priceLabel, formatArs } from './money'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api'

// AccountGrade bitmask: 1 = DEV, 2 = GM. Staff = any of these set.
const STAFF_MASK = 0b11
export function isStaff(grade: number | undefined): boolean {
  return ((grade ?? 0) & STAFF_MASK) !== 0
}

type Language = 'es' | 'en'

type PendingOrder = {
  id: string
  reference: string
  accountGuid: number
  priceUsd: number | string
  sylumAmount: number
  paymentMethod: string
  createdAt: string
}

const copy = {
  es: {
    tag: 'Panel de administración',
    title: 'Órdenes pendientes',
    subtitle: 'Confirmá una orden solo después de verificar la transferencia en tu banco.',
    signInPrompt: 'Iniciá sesión con una cuenta GM para administrar.',
    denied: 'Tu cuenta no tiene rango de staff (GM). Acceso denegado.',
    signIn: 'Iniciar sesión',
    refresh: 'Actualizar',
    empty: 'No hay órdenes pendientes.',
    reference: 'Referencia',
    account: 'Cuenta',
    amount: 'A transferir',
    sylum: 'Sylium',
    date: 'Fecha',
    confirm: 'Confirmar',
    confirming: 'Confirmando...',
    confirmAsk: (ref: string, ars: string) =>
      `¿Confirmar la orden ${ref}? Verificaste que entraron ${ars} en tu cuenta. Esto acredita los Sylium y no se puede deshacer.`,
    confirmed: (ref: string) => `Orden ${ref} acreditada.`,
    error: 'No se pudo completar la acción.',
    loadError: 'No se pudieron cargar las órdenes.',
  },
  en: {
    tag: 'Admin panel',
    title: 'Pending orders',
    subtitle: 'Only confirm an order after verifying the transfer in your bank.',
    signInPrompt: 'Sign in with a GM account to administer.',
    denied: 'Your account is not staff (GM). Access denied.',
    signIn: 'Sign in',
    refresh: 'Refresh',
    empty: 'No pending orders.',
    reference: 'Reference',
    account: 'Account',
    amount: 'To transfer',
    sylum: 'Sylium',
    date: 'Date',
    confirm: 'Confirm',
    confirming: 'Confirming...',
    confirmAsk: (ref: string, ars: string) =>
      `Confirm order ${ref}? You verified ${ars} arrived in your account. This credits the Sylium and cannot be undone.`,
    confirmed: (ref: string) => `Order ${ref} credited.`,
    error: 'The action could not be completed.',
    loadError: 'Orders could not be loaded.',
  },
} satisfies Record<Language, Record<string, unknown>>

export default function AdminPage({
  language,
  isAuthenticated,
  grade,
  accessToken,
  onLoginClick,
}: {
  language: Language
  isAuthenticated: boolean
  grade: number
  accessToken: string | null
  onLoginClick: () => void
}) {
  const t = copy[language] as (typeof copy)['es']
  const staff = isStaff(grade)
  const [orders, setOrders] = useState<PendingOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const authHeaders = useCallback(
    (): Record<string, string> => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    [accessToken],
  )

  const load = useCallback(async () => {
    if (!isAuthenticated || !staff) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/shop/admin/orders`, { headers: authHeaders() })
      if (!res.ok) throw new Error(await res.text())
      setOrders(await res.json())
    } catch {
      setToast({ kind: 'err', text: t.loadError })
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, staff, authHeaders, t.loadError])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(id)
  }, [toast])

  const confirm = async (order: PendingOrder) => {
    if (!window.confirm(t.confirmAsk(order.reference, formatArs(order.priceUsd)))) return
    setBusyId(order.id)
    try {
      const res = await fetch(`${apiBaseUrl}/shop/admin/orders/${order.id}/confirm`, {
        method: 'POST',
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error(await res.text())
      setOrders((prev) => prev.filter((o) => o.id !== order.id))
      setToast({ kind: 'ok', text: t.confirmed(order.reference) })
    } catch {
      setToast({ kind: 'err', text: t.error })
    } finally {
      setBusyId(null)
    }
  }

  const fmtDate = (v: string) =>
    new Date(v).toLocaleString(language === 'es' ? 'es-AR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <section className='page-shell pt-28 pb-16 md:pt-32 md:pb-24'>
      <p className='text-sm tracking-[0.26em] text-[#d8b45f] uppercase'>{t.tag}</p>
      <div className='mt-4 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='font-medieval text-4xl leading-tight text-white md:text-5xl'>{t.title}</h1>
          <p className='mt-3 max-w-xl text-sm leading-7 text-white/56'>{t.subtitle}</p>
        </div>
        {isAuthenticated && staff ? (
          <button
            type='button'
            onClick={() => void load()}
            className='rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-xs tracking-[0.14em] text-white uppercase hover:bg-white/10'
          >
            {t.refresh}
          </button>
        ) : null}
      </div>

      <div className='mt-10'>
        {!isAuthenticated ? (
          <Gate text={t.signInPrompt} action={t.signIn} onAction={onLoginClick} />
        ) : !staff ? (
          <Gate text={t.denied} />
        ) : loading ? (
          <div className='grid gap-3'>
            {[0, 1, 2].map((i) => (
              <div key={i} className='h-16 animate-pulse rounded-xl border border-white/8 bg-white/[0.03]' />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/60'>{t.empty}</div>
        ) : (
          <div className='overflow-hidden rounded-2xl border border-white/10'>
            <div className='hidden grid-cols-[1.2fr_0.8fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/8 bg-white/[0.04] px-5 py-3 text-xs tracking-[0.12em] text-white/44 uppercase md:grid'>
              <span>{t.reference}</span>
              <span>{t.account}</span>
              <span>{t.amount}</span>
              <span>{t.sylum}</span>
              <span>{t.date}</span>
              <span />
            </div>
            {orders.map((o, i) => (
              <div
                key={o.id}
                className={`grid grid-cols-2 items-center gap-3 px-5 py-4 text-sm md:grid-cols-[1.2fr_0.8fr_1fr_1fr_1fr_auto] md:gap-4 ${
                  i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.04]'
                }`}
              >
                <span className='font-mono font-semibold text-[#ead38a]'>{o.reference}</span>
                <span className='text-white/70'>#{o.accountGuid}</span>
                <span className='font-semibold text-white/85'>{formatArs(o.priceUsd)}</span>
                <span className='text-white/70'>
                  {o.sylumAmount.toLocaleString(language === 'es' ? 'es-AR' : 'en-US')} SP
                </span>
                <span className='text-white/44'>{fmtDate(o.createdAt)}</span>
                <button
                  type='button'
                  onClick={() => confirm(o)}
                  disabled={busyId === o.id}
                  className='col-span-2 mt-2 inline-flex min-h-10 items-center justify-center rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 px-5 text-xs font-semibold tracking-[0.14em] text-emerald-950 uppercase transition-transform hover:scale-[1.03] disabled:opacity-60 md:col-span-1 md:mt-0'
                >
                  {busyId === o.id ? t.confirming : t.confirm}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tiny hint of the ES→ARS rate for the operator */}
      {isAuthenticated && staff ? (
        <p className='mt-6 text-center text-xs text-white/32'>
          {language === 'es'
            ? `Montos en ARS a un cambio de ${priceLabel(1, 'es')} por USD 1.`
            : `Amounts shown in ARS at ${priceLabel(1, 'es')} per USD 1.`}
        </p>
      ) : null}

      {toast ? (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border px-6 py-3 text-sm shadow-[0_16px_40px_rgba(0,0,0,0.5)] ${
            toast.kind === 'ok'
              ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
              : 'border-rose-400/40 bg-rose-500/15 text-rose-100'
          }`}
        >
          {toast.text}
        </div>
      ) : null}
    </section>
  )
}

function Gate({ text, action, onAction }: { text: string; action?: string; onAction?: () => void }) {
  return (
    <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center'>
      <p className='text-white/60'>{text}</p>
      {action && onAction ? (
        <button
          type='button'
          onClick={onAction}
          className='mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] to-[#b98a31] px-6 text-xs font-semibold tracking-[0.14em] text-[#1d1403] uppercase'
        >
          {action}
        </button>
      ) : null}
    </div>
  )
}
