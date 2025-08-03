// types/profile.ts
import { Prisma } from '@prisma/client'

export interface PersonalInfo {
  fullName: string
  dateOfBirth: string
  nationality: string
  country: string
  phoneNumber: string
  address: string
}

export interface AcademicBackground {
  highestEducation: string
  institution: string
  graduationYear: string
  gpa: string
  fieldOfStudy: string
  hasGaps: boolean
  gapExplanation?: string
}

export interface TargetProgram {
  university: string
  program: string
  degree: string
  country: string
  startDate: string
  duration: string
}

export interface FinancialInfo {
  totalCost: string
  fundingSource: string
  sponsorName?: string
  bankBalance: string
  currency: string
}

export interface StudentProfile {
  id: string
  userId: string
  personalInfo: PersonalInfo
  academicBackground: AcademicBackground
  targetProgram: TargetProgram
  financialInfo?: FinancialInfo
  createdAt: Date
  updatedAt: Date
}

export type StudentProfileWithJsonFields = {
  id: string
  userId: string
  personalInfo: Prisma.JsonValue
  academicBackground: Prisma.JsonValue
  targetProgram: Prisma.JsonValue
  financialInfo: Prisma.JsonValue | null
  createdAt: Date
  updatedAt: Date
}