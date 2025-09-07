// types/profile.ts
import { Prisma } from '@prisma/client'

export interface PersonalInfo {
  fullName: string
  dateOfBirth: string
  nationality: string
  country: string
  phoneNumber: string
  address: string
  passportNumber?: string
}

export interface ParentsDetails {
  fatherName: string
  motherName: string
  fatherOccupation: string
  motherOccupation: string
  fatherStatus: 'alive' | 'deceased'
  pensionDetails: string
}

export interface BusinessOwnership {
  hasBusinessOwnership: boolean
  businessName: string
  businessType: string
  ownershipRole: string
  incomeFromBusiness: string
}

export interface TravelingCompanion {
  hasTravelingCompanion: boolean
  companionName: string
  relationship: string
  sameProgram: boolean
  separateVisa: boolean
}

export interface StrongFamilyBonds {
  bondDescription: string
  familySupport: string
  familyExpectations: string
  communicationFrequency: string
}

export interface AcademicBackground {
  highestEducation: string
  institution: string
  graduationYear: string
  gpa: string
  fieldOfStudy: string
  hasGaps: boolean
  gapExplanation?: string

  // Additional academic details from SOPs
  oLevelGrades?: string // From Mahira's data
  aLevelGrades?: string // From Mahira's data
  additionalCertifications?: string // From Rajia's SOP (JAVA, Graphic Design, etc.)
}

export interface TargetProgram {
  university: string
  program: string
  degree: string
  country: string
  startDate: string
  duration: string
  
  // Enhanced program details from SOPs
  programStructure?: {
    isPackageProgram: boolean // From Mahira's "PKG" program
    foundationProgram?: string // "Standard Foundation Program"
    diplomaProgram?: string // "Diploma of Commerce"
    bachelorProgram?: string // "Bachelor of Economics"
  }
  tuitionFees?: {
    amount: string
    currency: string // "AU$ 28,400" from Mahira
    duration: string // "per annum"
  }
  livingCosts?: {
    estimatedAmount: string // "AU$ 29,710" from Mahira
    currency: string
  }
  admissionRequirements?: string
  courseFocus?: string // "core business principles, economic theories" from Mahira
}

export interface FinancialInfo {
  totalCost: string
  fundingSource: string
  sponsorName?: string
  bankBalance: string
  currency: string
}

// New enhanced profile interfaces
export interface FamilyBackground {
  parentsOccupation: string
  familyIncome: string
  siblings: number
  familyBusiness?: string
  familySupport: string
  
  // Enhanced family details from SOPs
  parentsDetails: {
    fatherName?: string
    motherName?: string
    fatherOccupation?: string
    motherOccupation?: string
    fatherStatus?: 'alive' | 'deceased' // From Rajia's SOP
    pensionDetails?: string // From Rajia's SOP
  }
  propertyOwnership: boolean // From both SOPs
  businessOwnership?: string // "Bismillah Pipe and Sanitary" from Rajia
  familyFinancialStatus: string
}

export interface WorkExperience {
  hasWorkExperience: boolean
  jobs: {
    title: string
    company: string
    duration: string
    responsibilities: string
    location?: string
    isRemote?: boolean
  }[]
  internships: {
    title: string
    company: string
    duration: string
    learnings: string
  }[]
  
  // Freelancing and remote work (from Rajia's SOP)
  freelancingExperience?: {
    hasFreelancing: boolean
    type?: string // "Graphic Designer and virtual assistance"
    clients?: string // "Australian company"
    duration?: string // "Feb 2019 to present"
    recognition?: string // "top performing employee"
  }
}

export interface ExtracurricularActivities {
  leadership: string[]
  volunteering: string[]
  sports: string[]
  achievements: string[]
  hobbies: string[]
}

export interface LanguageProficiency {
  nativeLanguage: string
  englishProficiency: {
    testType: 'IELTS' | 'TOEFL' | 'Other'
    score: string
    testDate: string
  }
  otherLanguages: string[]
  
