// Exchange rate USD → ARS for shop pricing. Change here if the rate moves.
export const USD_TO_ARS = 1450

type Language = 'es' | 'en'

export function toNumber(v: number | string): number {
  return typeof v === 'number' ? v : Number(v)
}

/** Amount in ARS pesos that must actually be transferred to the CBU. */
export function arsAmount(usd: number | string): number {
  return Math.round(toNumber(usd) * USD_TO_ARS)
}

export function formatUsd(usd: number | string): string {
  return `$${toNumber(usd).toFixed(2)} USD`
}

export function formatArs(usd: number | string): string {
  return `$${arsAmount(usd).toLocaleString('es-AR')} ARS`
}

/** Price shown on catalog cards — pesos in Spanish, dollars in English. */
export function priceLabel(usd: number | string, language: Language): string {
  return language === 'es' ? formatArs(usd) : formatUsd(usd)
}
