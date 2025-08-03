// components/profile/FinancialStep.tsx
'use client'
import { FormInput, FormSelect } from '@/components/ui/form-field'
import type { FinancialInfo } from '@/types/profile'

interface FinancialStepProps {
  data: Partial<FinancialInfo>
  onUpdate: (data: Partial<FinancialInfo>) => void
  errors?: Record<string, string>
}

export default function FinancialStep({ data, onUpdate, errors = {} }: FinancialStepProps) {
  const handleChange = (field: keyof FinancialInfo, value: string) => {
    onUpdate({ [field]: value })
  }

  const currencyOptions = [
    { value: '', label: 'Select currency' },
    { value: 'CAD', label: 'CAD (Canadian Dollar)' },
    { value: 'USD', label: 'USD (US Dollar)' },
    { value: 'GBP', label: 'GBP (British Pound)' },
    { value: 'AUD', label: 'AUD (Australian Dollar)' },
    { value: 'EUR', label: 'EUR (Euro)' },
    { value: 'INR', label: 'INR (Indian Rupee)' },
    { value: 'CNY', label: 'CNY (Chinese Yuan)' }
  ]

  const fundingOptions = [
    { value: '', label: 'Select funding source' },
    { value: 'Personal Savings', label: 'Personal Savings' },
    { value: 'Family Sponsorship', label: 'Family Sponsorship' },
    { value: 'Bank Loan', label: 'Bank Loan' },
    { value: 'Scholarship', label: 'Scholarship' },
    { value: 'Government Funding', label: 'Government Funding' },
    { value: 'Employer Sponsorship', label: 'Employer Sponsorship' },
    { value: 'Mixed Sources', label: 'Mixed Sources' }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Total Program Cost"
          required
          value={data.totalCost || ''}
          onChange={(e) => handleChange('totalCost', e.target.value)}
          placeholder="e.g., 50000"
          error={errors.totalCost}
        />

        <FormSelect
          label="Currency"
          required
          value={data.currency || ''}
          onChange={(e) => handleChange('currency', e.target.value)}
          options={currencyOptions}
          error={errors.currency}
        />

        <FormSelect
          label="Primary Funding Source"
          required
          value={data.fundingSource || ''}
          onChange={(e) => handleChange('fundingSource', e.target.value)}
          options={fundingOptions}
          error={errors.fundingSource}
        />

        {data.fundingSource === 'Family Sponsorship' && (
          <FormInput
            label="Sponsor Name"
            required
            value={data.sponsorName || ''}
            onChange={(e) => handleChange('sponsorName', e.target.value)}
            placeholder="Name of your sponsor"
            error={errors.sponsorName}
          />
        )}

        <FormInput
          label="Available Funds"
          required
          value={data.bankBalance || ''}
          onChange={(e) => handleChange('bankBalance', e.target.value)}
          placeholder="Total available funds"
          error={errors.bankBalance}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This information will be used to generate your financial statement letter. 
          Make sure all amounts are accurate and match your supporting documents.
        </p>
      </div>
    </div>
  )
}