import { useCallback, useEffect, useState } from 'react'
import { priceLabel, formatArs } from './money'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000/api'

type Language = 'es' | 'en'
type ShopTab = 'sylium' | 'skins' | 'history'

type SylumPackage = {
  id: number
  name: string
  price_usd: number | string
  sylum_base: number
  sylum_bonus: number
  display_label: string
}

type Skin = {
  id: number
  skin_item_id: number
  name: string
  description: string
  rarity: number
  rarityName: string
  price_sylum: number
  image_url: string | null
}

type Balance = { webzenBalance: string; sylumBalance: string; vipTier: number }

type PaymentInfo = {
  method: string
  holder: string
  bank: string
  cbu: string
  alias: string
  note: string
}

type CreatedOrder = {
  orderId: string
  reference: string
  packageName: string
  priceUsd: number | string
  sylumAmount: number
  status: string
  payment: PaymentInfo
}

type MyOrder = {
  id: string
  reference: string
  priceUsd: number | string
  sylumAmount: number
  status: string
  createdAt: string
  completedAt: string | null
}

type HistoryEntry = {
  id: string
  opType: string
  currency: string
  amount: string
  balanceAfter: string
  meta: string | null
  createdAt: string
}

const copy = {
  es: {
    tag: 'Tienda',
    title: 'Sylium Store',
    subtitle:
      'Comprá Sylium Points por transferencia y canjealos por skins exclusivas que llegan a tu correo del juego.',
    tabs: { sylium: 'Sylium Points', skins: 'Skins', history: 'Historial' },
    balance: 'Tu saldo',
    signInPrompt: 'Iniciá sesión para comprar y ver tu saldo.',
    signIn: 'Iniciar sesión',
    buy: 'Comprar',
    bonus: 'de bonus',
    buySkin: 'Canjear',
    owned: 'Entregada',
    rarity: 'Rareza',
    delivered: 'Se entrega en el correo del juego. Retirala al ingresar.',
    insufficient: 'Sylium insuficiente',
    needSp: (n: number) => `Necesitás ${n.toLocaleString('es-AR')} SP`,
    skinSuccess: (name: string) => `¡"${name}" enviada a tu correo del juego! Retirala al ingresar.`,
    orderCreated: 'Orden creada — transferí para completar',
    payTitle: 'Datos para la transferencia',
    reference: 'Referencia (ponela en el concepto)',
    amount: 'Monto',
    holder: 'Titular',
    bank: 'Banco',
    cbu: 'CBU',
    alias: 'Alias',
    copied: 'Copiado',
    copy: 'Copiar',
    payNote:
      'La acreditación es manual: una vez confirmada la transferencia, se cargan tus Sylium (puede demorar hasta 24 h).',
    notConfigured: 'Los datos bancarios todavía no están configurados. Escribinos por Discord.',
    close: 'Cerrar',
    myOrders: 'Mis órdenes',
    noOrders: 'Todavía no tenés órdenes.',
    noHistory: 'Todavía no hay movimientos.',
    status: { pending: 'Pendiente', completed: 'Acreditada', refunded: 'Reembolsada' } as Record<string, string>,
    loadError: 'No se pudo cargar la tienda.',
    op: {
      credit_sylum: 'Sylium acreditado',
      spend_sylum: 'Compra con Sylium',
      earn_webzen: 'Webzen ganado',
      spend_webzen: 'Gasto de Webzen',
    } as Record<string, string>,
  },
  en: {
    tag: 'Shop',
    title: 'Sylium Store',
    subtitle:
      'Buy Sylium Points by transfer and redeem them for exclusive skins delivered to your in-game mail.',
    tabs: { sylium: 'Sylium Points', skins: 'Skins', history: 'History' },
    balance: 'Your balance',
    signInPrompt: 'Sign in to purchase and see your balance.',
    signIn: 'Sign in',
    buy: 'Buy',
    bonus: 'bonus',
    buySkin: 'Redeem',
    owned: 'Delivered',
    rarity: 'Rarity',
    delivered: 'Delivered to your in-game mail. Claim it when you log in.',
    insufficient: 'Not enough Sylium',
    needSp: (n: number) => `You need ${n.toLocaleString('en-US')} SP`,
    skinSuccess: (name: string) => `"${name}" sent to your in-game mail! Claim it when you log in.`,
    orderCreated: 'Order created — transfer to complete',
    payTitle: 'Bank transfer details',
    reference: 'Reference (put it in the concept)',
    amount: 'Amount',
    holder: 'Holder',
    bank: 'Bank',
    cbu: 'CBU',
    alias: 'Alias',
    copied: 'Copied',
    copy: 'Copy',
    payNote:
      'Crediting is manual: once the transfer is confirmed, your Sylium is added (may take up to 24 h).',
    notConfigured: 'Bank details are not configured yet. Reach out on Discord.',
    close: 'Close',
    myOrders: 'My orders',
    noOrders: 'You have no orders yet.',
    noHistory: 'No transactions yet.',
    status: { pending: 'Pending', completed: 'Credited', refunded: 'Refunded' } as Record<string, string>,
    loadError: 'The shop could not be loaded.',
    op: {
      credit_sylum: 'Sylium credited',
      spend_sylum: 'Sylium purchase',
      earn_webzen: 'Webzen earned',
      spend_webzen: 'Webzen spent',
    } as Record<string, string>,
  },
} satisfies Record<Language, Record<string, unknown>>

