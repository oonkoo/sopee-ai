// components/landing-page/HowItWorks.tsx
'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { User, Settings, Zap, Download, ArrowRight, CheckCircle } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: User,
    title: 'Create Your Profile',
    description: 'Fill in your personal, academic, and program details. Our smart form guides you through every essential piece of information.',
    features: ['Personal Information', 'Academic Background', 'Target Program Details', 'Financial Planning'],
    time: '5 minutes',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    step: '02',
    icon: Settings,
    title: 'Choose Letter Type',
    description: 'Select from our three specialized letter types based on your specific visa requirements and application needs.',
    features: ['Letter of Explanation', 'Study Plan Document', 'Financial Statement', 'Custom Requirements'],
    time: '1 minute',
    color: 'from-purple-500 to-pink-500'
  },
  {
    step: '03',
    icon: Zap,
    title: 'AI Generation',
    description: 'Our advanced AI analyzes your profile and generates a professional, personalized letter tailored to visa officer expectations.',
    features: ['AI Content Analysis', 'Professional Tone', 'Visa Officer Focus', 'Compliance Check'],
    time: '30 seconds',
    color: 'from-amber-500 to-orange-500'
  },
  {
    step: '04',
    icon: Download,
    title: 'Review & Download',
    description: 'Edit, customize, and download your professionally crafted letter. Make any final adjustments before submission.',
    features: ['In-line Editing', 'Real-time Preview', 'Multiple Formats', 'Version History'],
    time: '2 minutes',
    color: 'from-green-500 to-emerald-500'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-tl from-background/10 to-background/5 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Simple 4-Step Process
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            From Profile to
            <br />
            <span className="text-primary">Professional Letter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process transforms your information into compelling visa documentation in under 10 minutes.
          </p>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/5 via-primary/5 to-transparent -z-50" />

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
            <div className="flex justify-between items-center h-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-1 mx-8">
                  <div className="h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="w-4 h-4 text-primary/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, _) => {
              const Icon = step.icon
              return (
                <Card key={step.step} className="relative group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" style={{ 
                        background: `linear-gradient(135deg, ${step.color.split(' ')[1]}, ${step.color.split(' ')[3]})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {step.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Time */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Estimated time:</span>
                      <span className="text-sm font-medium text-primary">{step.time}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <RegisterLink>
            <Button size="lg" className="px-8 py-4 text-lg bg-primary hover:bg-primary/90">
              Start Your First Letter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </RegisterLink>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 3 free letters included
          </p>
        </div>
      </div>
    </section>
  )
}