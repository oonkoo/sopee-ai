// components/CountryDashboard.tsx
'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  BookOpen, 
  Target, 
  Sparkles, 
  ArrowRight,
  Clock,
  CheckCircle,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { User } from '@/types/auth'
import type { StudentProfile } from '@/types/profile'

interface CountryDashboardProps {
  user: User
  profile: StudentProfile | null
  recentLetters: { id: string; title: string; letterType: string; createdAt: Date; wordCount: number }[]
  country: 'CANADA' | 'AUSTRALIA'
}

export default function CountryDashboard({ user, profile, recentLetters, country }: CountryDashboardProps) {
  const countryImage = country === 'CANADA' ? '/countries/canada.png' : '/countries/australia.png'
  
  const countryInfo = {
    CANADA: {
      name: 'Canada',
      documentName: 'Statement of Purpose',
      shortName: 'SOP',
      description: 'AI-crafted SOP for Canadian study permits',
      route: '/canada/letters/generate',
      authority: 'IRCC',
      welcomeTitle: 'Create Your Canadian Study Permit Documents',
      welcomeSubtitle: 'Generate professional statements tailored for Immigration, Refugees and Citizenship Canada'
    },
    AUSTRALIA: {
      name: 'Australia',
      documentName: 'Statement of Purpose',
      shortName: 'SOP',
      description: 'AI-crafted SOP for Australian student visas',
      route: '/australia/letters/generate',
      authority: 'DHA',
      welcomeTitle: 'Create Your Australian Study Visa Documents',
      welcomeSubtitle: 'Generate professional statements tailored for Department of Home Affairs'
    }
  }

  const info = countryInfo[country]
  const completeness = profile?.profileCompleteness || 0
  const remainingLetters = user.lettersLimit - user.lettersGenerated

  function getProfileSuggestions(profile: StudentProfile | null, completeness: number) {
    if (completeness >= 100) return null
    
    const suggestions = []
    
    // Check for missing high-impact fields first
    if (!profile?.familyBackground) {
        suggestions.push({ text: "Add family background", weight: "High impact", route: "/onboarding/profile/family-background" })
    }
    
    if (!profile?.futureCareerPlans) {
        suggestions.push({ text: "Complete future career plans", weight: "High impact", route: "/onboarding/profile/future-plans" })
    }
    
    if (!profile?.financialInfo) {
        suggestions.push({ text: "Complete financial information", weight: "High impact", route: "/onboarding/profile/financial" })
    }
    
    // Medium impact fields
    if (!profile?.workExperience) {
        suggestions.push({ text: "Add work experience", weight: "Medium impact", route: "/onboarding/profile/work-experience" })
    }
    
    if (!profile?.homeCountryTies) {
        suggestions.push({ text: "Add home country ties", weight: "Medium impact", route: "/onboarding/profile/future-plans" })
    }
    
    if (!profile?.passportNumber) {
        suggestions.push({ text: "Add passport information", weight: "Medium impact", route: "/onboarding/profile/additional" })
    }
    
    // Enhancement fields - only show if main sections are complete
    if (suggestions.length === 0) {
        if (!profile?.languageProficiency) {
            suggestions.push({ text: "Add language proficiency", weight: "Enhancement", route: "/onboarding/profile/work-experience" })
        }
        
        if (!profile?.extracurricularActivities) {
            suggestions.push({ text: "Add extracurricular activities", weight: "Enhancement", route: "/onboarding/profile/additional" })
        }
        
        if (!profile?.additionalInfo) {
            suggestions.push({ text: "Add additional information", weight: "Enhancement", route: "/onboarding/profile/additional" })
        }
        
        // If still no suggestions, be more specific
        if (suggestions.length === 0) {
            // Check for specific missing optional enhancements
            const missingFields = []
            
            if (!profile?.parentsDetails) missingFields.push("Parent details")
            if (!profile?.programStructure) missingFields.push("Program structure")
            if (!profile?.tuitionAndCosts) missingFields.push("Tuition & costs")
            if (!profile?.universityRanking) missingFields.push("University ranking")
            if (!profile?.accommodationPlans) missingFields.push("Accommodation plans")
            if (!profile?.salaryExpectations) missingFields.push("Salary expectations")
            if (!profile?.returnPlans) missingFields.push("Return plans")
            if (!profile?.entrepreneurialPlans) missingFields.push("Business plans")
            if (!profile?.whyThisUniversity || !profile.whyThisUniversity?.text) missingFields.push("Why this university")
            if (!profile?.countryAdvantages || !profile.countryAdvantages?.text) missingFields.push("Country advantages")
            
            if (missingFields.length > 0) {
                const fieldText = missingFields.slice(0, 2).join(" or ")
                suggestions.push({ 
                    text: `Add ${fieldText} for 100%`, 
                    weight: "Enhancement", 
                    route: "/onboarding/profile/target-program" 
                })
            } else {
                suggestions.push({ text: "Profile near completion", weight: "General", route: "/onboarding/profile/target-program" })
            }
        }
    }
    
    return suggestions.slice(0, 3) // Show top 3 suggestions
  }

  return (
    <main className="container mx-auto px-4 lg:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border border-border/50">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative px-8 py-12 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              
              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI-Powered Document Generation</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    {info.welcomeTitle}
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl">
                    {info.welcomeSubtitle} requirements with advanced AI technology.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={info.route}>
                    <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90" disabled={remainingLetters <= 0}>
                      <Zap className="h-5 w-5" />
                      Generate {info.shortName} Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/${country.toLowerCase()}/letters`}>
                    <Button variant="outline" size="lg" className="gap-2">
                      <FileText className="h-5 w-5" />
                      View My Letters
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-card border border-border/50 p-8 shadow-2xl">
                    <Image 
                      src={countryImage} 
                      alt={`${info.name} flag`} 
                      width={160} 
                      height={120} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Compact Dark Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Main Profile Score Card - Compact */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="px-4">
            <div className="flex items-center gap-4">
                
                {/* Profile Icon & Score */}
                <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium text-foreground">Profile Score</p>
                    <p className="text-2xl font-bold text-primary">{Math.round(completeness)}%</p>
                </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex-1 mx-4">
                <Progress value={completeness} className="h-2" />
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-col gap-1">
                    <Link className='w-full' href="/onboarding/profile/personal">
                        <Button variant="outline" size="sm" className="text-xs h-7 w-full">
                        Edit
                        </Button>
                    </Link>
                    
                    {completeness < 100 && (() => {
                        const suggestions = getProfileSuggestions(profile, completeness);
                        const topSuggestion = suggestions?.[0];
                        
                        return topSuggestion ? (
                        <Link href={topSuggestion.route}>
                            <Button variant="ghost" size="sm" className="text-xs h-7 px-3 text-primary hover:bg-primary/80">
                            Improve
                            </Button>
                        </Link>
                        ) : null;
                    })()}
                </div>
            </div>
            
            {/* Compact Suggestions - Only show if < 100% */}
            {completeness < 100 && (
                <div className="mt-3 pt-3 border-t border-border/30">
                {(() => {
                    const suggestions = getProfileSuggestions(profile, completeness);
                    
                    if (!suggestions || suggestions.length === 0) {
                    return (
                        <p className="text-xs text-muted-foreground">
                        Complete remaining profile sections
                        </p>
                    );
                    }
                    
                    return (
                    <div className="flex flex-wrap gap-2">
                        {suggestions.slice(0, 2).map((suggestion, index) => (
                        <Link key={index} href={suggestion.route}>
                            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                            <span className="text-xs text-foreground">{suggestion.text}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                suggestion.weight === 'High impact' ? 'bg-red-100 text-red-700' :
                                suggestion.weight === 'Medium impact' ? 'bg-yellow-100 text-yellow-700' :
                                suggestion.weight === 'Enhancement' ? 'bg-green-100 text-green-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {suggestion.weight === 'High impact' ? 'High' : 
                                suggestion.weight === 'Medium impact' ? 'Med' : 
                                suggestion.weight === 'Enhancement' ? 'Enh' : 'Gen'}
                            </span>
                            </div>
                        </Link>
                        ))}
                    </div>
                    );
                })()}
                </div>
            )}
            
            {/* Excellent completion message */}
            {completeness >= 100 && (
                <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center gap-2 text-xs text-primary">
                    <CheckCircle className="h-3 w-3" />
                    <span>Profile optimized for SOP generation</span>
                </div>
                </div>
            )}
            </CardContent>
        </Card>

        {/* Compact Stats & Actions Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="px-4">
            <div className="space-y-4">
                
                {/* Letters & Plan Row */}
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                    <p className="text-lg font-bold text-primary">{remainingLetters}</p>
                    <p className="text-xs text-muted-foreground">remaining</p>
                    </div>
                </div>
                
                <div className="text-right">
                    <p className="text-sm font-semibold capitalize text-foreground">{user.subscriptionType}</p>
                    <p className="text-xs text-muted-foreground">plan</p>
                </div>
                </div>

                {/* Action Button */}
                <Link href={info.route}>
                <Button 
                    size="sm" 
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-9" 
                    disabled={remainingLetters <= 0}
                >
                    <Zap className="h-4 w-4" />
                    {remainingLetters <= 0 ? 'Upgrade Plan' : `Generate ${info.shortName}`}
                </Button>
                </Link>

                {/* Plan Upgrade Hint - Only for free users */}
                {user.subscriptionType === 'free' && remainingLetters <= 1 && (
                <div className="text-center">
                    <Button variant="link" size="sm" className="text-xs text-primary hover:text-primary/80 h-7">
                    View Pro Plans
                    </Button>
                </div>
                )}
            </div>
            </CardContent>
        </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Generate Document */}
          <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{info.documentName}</CardTitle>
                    <p className="text-sm text-muted-foreground">For {info.authority} requirements</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Active
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <p className="text-muted-foreground">
                {info.description} optimized for {info.name} immigration officers with your comprehensive profile data.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Uses your detailed profile information</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Tailored for {info.name} visa requirements</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Professional formatting and tone</span>
                </div>
              </div>

              <Link href={info.route}>
                <Button 
                  size="lg" 
                  className="w-full gap-2 bg-primary hover:bg-primary/90" 
                  disabled={remainingLetters <= 0}
                >
                  {remainingLetters <= 0 ? (
                    <>Upgrade Plan to Continue</>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Generate {info.shortName} Statement
                    </>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="border-border/50 bg-card/50 backdrop-blur opacity-75">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-muted-foreground">Additional Documents</CardTitle>
                    <p className="text-sm text-muted-foreground">Financial statements, cover letters & more</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  Coming Soon
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Additional document types and enhanced features are coming in future updates.
              </p>
              <Button variant="outline" disabled className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Available in Future Updates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentLetters.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Recent Letters</CardTitle>
                </div>
                <Link href={`/${country.toLowerCase()}/letters`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLetters.map((letter) => (
                  <div key={letter.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{letter.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(letter.createdAt).toLocaleDateString()} • {letter.wordCount} words
                        </p>
                      </div>
                    </div>
                    <Link href={`/${country.toLowerCase()}/letters/${letter.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pro Tips */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Pro Tips for Success</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Complete Your Profile</p>
                    <p className="text-sm text-muted-foreground">Ensure 100% completion for optimal results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Review & Personalize</p>
                    <p className="text-sm text-muted-foreground">Edit generated content to add personal touches</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Strong Home Ties</p>
                    <p className="text-sm text-muted-foreground">Emphasize family, property, and business connections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Specific Examples</p>
                    <p className="text-sm text-muted-foreground">Include concrete details about your goals and plans</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}