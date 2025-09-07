// types/auth.ts
export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  createdAt: Date
  updatedAt: Date
  subscriptionType: string
  lettersGenerated: number
  lettersLimit: number
  kindeOrgId?: string | null
  
  // New fields for country-specific flow
  targetCountry?: 'CANADA' | 'AUSTRALIA' | null
  onboardingStatus: 'COUNTRY_SELECTION' | 'PROFILE_CREATION' | 'COMPLETED'
  onboardingStep: number
}

export interface AuthUser {
  id: string
  email: string
  given_name?: string
  family_name?: string
  picture?: string
}

export interface AuthSession {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}