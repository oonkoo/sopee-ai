// components/landing-page/Hero.tsx
'use client'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { Button } from '@/components/ui/button'
import SopeeLogo from '@/components/SopeeLogo'
import { ArrowRight, FileText, Brain } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <SopeeLogo size={40} />
          <span className="text-2xl font-bold">
            SOPEE <span className="text-primary">AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <LoginLink>
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              Sign In
            </Button>
          </LoginLink>
          <RegisterLink>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started
            </Button>
          </RegisterLink>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-24">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left lg:pr-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Brain className="w-4 h-4" />
            Powered by Advanced AI
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
            AI-Powered
            <br />
            <span className="text-primary">SOP Generation</span>
            <br />
            for Student Visas
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            Create professional Statement of Purpose letters in minutes. 
            Let our AI craft compelling narratives that boost your visa approval chances.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
            <RegisterLink>
              <Button size="lg" className="px-8 py-4 text-lg bg-primary hover:bg-primary/90">
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </RegisterLink>
            <LoginLink>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                See How It Works
              </Button>
            </LoginLink>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>3,000+ Letters Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>95% Approval Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Canada & Australia</span>
            </div>
          </div>
        </div>

        {/* Right Content - Interactive Preview */}
        <div className="flex-1 lg:flex-shrink-0 mt-16 lg:mt-0 lg:max-w-lg xl:max-w-xl">
          <div className="relative">
            {/* Main Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold">Letter Generator</span>
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">AI Ready</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Select Letter Type</label>
                  <div className="bg-background/50 border rounded-lg p-3">
                    <div className="text-sm font-medium">Letter of Explanation</div>
                    <div className="text-xs text-muted-foreground">Address gaps & demonstrate intent</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Target University</label>
                  <div className="bg-background/50 border rounded-lg p-3 text-sm">
                    University of Toronto
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-primary/10 text-primary hover:text-primary/90 hover:bg-primary/20 group">
                  <SopeeLogo size={40} />
                  Generate with Sopee AI
                </Button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
              <Brain className="w-8 h-8 text-primary animate-pulse" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-secondary/30">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}