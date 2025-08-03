// lib/validations/profile.ts
import { z } from 'zod'

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  country: z.string().min(2, 'Current country is required'),
  phoneNumber: z.string().min(8, 'Valid phone number is required'),
  address: z.string().min(10, 'Address must be at least 10 characters')
})

export const academicBackgroundSchema = z.object({
  highestEducation: z.string().min(1, 'Education level is required'),
  institution: z.string().min(2, 'Institution name is required'),
  graduationYear: z.string().regex(/^\d{4}$/, 'Valid graduation year is required'),
  gpa: z.string().min(1, 'GPA/Percentage is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  hasGaps: z.boolean(),
  gapExplanation: z.string().optional()
}).refine((data) => {
  if (data.hasGaps && (!data.gapExplanation || data.gapExplanation.trim().length < 10)) {
    return false
  }
  return true
}, {
  message: "Gap explanation must be at least 10 characters when gaps exist",
  path: ["gapExplanation"]
})

export const targetProgramSchema = z.object({
  university: z.string().min(2, 'University name is required'),
  program: z.string().min(2, 'Program name is required'),
  degree: z.string().min(1, 'Degree level is required'),
  country: z.string().min(1, 'Study country is required'),
  startDate: z.string().min(1, 'Program start date is required'),
  duration: z.string().min(1, 'Program duration is required')
})

export const financialInfoSchema = z.object({
  totalCost: z.string().min(1, 'Total program cost is required'),
  currency: z.string().min(1, 'Currency is required'),
  fundingSource: z.string().min(1, 'Funding source is required'),
  sponsorName: z.string().optional(),
  bankBalance: z.string().min(1, 'Available funds amount is required')
}).refine((data) => {
  if (data.fundingSource === 'Family Sponsorship' && (!data.sponsorName || data.sponsorName.trim().length < 2)) {
    return false
  }
  return true
}, {
  message: "Sponsor name is required when funding source is Family Sponsorship",
  path: ["sponsorName"]
})

export const completeProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  academicBackground: academicBackgroundSchema,
  targetProgram: targetProgramSchema,
  financialInfo: financialInfoSchema.optional()
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type AcademicBackgroundFormData = z.infer<typeof academicBackgroundSchema>
export type TargetProgramFormData = z.infer<typeof targetProgramSchema>
export type FinancialInfoFormData = z.infer<typeof financialInfoSchema>