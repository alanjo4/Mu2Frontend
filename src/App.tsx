import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import background from './assets/background.png'
import { useAuth } from './AuthContext.tsx'
import './App.css'

type Language = 'es' | 'en'
type RoutePath = '/' | '/login' | '/account' | '/buy-sylium' | '/downloads'

type NavKey = 'home' | 'server' | 'downloads' | 'discord'
type AccountKey = 'account' | 'buySylium' | 'logout'
type FeatureKey = 'classic' | 'fair' | 'community'
type DownloadKey = 'client' | 'launcher' | 'support'
type SyliumPackKey = 'starter' | 'adventurer' | 'founder'

const copy = {
  es: {
    serverLabel: 'Mu2 Server',
    heroTitle: 'Mu Sylium',
    heroDescription:
      'Un servidor clasico de Mu Legend / Mu2 pensado para jugar con calma, competir con justicia y crecer junto a una comunidad activa.',
    menuLabel: 'Abrir navegacion',
    login: 'Login',
    playNow: 'JUGAR AHORA',
    downloadClient: 'Descargar cliente',
    accountMenuLabel: 'Abrir menu de cuenta',
    backHome: 'Volver al inicio',
    loginTitle: 'Ingresar a Mu Sylium',
    loginDescription:
      'Accede a tu cuenta para revisar tu panel, gestionar Sylium y preparar el cliente antes de entrar al servidor.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginSubmit: 'Ingresar',
    loginNote: 'Login temporal de frontend: cualquier envio inicia la sesion demo.',
    accountMenu: {
      account: 'Cuenta',
      buySylium: 'Buy Sylium',
      logout: 'Logout',
    },
    sections: {
      home: 'Home',
      server: 'Servidor',
      downloads: 'Descargas',
      discord: 'Discord',
    },
    heroStats: [
      { value: 'No P2W', label: 'Prioridad absoluta' },
      { value: 'Clasico', label: 'Mu Legend / Mu2' },
      { value: 'Comunidad', label: 'Crecimiento constante' },
    ],
    featureTitle: 'La experiencia clasica, cuidada para jugar justo',
    featureDescription:
      'Mu Sylium nace para quienes quieren volver a sentir el progreso real: subir, farmear, comerciar, hacer grupo y competir sin que la tienda decida la partida.',
    features: {
      classic: {
        title: 'Servidor clasico',
        description:
          'Progresion reconocible de Mu Legend / Mu2, con foco en aventura, farmeo, mazmorras y desarrollo del personaje.',
      },
      fair: {
        title: 'Sin pay to win',
        description:
          'La prioridad es evitar ventajas injustas por dinero. La competencia debe sentirse ganada dentro del juego.',
      },
      community: {
        title: 'Comunidad creciente',
        description:
          'Un espacio pensado para sumar jugadores, escuchar feedback y construir un servidor estable con el tiempo.',
      },
    },
    accountTitle: 'Panel de cuenta',
    accountDescription:
      'Desde aca vas a poder revisar tu estado, saldo y accesos principales. Por ahora dejamos la base visual lista para conectar con el backend.',
    accountGuestTitle: 'Inicia sesion para ver tu cuenta',
    accountGuestDescription: 'El panel queda preparado para mostrar datos reales cuando conectemos el sistema de cuentas.',
    accountStats: [
      { label: 'Estado', value: 'Activa' },
      { label: 'Sylium', value: '0' },
      { label: 'Rango', value: 'Jugador' },
    ],
    accountActions: {
      buySylium: 'Comprar Sylium',
      downloads: 'Ir a descargas',
    },
    syliumTitle: 'Buy Sylium',
    syliumDescription:
      'Sylium esta pensado para apoyar el servidor sin vender poder. La tienda debe mantenerse en cosmeticos, servicios de comodidad y beneficios que no rompan la competencia.',
    syliumPolicy: ['Sin items de poder exclusivo', 'Sin ventajas competitivas directas', 'Compras revisadas con criterio no pay to win'],
    syliumPacks: {
      starter: { name: 'Starter', amount: '1.000 Sylium', price: 'USD 5', note: 'Para cosmeticos y pequenos servicios.' },
      adventurer: { name: 'Adventurer', amount: '2.800 Sylium', price: 'USD 12', note: 'Balanceado para apoyar el servidor.' },
      founder: { name: 'Founder', amount: '6.000 Sylium', price: 'USD 25', note: 'Pack de apoyo para la comunidad inicial.' },
    },
    buyDisabled: 'Compra proximamente',
    downloadsTitle: 'Descargas',
    downloadsDescription:
      'La seccion de descargas queda lista para publicar el cliente, el launcher y los recursos de soporte. Los enlaces finales se pueden conectar cuando tengamos los archivos definitivos.',
    downloads: {
      client: {
        title: 'Cliente completo',
        description: 'Instalador principal de Mu Sylium para Windows.',
        meta: 'Recomendado para nuevos jugadores',
        action: 'Descargar cliente',
      },
      launcher: {
        title: 'Launcher / Patcher',
        description: 'Herramienta para actualizar el juego sin descargar todo de nuevo.',
        meta: 'Para futuras actualizaciones',
        action: 'Descargar launcher',
      },
      support: {
        title: 'Soporte de instalacion',
        description: 'Guia rapida para resolver problemas comunes de instalacion.',
        meta: 'Disponible en Discord',
        action: 'Ver soporte',
      },
    },
    requirementsTitle: 'Requisitos sugeridos',
    requirements: ['Windows 10/11', '8 GB de RAM', 'GPU dedicada recomendada', '20 GB libres en disco'],
    discordTitle: 'Unite a la comunidad',
    discordDescription:
      'El Discord es el punto de encuentro para anuncios, soporte, feedback y organizacion de grupos. La comunidad todavia esta creciendo, y ese es el mejor momento para entrar.',
    discordCta: 'Entrar a Discord',
    footerText: 'Mu Sylium es un proyecto de comunidad para jugadores de Mu Legend / Mu2.',
  },
  en: {
    serverLabel: 'Mu2 Server',
    heroTitle: 'Mu Sylium',
    heroDescription:
      'A classic Mu Legend / Mu2 server built for steady progression, fair competition, and a growing community.',
    menuLabel: 'Open navigation',
    login: 'Login',
    playNow: 'PLAY NOW',
    downloadClient: 'Download client',
    accountMenuLabel: 'Open account menu',
    backHome: 'Back home',
    loginTitle: 'Log in to Mu Sylium',
    loginDescription:
      'Access your account to review your panel, manage Sylium, and prepare the client before entering the server.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginSubmit: 'Log in',
    loginNote: 'Temporary frontend login: any submit starts the demo session.',
    accountMenu: {
      account: 'Account',
      buySylium: 'Buy Sylium',
      logout: 'Logout',
    },
    sections: {
      home: 'Home',
      server: 'Server',
      downloads: 'Downloads',
      discord: 'Discord',
    },
    heroStats: [
      { value: 'No P2W', label: 'Top priority' },
      { value: 'Classic', label: 'Mu Legend / Mu2' },
      { value: 'Community', label: 'Growing steadily' },
    ],
    featureTitle: 'The classic experience, tuned for fair play',
    featureDescription:
      'Mu Sylium is for players who want real progression again: leveling, farming, trading, grouping, and competing without the shop deciding the outcome.',
    features: {
      classic: {
        title: 'Classic server',
        description:
          'A recognizable Mu Legend / Mu2 progression path focused on adventure, farming, dungeons, and character growth.',
      },
      fair: {
        title: 'No pay to win',
        description:
          'The priority is avoiding unfair money-based advantages. Competition should feel earned inside the game.',
      },
      community: {
        title: 'Growing community',
        description:
          'A space made to welcome players, listen to feedback, and build a stable server over time.',
      },
    },
    accountTitle: 'Account panel',
    accountDescription:
      'From here you will be able to review your status, balance, and main account actions. The visual base is ready for backend data later.',
    accountGuestTitle: 'Log in to view your account',
    accountGuestDescription: 'The panel is prepared to show real account data once the account system is connected.',
    accountStats: [
      { label: 'Status', value: 'Active' },
      { label: 'Sylium', value: '0' },
      { label: 'Rank', value: 'Player' },
    ],
    accountActions: {
      buySylium: 'Buy Sylium',
      downloads: 'Go to downloads',
    },
    syliumTitle: 'Buy Sylium',
    syliumDescription:
      'Sylium is meant to support the server without selling power. The shop should stay focused on cosmetics, convenience services, and benefits that do not break competition.',
    syliumPolicy: ['No exclusive power items', 'No direct competitive advantages', 'Purchases reviewed with a no pay to win standard'],
    syliumPacks: {
      starter: { name: 'Starter', amount: '1,000 Sylium', price: 'USD 5', note: 'For cosmetics and small services.' },
      adventurer: { name: 'Adventurer', amount: '2,800 Sylium', price: 'USD 12', note: 'Balanced support for the server.' },
      founder: { name: 'Founder', amount: '6,000 Sylium', price: 'USD 25', note: 'Support pack for the early community.' },
    },
    buyDisabled: 'Purchase coming soon',
    downloadsTitle: 'Downloads',
    downloadsDescription:
      'The downloads section is ready for the client, launcher, and support resources. Final links can be connected when the files are available.',
    downloads: {
      client: {
        title: 'Full client',
        description: 'Main Mu Sylium installer for Windows.',
        meta: 'Recommended for new players',
        action: 'Download client',
      },
      launcher: {
        title: 'Launcher / Patcher',
        description: 'Tool to update the game without downloading everything again.',
        meta: 'For future updates',
        action: 'Download launcher',
      },
      support: {
        title: 'Installation support',
        description: 'Quick guide for common installation issues.',
        meta: 'Available on Discord',
        action: 'View support',
      },
    },
    requirementsTitle: 'Suggested requirements',
    requirements: ['Windows 10/11', '8 GB RAM', 'Dedicated GPU recommended', '20 GB free disk space'],
    discordTitle: 'Join the community',
    discordDescription:
      'Discord is the place for announcements, support, feedback, and party organization. The community is still growing, and that is the best time to join.',
    discordCta: 'Join Discord',
    footerText: 'Mu Sylium is a community project for Mu Legend / Mu2 players.',
  },
} satisfies Record<
  Language,
  {
    serverLabel: string
    heroTitle: string
    heroDescription: string
    menuLabel: string
    login: string
    playNow: string
    downloadClient: string
    accountMenuLabel: string
    backHome: string
    loginTitle: string
    loginDescription: string
    emailLabel: string
    passwordLabel: string
    loginSubmit: string
    loginNote: string
    accountMenu: Record<AccountKey, string>
    sections: Record<NavKey, string>
    heroStats: ReadonlyArray<{ value: string; label: string }>
    featureTitle: string
    featureDescription: string
    features: Record<FeatureKey, { title: string; description: string }>
    accountTitle: string
    accountDescription: string
    accountGuestTitle: string
    accountGuestDescription: string
    accountStats: ReadonlyArray<{ label: string; value: string }>
    accountActions: Record<'buySylium' | 'downloads', string>
    syliumTitle: string
    syliumDescription: string
    syliumPolicy: ReadonlyArray<string>
    syliumPacks: Record<SyliumPackKey, { name: string; amount: string; price: string; note: string }>
    buyDisabled: string
    downloadsTitle: string
    downloadsDescription: string
    downloads: Record<DownloadKey, { title: string; description: string; meta: string; action: string }>
    requirementsTitle: string
    requirements: ReadonlyArray<string>
    discordTitle: string
    discordDescription: string
    discordCta: string
    footerText: string
  }
