// lib/services/profileService.ts
import { prisma } from '@/lib/prisma'
import type { 
  PersonalInfo, 
  AcademicBackground, 
  TargetProgram, 
  FinancialInfo, 
  StudentProfile,
  FamilyBackground,
  WorkExperience,
  ExtracurricularActivities,
  LanguageProficiency,
  HomeCountryTies,
  FutureCareerPlans,
  CountryUniversityMotivation,
  PreviousVisaHistory,
  SponsorshipDetails,
  MaritalStatus,
  ParentsDetails,
  BusinessOwnership,
  TravelingCompanion,
  StrongFamilyBonds
} from '@/types/profile'
import { Prisma } from '@prisma/client'

interface ProfileUpdateData {
  personalInfo?: PersonalInfo
  academicBackground?: AcademicBackground
  targetProgram?: TargetProgram
  financialInfo?: FinancialInfo
  familyBackground?: FamilyBackground
  workExperience?: WorkExperience
  extracurricularActivities?: ExtracurricularActivities
  languageProficiency?: LanguageProficiency
  homeCountryTies?: HomeCountryTies
  futureCareerPlans?: FutureCareerPlans
  whyThisCountry?: CountryUniversityMotivation
  whyThisUniversity?: string | CountryUniversityMotivation
  previousVisaHistory?: PreviousVisaHistory
  sponsorshipDetails?: SponsorshipDetails
  maritalStatus?: MaritalStatus
  // New comprehensive fields
  passportNumber?: string
  parentsDetails?: ParentsDetails
  propertyOwnership?: boolean
  businessOwnership?: BusinessOwnership
  travelingCompanion?: TravelingCompanion
  strongFamilyBonds?: StrongFamilyBonds
  
  // Missing fields from components - these are what's causing the 50% issue
  programStructure?: { isPackageProgram: boolean; foundationProgram?: string; diplomaProgram?: string; bachelorProgram?: string }
  tuitionAndCosts?: { tuitionFees: { amount: string; currency: string; duration: string }; livingCosts: { estimatedAmount: string; currency: string }; totalEstimatedCost: string }
  countryAdvantages?: string | CountryUniversityMotivation
  universityRanking?: { rank: string; reputation: string }
  accommodationPlans?: { type: string; estimatedCost: string }
  additionalCertifications?: string[]
  freelancingExperience?: { hasFreelancing: boolean; projects: string[]; skills: string[] }
  salaryExpectations?: { immediateGoals: { salary: string; currency: string }; longTermGoals: { salary: string; currency: string } }
  homeCountryOpportunities?: string
  entrepreneurialPlans?: string
  returnPlans?: string
  additionalLanguageTests?: { testType: string; score: string; testDate: string }[]
  familyInTargetCountry?: { hasFamily: boolean; relationship: string[]; location: string }
  additionalInfo?: string
}

interface ProfileCreateData extends ProfileUpdateData {
  personalInfo: PersonalInfo
  academicBackground: AcademicBackground
  targetProgram: TargetProgram
  country: 'CANADA' | 'AUSTRALIA'
}

export class ProfileService {
  private static parseJsonField<T>(jsonValue: Prisma.JsonValue): T | null {
    if (!jsonValue || jsonValue === null) return null
    try {
      return jsonValue as unknown as T
    } catch {
      return null
    }
  }

