export type Sentiment = 'positive' | 'neutral' | 'negative'
export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type ComplaintCategory =
  | 'rudeness'
  | 'queue'
  | 'out_of_stock'
  | 'price'
  | 'expiry'
  | 'consultation'
  | 'cleanliness'
  | 'speed'
  | 'delivery'
  | 'app'
  | 'return'
  | 'subscription'
  | 'phone'
  | 'schedule'
  | 'other'

export interface Branch {
  id: string
  name: string
  address: string
  city: string
  district?: string
  rating: number
  reviewCount: number
  negativeCount: number
  answeredCount: number
  unansweredCount: number
  healthScore: number
  ratingTrend: number // delta vs prev month
  topIssue?: string
  status: 'good' | 'warning' | 'critical' | 'crisis'
  lat?: number
  lng?: number
  phone?: string
  hours?: string
  lastReviewAt?: string
}

export interface Review {
  id: string
  branchId: string
  branchName: string
  branchAddress: string
  authorName: string
  authorInitials: string
  rating: number
  text: string
  sentiment: Sentiment
  severity: Severity
  categories: ComplaintCategory[]
  hasReply: boolean
  replyText?: string
  publishedAt: string
  source: '2gis' | 'google' | 'yandex'
  aiRiskScore: number // 0-100
}

export interface Competitor {
  id: string
  name: string
  rating: number
  reviewCount: number
  delta: number // vs SADYKHAN
  topStrength: string
  topWeakness: string
}

export interface AlertItem {
  id: string
  type: 'crisis' | 'warning' | 'info' | 'success'
  title: string
  description: string
  branchId?: string
  branchName?: string
  createdAt: string
  isRead: boolean
}

export interface DashboardMetrics {
  avgRating: number
  avgRatingDelta: number
  totalReviews: number
  totalReviewsDelta: number
  negativeCount: number
  negativePercent: number
  unansweredCount: number
  avgResponseHours: number
  healthScore: number
  healthScoreDelta: number
  answeredPercent: number
  activeComplaints: number
}

export interface RatingHistory {
  month: string
  rating: number
  reviews: number
  negative: number
}

export interface ComplaintStat {
  category: ComplaintCategory
  label: string
  count: number
  percent: number
}
