// components/onboarding/CountrySelector.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, BookOpen, FileText, DollarSign } from 'lucide-react'
import type { User } from '@/types/auth'

interface CountrySelectorProps {
  user: User
}

const countries = [
  {
    code: 'CANADA' as const,
    name: 'Canada',
    flag: '🇨🇦',
    description: 'Study in Canada with comprehensive visa guidance',
    features: [
      'Post-graduation work permits',
      'Pathway to permanent residence', 
      'High-quality education system',
      'Multicultural environment'
    ],
    availableLetters: [
      { type: 'SOP', status: 'active', icon: FileText },
      { type: 'Study Plan', status: 'coming_soon', icon: BookOpen },
      { type: 'Financial Planning', status: 'coming_soon', icon: DollarSign }
    ],
    stats: {
      students: '450+',
      successRate: '94%'
    }
  },
  {
    code: 'AUSTRALIA' as const,
    name: 'Australia',
    flag: '🇦🇺',
    description: 'Study in Australia with GTE-focused documentation',
    features: [
      'Genuine Temporary Entrant (GTE)',
      'Work while studying opportunities',
      'World-class universities',
      'Beautiful lifestyle and climate'
    ],
    availableLetters: [
      { type: 'SOP (GTE)', status: 'active', icon: FileText },
      { type: 'Other Letters', status: 'future', icon: BookOpen }
    ],
    stats: {
      students: '180+',
      successRate: '89%'
    }
  }
]

export default function CountrySelector({}: CountrySelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<'CANADA' | 'AUSTRALIA' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCountrySelect = (countryCode: 'CANADA' | 'AUSTRALIA') => {
    setSelectedCountry(countryCode)
  }

  const handleContinue = async () => {
    if (!selectedCountry) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/onboarding/country-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry })
      })

      if (response.ok) {
        router.push('/onboarding/profile/personal')
      } else {
        console.error('Failed to save country selection')
      }
    } catch (error) {
      console.error('Error saving country selection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {countries.map((country) => (
          <Card 
            key={country.code}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedCountry === country.code 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-border/80'
            }`}
            onClick={() => handleCountrySelect(country.code)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <CardTitle className="text-xl">{country.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {country.stats.students} students
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {country.stats.successRate} success
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedCountry === country.code && (
                  <CheckCircle className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {country.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Key Benefits:</h4>
                <ul className="space-y-1">
                  {country.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Available Letters:</h4>
                <div className="space-y-2">
                  {country.availableLetters.map((letter, index) => {
                    const Icon = letter.icon
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{letter.type}</span>
                        </div>
                        <Badge 
                          variant={letter.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {letter.status === 'active' ? 'Active' : 
                           letter.status === 'coming_soon' ? 'Coming Soon' : 'Future'}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={handleContinue}
          disabled={!selectedCountry || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? 'Saving...' : 'Continue to Profile Creation'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        
        {selectedCountry && (
          <p className="text-sm text-muted-foreground mt-2">
            You selected {countries.find(c => c.code === selectedCountry)?.name}
          </p>
        )}
      </div>
    </div>
  )
}