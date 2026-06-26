import type { Team } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fk_token') : null
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body?.message ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Mapper: backend → frontend Team shape ────────────────────────────────────

interface BackendTeam {
  id: string
  name: string
  shortName: string
  country: string
  league: string
  continent: string
  primaryColor: string
  secondaryColor: string
  accentColor?: string
  logoUrl?: string
  founded?: number
  _count?: { kitModels: number }
}

function toTeam(t: BackendTeam): Team {
  return {
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    country: t.country,
    league: t.league,
    continent: t.continent as Team['continent'],
    logoUrl: t.logoUrl ?? '',
    colors: {
      primary: t.primaryColor,
      secondary: t.secondaryColor,
      accent: t.accentColor,
    },
    founded: t.founded,
  }
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export interface TeamsResponse {
  data: Team[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export async function fetchTeams(params?: {
  continent?: string
  country?: string
  search?: string
  page?: number
  limit?: number
}): Promise<TeamsResponse> {
  const qs = new URLSearchParams()
  if (params?.continent) qs.set('continent', params.continent)
  if (params?.country) qs.set('country', params.country)
  if (params?.search) qs.set('search', params.search)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))

  const raw = await request<{ data: BackendTeam[]; meta: TeamsResponse['meta'] }>(
    `/products/teams${qs.toString() ? `?${qs}` : ''}`
  )
  return { data: raw.data.map(toTeam), meta: raw.meta }
}

export async function fetchTeam(id: string): Promise<Team> {
  const raw = await request<BackendTeam>(`/products/teams/${id}`)
  return toTeam(raw)
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export async function authRegister(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) })
}

export async function authLogin(data: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) })
}

export async function authMe(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me')
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(payload: unknown) {
  return request('/orders', { method: 'POST', body: JSON.stringify(payload) })
}

export async function fetchMyOrders(page = 1) {
  return request(`/orders/my?page=${page}`)
}

export async function fetchMyOrder(id: string) {
  return request(`/orders/my/${id}`)
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function createPaymentIntent(data: { amount: number; currency?: string; paymentMethod: string }) {
  return request<{ clientSecret: string; paymentIntentId: string }>('/payments/intent', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
