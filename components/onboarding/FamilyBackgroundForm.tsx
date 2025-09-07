// components/onboarding/FamilyBackgroundForm.tsx (Update the imports and interface usage)
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
import type { 
  StudentProfile, 
  ParentsDetails, 
 
  TravelingCompanion, 
  StrongFamilyBonds 
} from '@/types/profile'

interface FamilyBackgroundFormProps {
  user: User
  existingProfile: StudentProfile | null
}

export default function FamilyBackgroundForm({ existingProfile }: FamilyBackgroundFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [parentsDetails, setParentsDetails] = useState<Partial<ParentsDetails>>(
    existingProfile?.parentsDetails || {
      fatherName: '',
      motherName: '',
      fatherOccupation: '',
      motherOccupation: '',
      fatherStatus: 'alive',
      pensionDetails: ''
    }
  )

  const [propertyOwnership, setPropertyOwnership] = useState<boolean>(
    existingProfile?.propertyOwnership || false
  )

  const [businessOwnership, setBusinessOwnership] = useState<{
    hasBusinessOwnership: boolean
    businessName: string
    businessType: string
    ownershipRole: string
    incomeFromBusiness: string
  }>(
    existingProfile?.businessOwnership || {
      hasBusinessOwnership: false,
      businessName: '',
      businessType: '',
      ownershipRole: '',
      incomeFromBusiness: ''
    }
  )

  const [travelingCompanion, setTravelingCompanion] = useState<Partial<TravelingCompanion>>(
    existingProfile?.travelingCompanion || {
      hasTravelingCompanion: false,
      companionName: '',
      relationship: '',
      sameProgram: false,
      separateVisa: true
    }
  )

  const [strongFamilyBonds, setStrongFamilyBonds] = useState<Partial<StrongFamilyBonds>>(
    existingProfile?.strongFamilyBonds || {
      bondDescription: '',
      familySupport: '',
      familyExpectations: '',
      communicationFrequency: ''
    }
  )

  // ... rest of the component remains the same
  const handleParentsDetailsChange = (field: keyof ParentsDetails, value: string) => {
    setParentsDetails(prev => ({ ...prev, [field]: value }))
  }

  // const handleBusinessOwnershipChange = (field: keyof BusinessOwnership, value: string | boolean) => {
  //   setBusinessOwnership(prev => ({ ...prev, [field]: value }))
  // }

  const handleTravelingCompanionChange = (field: keyof TravelingCompanion, value: string | boolean) => {
    setTravelingCompanion(prev => ({ ...prev, [field]: value }))
  }

  const handleStrongFamilyBondsChange = (field: keyof StrongFamilyBonds, value: string) => {
    setStrongFamilyBonds(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!parentsDetails.fatherName) newErrors.fatherName = 'Father name is required'
    if (!parentsDetails.motherName) newErrors.motherName = 'Mother name is required'
    if (!parentsDetails.fatherOccupation) newErrors.fatherOccupation = 'Father occupation is required'
    if (!parentsDetails.motherOccupation) newErrors.motherOccupation = 'Mother occupation is required'

    if (businessOwnership.hasBusinessOwnership) {
      if (!businessOwnership.businessName) newErrors.businessName = 'Business name is required'
      if (!businessOwnership.businessType) newErrors.businessType = 'Business type is required'
    }

    if (travelingCompanion.hasTravelingCompanion) {
      if (!travelingCompanion.companionName) newErrors.companionName = 'Companion name is required'
      if (!travelingCompanion.relationship) newErrors.relationship = 'Relationship is required'
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
          step: 'family-background',
          data: {
            propertyOwnership,
            businessOwnership,
            parentsDetails,
            strongFamilyBonds,
            travelingCompanion
          }
        })
      })

      if (response.ok) {
        router.push('/onboarding/profile/academic')
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
    router.push('/onboarding/profile/personal')
  }

  const fatherStatusOptions = [
    { value: 'alive', label: 'Alive' },
    { value: 'deceased', label: 'Deceased' }
  ]

  const relationshipOptions = [
    { value: '', label: 'Select relationship' },
    { value: 'twin_sister', label: 'Twin Sister' },
    { value: 'twin_brother', label: 'Twin Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'brother', label: 'Brother' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Family Background & Relationships</h1>
        <p className="text-muted-foreground mb-4">
          Detailed information about your family, their occupations, and relationships
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={25} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 2 of 8</p>
        </div>
      </div>

      {/* Parents Details */}
      <Card>
        <CardHeader>
          <CardTitle>Parents Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Father's Full Name"
              required
              value={parentsDetails.fatherName || ''}
              onChange={(e) => handleParentsDetailsChange('fatherName', e.target.value)}
              placeholder="Father's complete name"
              error={errors.fatherName}
            />

            <FormInput
              label="Mother's Full Name"
              required
              value={parentsDetails.motherName || ''}
              onChange={(e) => handleParentsDetailsChange('motherName', e.target.value)}
              placeholder="Mother's complete name"
              error={errors.motherName}
            />

            <FormInput
              label="Father's Occupation"
              required
              value={parentsDetails.fatherOccupation || ''}
              onChange={(e) => handleParentsDetailsChange('fatherOccupation', e.target.value)}
              placeholder="e.g., Government employee, Businessman"
              error={errors.fatherOccupation}
            />

            <FormInput
              label="Mother's Occupation"
              required
              value={parentsDetails.motherOccupation || ''}
              onChange={(e) => handleParentsDetailsChange('motherOccupation', e.target.value)}
              placeholder="e.g., Businesswoman, Housewife"
              error={errors.motherOccupation}
            />

            <FormSelect
              label="Father's Status"
              value={parentsDetails.fatherStatus || 'alive'}
              onChange={(e) => handleParentsDetailsChange('fatherStatus', e.target.value as 'alive' | 'deceased')}
              options={fatherStatusOptions}
            />

            {parentsDetails.fatherStatus === 'deceased' && (
              <FormTextarea
                label="Pension/Inheritance Details"
                value={parentsDetails.pensionDetails || ''}
                onChange={(e) => handleParentsDetailsChange('pensionDetails', e.target.value)}
                placeholder="Details about pension, inheritance, or family support"
                rows={3}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property & Business Ownership */}
      <Card>
        <CardHeader>
          <CardTitle>Property & Business Ownership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="propertyOwnership"
              checked={propertyOwnership}
              onCheckedChange={(checked) => setPropertyOwnership(!!checked)}
            />
            <Label htmlFor="propertyOwnership">
              Family owns property/land in home country
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasBusinessOwnership"
              checked={businessOwnership.hasBusinessOwnership}
              onCheckedChange={(checked) => setBusinessOwnership(prev => ({ 
                ...prev, 
                hasBusinessOwnership: !!checked 
              }))}
            />
            <Label htmlFor="hasBusinessOwnership">
              Family owns or runs a business
            </Label>
          </div>

          {businessOwnership.hasBusinessOwnership && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormInput
                label="Business Name"
                required
                value={businessOwnership.businessName}
                onChange={(e) => setBusinessOwnership(prev => ({ 
                  ...prev, 
                  businessName: e.target.value 
                }))}
                placeholder="e.g., Bismillah Pipe and Sanitary"
                error={errors.businessName}
              />

              <FormInput
                label="Business Type"
                required
                value={businessOwnership.businessType}
                onChange={(e) => setBusinessOwnership(prev => ({ 
                  ...prev, 
                  businessType: e.target.value 
                }))}
                placeholder="e.g., Wholesale/Retail, Manufacturing"
                error={errors.businessType}
              />

              <FormInput
                label="Your Role/Future Role"
                value={businessOwnership.ownershipRole}
                onChange={(e) => setBusinessOwnership(prev => ({ 
                  ...prev, 
                  ownershipRole: e.target.value 
                }))}
                placeholder="e.g., Heir, Partner, Manager"
              />

              <FormInput
                label="Annual Business Income"
                value={businessOwnership.incomeFromBusiness}
                onChange={(e) => setBusinessOwnership(prev => ({ 
                  ...prev, 
                  incomeFromBusiness: e.target.value 
                }))}
                placeholder="e.g., $50,000 - $100,000"
              />
            </div>
          )}
        </CardContent>
      </Card>


      {/* Traveling Companions */}
      <Card>
        <CardHeader>
          <CardTitle>Travel & Study Companions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasTravelingCompanion"
              checked={travelingCompanion.hasTravelingCompanion || false}
              onCheckedChange={(checked) => handleTravelingCompanionChange('hasTravelingCompanion', !!checked)}
            />
            <Label htmlFor="hasTravelingCompanion">I will be traveling/studying with someone I know</Label>
          </div>

          {travelingCompanion.hasTravelingCompanion && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Companion's Name"
                  required
                  value={travelingCompanion.companionName || ''}
                  onChange={(e) => handleTravelingCompanionChange('companionName', e.target.value)}
                  placeholder="Full name of travel companion"
                  error={errors.companionName}
                />

                <FormSelect
                  label="Relationship"
                  required
                  value={travelingCompanion.relationship || ''}
                  onChange={(e) => handleTravelingCompanionChange('relationship', e.target.value)}
                  options={relationshipOptions}
                  error={errors.relationship}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameProgram"
                    checked={travelingCompanion.sameProgram || false}
                    onCheckedChange={(checked) => handleTravelingCompanionChange('sameProgram', !!checked)}
                  />
                  <Label htmlFor="sameProgram">We will study the same program</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="separateVisa"
                    checked={travelingCompanion.separateVisa || true}
                    onCheckedChange={(checked) => handleTravelingCompanionChange('separateVisa', !!checked)}
                  />
                  <Label htmlFor="separateVisa">We will apply for separate student visas</Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Relationships */}
      <Card>
        <CardHeader>
          <CardTitle>Family Bonds & Support System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label="Describe Your Family Relationships"
            value={strongFamilyBonds.bondDescription || ''}
            onChange={(e) => handleStrongFamilyBondsChange('bondDescription', e.target.value)}
            placeholder="Describe the strength of your family bonds and relationships"
            rows={4}
          />

          <FormTextarea
            label="Family Support for Your Studies"
            value={strongFamilyBonds.familySupport || ''}
            onChange={(e) => handleStrongFamilyBondsChange('familySupport', e.target.value)}
            placeholder="How does your family support your educational goals?"
            rows={3}
          />

          <FormTextarea
            label="Family Expectations After Graduation"
            value={strongFamilyBonds.familyExpectations || ''}
            onChange={(e) => handleStrongFamilyBondsChange('familyExpectations', e.target.value)}
            placeholder="What does your family expect from you after completing your studies?"
            rows={3}
          />

          <FormInput
            label="Communication Frequency"
            value={strongFamilyBonds.communicationFrequency || ''}
            onChange={(e) => handleStrongFamilyBondsChange('communicationFrequency', e.target.value)}
            placeholder="e.g., Daily calls, Weekly video chats"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Personal Info
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Next: Academic Background'}
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