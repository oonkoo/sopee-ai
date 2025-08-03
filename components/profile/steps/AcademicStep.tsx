// components/profile/AcademicStep.tsx
'use client'
import { FormInput, FormSelect, FormTextarea, FormField } from '@/components/ui/form-field'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { AcademicBackground } from '@/types/profile'

interface AcademicStepProps {
  data: Partial<AcademicBackground>
  onUpdate: (data: Partial<AcademicBackground>) => void
  errors?: Record<string, string>
}

export default function AcademicStep({ data, onUpdate, errors = {} }: AcademicStepProps) {
  const handleChange = (field: keyof AcademicBackground, value: string | boolean) => {
    onUpdate({ [field]: value })
  }

  const educationOptions = [
    { value: '', label: 'Select education level' },
    { value: 'High School', label: 'High School' },
    { value: 'Diploma', label: 'Diploma' },
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: 'PhD', label: 'PhD' }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Highest Education"
          required
          value={data.highestEducation || ''}
          onChange={(e) => handleChange('highestEducation', e.target.value)}
          options={educationOptions}
          error={errors.highestEducation}
        />

        <FormInput
          label="Institution Name"
          required
          value={data.institution || ''}
          onChange={(e) => handleChange('institution', e.target.value)}
          placeholder="Name of your school/university"
          error={errors.institution}
        />

        <FormInput
          label="Graduation Year"
          required
          value={data.graduationYear || ''}
          onChange={(e) => handleChange('graduationYear', e.target.value)}
          placeholder="e.g., 2023"
          error={errors.graduationYear}
        />

        <FormInput
          label="GPA/Percentage"
          required
          value={data.gpa || ''}
          onChange={(e) => handleChange('gpa', e.target.value)}
          placeholder="e.g., 3.8/4.0 or 85%"
          error={errors.gpa}
        />
      </div>

      <FormInput
        label="Field of Study"
        required
        value={data.fieldOfStudy || ''}
        onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
        placeholder="e.g., Computer Science, Business Administration"
        error={errors.fieldOfStudy}
      />

      <div className="space-y-4">
        <FormField label="" error={errors.hasGaps}>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasGaps"
              checked={data.hasGaps || false}
              onCheckedChange={(checked) => handleChange('hasGaps', !!checked)}
            />
            <Label htmlFor="hasGaps">I have gaps in my education/employment</Label>
          </div>
        </FormField>

        {data.hasGaps && (
          <FormTextarea
            label="Gap Explanation"
            required
            value={data.gapExplanation || ''}
            onChange={(e) => handleChange('gapExplanation', e.target.value)}
            placeholder="Explain any gaps in your education or employment..."
            rows={4}
            error={errors.gapExplanation}
          />
        )}
      </div>
    </div>
  )
}