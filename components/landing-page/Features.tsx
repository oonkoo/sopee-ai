// components/landing-page/Features.tsx
'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, BookOpen, DollarSign, ArrowRight, Check, Zap } from 'lucide-react'
import SopeeLogo from '../SopeeLogo'

const features = [
  {
    id: 'explanation',
    icon: FileText,
    title: 'Letter of Explanation',
    subtitle: 'Address gaps & demonstrate intent',
    description: 'AI crafts compelling narratives that address employment gaps, study breaks, and clearly demonstrate your genuine intent to study abroad.',
    benefits: ['Gap Analysis & Solutions', 'Intent Demonstration', 'Professional Tone', 'Visa Officer Focus'],
    preview: 'Dear Visa Officer,\n\nI am writing to provide clarity regarding my academic and professional journey...',
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'study_plan',
    icon: BookOpen,
    title: 'Comprehensive Study Plan',
    subtitle: 'Academic roadmap & career goals',
    description: 'Detailed semester-by-semester breakdown with clear career progression, research opportunities, and post-graduation plans.',
    benefits: ['Semester Breakdown', 'Career Alignment', 'Research Integration', 'Future Planning'],
    preview: 'Academic Timeline:\n\nSemester 1: Core Foundation Courses\n- Advanced Programming Concepts...',
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: 'financial',
    icon: DollarSign,
    title: 'Financial Statement',
    subtitle: 'Funding breakdown & assurance',
    description: 'Comprehensive financial documentation showing adequate funding sources, cost breakdowns, and long-term financial planning.',
    benefits: ['Cost Analysis', 'Funding Sources', 'Sponsor Documentation', 'Financial Timeline'],
    preview: 'Financial Overview:\n\nTotal Program Cost: $85,000 CAD\nTuition Fees: $45,000...',
    color: 'from-green-500/20 to-emerald-500/20'
  }
]

export default function Features() {
  const [activeFeature, setActiveFeature] = useState('explanation')
  const currentFeature = features.find(f => f.id === activeFeature) || features[0]

  // Helper function to render the correct icon
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'explanation':
        return <FileText className="w-5 h-5 text-primary" />
      case 'study_plan':
        return <BookOpen className="w-5 h-5 text-primary" />
      case 'financial':
        return <DollarSign className="w-5 h-5 text-primary" />
      default:
        return <FileText className="w-5 h-5 text-primary" />
    }
  }

  const handleFeatureClick = (featureId: string) => {
    console.log('Feature clicked:', featureId)
    setActiveFeature(featureId)
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] -z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-secondary/5" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 z-10 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Letter Generation
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Three Essential Letters,
            <br />
            <span className="text-primary">One Powerful Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI understands visa requirements and creates personalized letters that address officer concerns and showcase your strengths.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature Tabs */}
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon
              const isActive = activeFeature === feature.id
              
              return (
                <button
                  key={feature.id}
                  type="button"
                  className={`w-full text-left cursor-pointer transition-all duration-300 hover:shadow-lg rounded-xl border p-6 ${
                    isActive 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border bg-card hover:border-border/80'
                  }`}
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-foreground/70'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{feature.subtitle}</p>
                      <p className="text-sm leading-relaxed mb-4">{feature.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {feature.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {isActive && (
                      <ArrowRight className="w-5 h-5 text-primary animate-pulse flex-shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${currentFeature.color}`}>
                      {renderIcon(activeFeature)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{currentFeature.title}</h4>
                      <p className="text-sm text-muted-foreground">{currentFeature.subtitle}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-muted-foreground">AI Generated</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-background/50 rounded-lg p-4 font-mono text-sm leading-relaxed border">
                    <div className="text-muted-foreground mb-2">Preview:</div>
                    <div className="whitespace-pre-line">{currentFeature.preview}</div>
                    <div className="text-primary mt-2 text-xs">...</div>
                  </div>
                  
                  <Button className="w-full mt-6 bg-primary/10 text-primary hover:text-primary/90 hover:bg-primary/20 group">
                    <SopeeLogo size={20} className="mr-2" />
                    Generate {currentFeature.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}