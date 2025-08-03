// components/profile/PersonalInfoStep.tsx
'use client'
import { FormInput } from '@/components/ui/form-field'
import type { PersonalInfo } from '@/types/profile'

interface PersonalInfoStepProps {
  data: Partial<PersonalInfo>
  onUpdate: (data: Partial<PersonalInfo>) => void
  errors?: Record<string, string>
}

export default function PersonalInfoStep({ data, onUpdate, errors = {} }: PersonalInfoStepProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          required
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          error={errors.fullName}
        />

        <FormInput
          label="Date of Birth"
          required
          type="date"
          value={data.dateOfBirth || ''}
          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
        />

        <FormInput
          label="Nationality"
          required
          value={data.nationality || ''}
          onChange={(e) => handleChange('nationality', e.target.value)}
          placeholder="e.g., Indian, Chinese"
          error={errors.nationality}
        />

        <FormInput
          label="Current Country"
          required
          value={data.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
          placeholder="Country you're currently in"
          error={errors.country}
        />

        <FormInput
          label="Phone Number"
          required
          value={data.phoneNumber || ''}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          placeholder="+1 234 567 8900"
          error={errors.phoneNumber}
        />
      </div>

      <FormInput
        label="Current Address"
        required
        value={data.address || ''}
        onChange={(e) => handleChange('address', e.target.value)}
        placeholder="Your current residential address"
        error={errors.address}
      />
    </div>
  )
}