>

const navItems: ReadonlyArray<{ key: NavKey; href: string }> = [
  { key: 'home', href: '/' },
  { key: 'server', href: '/#server' },
  { key: 'downloads', href: '/downloads' },
  { key: 'discord', href: '/#discord' },
]

const featureKeys: ReadonlyArray<FeatureKey> = ['classic', 'fair', 'community']
const downloadKeys: ReadonlyArray<DownloadKey> = ['client', 'launcher', 'support']
const syliumPackKeys: ReadonlyArray<SyliumPackKey> = ['starter', 'adventurer', 'founder']

const accountItems: ReadonlyArray<{ key: AccountKey; href?: string }> = [
  { key: 'account', href: '/account' },
  { key: 'buySylium', href: '/buy-sylium' },
  { key: 'logout' },
]
const routePaths = new Set<RoutePath>(['/', '/login', '/account', '/buy-sylium', '/downloads'])

function getRoutePath(pathname: string): RoutePath {
  return routePaths.has(pathname as RoutePath) ? (pathname as RoutePath) : '/'
}

function App() {
  const { isAuthenticated, user, login, logout } = useAuth()
  const [language, setLanguage] = useState<Language>('es')
  const [route, setRoute] = useState<RoutePath>(() => getRoutePath(window.location.pathname))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const backgroundPositionX = '20%'
  const backgroundPositionY = '20%'
  const t = copy[language]
  const userInitials = user?.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()


  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoutePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const closeMenusOnResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeMenusOnResize)
    return () => window.removeEventListener('resize', closeMenusOnResize)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const navigate = (href: string) => {
    const url = new URL(href, window.location.origin)
    const nextRoute = getRoutePath(url.pathname)

    window.history.pushState({}, '', `${url.pathname}${url.hash}`)
    setRoute(nextRoute)
    setIsMenuOpen(false)
    setIsAccountMenuOpen(false)

    if (nextRoute === '/' && url.hash) {
      window.setTimeout(() => {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 0)
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleInternalLink = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    navigate(href)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    login()
    navigate('/account')
  }
  const navigationBar = (
    <div
      className={`z-30 transition-[background-color,box-shadow] duration-300 ${
        isScrolled
          ? 'fixed inset-x-0 top-0 bg-[#02040a] shadow-[0_10px_40px_rgba(0,0,0,0.28)]'
          : 'fixed inset-x-0 top-0 bg-[#02040a]/88 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl'
      }`}
    >
      <div className='page-shell relative text-white'>
        <div className='page-grid items-center py-4'>
          <div className='col-span-2 md:col-span-6 lg:col-span-12'>
            <div className='relative flex items-center justify-between gap-4'>
              <a
                href='/'
                onClick={(event) => handleInternalLink(event, '/')}
                className='group inline-flex items-center transition-opacity duration-300 hover:opacity-90'
                aria-label='Go to Mu Sylium home'
              >
                <span className='font-medieval bg-linear-to-b from-[#f4edd8] via-[#ded3b6] to-[#c7b184] bg-clip-text text-3xl tracking-[0.04em] text-transparent sm:text-4xl'>
                  Mu Sylium
                </span>
              </a>

              <div className='hidden items-center gap-4 lg:flex'>
                <nav aria-label='Primary navigation'>
                  <ul className='flex items-center gap-5 text-sm tracking-[0.18em] text-white/72 uppercase'>
                    {navItems.map((item) => (
                      <li key={item.key}>
                        <a className='transition-colors duration-200 hover:text-white' href={item.href} onClick={(event) => handleInternalLink(event, item.href)}>
                          {t.sections[item.key]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className='inline-flex rounded-full border border-white/12 bg-white/6 p-1 backdrop-blur-md'>
                  <button
                    type='button'
                    onClick={() => setLanguage('es')}
                    className={`rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase transition-colors ${
                      language === 'es' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    type='button'
                    onClick={() => setLanguage('en')}
                    className={`rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase transition-colors ${
                      language === 'en' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {isAuthenticated ? (
                  <div ref={accountMenuRef} className='relative flex items-center gap-3'>
                    <a
                      href='/downloads'
                      onClick={(event) => handleInternalLink(event, '/downloads')}
                      aria-label={t.playNow}
                      className='inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-3 text-sm font-semibold text-[#1d1403] shadow-[0_10px_30px_rgba(191,143,45,0.3)] transition-transform duration-300 hover:scale-[1.02] min-[1440px]:px-5'
                    >
                      <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1d1403]/12'>
                        <svg aria-hidden='true' viewBox='0 0 24 24' className='h-3.5 w-3.5 fill-current'>
                          <path d='M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.68L9.54 5.98A1 1 0 0 0 8 6.82Z' />
                        </svg>
                      </span>
                      <span className='hidden uppercase tracking-[0.18em] min-[1440px]:inline'>{t.playNow}</span>
                    </a>
                    <button
                      type='button'
                      onClick={() => setIsAccountMenuOpen((open) => !open)}
                      aria-expanded={isAccountMenuOpen}
                      aria-label={t.accountMenuLabel}
                      className='inline-flex min-h-11 items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10'
                    >
                      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs uppercase tracking-[0.12em]'>
                        {userInitials}
                      </span>
                      <span className='text-left leading-tight'>
                        <span className='block text-[11px] uppercase tracking-[0.18em] text-white/50'>Account</span>
                        <span className='block'>{user?.name}</span>
                      </span>
                    </button>

                    <div
                      className={`absolute top-full right-0 mt-3 w-60 rounded-[1.35rem] border border-white/10 bg-[#08111f]/96 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-200 ${
                        isAccountMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                      }`}
                    >
                      <ul className='space-y-1'>
                        {accountItems.map((item) => (
                          <li key={item.key}>
                            {item.key === 'logout' ? (
                              <button
                                type='button'
                                onClick={handleLogout}
                                className='flex w-full items-center rounded-xl px-4 py-3 text-left text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                              >
                                {t.accountMenu[item.key]}
                              </button>
                            ) : (
                              <a
                                href={item.href}
                                onClick={(event) => handleInternalLink(event, item.href ?? '/')}
                                className='flex items-center rounded-xl px-4 py-3 text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                              >
                                {t.accountMenu[item.key]}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-3'>
                    <button
                      type='button'
                      onClick={handleLoginClick}
                      className='inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 text-sm text-white uppercase backdrop-blur-md transition-colors hover:bg-white/10 min-[1440px]:px-5'
                      aria-label={t.login}
                    >
                      <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4 w-4 stroke-current' fill='none'>
                        <path
                          d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 1.79-6 4v1h12v-1c0-2.21-2.69-4-6-4Z'
                          strokeWidth='1.7'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <span className='hidden tracking-[0.18em] min-[1440px]:inline'>{t.login}</span>
                    </button>
                    <a
                      href='/downloads'
                      onClick={(event) => handleInternalLink(event, '/downloads')}
                      aria-label={t.playNow}
                      className='inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-3 text-sm font-semibold text-[#1d1403] shadow-[0_10px_30px_rgba(191,143,45,0.3)] transition-transform duration-300 hover:scale-[1.02] min-[1440px]:px-5'
                    >
                      <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1d1403]/12'>
                        <svg aria-hidden='true' viewBox='0 0 24 24' className='h-3.5 w-3.5 fill-current'>
                          <path d='M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.68L9.54 5.98A1 1 0 0 0 8 6.82Z' />
                        </svg>
                      </span>
                      <span className='hidden uppercase tracking-[0.18em] min-[1440px]:inline'>{t.playNow}</span>
                    </a>
                  </div>
                )}
              </div>

              <div className='flex items-center gap-2 lg:hidden'>
                <div className='inline-flex rounded-full border border-white/12 bg-white/6 p-1 backdrop-blur-md'>
                  <button
                    type='button'
                    onClick={() => setLanguage('es')}
                    className={`rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                      language === 'es' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    type='button'
                    onClick={() => setLanguage('en')}
                    className={`rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                      language === 'en' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  type='button'
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-expanded={isMenuOpen}
                  aria-controls='mobile-nav'
                  aria-label={t.menuLabel}
                  className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-md transition-colors hover:bg-white/10'
                >
                  <span className='flex w-4 flex-col gap-1.5'>
                    <span className='h-px w-full bg-current' />
                    <span className='h-px w-full bg-current' />
                    <span className='h-px w-full bg-current' />
                  </span>
                </button>
              </div>

              <div
                id='mobile-nav'
                className={`absolute top-full right-0 left-0 mt-3 origin-top transition-all duration-300 lg:hidden ${
                  isMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
              >
                <div className='rounded-[1.5rem] border border-white/10 bg-[#08111f]/92 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl'>
                  <nav aria-label='Mobile navigation'>
                    <ul className='grid grid-cols-2 gap-3 text-sm tracking-[0.16em] text-white/82 uppercase'>
                      {navItems.map((item) => (
                        <li key={item.key}>
                          <a
                            className='flex min-h-12 items-center rounded-xl border border-white/8 bg-white/[0.03] px-4 transition-colors hover:bg-white/[0.08]'
                            href={item.href}
                            onClick={(event) => handleInternalLink(event, item.href)}
                          >
                            {t.sections[item.key]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className='mt-4 border-t border-white/8 pt-4'>
                    {isAuthenticated ? (
                      <div className='rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-2'>
                        <div className='px-3 py-2 text-sm text-white/58'>{user?.email}</div>
                        <ul className='space-y-1'>
                          {accountItems.map((item) => (
                            <li key={item.key}>
                              {item.key === 'logout' ? (
                                <button
                                  type='button'
                                  onClick={handleLogout}
                                  className='flex w-full items-center rounded-xl px-3 py-3 text-left text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                                >
                                  {t.accountMenu[item.key]}
                                </button>
                              ) : (
                                <a
                                  href={item.href}
                                  onClick={(event) => handleInternalLink(event, item.href ?? '/')}
                                  className='flex items-center rounded-xl px-3 py-3 text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                                >
                                  {t.accountMenu[item.key]}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <button
                        type='button'
                        onClick={handleLoginClick}
                        className='inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm tracking-[0.18em] text-white uppercase backdrop-blur-md transition-colors hover:bg-white/10'
                      >
                        {t.login}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const siteFooter = (
    <footer className='border-t border-white/8 py-8'>
      <div className='page-shell flex flex-col gap-3 text-sm text-white/48 md:flex-row md:items-center md:justify-between'>
        <p>{t.footerText}</p>
        <p className='font-medieval text-xl text-white/68'>Mu Sylium</p>
      </div>
    </footer>
  )
  if (route === '/login') {
    return (
      <main className='min-h-screen bg-[#02040a] text-white'>
        {navigationBar}
        <section className='page-shell flex min-h-screen items-center pt-28 pb-16'>
          <div className='page-grid w-full items-center gap-y-10'>
            <div className='col-span-2 md:col-span-6 lg:col-span-5'>
              <a
                href='/'
                onClick={(event) => handleInternalLink(event, '/')}
                className='font-medieval bg-linear-to-b from-[#f4edd8] via-[#ded3b6] to-[#c7b184] bg-clip-text text-4xl text-transparent'
              >
                Mu Sylium
              </a>
              <h1 className='font-medieval mt-8 text-5xl leading-tight'>{t.loginTitle}</h1>
              <p className='mt-5 text-base leading-8 text-white/70'>{t.loginDescription}</p>
              <a
                href='/'
                onClick={(event) => handleInternalLink(event, '/')}
                className='mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm tracking-[0.14em] text-white uppercase transition-colors hover:bg-white/10'
              >
                {t.backHome}
              </a>
            </div>

            <div className='col-span-2 md:col-span-6 lg:col-span-5 lg:col-start-8'>
              <form onSubmit={handleLoginSubmit} className='border border-white/10 bg-[#08111f]/88 p-6 shadow-[0_24px_74px_rgba(0,0,0,0.32)]'>
                <label className='block text-xs tracking-[0.18em] text-white/52 uppercase' htmlFor='email'>
                  {t.emailLabel}
                </label>
                <input
                  id='email'
                  type='email'
                  defaultValue={user?.email ?? 'aegon@musylium.com'}
                  className='mt-3 h-12 w-full border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition-colors focus:border-[#d8b45f]/60'
                />

                <label className='mt-5 block text-xs tracking-[0.18em] text-white/52 uppercase' htmlFor='password'>
                  {t.passwordLabel}
                </label>
                <input
                  id='password'
                  type='password'
                  defaultValue='demo1234'
                  className='mt-3 h-12 w-full border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition-colors focus:border-[#d8b45f]/60'
                />

                <button
                  type='submit'
                  className='mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-6 text-sm font-semibold tracking-[0.14em] text-[#1d1403] uppercase'
                >
                  {t.loginSubmit}
                </button>
                <p className='mt-4 text-xs leading-6 text-white/48'>{t.loginNote}</p>
              </form>
            </div>
          </div>
        </section>
        {siteFooter}
    </main>
    )
  }

  if (route === '/account') {
    return (
      <main className='min-h-screen bg-[#02040a] text-white'>
        {navigationBar}
        <section className='page-shell pt-28 pb-16 md:pt-32 md:pb-24'>
          <a href='/' onClick={(event) => handleInternalLink(event, '/')} className='font-medieval text-3xl text-[#ead38a]'>
            Mu Sylium
          </a>
          <div className='page-grid mt-12 items-center gap-y-8'>
            <div className='col-span-2 md:col-span-6 lg:col-span-5'>
              <p className='text-sm tracking-[0.26em] text-[#d8b45f] uppercase'>{t.accountMenu.account}</p>
              <h1 className='font-medieval mt-4 text-4xl leading-tight md:text-5xl'>
                {isAuthenticated ? t.accountTitle : t.accountGuestTitle}
              </h1>
              <p className='mt-5 text-base leading-8 text-white/70'>
                {isAuthenticated ? t.accountDescription : t.accountGuestDescription}
              </p>
            </div>

            <div className='col-span-2 md:col-span-6 lg:col-span-6 lg:col-start-7'>
              {isAuthenticated ? (
                <div className='border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_64px_rgba(0,0,0,0.24)]'>
                  <div className='flex flex-col gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='font-medieval text-3xl text-[#ead38a]'>{user?.name}</p>
                      <p className='mt-1 text-sm text-white/56'>{user?.email}</p>
                    </div>
                    <span className='inline-flex w-fit rounded-full border border-[#d8b45f]/40 px-4 py-2 text-xs tracking-[0.16em] text-[#ead38a] uppercase'>
                      Mu Sylium ID
                    </span>
                  </div>

                  <div className='mt-6 grid gap-3 sm:grid-cols-3'>
                    {t.accountStats.map((stat) => (
                      <div key={stat.label} className='bg-[#08111f]/70 p-4'>
                        <p className='text-xs tracking-[0.16em] text-white/46 uppercase'>{stat.label}</p>
                        <p className='mt-2 text-xl font-semibold'>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
                    <a href='/buy-sylium' onClick={(event) => handleInternalLink(event, '/buy-sylium')} className='inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-5 text-sm font-semibold tracking-[0.14em] text-[#1d1403] uppercase'>
                      {t.accountActions.buySylium}
                    </a>
                    <a href='/downloads' onClick={(event) => handleInternalLink(event, '/downloads')} className='inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm tracking-[0.14em] text-white uppercase transition-colors hover:bg-white/10'>
                      {t.accountActions.downloads}
                    </a>
                  </div>
                </div>
              ) : (
                <button type='button' onClick={handleLoginClick} className='inline-flex min-h-12 w-full items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-6 text-sm font-semibold tracking-[0.14em] text-[#1d1403] uppercase'>
                  {t.login}
                </button>
              )}
            </div>
          </div>
        </section>
        {siteFooter}
    </main>
    )
  }

  if (route === '/buy-sylium') {
    return (
      <main className='min-h-screen bg-[#02040a] text-white'>
        {navigationBar}
        <section className='page-shell pt-28 pb-16 md:pt-32 md:pb-24'>
          <a href='/' onClick={(event) => handleInternalLink(event, '/')} className='font-medieval text-3xl text-[#ead38a]'>
            Mu Sylium
          </a>
          <div className='page-grid mt-12 gap-y-10'>
            <div className='col-span-2 md:col-span-6 lg:col-span-5'>
              <p className='text-sm tracking-[0.26em] text-[#d8b45f] uppercase'>{t.accountMenu.buySylium}</p>
              <h1 className='font-medieval mt-4 text-4xl leading-tight md:text-5xl'>{t.syliumTitle}</h1>
              <p className='mt-5 text-base leading-8 text-white/70'>{t.syliumDescription}</p>
              {!isAuthenticated ? (
                <button type='button' onClick={handleLoginClick} className='mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-6 text-sm font-semibold tracking-[0.14em] text-[#1d1403] uppercase'>
                  {t.login}
                </button>
              ) : null}
            </div>

            <div className='col-span-2 md:col-span-6 lg:col-span-6 lg:col-start-7'>
              <div className='border border-[#d8b45f]/24 bg-[#d8b45f]/8 p-6'>
                <ul className='space-y-4'>
                  {t.syliumPolicy.map((item) => (
                    <li key={item} className='flex items-center gap-3 text-sm text-white/78'>
                      <span className='h-2 w-2 shrink-0 rounded-full bg-[#d8b45f]' />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='col-span-2 grid gap-4 md:col-span-6 md:grid-cols-3 lg:col-span-12'>
              {syliumPackKeys.map((key) => {
                const pack = t.syliumPacks[key]

                return (
                  <article key={key} className='border border-white/10 bg-white/[0.035] p-6 shadow-[0_16px_54px_rgba(0,0,0,0.18)]'>
                    <p className='text-sm tracking-[0.2em] text-[#d8b45f] uppercase'>{pack.name}</p>
                    <h3 className='font-medieval mt-4 text-3xl'>{pack.amount}</h3>
                    <p className='mt-2 text-xl font-semibold text-[#ead38a]'>{pack.price}</p>
                    <p className='mt-4 min-h-14 text-sm leading-7 text-white/64'>{pack.note}</p>
                    <button type='button' disabled className='mt-6 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-xs tracking-[0.14em] text-white/42 uppercase'>
                      {t.buyDisabled}
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
        {siteFooter}
    </main>
    )
  }

  if (route === '/downloads') {
    return (
      <main className='min-h-screen bg-[#02040a] text-white'>
        {navigationBar}
        <section className='page-shell pt-28 pb-16 md:pt-32 md:pb-24'>
          <a href='/' onClick={(event) => handleInternalLink(event, '/')} className='font-medieval text-3xl text-[#ead38a]'>
            Mu Sylium
          </a>
          <div className='page-grid mt-12 gap-y-10'>
            <div className='col-span-2 md:col-span-6 lg:col-span-5'>
              <p className='text-sm tracking-[0.26em] text-[#d8b45f] uppercase'>{t.sections.downloads}</p>
              <h1 className='font-medieval mt-4 text-4xl leading-tight md:text-5xl'>{t.downloadsTitle}</h1>
              <p className='mt-5 max-w-2xl text-base leading-8 text-white/70'>{t.downloadsDescription}</p>
            </div>

            <div className='col-span-2 md:col-span-6 lg:col-span-6 lg:col-start-7'>
              <div className='grid gap-4'>
                {downloadKeys.map((key) => {
                  const download = t.downloads[key]

                  return (
                    <article key={key} className='border border-white/10 bg-[#0b1323]/86 p-5 shadow-[0_18px_56px_rgba(0,0,0,0.2)]'>
                      <p className='text-xs tracking-[0.16em] text-[#d8b45f] uppercase'>{download.meta}</p>
                      <h3 className='mt-2 text-xl font-semibold'>{download.title}</h3>
                      <p className='mt-2 text-sm leading-6 text-white/62'>{download.description}</p>
                      <a href={key === 'support' ? '/#discord' : '/downloads'} onClick={(event) => handleInternalLink(event, key === 'support' ? '/#discord' : '/downloads')} className='mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-xs tracking-[0.14em] text-white uppercase transition-colors hover:bg-white/10'>
                        {download.action}
                      </a>
                    </article>
                  )
                })}
              </div>
            </div>

            <div className='col-span-2 md:col-span-6 lg:col-span-12'>
              <div className='grid gap-3 border border-white/10 bg-white/[0.025] p-5 sm:grid-cols-2 lg:grid-cols-5'>
                <p className='font-medieval text-2xl text-[#ead38a]'>{t.requirementsTitle}</p>
                {t.requirements.map((item) => (
                  <p key={item} className='border-l border-white/10 pl-4 text-sm text-white/66'>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
        {siteFooter}
    </main>
    )
  }
  return (
    <main id='home' className='min-h-screen overflow-hidden bg-[#02040a] text-white'>
      <header className='relative min-h-[640px] w-full md:min-h-[680px]'>
        <div className='absolute inset-0 overflow-hidden'>
          <img
            className='absolute inset-0 h-full w-full scale-[1.01] object-cover opacity-50'
            style={{ objectPosition: `${backgroundPositionX} ${backgroundPositionY}` }}
            src={background}
            alt=''
          />

          <div
            className='absolute inset-0'
            style={{
              background: `
                radial-gradient(circle at 50% 18%, rgba(2, 4, 10, 0.02) 0%, rgba(2, 4, 10, 0.18) 34%, rgba(2, 4, 10, 0.52) 62%, rgba(2, 4, 10, 0.78) 78%),
                linear-gradient(to bottom, rgba(2, 4, 10, 0.08) 0%, rgba(2, 4, 10, 0.22) 42%, rgba(2, 4, 10, 0.66) 72%, rgba(2, 4, 10, 0.94) 88%, rgba(2, 4, 10, 1) 100%)
              `,
            }}
          />
        </div>

        <div
          className={`z-30 transition-[background-color,box-shadow] duration-300 ${
            isScrolled
              ? 'fixed inset-x-0 top-0 bg-[#02040a] shadow-[0_10px_40px_rgba(0,0,0,0.28)]'
              : 'absolute inset-x-0 top-0 bg-transparent'
          }`}
        >
          <div className='page-shell relative text-white'>
            <div className='page-grid items-center py-4'>
              <div className='col-span-2 md:col-span-6 lg:col-span-12'>
                <div className='relative flex items-center justify-between gap-4'>
                  <a
                    href='/'
                    onClick={(event) => handleInternalLink(event, '/')}
                    className='group inline-flex items-center transition-opacity duration-300 hover:opacity-90'
                    aria-label='Go to Mu Sylium home'
                  >
                    <span className='font-medieval bg-linear-to-b from-[#f4edd8] via-[#ded3b6] to-[#c7b184] bg-clip-text text-3xl tracking-[0.04em] text-transparent sm:text-4xl'>
                      Mu Sylium
                    </span>
                  </a>

                  <div className='hidden items-center gap-4 lg:flex'>
                    <nav aria-label='Primary navigation'>
                      <ul className='flex items-center gap-5 text-sm tracking-[0.18em] text-white/72 uppercase'>
                        {navItems.map((item) => (
                          <li key={item.key}>
                            <a className='transition-colors duration-200 hover:text-white' href={item.href} onClick={(event) => handleInternalLink(event, item.href)}>
                              {t.sections[item.key]}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <div className='inline-flex rounded-full border border-white/12 bg-white/6 p-1 backdrop-blur-md'>
                      <button
                        type='button'
                        onClick={() => setLanguage('es')}
                        className={`rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase transition-colors ${
                          language === 'es' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                        }`}
                      >
                        ES
                      </button>
                      <button
                        type='button'
                        onClick={() => setLanguage('en')}
                        className={`rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase transition-colors ${
                          language === 'en' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                        }`}
                      >
                        EN
                      </button>
                    </div>

                    {isAuthenticated ? (
                      <div ref={accountMenuRef} className='relative flex items-center gap-3'>
                        <a
                          href='/downloads' onClick={(event) => handleInternalLink(event, '/downloads')}
                          aria-label={t.playNow}
                          className='inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-3 text-sm font-semibold text-[#1d1403] shadow-[0_10px_30px_rgba(191,143,45,0.3)] transition-transform duration-300 hover:scale-[1.02] min-[1440px]:px-5'
                        >
                          <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1d1403]/12'>
                            <svg aria-hidden='true' viewBox='0 0 24 24' className='h-3.5 w-3.5 fill-current'>
                              <path d='M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.68L9.54 5.98A1 1 0 0 0 8 6.82Z' />
                            </svg>
                          </span>
                          <span className='hidden uppercase tracking-[0.18em] min-[1440px]:inline'>
                            {t.playNow}
                          </span>
                        </a>
                        <button
                          type='button'
                          onClick={() => setIsAccountMenuOpen((open) => !open)}
                          aria-expanded={isAccountMenuOpen}
                          aria-label={t.accountMenuLabel}
                          className='inline-flex min-h-11 items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10'
                        >
                          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs uppercase tracking-[0.12em]'>
                            {userInitials}
                          </span>
                          <span className='text-left leading-tight'>
                            <span className='block text-[11px] uppercase tracking-[0.18em] text-white/50'>
                              Account
                            </span>
                            <span className='block'>{user?.name}</span>
                          </span>
                        </button>

                        <div
                          className={`absolute top-full right-0 mt-3 w-60 rounded-[1.35rem] border border-white/10 bg-[#08111f]/96 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-200 ${
                            isAccountMenuOpen
                              ? 'pointer-events-auto translate-y-0 opacity-100'
                              : 'pointer-events-none -translate-y-2 opacity-0'
                          }`}
                        >
                          <ul className='space-y-1'>
                            {accountItems.map((item) => (
                              <li key={item.key}>
                                {item.key === 'logout' ? (
                                  <button
                                    type='button'
                                    onClick={handleLogout}
                                    className='flex w-full items-center rounded-xl px-4 py-3 text-left text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                                  >
                                    {t.accountMenu[item.key]}
                                  </button>
                                ) : (
                                  <a
                                    href={item.href}
                                    onClick={(event) => handleInternalLink(event, item.href ?? '/')}
                                    className='flex items-center rounded-xl px-4 py-3 text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                                  >
                                    {t.accountMenu[item.key]}
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3'>
                        <button
                          type='button'
                          onClick={handleLoginClick}
                          className='inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 text-sm text-white uppercase backdrop-blur-md transition-colors hover:bg-white/10 min-[1440px]:px-5'
                          aria-label={t.login}
                        >
                          <svg aria-hidden='true' viewBox='0 0 24 24' className='h-4 w-4 stroke-current' fill='none'>
                            <path
                              d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 1.79-6 4v1h12v-1c0-2.21-2.69-4-6-4Z'
                              strokeWidth='1.7'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <span className='hidden tracking-[0.18em] min-[1440px]:inline'>{t.login}</span>
                        </button>
                        <a
                          href='/downloads' onClick={(event) => handleInternalLink(event, '/downloads')}
                          aria-label={t.playNow}
                          className='inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-3 text-sm font-semibold text-[#1d1403] shadow-[0_10px_30px_rgba(191,143,45,0.3)] transition-transform duration-300 hover:scale-[1.02] min-[1440px]:px-5'
                        >
                          <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1d1403]/12'>
                            <svg aria-hidden='true' viewBox='0 0 24 24' className='h-3.5 w-3.5 fill-current'>
                              <path d='M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.68L9.54 5.98A1 1 0 0 0 8 6.82Z' />
                            </svg>
                          </span>
                          <span className='hidden uppercase tracking-[0.18em] min-[1440px]:inline'>
                            {t.playNow}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className='flex items-center gap-2 lg:hidden'>
                    <div className='inline-flex rounded-full border border-white/12 bg-white/6 p-1 backdrop-blur-md'>
                      <button
                        type='button'
                        onClick={() => setLanguage('es')}
                        className={`rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                          language === 'es' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                        }`}
                      >
                        ES
                      </button>
                      <button
                        type='button'
                        onClick={() => setLanguage('en')}
                        className={`rounded-full px-3 py-1 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                          language === 'en' ? 'bg-white/14 text-white' : 'text-white/58 hover:text-white'
                        }`}
                      >
                        EN
                      </button>
                    </div>

                    <button
                      type='button'
                      onClick={() => setIsMenuOpen((open) => !open)}
                      aria-expanded={isMenuOpen}
                      aria-controls='mobile-nav'
                      aria-label={t.menuLabel}
                      className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-md transition-colors hover:bg-white/10'
                    >
                      <span className='flex w-4 flex-col gap-1.5'>
                        <span className='h-px w-full bg-current' />
                        <span className='h-px w-full bg-current' />
                        <span className='h-px w-full bg-current' />
                      </span>
                    </button>
                  </div>

                  <div
                    id='mobile-nav'
                    className={`absolute top-full right-0 left-0 mt-3 origin-top transition-all duration-300 lg:hidden ${
                      isMenuOpen
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                  >
                    <div className='rounded-[1.5rem] border border-white/10 bg-[#08111f]/92 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl'>
                      <nav aria-label='Mobile navigation'>
                        <ul className='grid grid-cols-2 gap-3 text-sm tracking-[0.16em] text-white/82 uppercase'>
                          {navItems.map((item) => (
                            <li key={item.key}>
                              <a
                                className='flex min-h-12 items-center rounded-xl border border-white/8 bg-white/[0.03] px-4 transition-colors hover:bg-white/[0.08]'
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {t.sections[item.key]}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      <div className='mt-4 border-t border-white/8 pt-4'>
                        {isAuthenticated ? (
                          <div className='rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-2'>
                            <div className='px-3 py-2 text-sm text-white/58'>{user?.email}</div>
                            <ul className='space-y-1'>
                              {accountItems.map((item) => (
                                <li key={item.key}>
                                  {item.key === 'logout' ? (
                                    <button
                                      type='button'
                                      onClick={handleLogout}
                                      className='flex w-full items-center rounded-xl px-3 py-3 text-left text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                                    >
                                      {t.accountMenu[item.key]}
                                    </button>
                                  ) : (
                                    <a
                                      href={item.href}
                                      onClick={(event) => handleInternalLink(event, item.href ?? '/')}
                                      className='flex items-center rounded-xl px-3 py-3 text-sm text-white/82 transition-colors hover:bg-white/[0.08]'
                                    >
                                      {t.accountMenu[item.key]}
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <button
                            type='button'
                            onClick={handleLoginClick}
                            className='inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm tracking-[0.18em] text-white uppercase backdrop-blur-md transition-colors hover:bg-white/10'
                          >
                            {t.login}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='page-shell relative z-10 flex min-h-[640px] items-center pt-[92px] text-white md:min-h-[680px] md:pt-[104px]'>
          <div className='page-grid w-full items-end gap-y-10'>
            <div className='col-span-2 max-w-3xl md:col-span-5 lg:col-span-6'>
              <p className='text-sm tracking-[0.35em] text-white/70 uppercase'>{t.serverLabel}</p>
              <h1 className='font-medieval mt-4 text-5xl leading-tight text-white sm:text-6xl md:text-7xl'>
                {t.heroTitle}
              </h1>
              <p className='mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg'>{t.heroDescription}</p>
              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <a
                  href='/downloads' onClick={(event) => handleInternalLink(event, '/downloads')}
                  className='inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-r from-[#e5c977] via-[#f1db95] to-[#b98a31] px-6 text-sm font-semibold tracking-[0.14em] text-[#1d1403] uppercase shadow-[0_14px_36px_rgba(191,143,45,0.28)] transition-transform duration-300 hover:scale-[1.02]'
                >
                  {t.downloadClient}
                </a>
                <a
                  href='/#discord' onClick={(event) => handleInternalLink(event, '/#discord')}
                  className='inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/8 px-6 text-sm tracking-[0.14em] text-white uppercase backdrop-blur-md transition-colors hover:bg-white/12'
                >
                  {t.discordCta}
                </a>
              </div>
            </div>

            <div className='col-span-2 md:col-span-6 lg:col-span-5 lg:col-start-8'>
              <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
                {t.heroStats.map((stat) => (
                  <div key={`${stat.value}-${stat.label}`} className='border-l border-[#d8b45f]/50 bg-white/[0.035] px-5 py-4 backdrop-blur-sm'>
                    <p className='font-medieval text-2xl text-[#ead38a]'>{stat.value}</p>
                    <p className='mt-1 text-xs tracking-[0.16em] text-white/58 uppercase'>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id='server' className='page-shell w-full py-16 md:py-24'>
        <div className='page-grid gap-y-10'>
          <div className='col-span-2 md:col-span-6 lg:col-span-5'>
            <p className='text-sm tracking-[0.26em] text-[#d8b45f] uppercase'>{t.sections.server}</p>
            <h2 className='font-medieval mt-4 text-4xl leading-tight text-white md:text-5xl'>{t.featureTitle}</h2>
          </div>
          <div className='col-span-2 md:col-span-6 lg:col-span-6 lg:col-start-7'>
            <p className='text-base leading-8 text-white/72'>{t.featureDescription}</p>
          </div>

          <div className='col-span-2 grid gap-4 md:col-span-6 md:grid-cols-3 lg:col-span-12'>
            {featureKeys.map((key) => (
              <article key={key} className='min-h-56 border border-white/10 bg-white/[0.035] p-6 shadow-[0_16px_54px_rgba(0,0,0,0.18)]'>
                <span className='font-medieval text-3xl text-[#d8b45f]'>0{featureKeys.indexOf(key) + 1}</span>
                <h3 className='mt-6 text-xl font-semibold text-white'>{t.features[key].title}</h3>
                <p className='mt-4 text-sm leading-7 text-white/66'>{t.features[key].description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* <section id='news' className='page-shell w-full py-16'>
        <div className='page-grid'>
          <div className='col-span-2 min-h-[20vh] md:col-span-6 lg:col-span-12' />
        </div>
      </section>

      <section id='events' className='page-shell w-full py-16'>
        <div className='page-grid'>
          <div className='col-span-2 min-h-[20vh] md:col-span-6 lg:col-span-12' />
        </div>
      </section>

      <section id='ranking' className='page-shell w-full py-16'>
        <div className='page-grid'>
          <div className='col-span-2 min-h-[20vh] md:col-span-6 lg:col-span-12' />
        </div>
      </section> */}

      <section id='discord' className='page-shell w-full py-16 md:py-24'>
        <div className='page-grid items-center gap-y-8'>
          <div className='col-span-2 md:col-span-6 lg:col-span-7'>
            <p className='text-sm tracking-[0.26em] text-[#d8b45f] uppercase'>{t.sections.discord}</p>
            <h2 className='font-medieval mt-4 text-4xl leading-tight text-white md:text-5xl'>{t.discordTitle}</h2>
            <p className='mt-5 max-w-3xl text-base leading-8 text-white/70'>{t.discordDescription}</p>
          </div>
          <div className='col-span-2 md:col-span-6 lg:col-span-4 lg:col-start-9'>
            <a
              href='https://discord.gg/'
              target='_blank'
              rel='noreferrer'
              className='inline-flex min-h-14 w-full items-center justify-center rounded-full border border-[#d8b45f]/46 bg-[#d8b45f]/10 px-6 text-sm font-semibold tracking-[0.14em] text-[#f1db95] uppercase transition-colors hover:bg-[#d8b45f]/16'
            >
              {t.discordCta}
            </a>
          </div>
        </div>
      </section>

      {siteFooter}
    </main>
  )
}

export default App