const rarityStyle: Record<number, { ring: string; text: string; glow: string; label: string }> = {
  1: { ring: 'border-sky-400/40', text: 'text-sky-300', glow: 'from-sky-500/15', label: 'bg-sky-500/15 text-sky-200' },
  2: { ring: 'border-fuchsia-400/40', text: 'text-fuchsia-300', glow: 'from-fuchsia-500/15', label: 'bg-fuchsia-500/15 text-fuchsia-200' },
  3: { ring: 'border-amber-400/45', text: 'text-amber-300', glow: 'from-amber-500/15', label: 'bg-amber-500/15 text-amber-200' },
  4: { ring: 'border-rose-500/50', text: 'text-rose-300', glow: 'from-rose-500/18', label: 'bg-rose-500/18 text-rose-200' },
}

export default function ShopPage({
  language,
  isAuthenticated,
  accessToken,
  onLoginClick,
}: {
  language: Language
  isAuthenticated: boolean
  accessToken: string | null
  onLoginClick: () => void
}) {
  const t = copy[language] as (typeof copy)['es']
  const [tab, setTab] = useState<ShopTab>('sylium')
  const [packages, setPackages] = useState<SylumPackage[]>([])
  const [skins, setSkins] = useState<Skin[]>([])
  const [balance, setBalance] = useState<Balance | null>(null)
  const [orders, setOrders] = useState<MyOrder[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [activeOrder, setActiveOrder] = useState<CreatedOrder | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const authHeaders = useCallback((): Record<string, string> => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  }, [accessToken])

  // Public catalog
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [pkgRes, skinRes] = await Promise.all([
          fetch(`${apiBaseUrl}/shop/packages`),
          fetch(`${apiBaseUrl}/shop/skins`),
        ])
        if (cancelled) return
        if (pkgRes.ok) setPackages(await pkgRes.json())
        if (skinRes.ok) setSkins(await skinRes.json())
      } catch {
        if (!cancelled) setToast({ kind: 'err', text: t.loadError })
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [t.loadError])

  const refreshAuthed = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const [balRes, ordRes, histRes] = await Promise.all([
        fetch(`${apiBaseUrl}/shop/balance`, { headers: authHeaders() }),
        fetch(`${apiBaseUrl}/shop/orders/mine`, { headers: authHeaders() }),
        fetch(`${apiBaseUrl}/shop/history`, { headers: authHeaders() }),
      ])
      if (balRes.ok) setBalance(await balRes.json())
      if (ordRes.ok) setOrders(await ordRes.json())
      if (histRes.ok) setHistory(await histRes.json())
    } catch {
      /* silent */
    }
  }, [isAuthenticated, authHeaders])

  useEffect(() => {
    void refreshAuthed()
  }, [refreshAuthed])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(id)
  }, [toast])

  const createOrder = async (packageId: number) => {
    if (!isAuthenticated) return onLoginClick()
    setBusyId(packageId)
    try {
      const res = await fetch(`${apiBaseUrl}/shop/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ packageId }),
      })
      if (!res.ok) throw new Error(await res.text())
      const order = (await res.json()) as CreatedOrder
      setActiveOrder(order)
      void refreshAuthed()
    } catch {
      setToast({ kind: 'err', text: t.loadError })
    } finally {
      setBusyId(null)
    }
  }

  const buySkin = async (skin: Skin) => {
    if (!isAuthenticated) return onLoginClick()
    if (balance && Number(balance.sylumBalance) < skin.price_sylum) {
      setToast({ kind: 'err', text: t.needSp(skin.price_sylum) })
      return
    }
    setBusyId(skin.id)
    try {
      const res = await fetch(`${apiBaseUrl}/shop/skins/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ skinId: skin.id }),
      })
      if (!res.ok) {
        const msg = await res.text()
        setToast({ kind: 'err', text: msg.includes('Insufficient') ? t.needSp(skin.price_sylum) : t.loadError })
        return
      }
      setToast({ kind: 'ok', text: t.skinSuccess(skin.name) })
      void refreshAuthed()
    } catch {
      setToast({ kind: 'err', text: t.loadError })
    } finally {
      setBusyId(null)
    }
  }

  const copyText = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500)
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  const fmtDate = (v: string) =>
    new Date(v).toLocaleDateString(language === 'es' ? 'es-AR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  return (
    <section className='page-shell pt-28 pb-16 md:pt-32 md:pb-24'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-6 md:flex-row md:items-end'>
        <div>
          <p className='text-sm tracking-[0.26em] text-[#d8b45f] uppercase'>{t.tag}</p>
          <h1 className='font-medieval mt-4 text-4xl leading-tight text-white md:text-5xl'>{t.title}</h1>
          <p className='mt-4 max-w-xl text-base leading-8 text-white/64'>{t.subtitle}</p>
        </div>
        {isAuthenticated ? (
          <div className='shrink-0 rounded-2xl border border-[#d8b45f]/24 bg-[#d8b45f]/8 px-6 py-4'>
            <p className='text-xs tracking-[0.16em] text-white/50 uppercase'>{t.balance}</p>
            <p className='font-medieval mt-1 text-3xl text-[#ead38a]'>
              {balance ? Number(balance.sylumBalance).toLocaleString(language === 'es' ? 'es-AR' : 'en-US') : '—'}{' '}
              <span className='text-lg text-[#d8b45f]'>SP</span>
            </p>
          </div>
        ) : (
          <button
            type='button'
            onClick={onLoginClick}
            className='shrink-0 self-start rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-6 py-3 text-sm font-semibold tracking-[0.14em] text-[#1d1403] uppercase'
          >
            {t.signIn}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className='mt-10 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1'>
        {(['sylium', 'skins', 'history'] as const).map((key) => (
          <button
            key={key}
            type='button'
            onClick={() => setTab(key)}
            className={`min-h-10 rounded-full px-5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors ${
              tab === key ? 'bg-linear-to-r from-[#e5c977] to-[#b98a31] text-[#1d1403]' : 'text-white/58 hover:text-white'
            }`}
          >
            {t.tabs[key]}
          </button>
        ))}
      </div>

      {/* Sylium packages */}
      {tab === 'sylium' ? (
        <div className='mt-8'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {packages.map((pkg) => {
              const total = pkg.sylum_base + pkg.sylum_bonus
              return (
                <article
                  key={pkg.id}
                  className='flex flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_16px_54px_rgba(0,0,0,0.18)] transition-colors hover:border-[#d8b45f]/40'
                >
                  <p className='text-sm tracking-[0.2em] text-[#d8b45f] uppercase'>{pkg.name}</p>
                  <h3 className='font-medieval mt-3 text-3xl text-white'>
                    {total.toLocaleString(language === 'es' ? 'es-AR' : 'en-US')}{' '}
                    <span className='text-lg text-[#d8b45f]'>SP</span>
                  </h3>
                  {pkg.sylum_bonus > 0 ? (
                    <p className='mt-1 text-xs tracking-[0.1em] text-emerald-300 uppercase'>
                      +{pkg.sylum_bonus.toLocaleString(language === 'es' ? 'es-AR' : 'en-US')} {t.bonus}
                    </p>
                  ) : (
                    <p className='mt-1 text-xs text-transparent'>.</p>
                  )}
                  <p className='mt-4 text-2xl font-semibold text-[#ead38a]'>{priceLabel(pkg.price_usd, language)}</p>
                  <button
                    type='button'
                    onClick={() => createOrder(pkg.id)}
                    disabled={busyId === pkg.id}
                    className='mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-5 text-xs font-semibold tracking-[0.14em] text-[#1d1403] uppercase transition-transform hover:scale-[1.02] disabled:opacity-60'
                  >
                    {t.buy}
                  </button>
                </article>
              )
            })}
          </div>

          {/* My orders */}
          {isAuthenticated && orders.length > 0 ? (
            <div className='mt-12'>
              <h2 className='font-medieval text-2xl text-white'>{t.myOrders}</h2>
              <div className='mt-4 overflow-hidden rounded-2xl border border-white/10'>
                {orders.map((o, i) => (
                  <div
                    key={o.id}
                    className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm ${
                      i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.04]'
                    }`}
                  >
                    <span className='font-mono text-[#ead38a]'>{o.reference}</span>
                    <span className='text-white/70'>
                      {o.sylumAmount.toLocaleString(language === 'es' ? 'es-AR' : 'en-US')} SP ·{' '}
                      {priceLabel(o.priceUsd, language)}
                    </span>
                    <span className='text-white/44'>{fmtDate(o.createdAt)}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs tracking-[0.1em] uppercase ${
                        o.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : o.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {t.status[o.status] ?? o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Skins */}
      {tab === 'skins' ? (
        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {skins.map((skin) => {
            const rs = rarityStyle[skin.rarity] ?? rarityStyle[1]
            const affordable = !balance || Number(balance.sylumBalance) >= skin.price_sylum
            return (
              <article
                key={skin.id}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white/[0.035] shadow-[0_16px_54px_rgba(0,0,0,0.18)] transition-colors ${rs.ring}`}
              >
                <div className={`relative aspect-square overflow-hidden bg-linear-to-br ${rs.glow} to-[#070c14]`}>
                  {/* Placeholder sits behind; the image covers it if it loads, and
                      falls back to it (onError) if the file is missing. */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className={`font-medieval text-5xl ${rs.text} opacity-30`}>{skin.name.charAt(0)}</span>
                  </div>
                  {skin.image_url ? (
                    <img
                      src={skin.image_url}
                      alt=''
                      className='absolute inset-0 h-full w-full object-cover'
                      loading='lazy'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  <span
                    className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] tracking-[0.12em] uppercase ${rs.label}`}
                  >
                    {skin.rarityName}
                  </span>
                </div>
                <div className='flex flex-1 flex-col p-5'>
                  <h3 className='text-lg font-semibold text-white'>{skin.name}</h3>
                  <p className='mt-2 line-clamp-3 flex-1 text-sm leading-6 text-white/56'>{skin.description}</p>
                  <div className='mt-4 flex items-center justify-between'>
                    <span className={`font-medieval text-2xl ${rs.text}`}>
                      {skin.price_sylum.toLocaleString(language === 'es' ? 'es-AR' : 'en-US')}
                      <span className='ml-1 text-sm text-white/50'>SP</span>
                    </span>
                    <button
                      type='button'
                      onClick={() => buySkin(skin)}
                      disabled={busyId === skin.id || (isAuthenticated && !affordable)}
                      className='inline-flex min-h-10 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] to-[#b98a31] px-5 text-xs font-semibold tracking-[0.14em] text-[#1d1403] uppercase transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {isAuthenticated && !affordable ? t.insufficient : t.buySkin}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
          <p className='col-span-full mt-2 text-center text-xs text-white/40'>{t.delivered}</p>
        </div>
      ) : null}

      {/* History */}
      {tab === 'history' ? (
        <div className='mt-8'>
          {!isAuthenticated ? (
            <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center'>
              <p className='text-white/60'>{t.signInPrompt}</p>
              <button
                type='button'
                onClick={onLoginClick}
                className='mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] to-[#b98a31] px-6 text-xs font-semibold tracking-[0.14em] text-[#1d1403] uppercase'
              >
                {t.signIn}
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/60'>
              {t.noHistory}
            </div>
          ) : (
            <div className='overflow-hidden rounded-2xl border border-white/10'>
              {history.map((h, i) => {
                const positive = !h.amount.startsWith('-')
                return (
                  <div
                    key={h.id}
                    className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm ${
                      i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.04]'
                    }`}
                  >
                    <span className='text-white/82'>{t.op[h.opType] ?? h.opType}</span>
                    <span className='text-white/44'>{fmtDate(h.createdAt)}</span>
                    <span className={positive ? 'text-emerald-300' : 'text-rose-300'}>
                      {positive ? '+' : ''}
                      {Number(h.amount).toLocaleString(language === 'es' ? 'es-AR' : 'en-US')}{' '}
                      {h.currency === 'sylum' ? 'SP' : 'WZ'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* Bank transfer panel */}
      {activeOrder ? (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'
          onClick={() => setActiveOrder(null)}
        >
          <div
            className='w-full max-w-md rounded-2xl border border-[#d8b45f]/30 bg-[#08111f] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]'
            onClick={(e) => e.stopPropagation()}
          >
            <p className='text-xs tracking-[0.16em] text-emerald-300 uppercase'>{t.orderCreated}</p>
            <h3 className='font-medieval mt-2 text-2xl text-white'>{t.payTitle}</h3>

            <div className='mt-5 rounded-xl border border-[#d8b45f]/30 bg-[#d8b45f]/8 p-4'>
              <p className='text-xs tracking-[0.12em] text-white/50 uppercase'>{t.reference}</p>
              <div className='mt-1 flex items-center justify-between gap-3'>
                <span className='font-mono text-2xl font-bold tracking-wider text-[#ead38a]'>{activeOrder.reference}</span>
                <button
                  type='button'
                  onClick={() => copyText('ref', activeOrder.reference)}
                  className='rounded-lg border border-white/12 px-3 py-1 text-xs text-white/70 hover:bg-white/10'
                >
                  {copied === 'ref' ? t.copied : t.copy}
                </button>
              </div>
            </div>

            {activeOrder.payment.cbu || activeOrder.payment.alias ? (
              <dl className='mt-4 space-y-2 text-sm'>
                <Row label={t.amount} value={formatArs(activeOrder.priceUsd)} />
                {activeOrder.payment.holder ? <Row label={t.holder} value={activeOrder.payment.holder} /> : null}
                {activeOrder.payment.bank ? <Row label={t.bank} value={activeOrder.payment.bank} /> : null}
                {activeOrder.payment.cbu ? (
                  <Row
                    label={t.cbu}
                    value={activeOrder.payment.cbu}
                    onCopy={() => copyText('cbu', activeOrder.payment.cbu)}
                    copied={copied === 'cbu' ? t.copied : t.copy}
                  />
                ) : null}
                {activeOrder.payment.alias ? (
                  <Row
                    label={t.alias}
                    value={activeOrder.payment.alias}
                    onCopy={() => copyText('alias', activeOrder.payment.alias)}
                    copied={copied === 'alias' ? t.copied : t.copy}
                  />
                ) : null}
              </dl>
            ) : (
              <p className='mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200'>
                {t.notConfigured}
              </p>
            )}

            <p className='mt-4 text-xs leading-6 text-white/50'>{activeOrder.payment.note || t.payNote}</p>

            <button
              type='button'
              onClick={() => setActiveOrder(null)}
              className='mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm tracking-[0.14em] text-white uppercase hover:bg-white/10'
            >
              {t.close}
            </button>
          </div>
        </div>
      ) : null}

      {/* Toast */}
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

function Row({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string
  value: string
  onCopy?: () => void
  copied?: string
}) {
  return (
    <div className='flex items-center justify-between gap-3 border-b border-white/6 pb-2'>
      <dt className='text-white/50'>{label}</dt>
      <dd className='flex items-center gap-2 text-right font-mono text-white/85'>
        <span className='break-all'>{value}</span>
        {onCopy ? (
          <button type='button' onClick={onCopy} className='rounded border border-white/12 px-2 py-0.5 text-xs text-white/60 hover:bg-white/10'>
            {copied}
          </button>
        ) : null}
      </dd>
    </div>
  )
}