  static async getUserProfile(userId: string, country?: 'CANADA' | 'AUSTRALIA'): Promise<StudentProfile | null> {
    const whereClause = country 
      ? { userId, country } 
      : { userId }

    const profile = await prisma.studentProfile.findFirst({
      where: whereClause,
      orderBy: { updatedAt: 'desc' }
    })

    if (!profile) return null

    // Parse all JSON fields
    const personalInfo = this.parseJsonField<PersonalInfo>(profile.personalInfo)
    const academicBackground = this.parseJsonField<AcademicBackground>(profile.academicBackground)
    const targetProgram = this.parseJsonField<TargetProgram>(profile.targetProgram)
    const financialInfo = profile.financialInfo ? this.parseJsonField<FinancialInfo>(profile.financialInfo) : null

    if (!personalInfo || !academicBackground || !targetProgram) {
      throw new Error('Invalid profile data')
    }

    // Force recalculation of profile completeness to fix any incorrect values
    const profileData = {
      personalInfo,
      academicBackground,
      targetProgram,
      financialInfo: profile.financialInfo ? this.parseJsonField<FinancialInfo>(profile.financialInfo) || undefined : undefined,
      familyBackground: this.parseJsonField<FamilyBackground>(profile.familyBackground) || undefined,
      workExperience: this.parseJsonField<WorkExperience>(profile.workExperience) || undefined,
      extracurricularActivities: this.parseJsonField<ExtracurricularActivities>(profile.extracurricularActivities) || undefined,
      languageProficiency: this.parseJsonField<LanguageProficiency>(profile.languageProficiency) || undefined,
      homeCountryTies: this.parseJsonField<HomeCountryTies>(profile.homeCountryTies) || undefined,
      futureCareerPlans: this.parseJsonField<FutureCareerPlans>(profile.futureCareerPlans) || undefined,
      whyThisCountry: this.parseJsonField<CountryUniversityMotivation>(profile.whyThisCountry) || undefined,
      whyThisUniversity: this.parseJsonField<CountryUniversityMotivation>(profile.whyThisUniversity) || undefined,
      previousVisaHistory: this.parseJsonField<PreviousVisaHistory>(profile.previousVisaHistory) || undefined,
      sponsorshipDetails: this.parseJsonField<SponsorshipDetails>(profile.sponsorshipDetails) || undefined,
      maritalStatus: this.parseJsonField<MaritalStatus>(profile.maritalStatus) || undefined,
      passportNumber: profile.passportNumber || undefined,
      parentsDetails: this.parseJsonField<ParentsDetails>(profile.parentsDetails) || undefined,
      propertyOwnership: profile.propertyOwnership || undefined,
      businessOwnership: this.parseJsonField<BusinessOwnership>(profile.businessOwnership) || undefined,
      travelingCompanion: this.parseJsonField<TravelingCompanion>(profile.travelingCompanion) || undefined,
      strongFamilyBonds: this.parseJsonField<StrongFamilyBonds>(profile.strongFamilyBonds) || undefined,
      programStructure: this.parseJsonField<{ isPackageProgram: boolean; foundationProgram?: string; diplomaProgram?: string; bachelorProgram?: string }>(profile.programStructure) || undefined,
      tuitionAndCosts: this.parseJsonField<{ tuitionFees: { amount: string; currency: string; duration: string }; livingCosts: { estimatedAmount: string; currency: string }; totalEstimatedCost: string }>(profile.tuitionAndCosts) || undefined,
      countryAdvantages: this.parseJsonField<string | CountryUniversityMotivation>(profile.countryAdvantages) || undefined,
      universityRanking: this.parseJsonField<{ rank: string; reputation: string }>(profile.universityRanking) || undefined,
      accommodationPlans: this.parseJsonField<{ type: string; estimatedCost: string }>(profile.accommodationPlans) || undefined,
      additionalCertifications: this.parseJsonField<string[]>(profile.additionalCertifications) || undefined,
      freelancingExperience: this.parseJsonField<{ hasFreelancing: boolean; projects: string[]; skills: string[] }>(profile.freelancingExperience) || undefined,
      salaryExpectations: this.parseJsonField<{ immediateGoals: { salary: string; currency: string }; longTermGoals: { salary: string; currency: string } }>(profile.salaryExpectations) || undefined,
      homeCountryOpportunities: this.parseJsonField<string>(profile.homeCountryOpportunities) || undefined,
      entrepreneurialPlans: this.parseJsonField<string>(profile.entrepreneurialPlans) || undefined,
      returnPlans: this.parseJsonField<string>(profile.returnPlans) || undefined,
      additionalLanguageTests: this.parseJsonField<{ testType: string; score: string; testDate: string }[]>(profile.additionalLanguageTests) || undefined,
      familyInTargetCountry: this.parseJsonField<{ hasFamily: boolean; relationship: string[]; location: string }>(profile.familyInTargetCountry) || undefined,
      additionalInfo: profile.additionalInfo || undefined
    }
    
    const correctedCompleteness = this.calculateProfileCompleteness(profileData)
    
    // Update the database with correct completeness if it's different
    if (Math.abs(correctedCompleteness - profile.profileCompleteness) > 0.1) {
      await prisma.studentProfile.update({
        where: { id: profile.id },
        data: { profileCompleteness: correctedCompleteness }
      })
    }

    return {
      id: profile.id,
      userId: profile.userId,
      country: profile.country as 'CANADA' | 'AUSTRALIA',
      personalInfo,
      academicBackground,
      targetProgram,
      financialInfo: financialInfo || undefined,
      profileCompleteness: correctedCompleteness,
      familyBackground: this.parseJsonField<FamilyBackground>(profile.familyBackground) || undefined,
      workExperience: this.parseJsonField<WorkExperience>(profile.workExperience) || undefined,
      extracurricularActivities: this.parseJsonField<ExtracurricularActivities>(profile.extracurricularActivities) || undefined,
      languageProficiency: this.parseJsonField<LanguageProficiency>(profile.languageProficiency) || undefined,
      homeCountryTies: this.parseJsonField<HomeCountryTies>(profile.homeCountryTies) || undefined,
      futureCareerPlans: this.parseJsonField<FutureCareerPlans>(profile.futureCareerPlans) || undefined,
      whyThisCountry: this.parseJsonField<CountryUniversityMotivation>(profile.whyThisCountry) || undefined,
      whyThisUniversity: this.parseJsonField<CountryUniversityMotivation>(profile.whyThisUniversity) || undefined,
      countryAdvantages: this.parseJsonField<string | CountryUniversityMotivation>(profile.countryAdvantages) || undefined,
      previousVisaHistory: this.parseJsonField<PreviousVisaHistory>(profile.previousVisaHistory) || undefined,
      sponsorshipDetails: this.parseJsonField<SponsorshipDetails>(profile.sponsorshipDetails) || undefined,
      maritalStatus: this.parseJsonField<MaritalStatus>(profile.maritalStatus) || undefined,
      // New comprehensive fields
      passportNumber: profile.passportNumber || undefined,
      parentsDetails: this.parseJsonField<ParentsDetails>(profile.parentsDetails) || undefined,
      propertyOwnership: profile.propertyOwnership || undefined,
      businessOwnership: this.parseJsonField<BusinessOwnership>(profile.businessOwnership) || undefined,
      travelingCompanion: this.parseJsonField<TravelingCompanion>(profile.travelingCompanion) || undefined,
      strongFamilyBonds: this.parseJsonField<StrongFamilyBonds>(profile.strongFamilyBonds) || undefined,
      
      // Additional missing fields from schema
      programStructure: this.parseJsonField<{ isPackageProgram: boolean; foundationProgram?: string; diplomaProgram?: string; bachelorProgram?: string }>(profile.programStructure) || undefined,
      tuitionAndCosts: this.parseJsonField<{ tuitionFees: { amount: string; currency: string; duration: string }; livingCosts: { estimatedAmount: string; currency: string }; totalEstimatedCost: string }>(profile.tuitionAndCosts) || undefined,
      universityRanking: this.parseJsonField<{ rank: string; reputation: string }>(profile.universityRanking) || undefined,
      accommodationPlans: this.parseJsonField<{ type: string; estimatedCost: string }>(profile.accommodationPlans) || undefined,
      additionalCertifications: this.parseJsonField<string[]>(profile.additionalCertifications) || undefined,
      freelancingExperience: this.parseJsonField<{ hasFreelancing: boolean; projects: string[]; skills: string[] }>(profile.freelancingExperience) || undefined,
      salaryExpectations: this.parseJsonField<{ immediateGoals: { salary: string; currency: string }; longTermGoals: { salary: string; currency: string } }>(profile.salaryExpectations) || undefined,
      homeCountryOpportunities: this.parseJsonField<string>(profile.homeCountryOpportunities) || undefined,
      entrepreneurialPlans: this.parseJsonField<string>(profile.entrepreneurialPlans) || undefined,
      returnPlans: this.parseJsonField<string>(profile.returnPlans) || undefined,
      additionalLanguageTests: this.parseJsonField<{ testType: string; score: string; testDate: string }[]>(profile.additionalLanguageTests) || undefined,
      familyInTargetCountry: this.parseJsonField<{ hasFamily: boolean; relationship: string[]; location: string }>(profile.familyInTargetCountry) || undefined,
      additionalInfo: profile.additionalInfo || undefined,
      
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    }
  }

