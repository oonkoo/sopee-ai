// components/profile/TargetProgramStep.tsx
'use client'
import { FormInput, FormSelect } from '@/components/ui/form-field'
import type { TargetProgram } from '@/types/profile'

interface TargetProgramStepProps {
  data: Partial<TargetProgram>
  onUpdate: (data: Partial<TargetProgram>) => void
  errors?: Record<string, string>
}

export default function TargetProgramStep({ data, onUpdate, errors = {} }: TargetProgramStepProps) {
  const handleChange = (field: keyof TargetProgram, value: string) => {
    onUpdate({ [field]: value })
  }

  const degreeOptions = [
    { value: '', label: 'Select degree level' },
    { value: 'Diploma', label: 'Diploma' },
    { value: "Bachelor's", label: "Bachelor's" },
    { value: "Master's", label: "Master's" },
    { value: 'PhD', label: 'PhD' },
    { value: 'Certificate', label: 'Certificate' }
  ]

  const countryOptions = [
    { value: '', label: 'Select country' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Sweden', label: 'Sweden' },
    { value: 'Other', label: 'Other' }
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="University/Institution"
          required
          value={data.university || ''}
          onChange={(e) => handleChange('university', e.target.value)}
          placeholder="e.g., University of Toronto"
          error={errors.university}
        />

        <FormInput
          label="Program Name"
          required
          value={data.program || ''}
          onChange={(e) => handleChange('program', e.target.value)}
          placeholder="e.g., Master of Computer Science"
          error={errors.program}
        />

        <FormSelect
          label="Degree Level"
          required
          value={data.degree || ''}
          onChange={(e) => handleChange('degree', e.target.value)}
          options={degreeOptions}
          error={errors.degree}
        />

        <FormSelect
          label="Study Country"
          required
          value={data.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
          options={countryOptions}
          error={errors.country}
        />

        <FormInput
          label="Program Start Date"
          required
          type="date"
          value={data.startDate || ''}
          onChange={(e) => handleChange('startDate', e.target.value)}
          error={errors.startDate}
        />

        <FormSelect
          label="Program Duration"
          required
          value={data.duration || ''}
          onChange={(e) => handleChange('duration', e.target.value)}
          options={durationOptions}
          error={errors.duration}
        />
      </div>
    </div>
  )
}