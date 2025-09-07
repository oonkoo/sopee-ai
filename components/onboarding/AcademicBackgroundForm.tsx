// components/onboarding/AcademicBackgroundForm.tsx
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
import type { StudentProfile, AcademicBackground, WorkExperience, LanguageProficiency } from '@/types/profile'

interface AcademicBackgroundFormProps {
  user: User
  existingProfile: StudentProfile | null
}

export default function AcademicBackgroundForm({ existingProfile }: AcademicBackgroundFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [academicBackground, setAcademicBackground] = useState<Partial<AcademicBackground>>(() => {
    const existing = existingProfile?.academicBackground;
    return {
      highestEducation: existing?.highestEducation || '',
      institution: existing?.institution || '',
      graduationYear: existing?.graduationYear || '',
      gpa: existing?.gpa || '',
      fieldOfStudy: existing?.fieldOfStudy || '',
      hasGaps: existing?.hasGaps !== undefined ? existing.hasGaps : false,
      gapExplanation: existing?.gapExplanation || ''
    };
  })

  const [workExperience, setWorkExperience] = useState<Partial<WorkExperience>>(() => {
    const existing = existingProfile?.workExperience;
    return {
      hasWorkExperience: existing?.hasWorkExperience !== undefined ? existing.hasWorkExperience : false,
      jobs: existing?.jobs || [],
      internships: existing?.internships || []
    };
  })

  const [languageProficiency, setLanguageProficiency] = useState<Partial<LanguageProficiency>>(
    existingProfile?.languageProficiency || {
      nativeLanguage: '',
      englishProficiency: {
        testType: 'IELTS',
        score: '',
        testDate: ''
      },
      otherLanguages: []
    }
  )

  const handleAcademicChange = (field: keyof AcademicBackground, value: string | boolean) => {
    setAcademicBackground(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleWorkExperienceChange = (field: keyof WorkExperience, value: unknown) => {
    setWorkExperience(prev => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (field: string, value: unknown) => {
    if (field.startsWith('englishProficiency.')) {
      const subField = field.split('.')[1]
      setLanguageProficiency(prev => ({
        ...prev,
        englishProficiency: {
          ...prev.englishProficiency!,
          [subField]: value
        }
      }))
    } else {
      setLanguageProficiency(prev => ({ ...prev, [field]: value }))
    }
  }

  const addJob = () => {
    setWorkExperience(prev => ({
      ...prev,
      jobs: [
        ...(prev.jobs || []),
        { title: '', company: '', duration: '', responsibilities: '' }
      ]
    }))
  }

  const removeJob = (index: number) => {
    setWorkExperience(prev => ({
      ...prev,
      jobs: prev.jobs?.filter((_, i) => i !== index) || []
    }))
  }

  const updateJob = (index: number, field: string, value: string) => {
    setWorkExperience(prev => ({
      ...prev,
      jobs: prev.jobs?.map((job, i) => 
        i === index ? { ...job, [field]: value } : job
      ) || []
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!academicBackground.highestEducation) newErrors.highestEducation = 'Education level is required'
    if (!academicBackground.institution) newErrors.institution = 'Institution name is required'
    if (!academicBackground.graduationYear) newErrors.graduationYear = 'Graduation year is required'
    if (!academicBackground.gpa) newErrors.gpa = 'GPA/Percentage is required'
    if (!academicBackground.fieldOfStudy) newErrors.fieldOfStudy = 'Field of study is required'
    
    if (academicBackground.hasGaps && !academicBackground.gapExplanation) {
      newErrors.gapExplanation = 'Gap explanation is required'
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
          step: 'academic',
          data: {
            academicBackground,
            workExperience,
            languageProficiency
          }
        })
      })

      if (response.ok) {
        router.push('/onboarding/profile/work-experience')
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
    router.push('/onboarding/profile/family-background')
  }

  const educationOptions = [
    { value: '', label: 'Select education level' },
    { value: 'High School', label: 'High School' },
    { value: 'Diploma', label: 'Diploma' },
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: 'PhD', label: 'PhD' }
  ]

  const testTypeOptions = [
    { value: 'IELTS', label: 'IELTS' },
    { value: 'TOEFL', label: 'TOEFL' },
    { value: 'Other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Academic Background</h1>
        <p className="text-muted-foreground mb-4">
          Tell us about your education, work experience, and language skills
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={25} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 3 of 8</p>
        </div>
      </div>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Education Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Highest Education"
              required
              value={academicBackground.highestEducation || ''}
              onChange={(e) => handleAcademicChange('highestEducation', e.target.value)}
              options={educationOptions}
              error={errors.highestEducation}
            />

            <FormInput
              label="Institution Name"
              required
              value={academicBackground.institution || ''}
              onChange={(e) => handleAcademicChange('institution', e.target.value)}
              placeholder="Name of your school/university"
              error={errors.institution}
            />

            <FormInput
              label="Graduation Year"
              required
              value={academicBackground.graduationYear || ''}
              onChange={(e) => handleAcademicChange('graduationYear', e.target.value)}
              placeholder="e.g., 2023"
              error={errors.graduationYear}
            />

            <FormInput
              label="GPA/Percentage"
              required
              value={academicBackground.gpa || ''}
              onChange={(e) => handleAcademicChange('gpa', e.target.value)}
              placeholder="e.g., 3.8/4.0 or 85%"
              error={errors.gpa}
            />
          </div>

          <FormInput
            label="Field of Study"
            required
            value={academicBackground.fieldOfStudy || ''}
            onChange={(e) => handleAcademicChange('fieldOfStudy', e.target.value)}
            placeholder="e.g., Computer Science, Business Administration"
            error={errors.fieldOfStudy}
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasGaps"
                checked={academicBackground.hasGaps || false}
                onCheckedChange={(checked) => handleAcademicChange('hasGaps', !!checked)}
              />
              <Label htmlFor="hasGaps">I have gaps in my education/employment</Label>
            </div>

            {academicBackground.hasGaps && (
              <FormTextarea
                label="Gap Explanation"
                required
                value={academicBackground.gapExplanation || ''}
                onChange={(e) => handleAcademicChange('gapExplanation', e.target.value)}
                placeholder="Explain any gaps in your education or employment..."
                rows={4}
                error={errors.gapExplanation}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasWorkExperience"
              checked={workExperience.hasWorkExperience || false}
              onCheckedChange={(checked) => handleWorkExperienceChange('hasWorkExperience', !!checked)}
            />
            <Label htmlFor="hasWorkExperience">I have work experience</Label>
          </div>

          {workExperience.hasWorkExperience && (
            <div className="space-y-4">
              {workExperience.jobs?.map((job, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Job {index + 1}</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeJob(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput
                      label="Job Title"
                      value={job.title}
                      onChange={(e) => updateJob(index, 'title', e.target.value)}
                      placeholder="Your position"
                    />
                    <FormInput
                      label="Company"
                      value={job.company}
                      onChange={(e) => updateJob(index, 'company', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <FormInput
                    label="Duration"
                    value={job.duration}
                    onChange={(e) => updateJob(index, 'duration', e.target.value)}
                    placeholder="e.g., Jan 2020 - Dec 2022"
                  />
                  <FormTextarea
                    label="Key Responsibilities"
                    value={job.responsibilities}
                    onChange={(e) => updateJob(index, 'responsibilities', e.target.value)}
                    placeholder="Describe your main responsibilities and achievements"
                    rows={3}
                  />
                </div>
              ))}
              
              <Button variant="outline" onClick={addJob}>
                Add Another Job
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Proficiency */}
      <Card>
        <CardHeader>
          <CardTitle>Language Proficiency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Native Language"
              value={languageProficiency.nativeLanguage || ''}
              onChange={(e) => handleLanguageChange('nativeLanguage', e.target.value)}
              placeholder="e.g., Bengali, Hindi"
            />

            <FormSelect
              label="English Test Type"
              value={languageProficiency.englishProficiency?.testType || 'IELTS'}
              onChange={(e) => handleLanguageChange('englishProficiency.testType', e.target.value)}
              options={testTypeOptions}
            />

            <FormInput
              label="English Test Score"
              value={languageProficiency.englishProficiency?.score || ''}
              onChange={(e) => handleLanguageChange('englishProficiency.score', e.target.value)}
              placeholder="e.g., 7.5 (IELTS) or 95 (TOEFL)"
            />

            <FormInput
              label="Test Date"
              type="date"
              value={languageProficiency.englishProficiency?.testDate || ''}
              onChange={(e) => handleLanguageChange('englishProficiency.testDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Family Background
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Next: Work Experience'}
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