  static calculateProfileCompleteness(data: ProfileUpdateData): number {
    // Simplified weight system for realistic 100% completion
    const weights = {
      // Core essential fields (60 points - must have for basic SOP)
      personalInfo: 20,           // Essential - name, nationality, etc.
      academicBackground: 20,     // Essential - education history  
      targetProgram: 20,          // Essential - university and program details
      
      // High-importance fields (30 points - significantly improve SOP quality)
      familyBackground: 10,       // Important for ties (parents, family business)
      futureCareerPlans: 10,      // Important for genuine intent
      financialInfo: 10,          // Important for visa approval
      
      // Medium-importance fields (10 points - good to have)
      workExperience: 2.5,
      homeCountryTies: 2.5,
      parentsDetails: 2.5,        // Critical - found in all approved SOPs
      passportNumber: 2.5,        // Required for applications
      
      // Optional enhancement fields (split remaining weight evenly)
      languageProficiency: 1,
      whyThisCountry: 1,
      whyThisUniversity: 1,
      countryAdvantages: 1,
      maritalStatus: 1,
      programStructure: 1,
      extracurricularActivities: 1,
      previousVisaHistory: 1,
      sponsorshipDetails: 1,
      travelingCompanion: 1,
      strongFamilyBonds: 1,
      tuitionAndCosts: 1,
      homeCountryOpportunities: 1,
      entrepreneurialPlans: 1,
      universityRanking: 1,
      accommodationPlans: 1,
      additionalCertifications: 1,
      freelancingExperience: 1,
      returnPlans: 1,
      additionalLanguageTests: 1,
      familyInTargetCountry: 1,
      additionalInfo: 1,
      salaryExpectations: 1,
      propertyOwnership: 1,
      businessOwnership: 1
    }

    let totalScore = 0
    
    // Calculate the actual maximum possible score from weights
    const maxScore = Object.values(weights).reduce((sum, weight) => sum + weight, 0)

    Object.entries(weights).forEach(([field, weight]) => {
      const fieldData = data[field as keyof ProfileUpdateData]
      let hasContent = false
      
      if (fieldData !== undefined && fieldData !== null) {
        // Check if it's a meaningful value (not empty)
        if (typeof fieldData === 'boolean') {
          hasContent = true // Any boolean value (true/false) counts as content
        } else if (typeof fieldData === 'string') {
          hasContent = fieldData.trim().length > 0
        } else if (typeof fieldData === 'object') {
          // For objects, check if they have meaningful content
          hasContent = this.checkObjectHasContent(fieldData)
        } else {
          hasContent = true
        }
      }
      
      if (hasContent) {
        totalScore += weight
      }
    })

    // Calculate percentage and cap at 100%
    const percentage = (totalScore / maxScore) * 100
    return Math.min(Math.round(percentage), 100)
  }
  
