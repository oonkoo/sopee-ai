// components/onboarding/AdditionalInformationForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { FormInput, FormTextarea } from '@/components/ui/form-field'
// import { updateOnboardingProgress } from '@/lib/kinde'
import type { User } from '@/types/auth'
import type { StudentProfile, PreviousVisaHistory, ExtracurricularActivities } from '@/types/profile'

interface AdditionalInformationFormProps {
  user: User
  existingProfile: StudentProfile | null
}

interface AdditionalLanguageTests {
  hasAdditional: boolean
  testName: string
  level: string
  completionDate: string
}

export default function AdditionalInformationForm({ user, existingProfile }: AdditionalInformationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [previousVisaHistory, setPreviousVisaHistory] = useState<Partial<PreviousVisaHistory>>(
    existingProfile?.previousVisaHistory || {
      hasTravelHistory: false,
      countriesVisited: [],
      previousVisaApplications: [],
      currentVisaStatus: ''
    }
  )

  const [extracurricularActivities, setExtracurricularActivities] = useState<Partial<ExtracurricularActivities>>(
    existingProfile?.extracurricularActivities || {
      leadership: [],
      volunteering: [],
      sports: [],
      achievements: [],
      hobbies: []
    }
  )

  const [additionalLanguageTests, setAdditionalLanguageTests] = useState<Partial<AdditionalLanguageTests>>(
    existingProfile?.additionalLanguageTests || {
      hasAdditional: false,
      testName: '',
      level: '',
      completionDate: ''
    }
  )

  const [passportNumber, setPassportNumber] = useState<string>(
    existingProfile?.passportNumber || ''
  )

  const [additionalInfo, setAdditionalInfo] = useState<string>(
    existingProfile?.additionalInfo || ''
  )

  const [familyInTargetCountry, setFamilyInTargetCountry] = useState<{
    hasFamily: boolean
    relationship: string[]
    location: string
  }>(
    existingProfile?.familyInTargetCountry || {
      hasFamily: false,
      relationship: [],
      location: ''
    }
  )

  const handleVisaHistoryChange = (field: keyof PreviousVisaHistory, value: unknown) => {
    setPreviousVisaHistory(prev => ({ ...prev, [field]: value }))
  }

  const handleExtracurricularChange = (field: keyof ExtracurricularActivities, value: string) => {
    const activities = value.split(',').map(item => item.trim()).filter(Boolean)
    setExtracurricularActivities(prev => ({ ...prev, [field]: activities }))
  }

  const handleLanguageTestChange = (field: keyof AdditionalLanguageTests, value: string | boolean) => {
    setAdditionalLanguageTests(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (passportNumber && !/^[A-Z0-9]{6,12}$/.test(passportNumber)) {
      newErrors.passportNumber = 'Please enter a valid passport number'
    }

    if (additionalLanguageTests.hasAdditional) {
      if (!additionalLanguageTests.testName) newErrors.testName = 'Test name is required'
      if (!additionalLanguageTests.level) newErrors.level = 'Level/score is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

    const handleComplete = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
        const response = await fetch('/api/onboarding/profile-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            step: 'additional',
            data: {
            previousVisaHistory: {
                ...previousVisaHistory,
                familyInTargetCountry // Add this to the visa history
            },
            extracurricularActivities,
            additionalLanguageTests,
            passportNumber,
            additionalInfo,
            familyInTargetCountry // Also include separately
            }
        })
        })

        if (response.ok) {
        // Mark onboarding as completed
        await fetch('/api/onboarding/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })

        // Redirect to appropriate dashboard
        const countryDashboard = user.targetCountry === 'CANADA' 
            ? '/canada/dashboard' 
            : '/australia/dashboard'
        
        router.push(countryDashboard)
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
    router.push('/onboarding/profile/financial')
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Additional Information</h1>
        <p className="text-muted-foreground mb-4">
          Final details to complete your comprehensive profile
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 8 of 8</p>
        </div>
      </div>

      {/* Passport Information */}
      <Card>
        <CardHeader>
          <CardTitle>Passport Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            label="Passport Number"
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
            placeholder="e.g., A07248078"
            error={errors.passportNumber}
          />
          <p className="text-sm text-muted-foreground">
            Your passport number as it appears on your passport document
          </p>
        </CardContent>
      </Card>

      {/* Travel & Visa History */}
      <Card>
        <CardHeader>
          <CardTitle>Travel & Visa History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasTravelHistory"
              checked={previousVisaHistory.hasTravelHistory || false}
              onCheckedChange={(checked) => handleVisaHistoryChange('hasTravelHistory', !!checked)}
            />
            <Label htmlFor="hasTravelHistory">I have traveled internationally before</Label>
          </div>

          {previousVisaHistory.hasTravelHistory && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <FormInput
                label="Countries Visited"
                value={previousVisaHistory.countriesVisited?.join(', ') || ''}
                onChange={(e) => handleVisaHistoryChange('countriesVisited', e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                placeholder="e.g., Thailand, Malaysia, India (comma separated)"
              />

              <FormInput
                label="Current Visa Status"
                value={previousVisaHistory.currentVisaStatus || ''}
                onChange={(e) => handleVisaHistoryChange('currentVisaStatus', e.target.value)}
                placeholder="e.g., No current visa, Tourist visa to Thailand"
              />
            </div>
          )}

        <div className="space-y-4">
            <p className="font-medium text-sm">Family in Target Country:</p>
            
            <div className="flex items-center space-x-2">
                <Checkbox
                id="hasFamilyInTargetCountry"
                checked={familyInTargetCountry.hasFamily}
                onCheckedChange={(checked) => setFamilyInTargetCountry(prev => ({ 
                    ...prev, 
                    hasFamily: !!checked,
                    // Reset other fields if unchecked
                    relationship: !!checked ? prev.relationship : [],
                    location: !!checked ? prev.location : ''
                }))}
                />
                <Label htmlFor="hasFamilyInTargetCountry">
                I have family/relatives living in {user.targetCountry}
                </Label>
            </div>

            {familyInTargetCountry.hasFamily && (
                <div className="space-y-3 p-4 bg-muted rounded-lg ml-6">
                <FormInput
                    label="Relationship to Family Members"
                    value={familyInTargetCountry.relationship.join(', ')}
                    onChange={(e) => setFamilyInTargetCountry(prev => ({
                    ...prev,
                    relationship: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                    }))}
                    placeholder="e.g., Uncle, Cousin, Brother (comma separated)"
                />
                
                <FormInput
                    label="Their Location/City"
                    value={familyInTargetCountry.location}
                    onChange={(e) => setFamilyInTargetCountry(prev => ({
                    ...prev,
                    location: e.target.value
                    }))}
                    placeholder="e.g., Toronto, Sydney, Vancouver"
                />
                
                <p className="text-xs text-muted-foreground">
                    Having family in the target country may affect your visa application. Please provide accurate information.
                </p>
                </div>
            )}

            {!familyInTargetCountry.hasFamily && (
                <div className="text-xs text-primary ml-6">
                ✓ No family ties in {user.targetCountry} - this strengthens your genuine temporary entrant status
                </div>
            )}
        </div>
        </CardContent>
      </Card>

      {/* Additional Language Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Language Qualifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasAdditionalLanguageTests"
              checked={additionalLanguageTests.hasAdditional || false}
              onCheckedChange={(checked) => handleLanguageTestChange('hasAdditional', !!checked)}
            />
            <Label htmlFor="hasAdditionalLanguageTests">I have completed additional language tests/courses</Label>
          </div>

          {additionalLanguageTests.hasAdditional && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Test/Course Name"
                  required
                  value={additionalLanguageTests.testName || ''}
                  onChange={(e) => handleLanguageTestChange('testName', e.target.value)}
                  placeholder="e.g., Japanese Language NAT-Test"
                  error={errors.testName}
                />

                <FormInput
                  label="Level/Score"
                  required
                  value={additionalLanguageTests.level || ''}
                  onChange={(e) => handleLanguageTestChange('level', e.target.value)}
                  placeholder="e.g., N5, Intermediate"
                  error={errors.level}
                />

                <FormInput
                  label="Completion Date"
                  type="date"
                  value={additionalLanguageTests.completionDate || ''}
                  onChange={(e) => handleLanguageTestChange('completionDate', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracurricular Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Extracurricular Activities & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Leadership Experience"
              value={extracurricularActivities.leadership?.join(', ') || ''}
              onChange={(e) => handleExtracurricularChange('leadership', e.target.value)}
              placeholder="e.g., Student council, Team leader (comma separated)"
            />

            <FormInput
              label="Volunteering Activities"
              value={extracurricularActivities.volunteering?.join(', ') || ''}
              onChange={(e) => handleExtracurricularChange('volunteering', e.target.value)}
              placeholder="e.g., Community service, NGO work (comma separated)"
            />

            <FormInput
              label="Sports & Recreation"
              value={extracurricularActivities.sports?.join(', ') || ''}
              onChange={(e) => handleExtracurricularChange('sports', e.target.value)}
              placeholder="e.g., Football, Cricket, Swimming (comma separated)"
            />

            <FormInput
              label="Achievements & Awards"
              value={extracurricularActivities.achievements?.join(', ') || ''}
              onChange={(e) => handleExtracurricularChange('achievements', e.target.value)}
              placeholder="e.g., Academic excellence, Sports awards (comma separated)"
            />
          </div>

          <FormInput
            label="Hobbies & Interests"
            value={extracurricularActivities.hobbies?.join(', ') || ''}
            onChange={(e) => handleExtracurricularChange('hobbies', e.target.value)}
            placeholder="e.g., Reading, Photography, Music (comma separated)"
          />
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Any Other Relevant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormTextarea
            label="Additional Information"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Any other information you would like to include in your SOP (optional)"
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            This section is optional but can be used to highlight any unique circumstances, achievements, or information that strengthens your application.
          </p>
        </CardContent>
      </Card>

      {/* Completion Summary */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Ready to Complete Profile</h3>
          </div>
          <p className="text-foreground mb-4">
            You&apos;re about to complete your comprehensive student profile! This information will be used to generate personalized, high-quality SOP letters that align with visa officer expectations for {user.targetCountry}.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>✓ Personal and family information collected</p>
            <p>✓ Academic and professional background documented</p>
            <p>✓ Target program and motivation detailed</p>
            <p>✓ Future plans and home country ties established</p>
            <p>✓ Financial planning completed</p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Financial Information
        </Button>

        <Button onClick={handleComplete} disabled={isLoading}>
          {isLoading ? 'Completing...' : 'Complete Profile & Continue'}
          <CheckCircle className="ml-2 h-4 w-4" />
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