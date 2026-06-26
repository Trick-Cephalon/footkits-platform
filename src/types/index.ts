export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | '2' | '4' | '6' | '8' | '10' | '12' | '14'
export type Gender = 'masculino' | 'feminino' | 'infantil'
export type SleeveType = 'curta' | 'longa'
export type FontStyle = 'standard' | 'block' | 'collegiate' | 'retro' | 'modern' | 'slim'

export interface Team {
  id: string
  name: string
  shortName: string
  country: string
  league: string
  continent: 'brasil' | 'europa' | 'america-sul' | 'selecoes'
  logoUrl: string
  colors: {
    primary: string
    secondary: string
    accent?: string
  }
  founded?: number
}

export interface KitModel {
  id: string
  teamId: string
  season: string
  type: 'home' | 'away' | 'third' | 'goalkeeper' | 'special'
  name: string
  description: string
  previewFront: string
  previewBack: string
  previewLeft: string
  previewRight: string
  basePrice: number
  availableSizes: Size[]
  availableGenders: Gender[]
  availableSleeves: SleeveType[]
  patches: Patch[]
  championships: Championship[]
  sponsorSlots: SponsorSlot[]
}

export interface Patch {
  id: string
  name: string
  imageUrl: string
  position: 'chest-left' | 'chest-right' | 'sleeve-left' | 'sleeve-right' | 'back-neck'
  required?: boolean
  price: number
}

export interface Championship {
  id: string
  name: string
  logoUrl: string
  year?: string
  price: number
}

export interface SponsorSlot {
  id: string
  position: 'front-main' | 'front-secondary' | 'back-main' | 'sleeve'
  available: boolean
  price: number
}

export interface PersonalizationConfig {
  name: string
  number: string
  font: FontStyle
  nameColor: string
  numberColor: string
  nameBorderColor?: string
  numberBorderColor?: string
  nameSize: number
  numberSize: number
  selectedPatches: string[]
  selectedChampionships: string[]
  isCaptain: boolean
  selectedSponsors: string[]
}

export interface CartItem {
  id: string
  kitModel: KitModel
  team: Team
  gender: Gender
  sleeve: SleeveType
  size: Size
  personalization: PersonalizationConfig
  quantity: number
  unitPrice: number
  totalPrice: number
  mockupUrl?: string
  addedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  status: OrderStatus
  totalPrice: number
  shippingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  mockupFiles: MockupFile[]
  technicalFiles: TechnicalFile[]
  createdAt: Date
  updatedAt: Date
  estimatedDelivery: Date
  trackingCode?: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'

export type PaymentMethod = 'stripe' | 'mercado_pago' | 'pix' | 'apple_pay' | 'google_pay'

export interface Address {
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface MockupFile {
  id: string
  type: 'front' | 'back' | 'left' | 'right'
  url: string
  format: 'png' | 'jpg'
  width: number
  height: number
}

export interface TechnicalFile {
  id: string
  type: 'pdf' | 'svg' | 'png' | 'ai'
  url: string
  description: string
  measurements: PrintMeasurements
}

export interface PrintMeasurements {
  namePosition: { x: number; y: number }
  nameSize: { width: number; height: number }
  numberPosition: { x: number; y: number }
  numberSize: { width: number; height: number }
  printArea: { width: number; height: number }
  bleed: number
  margins: { top: number; right: number; bottom: number; left: number }
  unit: 'mm'
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'customer' | 'admin' | 'operator'
  createdAt: Date
  orders: Order[]
  favorites: string[]
}

export interface AdminDashboard {
  totalOrders: number
  pendingOrders: number
  revenue: number
  newCustomers: number
  conversionRate: number
  topTeams: { team: Team; count: number }[]
  recentOrders: Order[]
}
