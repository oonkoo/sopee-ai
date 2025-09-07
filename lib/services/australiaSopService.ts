// lib/services/australiaSopService.ts
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import type { StudentProfile } from '@/types/profile'

export class AustraliaSopService {
  
  static async generateSOP(profile: StudentProfile): Promise<string> {
    try {
      console.log('Starting Australia SOP generation for profile:', profile.id)

      // Check if API key is available
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set')
      }

      const prompt = this.buildSopPrompt(profile)
      
      console.log('Calling Google AI API for Australia SOP...')

      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        prompt: prompt,
        temperature: 0.7
      })

      console.log('Australia SOP generation completed, text length:', text.length)

      if (!text || text.trim().length === 0) {
        throw new Error('AI generated empty response')
      }

      return text
    } catch (error) {
      console.error('Australia SOP generation service error:', error)
      
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Unknown error in Australia SOP generation service')
    }
  }

  private static buildSopPrompt(profile: StudentProfile): string {
    // Extract profile data safely
    const personalInfo = profile.personalInfo
    const academicBackground = profile.academicBackground
    const targetProgram = profile.targetProgram
    const familyBackground = profile.familyBackground
    const futureCareerPlans = profile.futureCareerPlans
    const whyThisCountry = profile.whyThisCountry || profile.countryAdvantages
    const whyThisUniversity = profile.whyThisUniversity
    const workExperience = profile.workExperience
    const financialInfo = profile.financialInfo
    const parentsDetails = profile.parentsDetails
    const businessOwnership = profile.businessOwnership
    const salaryExpectations = profile.salaryExpectations
    const universityRanking = profile.universityRanking
    const returnPlans = profile.returnPlans
    const homeCountryTies = profile.homeCountryTies

    return `You are an expert visa consultant writing a Statement of Purpose for an Australian student visa application. Create a comprehensive, authentic SOP that follows the exact structure and language patterns of approved Australian visa applications.

CRITICAL INSTRUCTIONS:
- Write 1500-2000 words following the EXACT structure below
- Use specific details from the profile data provided
- Include real numbers, salary figures, and specific examples
- Follow the tone and language patterns of successful Australian SOPs
- Address the three main questions that Australian visa officers ask

STUDENT PROFILE DATA:
Personal Information: ${JSON.stringify(personalInfo, null, 2)}
Academic Background: ${JSON.stringify(academicBackground, null, 2)}
Target Program: ${JSON.stringify(targetProgram, null, 2)}
Family Background: ${JSON.stringify(familyBackground, null, 2)}
Future Career Plans: ${JSON.stringify(futureCareerPlans, null, 2)}
Why Australia: ${JSON.stringify(whyThisCountry, null, 2)}
Why This University: ${JSON.stringify(whyThisUniversity, null, 2)}
Work Experience: ${JSON.stringify(workExperience, null, 2)}
Financial Information: ${JSON.stringify(financialInfo, null, 2)}
Parents Details: ${JSON.stringify(parentsDetails, null, 2)}
Business Ownership: ${JSON.stringify(businessOwnership, null, 2)}
Salary Expectations: ${JSON.stringify(salaryExpectations, null, 2)}
University Ranking: ${JSON.stringify(universityRanking, null, 2)}
Return Plans: ${JSON.stringify(returnPlans, null, 2)}
Home Country Ties: ${JSON.stringify(homeCountryTies, null, 2)}

APPROVED SOP STRUCTURE TO FOLLOW:

**# Statement of Purpose**

**Give details of the applicant's current circumstances. This includes ties to family, community, employment and economic circumstances.**

[WRITE A DETAILED SECTION COVERING:]
- Full name and citizenship
- Complete family structure (father's name, occupation, mother's name, occupation)
- Siblings details with their current education/status
- Family business details (type, ownership, income generation)
- Property ownership and assets (mention grandfather's land, family properties)
- Family financial stability and income sources
- Strong family bonds and joint family structure
- Economic circumstances and family support system
- Community ties and local connections
- Why returning home is beneficial (accommodation costs, travel expenses, family support)
- Specific responsibilities towards family and business succession
- How the Australian degree investment will benefit family business growth

**Explain why the applicant wishes to study this course in Australia with this particular education provider. This must also explain their understanding of the requirements of the intended course and studying and living in Australia.**

[WRITE A DETAILED SECTION COVERING:]
- Academic journey and university admission attempts in home country
- Why Australia is the best study destination compared to USA, UK, Canada
- Australian education system advantages (TEQSA quality assurance, world-class universities)
- Specific university benefits and why this institution was chosen
- University ranking and reputation (mention specific QS rankings if available)
- Outstanding student support and industry-relevant experience
- Award-winning teaching staff and multicultural environment
- Campus details and location choice
- Accommodation arrangements and friends/support network
- Course details: program name, duration, major specialization
- Understanding of course requirements and curriculum
- Industry demand and job market relevance of the chosen field

**Explain how completing the course will be of benefit to the applicant.**

[WRITE A DETAILED SECTION COVERING:]
- Skills development in specific field (IT, business analysis, etc.)
- Career opportunities in home country after graduation
- Specific job roles and positions accessible with Australian degree
- Target companies and sectors (IT, financial, e-commerce, banking, online payment gateways)
- Salary expectations with specific amounts in home country currency
- How degree will help grow family business operations
- International perspective and global business understanding
- Networking opportunities and industry connections
- Leadership and management skills development
- Entrepreneurial opportunities and business growth potential
- Contribution to home country's economic development
- Long-term career progression and professional growth

END WITH:
"I declare that the particulars given above are true and correct in every detail. I am submitting all my documents and request you to consider my application and allow me to embark on my dream education.

Regards,
[Student's Full Name]"

LANGUAGE STYLE GUIDELINES:
- Use conversational, personal tone like approved SOPs
- Include specific examples and concrete details
- Mention real numbers and financial figures
- Reference family business specifics and assets
- Include accommodation and living cost benefits
- Show strong family obligations and ties
- Demonstrate clear return intentions with specific plans
- Use phrases like "handsome salary," "golden opportunity," "world-class universities"
- Be authentic and genuine in expression

Generate the complete SOP now, ensuring it feels personal and authentic while incorporating all the specific details from the student's profile.`
  }

  static getSopTitle(): string {
    return 'Statement of Purpose - Australia Student Visa'
  }

  static getWordCountRange(): { min: number; max: number } {
    return { min: 1500, max: 2000 }
  }
}