  // Additional language skills from Rajia's SOP
  additionalLanguageTests?: {
    hasAdditional: boolean
    testName?: string // "Japanese Language NAT-Test"
    level?: string
    completionDate?: string
  }
}

export interface HomeCountryTies {
  propertyOwnership: boolean
  businessInterests: string
  familyObligations: string
  communityConnections: string
  returnReasons: string
  
  // Enhanced ties from SOPs
  strongFamilyBonds: string // "very strong bond" from both SOPs
  financialObligations?: string // "obligations to parents-in-law" from Rajia
  housingArrangements?: string // "won't have to pay additional lodging costs" from Rajia
  domesticSupport?: string // "house workers and assistance" from Rajia
}

export interface FutureCareerPlans {
  immediateGoals: string
  longTermGoals: string
  howDegreeHelps: string
  contributionToHomeCountry: string
  returnPlans: string
  
  // Enhanced career planning from SOPs
  entrepreneurialPlans?: {
    hasPlans: boolean
    businessType?: string // "consulting business" from Rajia
    industry?: string
    timeline?: string
  }
  salaryExpectations?: {
    withAustralianDegree?: string // "AUD 1,000 per month" from Mahira
    withLocalDegree?: string // "AUD 300" from Mahira
  }
  homeCountryOpportunities?: {
    marketAnalysis?: string // Bangladesh GDP growth data from Rajia
    industryGrowth?: string
    specificCompanies?: string[] // IT companies list from Rajia
  }
}

export interface CountryUniversityMotivation {
  text: any
  whyThisCountry: string
  whyThisUniversity: string
  specificPrograms: string
  researchInterests: string
  facultyOfInterest: string
  
  // Enhanced motivation from SOPs
  countryAdvantages?: {
    educationQuality?: string
    globalExposure?: string
    researchExcellence?: string
    lifestyle?: string
    climate?: string
    safety?: string // "top 5 safest" from Rajia
    studentCity?: string // "top 10 best student cities" from Rajia
  }
  universityRanking?: string // "590th globally in QS Rankings" from Rajia
  universitySpecialties?: string[] // "industry links, inclusion, applied learning" from Rajia
  supportServices?: string
  scholarshipOpportunities?: string
  accommodationPlans?: string // "College Rooms" from Rajia
}

export interface PreviousVisaHistory {
  hasTravelHistory: boolean
  countriesVisited: string[]
  previousVisaApplications: {
    country: string
    purpose: string
    status: 'approved' | 'rejected'
    date: string
  }[]
  currentVisaStatus: string
  
  // Family in target country
  familyInTargetCountry?: {
    hasFamily: boolean
    relationship?: string[]
    location?: string
  }
}

export interface SponsorshipDetails {
  hasSponsor: boolean
  sponsorName?: string
  sponsorRelation?: string
  sponsorOccupation?: string
  sponsorIncome?: string
  sponsorCommitment?: string
  
  // Enhanced sponsorship from SOPs
  familyFinancialSupport?: {
    parentsSupport: boolean
    propertyIncome?: boolean // "rent from their properties" from Mahira
    businessIncome?: boolean
    pensionIncome?: boolean // From Rajia's SOP
  }
  estimatedTotalFunding?: {
    amount: string
    currency: string
    breakdown: string
  }
}

export interface StudentProfile {
  id: string
  userId: string
  country: 'CANADA' | 'AUSTRALIA'
  personalInfo: PersonalInfo
  academicBackground: AcademicBackground
  targetProgram: TargetProgram
  financialInfo?: FinancialInfo
  profileCompleteness: number
  
