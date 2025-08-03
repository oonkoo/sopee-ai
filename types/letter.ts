// types/letter.ts
export type LetterType = 'explanation' | 'study_plan' | 'financial'

export interface GeneratedLetter {
  id: string
  userId: string
  profileId: string | null
  letterType: string
  title: string
  content: string
  modelUsed: string | null
  generationTime: number | null
  wordCount: number | null
  createdAt: Date
  feedbackRating: number | null
  isFavorite: boolean
}

export interface LetterPrompts {
  explanation: string
  study_plan: string
  financial: string
}

export interface GenerationRequest {
  letterType: LetterType
  profileId: string
}

export interface GenerationResponse {
  letter: GeneratedLetter
  remainingGenerations: number
}