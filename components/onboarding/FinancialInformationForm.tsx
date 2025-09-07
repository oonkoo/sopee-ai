// components/onboarding/FinancialInformationForm.tsx
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
import type { StudentProfile, FinancialInfo, SponsorshipDetails } from '@/types/profile'

interface FinancialInformationFormProps {
  user: User
  existingProfile: StudentProfile | null
}

interface TuitionAndCosts {
  tuitionFees: {
    amount: string
    currency: string
    duration: string
  }
  livingCosts: {
    estimatedAmount: string
    currency: string
    breakdown: string
  }
  additionalCosts: {
    healthInsurance: string
    studyMaterials: string
    transportation: string
    other: string
  }
}

interface AccommodationPlans {
  hasAccommodationPlan: boolean
  accommodationType: string
  location: string
  cost: string
  duration: string
  amenities: string
}

interface SalaryExpectations {
  withDegree: {
    amount: string
    currency: string
    timeframe: string
  }
  withoutDegree: {
    amount: string
    currency: string
    timeframe: string
  }
  careerGrowthExpectation: string
}


export default function FinancialInformationForm({ existingProfile }: FinancialInformationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [financialInfo, setFinancialInfo] = useState<Partial<FinancialInfo>>(
    existingProfile?.financialInfo || {
      totalCost: '',
      currency: '',
      fundingSource: '',
      sponsorName: '',
      bankBalance: ''
    }
  )

  const [tuitionAndCosts, setTuitionAndCosts] = useState<Partial<TuitionAndCosts>>(
    existingProfile?.tuitionAndCosts as TuitionAndCosts || {
      tuitionFees: { amount: '', currency: '', duration: '' },
      livingCosts: { estimatedAmount: '', currency: '', breakdown: '' },
      additionalCosts: { healthInsurance: '', studyMaterials: '', transportation: '', other: '' }
    }
  )

  const [sponsorshipDetails, setSponsorshipDetails] = useState<Partial<SponsorshipDetails>>(
    existingProfile?.sponsorshipDetails || {
      hasSponsor: false,
      sponsorName: '',
      sponsorRelation: '',
      sponsorOccupation: '',
      sponsorIncome: '',
      sponsorCommitment: ''
    }
  )

  const [accommodationPlans, setAccommodationPlans] = useState<Partial<AccommodationPlans>>(
    existingProfile?.accommodationPlans as AccommodationPlans || {
      hasAccommodationPlan: false,
      accommodationType: '',
      location: '',
      cost: '',
      duration: '',
      amenities: ''
    }
  )

  const [salaryExpectations, setSalaryExpectations] = useState<Partial<SalaryExpectations>>(
    existingProfile?.salaryExpectations as SalaryExpectations || {
      withDegree: { amount: '', currency: '', timeframe: '' },
      withoutDegree: { amount: '', currency: '', timeframe: '' },
      careerGrowthExpectation: ''
    }
  )

  const handleFinancialInfoChange = (field: keyof FinancialInfo, value: string) => {
    setFinancialInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTuitionCostsChange = (section: string, field: string, value: string) => {
    setTuitionAndCosts(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof TuitionAndCosts],
        [field]: value
      }
    }))
  }

  const handleSponsorshipChange = (field: keyof SponsorshipDetails, value: string | boolean) => {
    setSponsorshipDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleAccommodationChange = (field: keyof AccommodationPlans, value: string | boolean) => {
    setAccommodationPlans(prev => ({ ...prev, [field]: value }))
  }

    const handleSalaryExpectationChange = (section: string, field: string, value: string) => {
    setSalaryExpectations(prev => {
        const currentSection = prev[section as keyof SalaryExpectations] as Record<string, unknown>
        return {
        ...prev,
        [section]: {
            ...currentSection,
            [field]: value
        }
        }
    })
    }


  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!financialInfo.totalCost) newErrors.totalCost = 'Total program cost is required'
    if (!financialInfo.currency) newErrors.currency = 'Currency is required'
    if (!financialInfo.fundingSource) newErrors.fundingSource = 'Funding source is required'
    if (!financialInfo.bankBalance) newErrors.bankBalance = 'Available funds amount is required'

    if (financialInfo.fundingSource === 'Family Sponsorship' && !sponsorshipDetails.sponsorName) {
      newErrors.sponsorName = 'Sponsor name is required for family sponsorship'
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
            step: 'financial',
            data: {
            financialInfo,
            tuitionAndCosts,
            sponsorshipDetails,
            accommodationPlans,
            salaryExpectations
            }
        })
        })

        if (response.ok) {
        router.push('/onboarding/profile/additional') // Changed to additional (final step)
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
    router.push('/onboarding/profile/future-plans')
  }

  const currencyOptions = [
    { value: '', label: 'Select currency' },
    { value: 'CAD', label: 'CAD (Canadian Dollar)' },
    { value: 'AUD', label: 'AUD (Australian Dollar)' },
    { value: 'USD', label: 'USD (US Dollar)' },
    { value: 'GBP', label: 'GBP (British Pound)' },
    { value: 'EUR', label: 'EUR (Euro)' },
    { value: 'BDT', label: 'BDT (Bangladeshi Taka)' }
  ]

  const fundingOptions = [
    { value: '', label: 'Select funding source' },
    { value: 'Personal Savings', label: 'Personal Savings' },
    { value: 'Family Sponsorship', label: 'Family Sponsorship' },
    { value: 'Property Income', label: 'Property/Rental Income' },
    { value: 'Business Income', label: 'Business Income' },
    { value: 'Bank Loan', label: 'Bank Loan' },
    { value: 'Scholarship', label: 'Scholarship' },
    { value: 'Mixed Sources', label: 'Mixed Sources' }
  ]

  const accommodationTypes = [
    { value: '', label: 'Select accommodation type' },
    { value: 'University Dormitory', label: 'University Dormitory' },
    { value: 'College Rooms', label: 'College Rooms' },
    { value: 'Private Apartment', label: 'Private Apartment' },
    { value: 'Shared Housing', label: 'Shared Housing' },
    { value: 'Homestay', label: 'Homestay' },
    { value: 'Other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Financial Information</h1>
        <p className="text-muted-foreground mb-4">
          Provide detailed information about funding, costs, and financial planning
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={87.5} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step 7 of 8</p>
        </div>
      </div>

      {/* Basic Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Program Costs & Funding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Total Program Cost"
              required
              value={financialInfo.totalCost || ''}
              onChange={(e) => handleFinancialInfoChange('totalCost', e.target.value)}
              placeholder="e.g., 50000"
              error={errors.totalCost}
            />

            <FormSelect
              label="Currency"
              required
              value={financialInfo.currency || ''}
              onChange={(e) => handleFinancialInfoChange('currency', e.target.value)}
              options={currencyOptions}
              error={errors.currency}
            />

            <FormSelect
              label="Primary Funding Source"
              required
              value={financialInfo.fundingSource || ''}
              onChange={(e) => handleFinancialInfoChange('fundingSource', e.target.value)}
              options={fundingOptions}
              error={errors.fundingSource}
            />

            <FormInput
              label="Available Funds"
              required
              value={financialInfo.bankBalance || ''}
              onChange={(e) => handleFinancialInfoChange('bankBalance', e.target.value)}
              placeholder="Total available funds"
              error={errors.bankBalance}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Costs Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Tuition Fees (per year)"
              value={tuitionAndCosts.tuitionFees?.amount || ''}
              onChange={(e) => handleTuitionCostsChange('tuitionFees', 'amount', e.target.value)}
              placeholder="e.g., 28400"
            />

            <FormInput
              label="Living Costs (per year)"
              value={tuitionAndCosts.livingCosts?.estimatedAmount || ''}
              onChange={(e) => handleTuitionCostsChange('livingCosts', 'estimatedAmount', e.target.value)}
              placeholder="e.g., 29710"
            />

            <FormInput
              label="Health Insurance"
              value={tuitionAndCosts.additionalCosts?.healthInsurance || ''}
              onChange={(e) => handleTuitionCostsChange('additionalCosts', 'healthInsurance', e.target.value)}
              placeholder="Annual health insurance cost"
            />
          </div>

          <FormTextarea
            label="Living Costs Breakdown"
            value={tuitionAndCosts.livingCosts?.breakdown || ''}
            onChange={(e) => handleTuitionCostsChange('livingCosts', 'breakdown', e.target.value)}
            placeholder="Detailed breakdown: accommodation, food, transportation, etc."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Study Materials & Books"
              value={tuitionAndCosts.additionalCosts?.studyMaterials || ''}
              onChange={(e) => handleTuitionCostsChange('additionalCosts', 'studyMaterials', e.target.value)}
              placeholder="Annual cost for books and materials"
            />

            <FormInput
              label="Transportation"
              value={tuitionAndCosts.additionalCosts?.transportation || ''}
              onChange={(e) => handleTuitionCostsChange('additionalCosts', 'transportation', e.target.value)}
              placeholder="Monthly/annual transport costs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship Details */}
      {(financialInfo.fundingSource === 'Family Sponsorship' || financialInfo.fundingSource === 'Mixed Sources') && (
        <Card>
          <CardHeader>
            <CardTitle>Sponsorship Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Sponsor Name"
                required
                value={sponsorshipDetails.sponsorName || ''}
                onChange={(e) => handleSponsorshipChange('sponsorName', e.target.value)}
                placeholder="Full name of sponsor"
                error={errors.sponsorName}
              />

              <FormInput
                label="Relationship to Sponsor"
                value={sponsorshipDetails.sponsorRelation || ''}
                onChange={(e) => handleSponsorshipChange('sponsorRelation', e.target.value)}
                placeholder="e.g., Father, Mother, Uncle"
              />

              <FormInput
                label="Sponsor's Occupation"
                value={sponsorshipDetails.sponsorOccupation || ''}
                onChange={(e) => handleSponsorshipChange('sponsorOccupation', e.target.value)}
                placeholder="Sponsor's job/business"
              />

              <FormInput
                label="Sponsor's Annual Income"
                value={sponsorshipDetails.sponsorIncome || ''}
                onChange={(e) => handleSponsorshipChange('sponsorIncome', e.target.value)}
                placeholder="Approximate annual income"
              />
            </div>

            <FormTextarea
              label="Sponsorship Commitment"
              value={sponsorshipDetails.sponsorCommitment || ''}
              onChange={(e) => handleSponsorshipChange('sponsorCommitment', e.target.value)}
              placeholder="Details about the sponsor's commitment to fund your education"
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {/* Accommodation Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Accommodation Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasAccommodationPlan"
              checked={accommodationPlans.hasAccommodationPlan || false}
              onCheckedChange={(checked) => handleAccommodationChange('hasAccommodationPlan', !!checked)}
            />
            <Label htmlFor="hasAccommodationPlan">I have researched accommodation options</Label>
          </div>

          {accommodationPlans.hasAccommodationPlan && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Accommodation Type"
                  value={accommodationPlans.accommodationType || ''}
                  onChange={(e) => handleAccommodationChange('accommodationType', e.target.value)}
                  options={accommodationTypes}
                />

                <FormInput
                  label="Location/Area"
                  value={accommodationPlans.location || ''}
                  onChange={(e) => handleAccommodationChange('location', e.target.value)}
                  placeholder="e.g., Near campus, City center"
                />

                <FormInput
                  label="Estimated Cost (per week/month)"
                  value={accommodationPlans.cost || ''}
                  onChange={(e) => handleAccommodationChange('cost', e.target.value)}
                  placeholder="e.g., 300 per week"
                />

                <FormInput
                  label="Lease Duration"
                  value={accommodationPlans.duration || ''}
                  onChange={(e) => handleAccommodationChange('duration', e.target.value)}
                  placeholder="e.g., 12 months, Academic year"
                />
              </div>

              <FormTextarea
                label="Amenities & Features"
                value={accommodationPlans.amenities || ''}
                onChange={(e) => handleAccommodationChange('amenities', e.target.value)}
                placeholder="List important amenities like furnished, WiFi, laundry, etc."
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Salary Expectations */}
      <Card>
        <CardHeader>
          <CardTitle>Post-Graduation Financial Expectations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">With International Degree</h4>
              <div className="space-y-3">
                <FormInput
                  label="Expected Monthly Salary"
                  value={salaryExpectations.withDegree?.amount || ''}
                  onChange={(e) => handleSalaryExpectationChange('withDegree', 'amount', e.target.value)}
                  placeholder="e.g., 1000"
                />
                <FormSelect
                  label="Currency"
                  value={salaryExpectations.withDegree?.currency || ''}
                  onChange={(e) => handleSalaryExpectationChange('withDegree', 'currency', e.target.value)}
                  options={currencyOptions}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">With Local Degree</h4>
              <div className="space-y-3">
                <FormInput
                  label="Expected Monthly Salary"
                  value={salaryExpectations.withoutDegree?.amount || ''}
                  onChange={(e) => handleSalaryExpectationChange('withoutDegree', 'amount', e.target.value)}
                  placeholder="e.g., 300"
                />
                <FormSelect
                  label="Currency"
                  value={salaryExpectations.withoutDegree?.currency || ''}
                  onChange={(e) => handleSalaryExpectationChange('withoutDegree', 'currency', e.target.value)}
                  options={currencyOptions}
                />
              </div>
            </div>
          </div>

          <FormTextarea
            label="Career Growth Expectations"
            value={salaryExpectations.careerGrowthExpectation || ''}
            onChange={(e) => setSalaryExpectations(prev => ({ ...prev, careerGrowthExpectation: e.target.value }))}
            placeholder="Describe your expected career progression and how the international degree will help"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Future Plans
        </Button>

        <Button onClick={handleNext} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Next: Additional Information'}
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