  // Enhanced fields (existing)
  familyBackground?: FamilyBackground
  workExperience?: WorkExperience
  extracurricularActivities?: ExtracurricularActivities
  languageProficiency?: LanguageProficiency
  homeCountryTies?: HomeCountryTies
  futureCareerPlans?: FutureCareerPlans
  whyThisCountry?: CountryUniversityMotivation
  whyThisUniversity?: CountryUniversityMotivation
  previousVisaHistory?: PreviousVisaHistory
  sponsorshipDetails?: SponsorshipDetails
  maritalStatus?: MaritalStatus
  
  // Add the new comprehensive fields
  passportNumber?: string
  parentsDetails?: ParentsDetails
  propertyOwnership?: boolean
  businessOwnership?: BusinessOwnership
  travelingCompanion?: TravelingCompanion
  strongFamilyBonds?: StrongFamilyBonds
  programStructure?: any
  tuitionAndCosts?: any
  entrepreneurialPlans?: any
  countryAdvantages?: any
  universityRanking?: any
  accommodationPlans?: any
  additionalCertifications?: any
  freelancingExperience?: any
  salaryExpectations?: any
  homeCountryOpportunities?: any
  
  // Missing fields from components
  returnPlans?: any
  additionalLanguageTests?: any
  familyInTargetCountry?: any
  additionalInfo?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface MaritalStatus {
  status: 'single' | 'married' | 'divorced' | 'widowed'
  hasSpouse: boolean
  spouseDetails?: {
    name: string
    occupation: string
    education: string
    company?: string // "UY systems Ltd" from Rajia
    willAccompany: boolean
    currentLocation: string
    supportForStudies: string
    isOnlySon?: boolean // From Rajia's SOP
    inheritanceDetails?: string // From Rajia's SOP
  }
  hasChildren: boolean
  childrenDetails?: {
    count: number
    ages: number[]
    willAccompany: boolean
    careArrangements: string
  }
  dependents: {
    hasDependents: boolean
    relationship: string[]
    careArrangements: string
  }
  
  // Sibling traveling together (from Mahira's data)
  travelingWithFamily?: {
    hasTravelingCompanion: boolean
    companionName?: string
    relationship?: string // "twin sister"
    sameProgram?: boolean
  }
}

export type StudentProfileWithJsonFields = {
  id: string
  userId: string
  country: 'CANADA' | 'AUSTRALIA'
  personalInfo: Prisma.JsonValue
  academicBackground: Prisma.JsonValue
  targetProgram: Prisma.JsonValue
  financialInfo: Prisma.JsonValue | null
  profileCompleteness: number
  familyBackground: Prisma.JsonValue | null
  workExperience: Prisma.JsonValue | null
  extracurricularActivities: Prisma.JsonValue | null
  languageProficiency: Prisma.JsonValue | null
  homeCountryTies: Prisma.JsonValue | null
  futureCareerPlans: Prisma.JsonValue | null
  whyThisCountry: Prisma.JsonValue | null
  whyThisUniversity: Prisma.JsonValue | null
  previousVisaHistory: Prisma.JsonValue | null
  sponsorshipDetails: Prisma.JsonValue | null
  maritalStatus: Prisma.JsonValue | null
  
  // Add new fields
  passportNumber: string | null
  parentsDetails: Prisma.JsonValue | null
  propertyOwnership: boolean | null
  businessOwnership: Prisma.JsonValue | null
  travelingCompanion: Prisma.JsonValue | null
  strongFamilyBonds: Prisma.JsonValue | null
  programStructure: Prisma.JsonValue | null
  tuitionAndCosts: Prisma.JsonValue | null
  entrepreneurialPlans: Prisma.JsonValue | null
  countryAdvantages: Prisma.JsonValue | null
  universityRanking: Prisma.JsonValue | null
  accommodationPlans: Prisma.JsonValue | null
  additionalCertifications: Prisma.JsonValue | null
  freelancingExperience: Prisma.JsonValue | null
  salaryExpectations: Prisma.JsonValue | null
  homeCountryOpportunities: Prisma.JsonValue | null
  
  createdAt: Date
  updatedAt: Date
}