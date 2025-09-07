// components/letters/LetterGenerationForm.tsx
'use client'
import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  User2 as UserIcon, 
  Users2 as FamilyUser,
  GraduationCap, 
  Target,
  DollarSign,
  ArrowRight,
  Eye,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import GenerationProgress from './GenerationProgress'
import type { User } from '@/types/auth'
import type { StudentProfile } from '@/types/profile'

interface LetterGenerationFormProps {
  user: User
  profile: StudentProfile
  country: 'AUSTRALIA' | 'CANADA'
  remainingLetters: number
}

interface ProfileSection {
  name: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
  importance: 'critical' | 'important' | 'optional'
  fields: { name: string; value: unknown; required: boolean }[]
}

export default function LetterGenerationForm({ 
  user, 
  profile, 
  country,
  remainingLetters 
}: LetterGenerationFormProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const countryInfo = {
    AUSTRALIA: {
      name: 'Australia',
      documentName: 'Statement of Purpose',
      shortName: 'SOP',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      route: '/australia'
    },
    CANADA: {
      name: 'Canada',
      documentName: 'Statement of Purpose', 
      shortName: 'SOP',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      route: '/canada'
    }
  }

  const info = countryInfo[country]

  // Analyze profile completeness for all 8 onboarding steps
  const profileSections: ProfileSection[] = [
    {
      name: 'Personal Information',
      icon: UserIcon,
      completed: !!(profile.personalInfo?.fullName && profile.personalInfo?.nationality),
      importance: 'critical',
      fields: [
        { name: 'Full Name', value: profile.personalInfo?.fullName, required: true },
        { name: 'Nationality', value: profile.personalInfo?.nationality, required: true },
        { name: 'Date of Birth', value: profile.personalInfo?.dateOfBirth, required: true },
        { name: 'Address', value: profile.personalInfo?.address, required: true }
      ]
    },
    {
      name: 'Family Background',
      icon: FamilyUser,
      completed: !!(profile.familyBackground),
      importance: 'important',
      fields: [
        { name: 'Parents Occupation', value: profile.familyBackground?.parentsOccupation, required: true },
        { name: 'Family Income', value: profile.familyBackground?.familyIncome, required: true },
        { name: 'Family Business', value: profile.familyBackground?.familyBusiness, required: false },
        { name: 'Property Ownership', value: profile.propertyOwnership, required: false }
      ]
    },
    {
      name: 'Academic Background',
      icon: GraduationCap,
      completed: !!(profile.academicBackground?.highestEducation && profile.academicBackground?.institution),
      importance: 'critical',
      fields: [
        { name: 'Highest Education', value: profile.academicBackground?.highestEducation, required: true },
        { name: 'Institution', value: profile.academicBackground?.institution, required: true },
        { name: 'Field of Study', value: profile.academicBackground?.fieldOfStudy, required: true },
        { name: 'GPA/Grades', value: profile.academicBackground?.gpa, required: false }
      ]
    },
    {
      name: 'Work Experience',
      icon: Target,
      completed: !!(profile.workExperience),
      importance: 'important',
      fields: [
        { name: 'Has Work Experience', value: profile.workExperience?.hasWorkExperience, required: false },
        { name: 'Jobs', value: profile.workExperience?.jobs?.length, required: false },
        { name: 'Internships', value: profile.workExperience?.internships?.length, required: false },
        { name: 'Freelancing', value: profile.freelancingExperience, required: false }
      ]
    },
    {
      name: 'Target Program',
      icon: Target,
      completed: !!(profile.targetProgram?.university && profile.targetProgram?.program),
      importance: 'critical',
      fields: [
        { name: 'University', value: profile.targetProgram?.university, required: true },
        { name: 'Program', value: profile.targetProgram?.program, required: true },
        { name: 'Degree Level', value: profile.targetProgram?.degree, required: true },
        { name: 'Why This University', value: profile.whyThisUniversity, required: false }
      ]
    },
    {
      name: 'Future Plans',
      icon: Target,
      completed: !!(profile.futureCareerPlans),
      importance: 'important',
      fields: [
        { name: 'Immediate Goals', value: profile.futureCareerPlans?.immediateGoals, required: true },
        { name: 'Long Term Goals', value: profile.futureCareerPlans?.longTermGoals, required: true },
        { name: 'Return Plans', value: profile.returnPlans, required: true },
        { name: 'Salary Expectations', value: profile.salaryExpectations, required: false }
      ]
    },
    {
      name: 'Financial Information',
      icon: DollarSign,
      completed: !!(profile.financialInfo),
      importance: 'critical',
      fields: [
        { name: 'Total Cost', value: profile.financialInfo?.totalCost, required: true },
        { name: 'Funding Source', value: profile.financialInfo?.fundingSource, required: true },
        { name: 'Bank Balance', value: profile.financialInfo?.bankBalance, required: true },
        { name: 'Sponsor Details', value: profile.sponsorshipDetails, required: false }
      ]
    },
    {
      name: 'Additional Information',
      icon: FileText,
      completed: !!(profile.languageProficiency || profile.extracurricularActivities || profile.additionalInfo),
      importance: 'optional',
      fields: [
        { name: 'Language Proficiency', value: profile.languageProficiency, required: false },
        { name: 'Extracurricular Activities', value: profile.extracurricularActivities, required: false },
        { name: 'Additional Information', value: profile.additionalInfo, required: false },
        { name: 'Previous Visa History', value: profile.previousVisaHistory, required: false }
      ]
    }
  ]

  const criticalSections = profileSections.filter(s => s.importance === 'critical')
  const completedCritical = criticalSections.filter(s => s.completed).length
  const canGenerate = completedCritical === criticalSections.length

  const [generationResult, setGenerationResult] = useState<{ letter: { id: string } } | null>(null)

  const handleGenerate = async () => {
    if (!canGenerate || remainingLetters <= 0) return

    setIsGenerating(true)
    setError(null)
    setGenerationResult(null)

    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterType: 'sop',
          profileId: profile.id
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Store the result but don't redirect yet - let the progress component complete
        setGenerationResult(result)
      } else {
        setError(result.error || 'Failed to generate letter')
        setIsGenerating(false)
      }
    } catch {
      setError('An error occurred while generating the letter')
      setIsGenerating(false)
    }
  }

  const handleProgressComplete = useCallback(() => {
    if (generationResult) {
      // Now redirect after the progress animation completes
      setIsGenerating(false) // Stop generating first
      router.push(`${info.route}/letters/${generationResult.letter.id}`)
    } else {
      setIsGenerating(false)
    }
  }, [generationResult, info.route, router])

  const handlePreview = () => {
    setShowPreview(!showPreview)
  }

  if (isGenerating) {
    return (
      <GenerationProgress 
        isGenerating={true} 
        country={country} 
        onComplete={handleProgressComplete}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Completeness Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-5 w-5 ${info.color}`} />
              <CardTitle>Profile Readiness Check</CardTitle>
            </div>
            <Badge variant={canGenerate ? "default" : "secondary"}>
              {Math.round(profile.profileCompleteness)}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completeness</span>
              <span className="text-primary">{Math.round(profile.profileCompleteness)}%</span>
            </div>
            <Progress value={profile.profileCompleteness} className="h-2" />
          </div>

          {!canGenerate && (
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Complete Required Sections
                </p>
                <p className="text-sm text-muted-foreground">
                  Please complete all critical sections before generating your {info.documentName}.
                </p>
              </div>
            </div>
          )}

          {/* Section Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {profileSections.map((section) => {
              const SectionIcon = section.icon
              return (
                <div key={section.name} className="flex items-center gap-3 p-3 bg-card/70 rounded-lg border border-border/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    section.completed ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    <SectionIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${section.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {section.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={section.importance === 'critical' ? 'destructive' : section.importance === 'important' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {section.importance}
                      </Badge>
                      {section.completed ? (
                        <CheckCircle className="h-3 w-3 text-primary" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Letter Type Selection */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-border/50 rounded-lg bg-card/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{info.documentName}</h3>
                <p className="text-muted-foreground mb-3">
                  Professional statement crafted for {info.name} immigration officers using AI trained on approved applications.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">1500-2000 words</Badge>
                  <Badge variant="outline">Approved patterns</Badge>
                  <Badge variant="outline">Personalized content</Badge>
                  {country === 'AUSTRALIA' && <Badge variant="outline">DHA optimized</Badge>}
                  {country === 'CANADA' && <Badge variant="outline">IRCC optimized</Badge>}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Profile Data */}
          {showPreview && (
            <div className="space-y-4 p-4 bg-card/30 rounded-lg border border-border/50">
              <h4 className="font-medium">Profile Data Preview - All 8 Steps</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileSections.map((section) => (
                  <div key={section.name} className="space-y-2 p-3 bg-card/50 rounded-lg border border-border/30">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        section.completed ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        <section.icon className="h-3 w-3" />
                      </div>
                      <h5 className="text-sm font-medium">{section.name}</h5>
                      <Badge 
                        variant={section.importance === 'critical' ? 'destructive' : section.importance === 'important' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {section.importance}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {section.fields.map((field) => (
                        <div key={field.name} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{field.name}:</span>
                          <span className={field.value ? 'text-primary' : 'text-muted-foreground/50'}>
                            {field.value ? '✓' : '✗'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Controls */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Usage Info */}
            <div className="flex items-center justify-between p-4 bg-card/30 rounded-lg border border-border/50">
              <div>
                <p className="text-sm font-medium">Remaining Generations</p>
                <p className="text-2xl font-bold text-primary">{remainingLetters}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-sm font-medium capitalize">{user.subscriptionType}</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Preview'} Profile Data
              </Button>
              
              <Button 
                onClick={handleGenerate}
                disabled={!canGenerate || remainingLetters <= 0 || isGenerating}
                size="lg"
                className="flex-1 gap-2"
              >
                <Zap className="h-5 w-5" />
                {remainingLetters <= 0 ? 'Upgrade Plan' : `Generate ${info.shortName}`}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {!canGenerate && (
              <div className="text-center">
                <Link href="/onboarding/profile/personal">
                  <Button variant="ghost" size="sm">
                    Complete Profile →
                  </Button>
                </Link>
              </div>
            )}

            {remainingLetters <= 0 && (
              <div className="text-center">
                <Button variant="ghost" size="sm">
                  View Upgrade Options →
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}