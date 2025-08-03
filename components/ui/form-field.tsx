// components/ui/form-field.tsx
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn("text-sm font-medium", error && "text-destructive")}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}
    </div>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

export function FormInput({ label, error, required, className, ...props }: FormInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <Input
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        {...props}
      />
    </FormField>
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export function FormTextarea({ label, error, required, className, ...props }: FormTextareaProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <Textarea
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        {...props}
      />
    </FormField>
  )
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  required?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}

export function FormSelect({ 
  label, 
  error, 
  required, 
  options, 
  placeholder, 
  className, 
  ...props 
}: FormSelectProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <select
        className={cn(
          "w-full border border-input rounded-md px-3 py-2 bg-background text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}