  // Helper function to check if an object has meaningful content
  static checkObjectHasContent(obj: unknown): boolean {
    if (!obj || typeof obj !== 'object') return false
    
    // Special handling for text wrapper objects
    if ('text' in obj && typeof (obj as { text: unknown }).text === 'string') {
      return (obj as { text: string }).text.trim().length > 0
    }
    
    // Check if object has any non-empty string values
    const hasNonEmptyStrings = Object.values(obj).some(value => {
      if (typeof value === 'string') {
        return value.trim().length > 0
      }
      if (typeof value === 'boolean') {
        return true
      }
      if (typeof value === 'object' && value !== null) {
        return this.checkObjectHasContent(value)
      }
      return value !== undefined && value !== null
    })
    
    return hasNonEmptyStrings
  }

  // NEW: Create initial profile with minimal required data
  static async createInitialProfile(userId: string, country: 'CANADA' | 'AUSTRALIA', personalInfo: PersonalInfo) {
    // Create minimal required data for academic background and target program
    const minimalAcademicBackground: AcademicBackground = {
      highestEducation: '',
      institution: '',
      graduationYear: '',
      gpa: '',
      fieldOfStudy: '',
      hasGaps: false
    }

    const minimalTargetProgram: TargetProgram = {
      university: '',
      program: '',
      degree: '',
      country: country,
      startDate: '',
      duration: ''
    }

    const completeness = this.calculateProfileCompleteness({ personalInfo })

    const profile = await prisma.studentProfile.create({
      data: {
        userId,
        country,
        profileCompleteness: completeness,
        personalInfo: personalInfo as unknown as Prisma.InputJsonValue,
        academicBackground: minimalAcademicBackground as unknown as Prisma.InputJsonValue,
        targetProgram: minimalTargetProgram as unknown as Prisma.InputJsonValue,
        passportNumber: null,
        propertyOwnership: false
      }
    })

    return this.getUserProfile(profile.userId, country)
  }

