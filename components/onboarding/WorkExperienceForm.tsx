// components/onboarding/WorkExperienceForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react'
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-field'
import type { User } from '@/types/auth'
import type { StudentProfile, WorkExperience, LanguageProficiency, ExtracurricularActivities } from '@/types/profile'

interface WorkExperienceFormProps {
  user: User
  existingProfile: StudentProfile | null
}

interface FreelancingExperience {
  hasFreelancing: boolean
  type: string
  clients: string
  duration: string
  recognition: string
  skills: string
}

interface AdditionalCertifications {
  hasCertifications: boolean
  certifications: {
    name: string
    provider: string
    completionDate: string
    relevance: string
  }[]
}

export default function WorkExperienceForm({ existingProfile }: WorkExperienceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [workExperience, setWorkExperience] = useState<Partial<WorkExperience>>(
    existingProfile?.workExperience || {
      hasWorkExperience: false,
      jobs: [],
      internships: []
    }
  )

  const [freelancingExperience, setFreelancingExperience] = useState<Partial<FreelancingExperience>>(
    existingProfile?.freelancingExperience as FreelancingExperience || {
      hasFreelancing: false,
      type: '',
      clients: '',
      duration: '',
      recognition: '',
      skills: ''
    }
  )

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

  const [additionalCertifications, setAdditionalCertifications] = useState<Partial<AdditionalCertifications>>(
    existingProfile?.additionalCertifications as AdditionalCertifications || {
      hasCertifications: false,
      certifications: []
    }
  )

  const [extracurricularActivities] = useState<Partial<ExtracurricularActivities>>(
    existingProfile?.extracurricularActivities || {
      leadership: [],
      volunteering: [],
      sports: [],
      achievements: [],
      hobbies: []
    }
  )

  const handleWorkExperienceChange = (field: keyof WorkExperience, value: unknown) => {
    setWorkExperience(prev => ({ ...prev, [field]: value }))
  }

  const handleFreelancingChange = (field: keyof FreelancingExperience, value: string | boolean) => {
    setFreelancingExperience(prev => ({ ...prev, [field]: value }))
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
        { title: '', company: '', duration: '', responsibilities: '', location: '', isRemote: false }
      ]
    }))
  }

  const removeJob = (index: number) => {
    setWorkExperience(prev => ({
      ...prev,
      jobs: prev.jobs?.filter((_, i) => i !== index) || []
    }))
  }

  const updateJob = (index: number, field: string, value: string | boolean) => {
    setWorkExperience(prev => ({
      ...prev,
      jobs: prev.jobs?.map((job, i) => 
        i === index ? { ...job, [field]: value } : job
      ) || []
    }))
  }

  const addCertification = () => {
    setAdditionalCertifications(prev => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { name: '', provider: '', completionDate: '', relevance: '' }
      ]
    }))
  }

  const removeCertification = (index: number) => {
    setAdditionalCertifications(prev => ({
      ...prev,
      certifications: prev.certifications?.filter((_, i) => i !== index) || []
    }))
  }

  const updateCertification = (index: number, field: string, value: string) => {
    setAdditionalCertifications(prev => ({
      ...prev,
      certifications: prev.certifications?.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      ) || []
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (workExperience.hasWorkExperience && (!workExperience.jobs || workExperience.jobs.length === 0)) {
      newErrors.jobs = 'Please add at least one job if you have work experience'
    }

    if (freelancingExperience.hasFreelancing) {
      if (!freelancingExperience.type) newErrors.freelancingType = 'Freelancing type is required'
      if (!freelancingExperience.duration) newErrors.freelancingDuration = 'Duration is required'
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
          step: 'work-experience',
          data: {
            workExperience,
            freelancingExperience,
            languageProficiency,
            additionalCertifications,
            extracurricularActivities
          }
        })
      })

      if (response.ok) {
        router.push('/onboarding/profile/target-program')
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
    router.push('/onboarding/profile/academic')
  }

  const testTypeOptions = [
    { value: 'IELTS', label: 'IELTS' },
    { value: 'TOEFL', label: 'TOEFL' },
    { value: 'Other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Work Experience & Skills</h1>
        <p className="text-muted-foreground mb-4">
          Tell us about your professional experience, language skills, and additional qualifications
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={50} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 4 of 8</p>
        </div>
      </div>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Experience</CardTitle>
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
                      <Trash2 className="w-4 h-4" />
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
                    <FormInput
                      label="Duration"
                      value={job.duration}
                      onChange={(e) => updateJob(index, 'duration', e.target.value)}
                      placeholder="e.g., Jan 2020 - Dec 2022"
                    />
                    <FormInput
                      label="Location"
                      value={job.location || ''}
                      onChange={(e) => updateJob(index, 'location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`remote-${index}`}
                      checked={job.isRemote || false}
                      onCheckedChange={(checked) => updateJob(index, 'isRemote', !!checked)}
                    />
                    <Label htmlFor={`remote-${index}`}>Remote work</Label>
                  </div>
                  <FormTextarea
                    label="Key Responsibilities & Achievements"
                    value={job.responsibilities}
                    onChange={(e) => updateJob(index, 'responsibilities', e.target.value)}
                    placeholder="Describe your main responsibilities and achievements"
                    rows={3}
                  />
                </div>
              ))}
              
              <Button variant="outline" onClick={addJob}>
                <Plus className="w-4 h-4 mr-2" />
                Add Another Job
              </Button>
            </div>
          )}

          {errors.jobs && (
            <p className="text-sm text-red-600">{errors.jobs}</p>
          )}
        </CardContent>
      </Card>

      {/* Freelancing Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Freelancing & Remote Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasFreelancing"
              checked={freelancingExperience.hasFreelancing || false}
              onCheckedChange={(checked) => handleFreelancingChange('hasFreelancing', !!checked)}
            />
            <Label htmlFor="hasFreelancing">I have freelancing or remote work experience</Label>
          </div>

          {freelancingExperience.hasFreelancing && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Type of Freelancing"
                  required
                  value={freelancingExperience.type || ''}
                  onChange={(e) => handleFreelancingChange('type', e.target.value)}
                  placeholder="e.g., Graphic Designer, Web Developer"
                  error={errors.freelancingType}
                />

                <FormInput
                  label="Duration"
                  required
                  value={freelancingExperience.duration || ''}
                  onChange={(e) => handleFreelancingChange('duration', e.target.value)}
                  placeholder="e.g., Feb 2019 to present"
                  error={errors.freelancingDuration}
                />

                <FormInput
                  label="Client Type/Location"
                  value={freelancingExperience.clients || ''}
                  onChange={(e) => handleFreelancingChange('clients', e.target.value)}
                  placeholder="e.g., Australian company, International clients"
                />

                <FormInput
                  label="Recognition/Performance"
                  value={freelancingExperience.recognition || ''}
                  onChange={(e) => handleFreelancingChange('recognition', e.target.value)}
                  placeholder="e.g., Top performing employee"
                />
              </div>

              <FormTextarea
                label="Skills & Tools Used"
                value={freelancingExperience.skills || ''}
                onChange={(e) => handleFreelancingChange('skills', e.target.value)}
                placeholder="List the main skills, tools, and technologies you use in your freelancing work"
                rows={3}
              />
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

          <FormInput
            label="Other Languages"
            value={languageProficiency.otherLanguages?.join(', ') || ''}
            onChange={(e) => handleLanguageChange('otherLanguages', e.target.value.split(',').map(lang => lang.trim()).filter(Boolean))}
            placeholder="e.g., Japanese, Arabic, French (comma separated)"
          />
        </CardContent>
      </Card>

      {/* Additional Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Certifications & Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasCertifications"
              checked={additionalCertifications.hasCertifications || false}
              onCheckedChange={(checked) => setAdditionalCertifications(prev => ({ ...prev, hasCertifications: !!checked }))}
            />
            <Label htmlFor="hasCertifications">I have completed additional courses or certifications</Label>
          </div>

          {additionalCertifications.hasCertifications && (
            <div className="space-y-4">
              {additionalCertifications.certifications?.map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Certification {index + 1}</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput
                      label="Course/Certification Name"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      placeholder="e.g., Advanced Java Programming"
                    />
                    <FormInput
                      label="Provider/Institution"
                      value={cert.provider}
                      onChange={(e) => updateCertification(index, 'provider', e.target.value)}
                      placeholder="e.g., Coursera, University"
                    />
                    <FormInput
                      label="Completion Date"
                      type="date"
                      value={cert.completionDate}
                      onChange={(e) => updateCertification(index, 'completionDate', e.target.value)}
                    />
                    <FormInput
                      label="Relevance to Studies"
                      value={cert.relevance}
                      onChange={(e) => updateCertification(index, 'relevance', e.target.value)}
                      placeholder="How this relates to your target program"
                    />
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addCertification}>
                <Plus className="w-4 h-4 mr-2" />
                Add Another Certification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Academic Background
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Next: Target Program'}
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