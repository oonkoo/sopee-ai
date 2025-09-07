// components/onboarding/FuturePlansForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-field'
import type { User } from '@/types/auth'
import type { StudentProfile, FutureCareerPlans, HomeCountryTies } from '@/types/profile'

interface FuturePlansFormProps {
  user: User
  existingProfile: StudentProfile | null
}

interface EntrepreneurialPlans {
  hasPlans: boolean
  businessType: string
  industry: string
  timeline: string
  fundingPlan: string
  expectedChallenges: string
  successFactors: string
}

interface HomeCountryOpportunities {
  marketAnalysis: string
  industryGrowth: string
  specificCompanies: string[]
  governmentInitiatives: string
  economicIndicators: string
  competitiveAdvantages: string
}

interface ReturnPlans {
  timeframe: string
  specificPlans: string
  contributionAreas: string
  skillTransfer: string
  networkBuilding: string
  knowledgeSharing: string
}

export default function FuturePlansForm({ existingProfile }: FuturePlansFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [futureCareerPlans, setFutureCareerPlans] = useState<Partial<FutureCareerPlans>>(
    existingProfile?.futureCareerPlans || {
      immediateGoals: '',
      longTermGoals: '',
      howDegreeHelps: '',
      contributionToHomeCountry: '',
      returnPlans: ''
    }
  )

  const [entrepreneurialPlans, setEntrepreneurialPlans] = useState<Partial<EntrepreneurialPlans>>(
    existingProfile?.entrepreneurialPlans as EntrepreneurialPlans || {
      hasPlans: false,
      businessType: '',
      industry: '',
      timeline: '',
      fundingPlan: '',
      expectedChallenges: '',
      successFactors: ''
    }
  )

  const [homeCountryTies, setHomeCountryTies] = useState<Partial<HomeCountryTies>>(
    existingProfile?.homeCountryTies || {
      propertyOwnership: false,
      businessInterests: '',
      familyObligations: '',
      communityConnections: '',
      returnReasons: ''
    }
  )

  const [homeCountryOpportunities, setHomeCountryOpportunities] = useState<Partial<HomeCountryOpportunities>>(
    existingProfile?.homeCountryOpportunities as HomeCountryOpportunities || {
      marketAnalysis: '',
      industryGrowth: '',
      specificCompanies: [],
      governmentInitiatives: '',
      economicIndicators: '',
      competitiveAdvantages: ''
    }
  )

  const [returnPlans, setReturnPlans] = useState<Partial<ReturnPlans>>(
    existingProfile?.returnPlans || {
      timeframe: '',
      specificPlans: '',
      contributionAreas: '',
      skillTransfer: '',
      networkBuilding: '',
      knowledgeSharing: ''
    }
  )

  const handleCareerPlansChange = (field: keyof FutureCareerPlans, value: string) => {
    setFutureCareerPlans(prev => ({ ...prev, [field]: value }))
  }

  const handleEntrepreneurialChange = (field: keyof EntrepreneurialPlans, value: string | boolean) => {
    setEntrepreneurialPlans(prev => ({ ...prev, [field]: value }))
  }

  const handleHomeCountryTiesChange = (field: keyof HomeCountryTies, value: string | boolean) => {
    setHomeCountryTies(prev => ({ ...prev, [field]: value }))
  }

  const handleOpportunitiesChange = (field: keyof HomeCountryOpportunities, value: string | string[]) => {
    setHomeCountryOpportunities(prev => ({ ...prev, [field]: value }))
  }

  const handleReturnPlansChange = (field: keyof ReturnPlans, value: string) => {
    setReturnPlans(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!futureCareerPlans.immediateGoals) newErrors.immediateGoals = 'Immediate career goals are required'
    if (!futureCareerPlans.longTermGoals) newErrors.longTermGoals = 'Long-term goals are required'
    if (!futureCareerPlans.howDegreeHelps) newErrors.howDegreeHelps = 'Please explain how the degree will help'
    if (!futureCareerPlans.returnPlans) newErrors.returnPlans = 'Return plans are required'

    if (entrepreneurialPlans.hasPlans) {
      if (!entrepreneurialPlans.businessType) newErrors.businessType = 'Business type is required'
      if (!entrepreneurialPlans.timeline) newErrors.timeline = 'Timeline is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/onboarding/profile-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'future-plans',
          data: {
            futureCareerPlans,
            entrepreneurialPlans,
            homeCountryTies,
            homeCountryOpportunities,
            returnPlans
          }
        })
      })

      if (response.ok) {
        router.push('/onboarding/profile/financial')
      } else {
        const result = await response.json()
        setErrors(result.errors || { general: 'Failed to save data' })
      }
    } catch {
      setErrors({ general: 'An error occurred while saving' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/onboarding/profile/target-program')
  }

  const timelineOptions = [
    { value: '', label: 'Select timeline' },
    { value: 'Immediately after graduation', label: 'Immediately after graduation' },
    { value: '1-2 years after graduation', label: '1-2 years after graduation' },
    { value: '3-5 years after graduation', label: '3-5 years after graduation' },
    { value: '5+ years after graduation', label: '5+ years after graduation' }
  ]

  const returnTimeframes = [
    { value: '', label: 'Select return timeframe' },
    { value: 'Immediately after graduation', label: 'Immediately after graduation' },
    { value: '1-2 years after graduation', label: '1-2 years after graduation' },
    { value: '3-5 years after graduation', label: '3-5 years after graduation' },
    { value: 'After gaining work experience', label: 'After gaining work experience' }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Future Plans & Career Goals</h1>
        <p className="text-muted-foreground mb-4">
          Tell us about your career aspirations, business plans, and how you plan to contribute to your home country
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={75} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 6 of 8</p>
        </div>
      </div>

      {/* Career Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Career Objectives & Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label="Immediate Career Goals (First 1-2 years)"
            required
            value={futureCareerPlans.immediateGoals || ''}
            onChange={(e) => handleCareerPlansChange('immediateGoals', e.target.value)}
            placeholder="What do you want to achieve immediately after graduation?"
            rows={4}
            error={errors.immediateGoals}
          />

          <FormTextarea
            label="Long-term Career Goals (5-10 years)"
            required
            value={futureCareerPlans.longTermGoals || ''}
            onChange={(e) => handleCareerPlansChange('longTermGoals', e.target.value)}
            placeholder="Where do you see yourself in 5-10 years?"
            rows={4}
            error={errors.longTermGoals}
          />

          <FormTextarea
            label="How Will This Degree Help You?"
            required
            value={futureCareerPlans.howDegreeHelps || ''}
            onChange={(e) => handleCareerPlansChange('howDegreeHelps', e.target.value)}
            placeholder="Explain how the international degree will help achieve your career goals"
            rows={4}
            error={errors.howDegreeHelps}
          />
        </CardContent>
      </Card>

      {/* Entrepreneurial Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Business & Entrepreneurial Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasEntrepreneurialPlans"
              checked={entrepreneurialPlans.hasPlans || false}
              onCheckedChange={(checked) => handleEntrepreneurialChange('hasPlans', !!checked)}
            />
            <Label htmlFor="hasEntrepreneurialPlans">I plan to start my own business or consulting firm</Label>
          </div>

          {entrepreneurialPlans.hasPlans && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Type of Business"
                  required
                  value={entrepreneurialPlans.businessType || ''}
                  onChange={(e) => handleEntrepreneurialChange('businessType', e.target.value)}
                  placeholder="e.g., Consulting business, Tech startup"
                  error={errors.businessType}
                />

                <FormInput
                  label="Industry Focus"
                  value={entrepreneurialPlans.industry || ''}
                  onChange={(e) => handleEntrepreneurialChange('industry', e.target.value)}
                  placeholder="e.g., IT, Finance, Healthcare"
                />

                <FormSelect
                  label="Expected Timeline"
                  required
                  value={entrepreneurialPlans.timeline || ''}
                  onChange={(e) => handleEntrepreneurialChange('timeline', e.target.value)}
                  options={timelineOptions}
                  error={errors.timeline}
                />

                <FormInput
                  label="Initial Funding Plan"
                  value={entrepreneurialPlans.fundingPlan || ''}
                  onChange={(e) => handleEntrepreneurialChange('fundingPlan', e.target.value)}
                  placeholder="e.g., Personal savings, Family support"
                />
              </div>

              <FormTextarea
                label="Expected Challenges & Solutions"
                value={entrepreneurialPlans.expectedChallenges || ''}
                onChange={(e) => handleEntrepreneurialChange('expectedChallenges', e.target.value)}
                placeholder="What challenges do you expect and how will you overcome them?"
                rows={3}
              />

              <FormTextarea
                label="Success Factors"
                value={entrepreneurialPlans.successFactors || ''}
                onChange={(e) => handleEntrepreneurialChange('successFactors', e.target.value)}
                placeholder="What factors will contribute to your business success?"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Home Country Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Home Country Market Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label="Market Analysis"
            value={homeCountryOpportunities.marketAnalysis || ''}
            onChange={(e) => handleOpportunitiesChange('marketAnalysis', e.target.value)}
            placeholder="Analyze the current market conditions in your home country"
            rows={4}
          />

          <FormTextarea
            label="Industry Growth & Opportunities"
            value={homeCountryOpportunities.industryGrowth || ''}
            onChange={(e) => handleOpportunitiesChange('industryGrowth', e.target.value)}
            placeholder="Describe growth opportunities in your target industry"
            rows={3}
          />

          <FormTextarea
            label="Government Initiatives & Support"
            value={homeCountryOpportunities.governmentInitiatives || ''}
            onChange={(e) => handleOpportunitiesChange('governmentInitiatives', e.target.value)}
            placeholder="Any government programs or initiatives that support your field?"
            rows={3}
          />

          <FormTextarea
            label="Economic Indicators & GDP Growth"
            value={homeCountryOpportunities.economicIndicators || ''}
            onChange={(e) => handleOpportunitiesChange('economicIndicators', e.target.value)}
            placeholder="Reference specific economic data that supports opportunities in your field"
            rows={3}
          />

          <FormInput
            label="Target Companies/Organizations"
            value={homeCountryOpportunities.specificCompanies?.join(', ') || ''}
            onChange={(e) => handleOpportunitiesChange('specificCompanies', e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
            placeholder="e.g., Tiger IT Bangladesh, BJIT Limited, DataSoft Systems (comma separated)"
          />
        </CardContent>
      </Card>

      {/* Home Country Ties & Return Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Home Country Ties & Return Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label="Family Obligations & Responsibilities"
            value={homeCountryTies.familyObligations || ''}
            onChange={(e) => handleHomeCountryTiesChange('familyObligations', e.target.value)}
            placeholder="Describe your family responsibilities that require your return"
            rows={3}
          />

          <FormTextarea
            label="Business Interests & Property"
            value={homeCountryTies.businessInterests || ''}
            onChange={(e) => handleHomeCountryTiesChange('businessInterests', e.target.value)}
            placeholder="Any existing business interests, property, or investments in your home country"
            rows={3}
          />

          <FormTextarea
            label="Community Connections"
            value={homeCountryTies.communityConnections || ''}
            onChange={(e) => handleHomeCountryTiesChange('communityConnections', e.target.value)}
            placeholder="Your connections and commitments to local community"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Planned Return Timeframe"
              value={returnPlans.timeframe || ''}
              onChange={(e) => handleReturnPlansChange('timeframe', e.target.value)}
              options={returnTimeframes}
            />

            <FormInput
              label="Primary Return Motivation"
              value={homeCountryTies.returnReasons || ''}
              onChange={(e) => handleHomeCountryTiesChange('returnReasons', e.target.value)}
              placeholder="e.g., Family obligations, Business opportunities"
            />
          </div>

          <FormTextarea
            label="Specific Return Plans"
            required
            value={futureCareerPlans.returnPlans || ''}
            onChange={(e) => handleCareerPlansChange('returnPlans', e.target.value)}
            placeholder="Detailed plans for returning to and contributing to your home country"
            rows={4}
            error={errors.returnPlans}
          />

          <FormTextarea
            label="Knowledge & Skill Transfer"
            value={returnPlans.skillTransfer || ''}
            onChange={(e) => handleReturnPlansChange('skillTransfer', e.target.value)}
            placeholder="How will you transfer the knowledge and skills gained abroad to benefit your home country?"
            rows={3}
          />

          <FormTextarea
            label="Contribution to Home Country"
            value={futureCareerPlans.contributionToHomeCountry || ''}
            onChange={(e) => handleCareerPlansChange('contributionToHomeCountry', e.target.value)}
            placeholder="How will you use your education to contribute to your home country's development?"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Target Program
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Next: Financial Information'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {errors.general && (
        <div className="text-center text-red-600 text-sm">
          {errors.general}
        </div>
      )}
    </div>
  )
}