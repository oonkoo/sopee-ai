// components/letters/GenerationProgress.tsx
'use client'
import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Zap, FileText, Sparkles, Brain, Database, Shield, Eye, Cpu, BookOpen } from 'lucide-react'

interface GenerationProgressProps {
  isGenerating: boolean
  estimatedTimeMs?: number
  onComplete?: () => void
  country: 'AUSTRALIA' | 'CANADA'
  actualGenerationTime?: number
}

const dataProcessingSteps = [
  { 
    name: 'Profile Analysis', 
    description: 'Processing your personal and academic background data', 
    icon: Database,
    duration: 4000,
    category: 'processing'
  },
  { 
    name: 'Data Validation', 
    description: 'Validating and structuring your profile information', 
    icon: Shield,
    duration: 3000,
    category: 'processing'
  },
  { 
    name: 'Pattern Matching', 
    description: 'Analyzing successful visa application patterns', 
    icon: Eye,
    duration: 5000,
    category: 'processing'
  }
]

const aiGenerationSteps = [
  { 
    name: 'AI Model Loading', 
    description: 'Initializing specialized language models', 
    icon: Brain,
    duration: 3000,
    category: 'generation'
  },
  { 
    name: 'Content Generation', 
    description: 'Creating your personalized statement using AI', 
    icon: Sparkles,
    duration: 8000,
    category: 'generation'
  },
  { 
    name: 'Language Optimization', 
    description: 'Enhancing tone and professional structure', 
    icon: BookOpen,
    duration: 4000,
    category: 'generation'
  },
  { 
    name: 'Final Processing', 
    description: 'Completing document formatting and validation', 
    icon: FileText,
    duration: 3000,
    category: 'generation'
  }
]

const progressSteps = [...dataProcessingSteps, ...aiGenerationSteps]

export default function GenerationProgress({ 
  isGenerating, 
  estimatedTimeMs = 45000, 
  onComplete,
  country,
  actualGenerationTime 
}: GenerationProgressProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isActuallyGenerating, setIsActuallyGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)

  // Calculate display time with minor variations (44-48s) - use useState to avoid hydration mismatch
  const [displayTime, setDisplayTime] = useState(estimatedTimeMs)
  
  useEffect(() => {
    // Set the random variation on client side only to avoid hydration issues
    const staticProcessingTime = estimatedTimeMs + (Math.floor(Math.random() * 5) - 2) * 1000 // ±2s variation
    setDisplayTime(Math.max(staticProcessingTime, 30000)) // Minimum 30s total
  }, [estimatedTimeMs])

  // Memoize the completion callback to prevent re-renders
  const handleComplete = useCallback(() => {
    if (onComplete) {
      // Use setTimeout to avoid calling during render
      setTimeout(() => {
        onComplete()
      }, 100)
    }
  }, [onComplete])

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0)
      setCurrentStep(0)
      setElapsedTime(0)
      setIsActuallyGenerating(false)
      setGenerationComplete(false)
      return
    }

    setIsActuallyGenerating(true)

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 100)
    }, 100)

    return () => clearInterval(interval)
  }, [isGenerating, displayTime, generationComplete, handleComplete])

  useEffect(() => {
    if (!isActuallyGenerating) return

    // Calculate which step we should be on based on cumulative durations
    let cumulativeTime = 0
    let currentStepIndex = 0
    
    for (let i = 0; i < progressSteps.length; i++) {
      if (elapsedTime >= cumulativeTime && elapsedTime < cumulativeTime + progressSteps[i].duration) {
        currentStepIndex = i
        break
      }
      cumulativeTime += progressSteps[i].duration
      if (i === progressSteps.length - 1) {
        currentStepIndex = i
      }
    }
    
    setCurrentStep(currentStepIndex)
    
    // Calculate progress based on elapsed time vs total display time
    const totalProgress = Math.min((elapsedTime / displayTime) * 100, 98)
    setProgress(totalProgress)
    
    // Mark generation as complete when we reach the last step
    if (currentStepIndex >= progressSteps.length - 1 && !generationComplete) {
      setGenerationComplete(true)
      setProgress(100)
    }
  }, [elapsedTime, displayTime, isActuallyGenerating, generationComplete])

  // Handle completion in a separate effect
  useEffect(() => {
    if (generationComplete && elapsedTime >= displayTime) {
      // Ensure we only call complete once
      setIsActuallyGenerating(false)
      handleComplete()
    }
  }, [generationComplete, elapsedTime, displayTime, handleComplete])

  if (!isGenerating) return null

  // const countryInfo = {
  //   AUSTRALIA: {
  //     color: 'text-primary',
  //     bgColor: 'bg-primary/10',
  //     borderColor: 'border-primary/20'
  //   },
  //   CANADA: {
  //     color: 'text-red-600', 
  //     bgColor: 'bg-red-50',
  //     borderColor: 'border-red-200'
  //   }
  // }

  // const colors = countryInfo[country]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Generating Your Statement of Purpose
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Estimated time: {Math.round(displayTime / 1000)}s</span>
              <span>Elapsed: {Math.round(elapsedTime / 1000)}s</span>
            </div>
          </div>

          {/* Data Processing Phase */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Data Processing Phase</h4>
              <div className="h-px bg-border flex-1"></div>
            </div>
            
            {dataProcessingSteps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              
              return (
                <div key={step.name} className={`flex items-start gap-4 p-3 rounded-lg border transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/5 border-primary/30 shadow-sm' 
                    : isCompleted
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-card/30 border-border/20'
                }`}>
                  <div className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary/10 border-primary text-primary'
                      : isActive 
                        ? 'bg-primary/10 border-primary text-primary animate-pulse'
                        : 'bg-muted/50 border-muted text-muted-foreground'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                    {isActive && (
                      <div className="absolute -inset-1 bg-primary/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  )}
                  {isCompleted && (
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* AI Generation Phase */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">AI Generation Phase</h4>
              <div className="h-px bg-border flex-1"></div>
              <div className="text-xs text-muted-foreground">
                Generation Time: ~{actualGenerationTime ? Math.round(actualGenerationTime / 1000) : '9'}s
              </div>
            </div>
            
            {aiGenerationSteps.map((step, index) => {
              const globalIndex = dataProcessingSteps.length + index
              const StepIcon = step.icon
              const isActive = globalIndex === currentStep
              const isCompleted = globalIndex < currentStep
              
              return (
                <div key={step.name} className={`flex items-start gap-4 p-3 rounded-lg border transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/5 border-primary/30 shadow-sm' 
                    : isCompleted
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-card/30 border-border/20'
                }`}>
                  <div className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary/10 border-primary text-primary'
                      : isActive 
                        ? 'bg-primary/10 border-primary text-primary animate-pulse'
                        : 'bg-muted/50 border-muted text-muted-foreground'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                    {isActive && (
                      <div className="absolute -inset-1 bg-primary/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  )}
                  {isCompleted && (
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Dynamic Tips */}
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Advanced AI Processing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Our AI models are trained on thousands of approved {country === 'AUSTRALIA' ? 'Australian' : 'Canadian'} visa applications 
                    to ensure your statement follows proven successful patterns.
                  </p>
                </div>
              </div>
            </div>
            
            {currentStep >= 3 && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {country === 'AUSTRALIA' ? 'DHA' : 'IRCC'} Compliance Check
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ensuring your statement meets all immigration officer requirements and criteria.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep >= 5 && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Professional Enhancement
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Optimizing language, tone, and structure to create a compelling narrative.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}