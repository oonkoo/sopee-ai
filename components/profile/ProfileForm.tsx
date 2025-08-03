// components/profile/ProfileForm.tsx
/* eslint-disable  @typescript-eslint/no-explicit-any */

'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import PersonalInfoStep from './steps/PersonalInfoStep'
import AcademicStep from './steps/AcademicStep'
import TargetProgramStep from './steps/TargetProgramStep'
import FinancialStep from './steps/FinancialStep'
import { personalInfoSchema, academicBackgroundSchema, targetProgramSchema, financialInfoSchema } from '@/lib/validations/profile'
import type { PersonalInfo, AcademicBackground, TargetProgram, FinancialInfo, StudentProfile } from '@/types/profile'

interface ProfileFormProps {
  initialData?: StudentProfile | null
  isUpdate?: boolean
}

interface FieldErrors {
  personalInfo?: Record<string, string>
  academicBackground?: Record<string, string>
  targetProgram?: Record<string, string>
  financialInfo?: Record<string, string>
}

export default function ProfileForm({ initialData, isUpdate = false }: ProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState<string>('')
  const [formData, setFormData] = useState({
    personalInfo: initialData?.personalInfo || {} as Partial<PersonalInfo>,
    academicBackground: initialData?.academicBackground || {} as Partial<AcademicBackground>,
    targetProgram: initialData?.targetProgram || {} as Partial<TargetProgram>,
    financialInfo: initialData?.financialInfo || {} as Partial<FinancialInfo>
  })

  const steps = [
    { id: 1, title: 'Personal Information', component: PersonalInfoStep, schema: personalInfoSchema, key: 'personalInfo' },
    { id: 2, title: 'Academic Background', component: AcademicStep, schema: academicBackgroundSchema, key: 'academicBackground' },
    { id: 3, title: 'Target Program', component: TargetProgramStep, schema: targetProgramSchema, key: 'targetProgram' },
    { id: 4, title: 'Financial Information', component: FinancialStep, schema: financialInfoSchema, key: 'financialInfo' }
  ]

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data }
    }))
    
    // Clear errors for this section when user makes changes
    setFieldErrors(prev => ({
      ...prev,
      [section]: {}
    }))
    setGeneralError('')
  }

  const validateCurrentStep = () => {
    const currentStepKey = steps[currentStep - 1].key
    const currentStepData = formData[currentStepKey as keyof typeof formData]
    const currentSchema = steps[currentStep - 1].schema
    
    const result = currentSchema.safeParse(currentStepData)
    
    if (!result.success) {
      const stepErrors: Record<string, string> = {}
      result.error.errors.forEach(err => {
        const field = err.path[0] as string
        stepErrors[field] = err.message
      })
      
      setFieldErrors(prev => ({
        ...prev,
        [currentStepKey]: stepErrors
      }))
      return false
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [currentStepKey]: {}
    }))
    return true
  }

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const parseApiErrors = (details: any[]) => {
    const errors: FieldErrors = {}
    
    details.forEach(detail => {
      const [section, field] = detail.field.split('.')
      if (!errors[section as keyof FieldErrors]) {
        errors[section as keyof FieldErrors] = {}
      }
      errors[section as keyof FieldErrors]![field] = detail.message
    })
    
    return errors
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return
    }

    setIsLoading(true)
    setFieldErrors({})
    setGeneralError('')
    
    try {
      const response = await fetch('/api/profile', {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        window.location.href = '/dashboard'
      } else {
        if (result.details) {
          setFieldErrors(parseApiErrors(result.details))
        } else {
          setGeneralError(result.error || 'Failed to save profile')
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      setGeneralError('An error occurred while saving profile')
    } finally {
      setIsLoading(false)
    }
  }

  const currentStepKey = steps[currentStep - 1].key
  const CurrentStepComponent = steps[currentStep - 1].component
  const currentStepErrors = fieldErrors[currentStepKey as keyof FieldErrors] || {}

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step.id}
            </div>
            <span className="ml-2 text-sm hidden md:block">{step.title}</span>
          </div>
        ))}
      </div>

      {/* General Error */}
      {generalError && (
        <Alert variant="destructive">
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            data={formData[currentStepKey as keyof typeof formData]}
            onUpdate={(data: any) => updateFormData(currentStepKey, data)}
            errors={currentStepErrors}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : isUpdate ? 'Update Profile' : 'Create Profile'}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}