  static async createProfile(userId: string, data: ProfileCreateData) {
    const completeness = this.calculateProfileCompleteness(data)

    const profile = await prisma.studentProfile.create({
      data: {
        userId,
        country: data.country,
        profileCompleteness: completeness,
        personalInfo: data.personalInfo as unknown as Prisma.InputJsonValue,
        academicBackground: data.academicBackground as unknown as Prisma.InputJsonValue,
        targetProgram: data.targetProgram as unknown as Prisma.InputJsonValue,
        financialInfo: data.financialInfo ? (data.financialInfo as unknown as Prisma.InputJsonValue) : undefined,
        familyBackground: data.familyBackground ? (data.familyBackground as unknown as Prisma.InputJsonValue) : undefined,
        workExperience: data.workExperience ? (data.workExperience as unknown as Prisma.InputJsonValue) : undefined,
        extracurricularActivities: data.extracurricularActivities ? (data.extracurricularActivities as unknown as Prisma.InputJsonValue) : undefined,
        languageProficiency: data.languageProficiency ? (data.languageProficiency as unknown as Prisma.InputJsonValue) : undefined,
        homeCountryTies: data.homeCountryTies ? (data.homeCountryTies as unknown as Prisma.InputJsonValue) : undefined,
        futureCareerPlans: data.futureCareerPlans ? (data.futureCareerPlans as unknown as Prisma.InputJsonValue) : undefined,
        whyThisCountry: data.whyThisCountry ? (data.whyThisCountry as unknown as Prisma.InputJsonValue) : undefined,
        whyThisUniversity: data.whyThisUniversity ? (data.whyThisUniversity as unknown as Prisma.InputJsonValue) : undefined,
        previousVisaHistory: data.previousVisaHistory ? (data.previousVisaHistory as unknown as Prisma.InputJsonValue) : undefined,
        sponsorshipDetails: data.sponsorshipDetails ? (data.sponsorshipDetails as unknown as Prisma.InputJsonValue) : undefined,
        maritalStatus: data.maritalStatus ? (data.maritalStatus as unknown as Prisma.InputJsonValue) : undefined,
        // New comprehensive fields
        passportNumber: data.passportNumber || null,
        parentsDetails: data.parentsDetails ? (data.parentsDetails as unknown as Prisma.InputJsonValue) : undefined,
        propertyOwnership: data.propertyOwnership || false,
        businessOwnership: data.businessOwnership ? (data.businessOwnership as unknown as Prisma.InputJsonValue) : undefined,
        travelingCompanion: data.travelingCompanion ? (data.travelingCompanion as unknown as Prisma.InputJsonValue) : undefined,
        strongFamilyBonds: data.strongFamilyBonds ? (data.strongFamilyBonds as unknown as Prisma.InputJsonValue) : undefined,
        
        // Additional missing fields
        programStructure: data.programStructure ? (data.programStructure as unknown as Prisma.InputJsonValue) : undefined,
        tuitionAndCosts: data.tuitionAndCosts ? (data.tuitionAndCosts as unknown as Prisma.InputJsonValue) : undefined,
        countryAdvantages: data.countryAdvantages ? (data.countryAdvantages as unknown as Prisma.InputJsonValue) : undefined,
        universityRanking: data.universityRanking ? (data.universityRanking as unknown as Prisma.InputJsonValue) : undefined,
        accommodationPlans: data.accommodationPlans ? (data.accommodationPlans as unknown as Prisma.InputJsonValue) : undefined,
        additionalCertifications: data.additionalCertifications ? (data.additionalCertifications as unknown as Prisma.InputJsonValue) : undefined,
        freelancingExperience: data.freelancingExperience ? (data.freelancingExperience as unknown as Prisma.InputJsonValue) : undefined,
        salaryExpectations: data.salaryExpectations ? (data.salaryExpectations as unknown as Prisma.InputJsonValue) : undefined,
        homeCountryOpportunities: data.homeCountryOpportunities ? (data.homeCountryOpportunities as unknown as Prisma.InputJsonValue) : undefined,
        entrepreneurialPlans: data.entrepreneurialPlans ? (data.entrepreneurialPlans as unknown as Prisma.InputJsonValue) : undefined,
        returnPlans: data.returnPlans ? (data.returnPlans as unknown as Prisma.InputJsonValue) : undefined,
        additionalLanguageTests: data.additionalLanguageTests ? (data.additionalLanguageTests as unknown as Prisma.InputJsonValue) : undefined,
        familyInTargetCountry: data.familyInTargetCountry ? (data.familyInTargetCountry as unknown as Prisma.InputJsonValue) : undefined,
        additionalInfo: data.additionalInfo || null
      }
    })

    return this.getUserProfile(profile.userId, data.country)
  }

