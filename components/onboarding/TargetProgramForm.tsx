// components/onboarding/TargetProgramForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-field'
import type { User } from '@/types/auth'
import type { StudentProfile, TargetProgram, CountryUniversityMotivation, FutureCareerPlans } from '@/types/profile'

interface TargetProgramFormProps {
  user: User
  existingProfile: StudentProfile | null
}

export default function TargetProgramForm({ user, existingProfile }: TargetProgramFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [targetProgram, setTargetProgram] = useState<Partial<TargetProgram>>(
    existingProfile?.targetProgram || {
      university: '',
      program: '',
      degree: '',
      country: user.targetCountry || '',
      startDate: '',
      duration: ''
    }
  )

  const [whyThisCountry, setWhyThisCountry] = useState<Partial<CountryUniversityMotivation>>(
    existingProfile?.whyThisCountry || {
      whyThisCountry: '',
      whyThisUniversity: '',
      specificPrograms: '',
      researchInterests: '',
      facultyOfInterest: ''
    }
  )

  const [futureCareerPlans, setFutureCareerPlans] = useState<Partial<FutureCareerPlans>>(
    existingProfile?.futureCareerPlans || {
      immediateGoals: '',
      longTermGoals: '',
      howDegreeHelps: '',
      contributionToHomeCountry: '',
      returnPlans: ''
    }
  )

  const [programStructure] = useState<{
    isPackageProgram: boolean
    foundationProgram?: string
    diplomaProgram?: string
    bachelorProgram?: string
    majorSpecialization?: string
    programDuration: string
  }>(
    existingProfile?.programStructure || {
      isPackageProgram: false,
      foundationProgram: '',
      diplomaProgram: '',
      bachelorProgram: '',
      majorSpecialization: '',
      programDuration: ''
    }
  )

  const [universityRanking, setUniversityRanking] = useState<{
    globalRanking?: string
    nationalRanking?: string
    subjectRanking?: string
    accreditation: string
    reputation: string
  }>(
    existingProfile?.universityRanking || {
      globalRanking: '',
      nationalRanking: '',
      subjectRanking: '',
      accreditation: '',
      reputation: ''
    }
  )

  const [tuitionAndCosts] = useState<{
    tuitionFees: { amount: string; currency: string; duration: string }
    livingCosts: { estimatedAmount: string; currency: string; breakdown: string }
    totalEstimatedCost: string
  }>(
    existingProfile?.tuitionAndCosts || {
      tuitionFees: { amount: '', currency: '', duration: '' },
      livingCosts: { estimatedAmount: '', currency: '', breakdown: '' },
      totalEstimatedCost: ''
    }
  )

  const handleTargetProgramChange = (field: keyof TargetProgram, value: string) => {
    setTargetProgram(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCountryMotivationChange = (field: keyof CountryUniversityMotivation, value: string) => {
    setWhyThisCountry(prev => ({ ...prev, [field]: value }))
  }

  const handleCareerPlansChange = (field: keyof FutureCareerPlans, value: string) => {
    setFutureCareerPlans(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!targetProgram.university) newErrors.university = 'University is required'
    if (!targetProgram.program) newErrors.program = 'Program is required'
    if (!targetProgram.degree) newErrors.degree = 'Degree level is required'
    if (!targetProgram.startDate) newErrors.startDate = 'Start date is required'
    if (!targetProgram.duration) newErrors.duration = 'Duration is required'

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
          step: 'target-program',
          data: {
            targetProgram,
            whyThisCountry,
            futureCareerPlans,
            programStructure,    
            universityRanking,   
            tuitionAndCosts  
          }
        })
      })

      if (response.ok) {
        router.push('/onboarding/profile/future-plans')
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
    router.push('/onboarding/profile/work-experience')
  }

  const degreeOptions = [
    { value: '', label: 'Select degree level' },
    { value: 'Diploma', label: 'Diploma' },
    { value: "Bachelor's", label: "Bachelor's" },
    { value: "Master's", label: "Master's" },
    { value: 'PhD', label: 'PhD' },
    { value: 'Certificate', label: 'Certificate' }
  ]

  const durationOptions = [
    { value: '', label: 'Select duration' },
    { value: '6 months', label: '6 months' },
    { value: '1 year', label: '1 year' },
    { value: '1.5 years', label: '1.5 years' },
    { value: '2 years', label: '2 years' },
    { value: '3 years', label: '3 years' },
    { value: '4 years', label: '4 years' },
    { value: '5+ years', label: '5+ years' }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Target Program & Goals</h1>
        <p className="text-muted-foreground mb-4">
          Tell us about your target university, program, and career aspirations
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={62.5} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 5 of 8</p>
        </div>
      </div>

      {/* Target Program */}
      <Card>
        <CardHeader>
          <CardTitle>University & Program Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="University/Institution"
              required
              value={targetProgram.university || ''}
              onChange={(e) => handleTargetProgramChange('university', e.target.value)}
              placeholder="e.g., University of Toronto"
              error={errors.university}
            />

            <FormInput
              label="Program Name"
              required
              value={targetProgram.program || ''}
              onChange={(e) => handleTargetProgramChange('program', e.target.value)}
              placeholder="e.g., Master of Computer Science"
              error={errors.program}
            />

            <FormSelect
              label="Degree Level"
              required
              value={targetProgram.degree || ''}
              onChange={(e) => handleTargetProgramChange('degree', e.target.value)}
              options={degreeOptions}
              error={errors.degree}
            />

            <FormInput
              label="Program Start Date"
              required
              type="date"
              value={targetProgram.startDate || ''}
              onChange={(e) => handleTargetProgramChange('startDate', e.target.value)}
              error={errors.startDate}
            />

            <FormSelect
              label="Program Duration"
              required
              value={targetProgram.duration || ''}
              onChange={(e) => handleTargetProgramChange('duration', e.target.value)}
              options={durationOptions}
              error={errors.duration}
            />
          </div>
        </CardContent>
      </Card>

      {/* Why This Country/University */}
      <Card>
        <CardHeader>
          <CardTitle>Motivation & Research</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label={`Why ${user.targetCountry === 'CANADA' ? 'Canada' : 'Australia'}?`}
            value={whyThisCountry.whyThisCountry || ''}
            onChange={(e) => handleCountryMotivationChange('whyThisCountry', e.target.value)}
            placeholder={`Explain why you chose ${user.targetCountry === 'CANADA' ? 'Canada' : 'Australia'} for your studies`}
            rows={4}
          />

          <FormTextarea
            label="Why This University?"
            value={whyThisCountry.whyThisUniversity || ''}
            onChange={(e) => handleCountryMotivationChange('whyThisUniversity', e.target.value)}
            placeholder="What specific aspects of this university attract you?"
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextarea
              label="Specific Programs of Interest"
              value={whyThisCountry.specificPrograms || ''}
              onChange={(e) => handleCountryMotivationChange('specificPrograms', e.target.value)}
              placeholder="Which courses or specializations interest you?"
              rows={3}
            />

            <FormTextarea
              label="Research Interests"
              value={whyThisCountry.researchInterests || ''}
              onChange={(e) => handleCountryMotivationChange('researchInterests', e.target.value)}
              placeholder="Any research areas you want to explore?"
              rows={3}
            />
          </div>

          <FormInput
            label="Faculty of Interest"
            value={whyThisCountry.facultyOfInterest || ''}
            onChange={(e) => handleCountryMotivationChange('facultyOfInterest', e.target.value)}
            placeholder="Any specific professors or faculty you'd like to work with?"
          />
        </CardContent>
      </Card>

      {/* University Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>University Ranking & Reputation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Global Ranking"
              value={universityRanking.globalRanking || ''}
              onChange={(e) => setUniversityRanking(prev => ({ ...prev, globalRanking: e.target.value }))}
              placeholder="e.g., QS World Ranking #25"
            />

            <FormInput
              label="National Ranking"
              value={universityRanking.nationalRanking || ''}
              onChange={(e) => setUniversityRanking(prev => ({ ...prev, nationalRanking: e.target.value }))}
              placeholder="e.g., #3 in Canada"
            />

            <FormInput
              label="Subject/Program Ranking"
              value={universityRanking.subjectRanking || ''}
              onChange={(e) => setUniversityRanking(prev => ({ ...prev, subjectRanking: e.target.value }))}
              placeholder="e.g., #1 in Computer Science"
            />

            <FormTextarea
              label="Accreditation & Reputation"
              value={universityRanking.reputation || ''}
              onChange={(e) => setUniversityRanking(prev => ({ ...prev, reputation: e.target.value }))}
              placeholder="Mention any special accreditations or reputation factors"
              rows={3}
            />
          </div>

          <FormTextarea
            label="Accreditation Details"
            value={universityRanking.accreditation || ''}
            onChange={(e) => setUniversityRanking(prev => ({ ...prev, accreditation: e.target.value }))}
            placeholder="Professional accreditations (AACSB, ABET, etc.)"
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Career Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Career Goals & Return Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextarea
              label="Immediate Career Goals"
              value={futureCareerPlans.immediateGoals || ''}
              onChange={(e) => handleCareerPlansChange('immediateGoals', e.target.value)}
              placeholder="What do you want to achieve right after graduation?"
              rows={4}
            />

            <FormTextarea
              label="Long-term Career Goals"
              value={futureCareerPlans.longTermGoals || ''}
              onChange={(e) => handleCareerPlansChange('longTermGoals', e.target.value)}
              placeholder="Where do you see yourself in 5-10 years?"
              rows={4}
            />
          </div>

          <FormTextarea
            label="How Will This Degree Help?"
            value={futureCareerPlans.howDegreeHelps || ''}
            onChange={(e) => handleCareerPlansChange('howDegreeHelps', e.target.value)}
            placeholder="Explain how this degree aligns with your career goals"
            rows={4}
          />

          <FormTextarea
            label="Contribution to Home Country"
            value={futureCareerPlans.contributionToHomeCountry || ''}
            onChange={(e) => handleCareerPlansChange('contributionToHomeCountry', e.target.value)}
            placeholder="How will you use your education to contribute to your home country?"
            rows={4}
          />

          <FormTextarea
            label="Return Plans"
            value={futureCareerPlans.returnPlans || ''}
            onChange={(e) => handleCareerPlansChange('returnPlans', e.target.value)}
            placeholder="Describe your plans to return to your home country after studies"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Work Experience
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Next: Future Plans'}
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