// components/letter/LetterGenerator.tsx
'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import type { LetterType } from '@/types/letter'
import type { User } from '@/types/auth'
import type { StudentProfile } from '@/types/profile'
import LetterPreview from './LetterPreview'

interface LetterGeneratorProps {
  profile: StudentProfile
  user: User
}

interface GeneratedLetterResponse {
  letter: {
    id: string
    userId: string
    profileId: string | null
    letterType: string
    title: string
    content: string
    modelUsed: string | null
    generationTime: number | null
    wordCount: number | null
    createdAt: Date
    feedbackRating: number | null
    isFavorite: boolean
  }
  remainingGenerations: number
}

interface ErrorResponse {
  error: string
  details?: string
  timestamp?: string
}

export default function LetterGenerator({ profile, user }: LetterGeneratorProps) {
  const [selectedType, setSelectedType] = useState<LetterType | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetterResponse['letter'] | null>(null)
  const [error, setError] = useState<string>('')

  const letterTypes = [
    {
      type: 'explanation' as LetterType,
      title: 'Letter of Explanation',
      description: 'Address gaps and demonstrate genuine intent to study',
      icon: '📝'
    },
    {
      type: 'study_plan' as LetterType,
      title: 'Study Plan',
      description: 'Detailed academic timeline and career goals',
      icon: '📚'
    },
    {
      type: 'financial' as LetterType,
      title: 'Financial Statement',
      description: 'Comprehensive funding and expense breakdown',
      icon: '💰'
    }
  ]

  const handleGenerate = async (letterType: LetterType) => {
    if (user.lettersGenerated >= user.lettersLimit) {
      setError('You have reached your letter generation limit. Please upgrade your plan.')
      return
    }

    setIsGenerating(true)
    setError('')
    setSelectedType(letterType)

    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letterType,
          profileId: profile.id
        })
      })

      if (response.ok) {
        const result: GeneratedLetterResponse = await response.json()
        setGeneratedLetter(result.letter)
      } else {
        const errorResult: ErrorResponse = await response.json()
        setError(errorResult.error || 'Failed to generate letter')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setError('An error occurred while generating the letter')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBack = () => {
    setGeneratedLetter(null)
    setSelectedType(null)
    setError('')
  }

  if (generatedLetter) {
    return (
      <LetterPreview 
        letter={generatedLetter}
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Usage Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Letter Generation</h3>
              <p className="text-sm text-gray-600">
                {user.lettersGenerated} of {user.lettersLimit} letters used
              </p>
            </div>
            <div className="text-2xl font-bold text-primary">
              {user.lettersLimit - user.lettersGenerated} remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Letter Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {letterTypes.map((letterType) => (
          <Card 
            key={letterType.type} 
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{letterType.icon}</div>
              <CardTitle className="text-lg">{letterType.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                {letterType.description}
              </p>
              <Button 
                onClick={() => handleGenerate(letterType.type)}
                disabled={isGenerating || user.lettersGenerated >= user.lettersLimit}
                className="w-full"
              >
                {isGenerating && selectedType === letterType.type ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Letter'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}