  static async updateProfile(userId: string, country: 'CANADA' | 'AUSTRALIA', data: ProfileUpdateData) {
    const existingProfile = await prisma.studentProfile.findFirst({
      where: { userId, country }
    })
    
    if (!existingProfile) {
      throw new Error('Profile not found')
    }

    // Parse existing data for completeness calculation
    const existingPersonalInfo = this.parseJsonField<PersonalInfo>(existingProfile.personalInfo)
    const existingAcademicBackground = this.parseJsonField<AcademicBackground>(existingProfile.academicBackground)
    const existingTargetProgram = this.parseJsonField<TargetProgram>(existingProfile.targetProgram)

    const completeness = this.calculateProfileCompleteness({
      ...data,
      // Include existing data for completeness calculation (only if new data not provided)
      personalInfo: data.personalInfo || (existingPersonalInfo || undefined),
      academicBackground: data.academicBackground || (existingAcademicBackground || undefined),
      targetProgram: data.targetProgram || (existingTargetProgram || undefined),
      
      // Include existing data for all other fields for proper completeness calculation
      familyBackground: data.familyBackground || this.parseJsonField<FamilyBackground>(existingProfile.familyBackground) || undefined,
      workExperience: data.workExperience || this.parseJsonField<WorkExperience>(existingProfile.workExperience) || undefined,
      extracurricularActivities: data.extracurricularActivities || this.parseJsonField<ExtracurricularActivities>(existingProfile.extracurricularActivities) || undefined,
      languageProficiency: data.languageProficiency || this.parseJsonField<LanguageProficiency>(existingProfile.languageProficiency) || undefined,
      homeCountryTies: data.homeCountryTies || this.parseJsonField<HomeCountryTies>(existingProfile.homeCountryTies) || undefined,
      futureCareerPlans: data.futureCareerPlans || this.parseJsonField<FutureCareerPlans>(existingProfile.futureCareerPlans) || undefined,
      whyThisCountry: data.whyThisCountry || this.parseJsonField<CountryUniversityMotivation>(existingProfile.whyThisCountry) || undefined,
      whyThisUniversity: data.whyThisUniversity || this.parseJsonField<string | CountryUniversityMotivation>(existingProfile.whyThisUniversity) || undefined,
      countryAdvantages: data.countryAdvantages || this.parseJsonField<string | CountryUniversityMotivation>(existingProfile.countryAdvantages) || undefined,
      previousVisaHistory: data.previousVisaHistory || this.parseJsonField<PreviousVisaHistory>(existingProfile.previousVisaHistory) || undefined,
      sponsorshipDetails: data.sponsorshipDetails || this.parseJsonField<SponsorshipDetails>(existingProfile.sponsorshipDetails) || undefined,
      maritalStatus: data.maritalStatus || this.parseJsonField<MaritalStatus>(existingProfile.maritalStatus) || undefined,
      passportNumber: data.passportNumber || existingProfile.passportNumber || undefined,
      parentsDetails: data.parentsDetails || this.parseJsonField<ParentsDetails>(existingProfile.parentsDetails) || undefined,
      propertyOwnership: data.propertyOwnership !== undefined ? data.propertyOwnership : existingProfile.propertyOwnership,
      businessOwnership: data.businessOwnership || this.parseJsonField<BusinessOwnership>(existingProfile.businessOwnership) || undefined,
      travelingCompanion: data.travelingCompanion || this.parseJsonField<TravelingCompanion>(existingProfile.travelingCompanion) || undefined,
      strongFamilyBonds: data.strongFamilyBonds || this.parseJsonField<StrongFamilyBonds>(existingProfile.strongFamilyBonds) || undefined,
      programStructure: data.programStructure || this.parseJsonField<{ isPackageProgram: boolean; foundationProgram?: string; diplomaProgram?: string; bachelorProgram?: string }>(existingProfile.programStructure) || undefined,
      tuitionAndCosts: data.tuitionAndCosts || this.parseJsonField<{ tuitionFees: { amount: string; currency: string; duration: string }; livingCosts: { estimatedAmount: string; currency: string }; totalEstimatedCost: string }>(existingProfile.tuitionAndCosts) || undefined,
      universityRanking: data.universityRanking || this.parseJsonField<{ rank: string; reputation: string }>(existingProfile.universityRanking) || undefined,
      accommodationPlans: data.accommodationPlans || this.parseJsonField<{ type: string; estimatedCost: string }>(existingProfile.accommodationPlans) || undefined,
      additionalCertifications: data.additionalCertifications || this.parseJsonField<string[]>(existingProfile.additionalCertifications) || undefined,
      freelancingExperience: data.freelancingExperience || this.parseJsonField<{ hasFreelancing: boolean; projects: string[]; skills: string[] }>(existingProfile.freelancingExperience) || undefined,
      salaryExpectations: data.salaryExpectations || this.parseJsonField<{ immediateGoals: { salary: string; currency: string }; longTermGoals: { salary: string; currency: string } }>(existingProfile.salaryExpectations) || undefined,
      homeCountryOpportunities: data.homeCountryOpportunities || this.parseJsonField<string>(existingProfile.homeCountryOpportunities) || undefined,
      entrepreneurialPlans: data.entrepreneurialPlans || this.parseJsonField<string>(existingProfile.entrepreneurialPlans) || undefined,
      returnPlans: data.returnPlans || this.parseJsonField<string>(existingProfile.returnPlans) || undefined,
      additionalLanguageTests: data.additionalLanguageTests || this.parseJsonField<{ testType: string; score: string; testDate: string }[]>(existingProfile.additionalLanguageTests) || undefined,
      familyInTargetCountry: data.familyInTargetCountry || this.parseJsonField<{ hasFamily: boolean; relationship: string[]; location: string }>(existingProfile.familyInTargetCountry) || undefined,
      additionalInfo: data.additionalInfo !== undefined ? data.additionalInfo : existingProfile.additionalInfo || undefined,
      financialInfo: data.financialInfo || this.parseJsonField<FinancialInfo>(existingProfile.financialInfo) || undefined
    })

    const updateData: Prisma.StudentProfileUpdateInput = { 
      updatedAt: new Date(),
      profileCompleteness: completeness
    }
    
    // Update only provided fields
    if (data.personalInfo) {
      updateData.personalInfo = data.personalInfo as unknown as Prisma.InputJsonValue
    }
    if (data.academicBackground) {
      updateData.academicBackground = data.academicBackground as unknown as Prisma.InputJsonValue
    }
    if (data.targetProgram) {
      updateData.targetProgram = data.targetProgram as unknown as Prisma.InputJsonValue
    }
    if (data.financialInfo !== undefined) {
      updateData.financialInfo = data.financialInfo ? (data.financialInfo as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.familyBackground !== undefined) {
      updateData.familyBackground = data.familyBackground ? (data.familyBackground as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.workExperience !== undefined) {
      updateData.workExperience = data.workExperience ? (data.workExperience as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.extracurricularActivities !== undefined) {
      updateData.extracurricularActivities = data.extracurricularActivities ? (data.extracurricularActivities as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.languageProficiency !== undefined) {
      updateData.languageProficiency = data.languageProficiency ? (data.languageProficiency as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.homeCountryTies !== undefined) {
      updateData.homeCountryTies = data.homeCountryTies ? (data.homeCountryTies as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.futureCareerPlans !== undefined) {
      updateData.futureCareerPlans = data.futureCareerPlans ? (data.futureCareerPlans as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.whyThisCountry !== undefined) {
      updateData.whyThisCountry = data.whyThisCountry ? (data.whyThisCountry as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.whyThisUniversity !== undefined) {
      updateData.whyThisUniversity = data.whyThisUniversity ? (data.whyThisUniversity as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.countryAdvantages !== undefined) {
      updateData.countryAdvantages = data.countryAdvantages ? (data.countryAdvantages as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.previousVisaHistory !== undefined) {
      updateData.previousVisaHistory = data.previousVisaHistory ? (data.previousVisaHistory as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.sponsorshipDetails !== undefined) {
      updateData.sponsorshipDetails = data.sponsorshipDetails ? (data.sponsorshipDetails as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.maritalStatus !== undefined) {
      updateData.maritalStatus = data.maritalStatus ? (data.maritalStatus as unknown as Prisma.InputJsonValue) : undefined
    }
    
    // New comprehensive fields
    if (data.passportNumber !== undefined) {
      updateData.passportNumber = data.passportNumber
    }
    if (data.parentsDetails !== undefined) {
      updateData.parentsDetails = data.parentsDetails ? (data.parentsDetails as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.propertyOwnership !== undefined) {
      updateData.propertyOwnership = data.propertyOwnership
    }
    if (data.businessOwnership !== undefined) {
      updateData.businessOwnership = data.businessOwnership ? (data.businessOwnership as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.travelingCompanion !== undefined) {
      updateData.travelingCompanion = data.travelingCompanion ? (data.travelingCompanion as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.strongFamilyBonds !== undefined) {
      updateData.strongFamilyBonds = data.strongFamilyBonds ? (data.strongFamilyBonds as unknown as Prisma.InputJsonValue) : undefined
    }
    
    // Handle all the missing fields that were causing the 50% issue
    if (data.programStructure !== undefined) {
      updateData.programStructure = data.programStructure ? (data.programStructure as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.tuitionAndCosts !== undefined) {
      updateData.tuitionAndCosts = data.tuitionAndCosts ? (data.tuitionAndCosts as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.universityRanking !== undefined) {
      updateData.universityRanking = data.universityRanking ? (data.universityRanking as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.accommodationPlans !== undefined) {
      updateData.accommodationPlans = data.accommodationPlans ? (data.accommodationPlans as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.additionalCertifications !== undefined) {
      updateData.additionalCertifications = data.additionalCertifications ? (data.additionalCertifications as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.freelancingExperience !== undefined) {
      updateData.freelancingExperience = data.freelancingExperience ? (data.freelancingExperience as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.salaryExpectations !== undefined) {
      updateData.salaryExpectations = data.salaryExpectations ? (data.salaryExpectations as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.homeCountryOpportunities !== undefined) {
      updateData.homeCountryOpportunities = data.homeCountryOpportunities ? (data.homeCountryOpportunities as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.entrepreneurialPlans !== undefined) {
      updateData.entrepreneurialPlans = data.entrepreneurialPlans ? (data.entrepreneurialPlans as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.returnPlans !== undefined) {
      updateData.returnPlans = data.returnPlans ? (data.returnPlans as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.additionalLanguageTests !== undefined) {
      updateData.additionalLanguageTests = data.additionalLanguageTests ? (data.additionalLanguageTests as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.familyInTargetCountry !== undefined) {
      updateData.familyInTargetCountry = data.familyInTargetCountry ? (data.familyInTargetCountry as unknown as Prisma.InputJsonValue) : undefined
    }
    if (data.additionalInfo !== undefined) {
      updateData.additionalInfo = data.additionalInfo
    }

    await prisma.studentProfile.update({
      where: { id: existingProfile.id },
      data: updateData
    })

    return this.getUserProfile(userId, country)
  }

  static async deleteProfile(userId: string, country?: 'CANADA' | 'AUSTRALIA') {
    const whereClause = country 
      ? { userId, country } 
      : { userId }

    const profile = await prisma.studentProfile.findFirst({
      where: whereClause
    })
    
    if (!profile) {
      throw new Error('Profile not found')
    }

    return await prisma.studentProfile.delete({
      where: { id: profile.id }
    })
  }
}