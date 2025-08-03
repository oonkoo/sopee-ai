// lib/services/letterService.ts
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import type { LetterType, LetterPrompts } from '@/types/letter'
import type { StudentProfile, PersonalInfo, AcademicBackground, TargetProgram, FinancialInfo } from '@/types/profile'

interface ProfileData {
  personalInfo: PersonalInfo
  academicBackground: AcademicBackground
  targetProgram: TargetProgram
  financialInfo?: FinancialInfo
}

export class LetterService {
  private static readonly letterPrompts: LetterPrompts = {
    explanation: `You are an expert visa consultant writing a Letter of Explanation for a student visa application. Write a professional, convincing letter that addresses potential concerns and demonstrates genuine intent to study.

Include:
- Clear purpose of study
- Academic progression logic
- Career goals alignment
- Financial capability assurance
- Strong ties to home country
- Address any gaps if mentioned

Student Details:
Personal Info: {personalInfo}
Academic Background: {academicBackground}
Target Program: {targetProgram}
Financial Info: {financialInfo}

Write a formal letter (400-600 words) starting with "Dear Visa Officer," and maintain a respectful, confident tone throughout.`,

    study_plan: `You are an academic advisor creating a comprehensive Study Plan for a student visa application. Write a detailed academic roadmap that shows clear progression and career alignment.

Include:
- Program structure and key courses
- Semester-by-semester breakdown
- Research/internship opportunities
- Skills development plan
- Career objectives alignment
- Post-graduation plans

Student Details:
Personal Info: {personalInfo}
Academic Background: {academicBackground}
Target Program: {targetProgram}

Write a structured study plan (500-800 words) with clear headings and detailed explanations.`,

    financial: `You are a financial advisor preparing a Financial Statement letter for a student visa application. Write a comprehensive financial plan demonstrating adequate funding for the entire study period.

Include:
- Total program costs breakdown
- Living expenses estimation
- Funding sources details
- Financial timeline
- Sponsor information (if applicable)
- Bank statement summary

Student Details:
Personal Info: {personalInfo}
Target Program: {targetProgram}
Financial Info: {financialInfo}

Write a detailed financial statement (400-600 words) with clear cost breakdowns and funding assurances.`
  }

  static async generateLetter(letterType: LetterType, profile: StudentProfile): Promise<string> {
    try {
      console.log('Starting letter generation for type:', letterType)

      // Check if API key is available
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set')
      }

      const prompt = this.letterPrompts[letterType]
      
      // Parse profile JSON data safely
      let personalInfo: PersonalInfo, academicBackground: AcademicBackground, targetProgram: TargetProgram, financialInfo: FinancialInfo | undefined

      try {
        personalInfo = typeof profile.personalInfo === 'string' 
          ? JSON.parse(profile.personalInfo) 
          : profile.personalInfo

        academicBackground = typeof profile.academicBackground === 'string'
          ? JSON.parse(profile.academicBackground)
          : profile.academicBackground

        targetProgram = typeof profile.targetProgram === 'string'
          ? JSON.parse(profile.targetProgram)
          : profile.targetProgram

        financialInfo = profile.financialInfo 
          ? (typeof profile.financialInfo === 'string' 
              ? JSON.parse(profile.financialInfo) 
              : profile.financialInfo)
          : undefined
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        throw new Error('Failed to parse profile data')
      }

      // Replace placeholders in prompt
      const finalPrompt = prompt
        .replace('{personalInfo}', JSON.stringify(personalInfo, null, 2))
        .replace('{academicBackground}', JSON.stringify(academicBackground, null, 2))
        .replace('{targetProgram}', JSON.stringify(targetProgram, null, 2))
        .replace('{financialInfo}', financialInfo ? JSON.stringify(financialInfo, null, 2) : 'Not provided')

      console.log('Calling Google AI API...')

      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        prompt: finalPrompt,
        temperature: 0.7
      })

      console.log('AI generation completed, text length:', text.length)

      if (!text || text.trim().length === 0) {
        throw new Error('AI generated empty response')
      }

      return text
    } catch (error) {
      console.error('Letter generation service error:', error)
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Unknown error in letter generation service')
    }
  }

  static getLetterTitle(letterType: LetterType): string {
    const titles: Record<LetterType, string> = {
      explanation: 'Letter of Explanation',
      study_plan: 'Study Plan',
      financial: 'Financial Statement'
    }
    return titles[letterType]
  }
}