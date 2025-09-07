// components/onboarding/PersonalInfoForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-field'
import type { User } from '@/types/auth'
import type { StudentProfile, PersonalInfo, FamilyBackground, MaritalStatus } from '@/types/profile'

interface PersonalInfoFormProps {
  user: User
  existingProfile: StudentProfile | null
}

export default function PersonalInfoForm({ user, existingProfile }: PersonalInfoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data
  const [personalInfo, setPersonalInfo] = useState<Partial<PersonalInfo>>(
    existingProfile?.personalInfo || {
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      dateOfBirth: '',
      nationality: '',
      country: '',
      phoneNumber: '',
      address: ''
    }
  )

  const [passportNumber, setPassportNumber] = useState<string>(
    existingProfile?.passportNumber || ''
  )

  const [familyBackground, setFamilyBackground] = useState<Partial<FamilyBackground>>(
    existingProfile?.familyBackground || {
      parentsOccupation: '',
      familyIncome: '',
      siblings: 0,
      familyBusiness: '',
      familySupport: ''
    }
  )

  const [maritalStatus, setMaritalStatus] = useState<Partial<MaritalStatus>>(
    existingProfile?.maritalStatus || {
      status: 'single',
      hasSpouse: false,
      hasChildren: false,
      dependents: { hasDependents: false, relationship: [], careArrangements: '' }
    }
  )

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFamilyBackgroundChange = (field: keyof FamilyBackground, value: string | number) => {
    setFamilyBackground(prev => ({ ...prev, [field]: value }))
  }

  const handleMaritalStatusChange = (field: string, value: unknown) => {
    setMaritalStatus(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!personalInfo.fullName) newErrors.fullName = 'Full name is required'
    if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!personalInfo.nationality) newErrors.nationality = 'Nationality is required'
    if (!personalInfo.country) newErrors.country = 'Current country is required'
    if (!personalInfo.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
    if (!personalInfo.address) newErrors.address = 'Address is required'
    if (passportNumber && !/^[A-Z0-9]{6,12}$/.test(passportNumber)) {
      newErrors.passportNumber = 'Please enter a valid passport number (6-12 characters)'
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
          step: 'personal',
          data: {
            personalInfo,
            familyBackground,
            maritalStatus,
            passportNumber: passportNumber || undefined
          }
        })
      })

      if (response.ok) {
        router.push('/onboarding/profile/family-background')
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
    router.push('/onboarding/country-select')
  }

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ]

  const familyIncomeOptions = [
    { value: '', label: 'Select family income range' },
    { value: 'below_50k', label: 'Below $50,000' },
    { value: '50k_100k', label: '$50,000 - $100,000' },
    { value: '100k_200k', label: '$100,000 - $200,000' },
    { value: '200k_500k', label: '$200,000 - $500,000' },
    { value: 'above_500k', label: 'Above $500,000' }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Personal Information</h1>
        <p className="text-muted-foreground mb-4">
          Tell us about yourself and your family background
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={12.5} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 1 of 8</p>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              required
              value={personalInfo.fullName || ''}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
              placeholder="Enter your full name as on passport"
              error={errors.fullName}
            />

            <FormInput
              label="Date of Birth"
              required
              type="date"
              value={personalInfo.dateOfBirth || ''}
              onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
            />

            <FormInput
              label="Nationality"
              required
              value={personalInfo.nationality || ''}
              onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
              placeholder="e.g., Bangladeshi, Indian"
              error={errors.nationality}
            />

            <FormInput
              label="Current Country"
              required
              value={personalInfo.country || ''}
              onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
              placeholder="Country you're currently residing in"
              error={errors.country}
            />

            <FormInput
              label="Phone Number"
              required
              value={personalInfo.phoneNumber || ''}
              onChange={(e) => handlePersonalInfoChange('phoneNumber', e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              error={errors.phoneNumber}
            />
          </div>

          <FormTextarea
            label="Current Address"
            required
            value={personalInfo.address || ''}
            onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
            placeholder="Your complete current residential address"
            rows={3}
            error={errors.address}
          />

          <FormInput
            label="Passport Number"
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
            placeholder="e.g., A07248078"
            error={errors.passportNumber}
          />
        </CardContent>
      </Card>

      {/* Family Background */}
      <Card>
        <CardHeader>
          <CardTitle>Family Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Parents' Occupation"
              value={familyBackground.parentsOccupation || ''}
              onChange={(e) => handleFamilyBackgroundChange('parentsOccupation', e.target.value)}
              placeholder="e.g., Teacher & Engineer"
            />

            <FormSelect
              label="Family Income Range"
              value={familyBackground.familyIncome || ''}
              onChange={(e) => handleFamilyBackgroundChange('familyIncome', e.target.value)}
              options={familyIncomeOptions}
            />

            <FormInput
              label="Number of Siblings"
              type="number"
              value={familyBackground.siblings?.toString() || '0'}
              onChange={(e) => handleFamilyBackgroundChange('siblings', parseInt(e.target.value) || 0)}
              placeholder="0"
            />

            <FormInput
              label="Family Business (if any)"
              value={familyBackground.familyBusiness || ''}
              onChange={(e) => handleFamilyBackgroundChange('familyBusiness', e.target.value)}
              placeholder="Type of business or N/A"
            />
          </div>

          <FormTextarea
            label="Family Support for Education"
            value={familyBackground.familySupport || ''}
            onChange={(e) => handleFamilyBackgroundChange('familySupport', e.target.value)}
            placeholder="Describe how your family supports your educational goals"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Marital Status */}
      <Card>
        <CardHeader>
          <CardTitle>Marital Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormSelect
            label="Marital Status"
            value={maritalStatus.status || 'single'}
            onChange={(e) => handleMaritalStatusChange('status', e.target.value)}
            options={maritalStatusOptions}
          />

          {maritalStatus.status === 'married' && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Spouse Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Spouse Name"
                  value={maritalStatus.spouseDetails?.name || ''}
                  onChange={(e) => handleMaritalStatusChange('spouseDetails', {
                    ...maritalStatus.spouseDetails,
                    name: e.target.value
                  })}
                  placeholder="Spouse's full name"
                />
                <FormInput
                  label="Spouse Occupation"
                  value={maritalStatus.spouseDetails?.occupation || ''}
                  onChange={(e) => handleMaritalStatusChange('spouseDetails', {
                    ...maritalStatus.spouseDetails,
                    occupation: e.target.value
                  })}
                  placeholder="Spouse's occupation"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Country Selection
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Next: Family Background'}
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