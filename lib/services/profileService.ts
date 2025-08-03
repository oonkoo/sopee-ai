// lib/services/profileService.ts
import { prisma } from '@/lib/prisma'
import type { PersonalInfo, AcademicBackground, TargetProgram, FinancialInfo, StudentProfile } from '@/types/profile'
import { Prisma } from '@prisma/client'

interface ProfileUpdateData {
  personalInfo?: PersonalInfo
  academicBackground?: AcademicBackground
  targetProgram?: TargetProgram
  financialInfo?: FinancialInfo
}

interface ProfileCreateData {
  personalInfo: PersonalInfo
  academicBackground: AcademicBackground
  targetProgram: TargetProgram
  financialInfo?: FinancialInfo
}

export class ProfileService {
  // Helper function to safely parse JSON fields
  private static parseJsonField<T>(jsonValue: Prisma.JsonValue): T | null {
    if (!jsonValue || jsonValue === null) return null
    try {
      return jsonValue as unknown as T
    } catch {
      return null
    }
  }

  static async getUserProfile(userId: string): Promise<StudentProfile | null> {
    const profile = await prisma.studentProfile.findFirst({
      where: { userId }
    })

    if (!profile) return null

    // Safely parse JSON fields
    const personalInfo = this.parseJsonField<PersonalInfo>(profile.personalInfo)
    const academicBackground = this.parseJsonField<AcademicBackground>(profile.academicBackground)
    const targetProgram = this.parseJsonField<TargetProgram>(profile.targetProgram)
    const financialInfo = profile.financialInfo ? this.parseJsonField<FinancialInfo>(profile.financialInfo) : null

    if (!personalInfo || !academicBackground || !targetProgram) {
      throw new Error('Invalid profile data')
    }

    return {
      id: profile.id,
      userId: profile.userId,
      personalInfo,
      academicBackground,
      targetProgram,
      financialInfo: financialInfo || undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    }
  }

  static async createProfile(userId: string, data: ProfileCreateData) {
    const profile = await prisma.studentProfile.create({
      data: {
        userId,
        personalInfo: data.personalInfo as unknown as Prisma.InputJsonValue,
        academicBackground: data.academicBackground as unknown as Prisma.InputJsonValue,
        targetProgram: data.targetProgram as unknown as Prisma.InputJsonValue,
        financialInfo: data.financialInfo 
          ? (data.financialInfo as unknown as Prisma.InputJsonValue) 
          : undefined
      }
    })

    return this.getUserProfile(profile.userId)
  }

  static async updateProfile(userId: string, data: ProfileUpdateData) {
    const existingProfile = await prisma.studentProfile.findFirst({
      where: { userId }
    })
    
    if (!existingProfile) {
      throw new Error('Profile not found')
    }

    const updateData: Prisma.StudentProfileUpdateInput = { 
      updatedAt: new Date() 
    }
    
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
      updateData.financialInfo = data.financialInfo 
        ? (data.financialInfo as unknown as Prisma.InputJsonValue) 
        : undefined
    }

    await prisma.studentProfile.update({
      where: { id: existingProfile.id },
      data: updateData
    })

    return this.getUserProfile(userId)
  }

  static async deleteProfile(userId: string) {
    const profile = await prisma.studentProfile.findFirst({
      where: { userId }
    })
    
    if (!profile) {
      throw new Error('Profile not found')
    }

    return await prisma.studentProfile.delete({
      where: { id: profile.id }
    })
  }
}