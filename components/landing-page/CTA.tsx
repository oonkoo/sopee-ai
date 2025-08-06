// components/landing-page/CTA.tsx
'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { ArrowRight, CheckCircle, Zap, Clock, Shield, Users } from 'lucide-react'
import { motion } from 'motion/react'
import SopeeLogo from '@/components/SopeeLogo'

const benefits = [
  {
    icon: CheckCircle,
    text: '3 free letters included'
  },
  {
    icon: Clock,
    text: 'Ready in under 10 minutes'
  },
  {
    icon: Shield,
    text: 'Visa-compliant formatting'
  },
  {
    icon: Users,
    text: '500+ successful applications'
  }
]

const urgencyStats = [
  { number: '2,847', label: 'Students applied this month' },
  { number: '156', label: 'Visas approved this week' },
  { number: '23', label: 'Applications today' }
]

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" />
        <motion.div 
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(var(--primary), 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-50"
        />
      </div>
      
      {/* Gradient Overlay */}   
      <div className="absolute inset-0 bg-gradient-to-br from-background/5 via-primary/5 to-background/5 -z-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Limited Time: Free Account Setup
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Start Your
              <br />
              <span className="text-primary">Visa Journey</span>
              <br />
              Today
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {`Join hundreds of Bangladeshi students who've successfully secured their Canadian and Australian study permits. 
              Your professional SOP letters are just minutes away.`}
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <RegisterLink>
                <Button size="lg" className="px-8 py-4 text-lg bg-primary hover:bg-primary/90 group relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center gap-2 cursor-pointer">
                    <SopeeLogo size={20} />
                    Create Free Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </RegisterLink>
              
              <LoginLink>
                <Button variant="outline" size="lg" className="px-8 py-4 cursor-pointer text-lg hover:bg-primary/5 hover:text-primary hover:border-primary/50">
                  Already have an account?
                </Button>
              </LoginLink>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm text-muted-foreground items-center flex gap-4"
            >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Setup in 2 minutes</span>
            </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden relative z-10">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <SopeeLogo size={32} animated />
                    <span className="text-xl font-bold">SOPEE AI</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
                  <p className="text-sm text-muted-foreground">Join the success stories</p>
                </div>

                {/* Live Activity Feed */}
                <div className="space-y-3 mb-6">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Recent Activity</div>
                  {urgencyStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 * index }}
                      className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">{stat.number}</span>
                    </motion.div>
                  ))}
                </div>

                <RegisterLink>
                  <Button className="w-full py-5 mt-6 bg-primary/10 text-primary hover:text-primary/90 hover:bg-primary/20 group flex items-center justify-center cursor-pointer">
                    <SopeeLogo size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </RegisterLink>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30 z-20"
            >
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-secondary/30"
            >
              <Zap className="w-8 h-8 text-secondary" />
            </motion.div>

            {/* Success Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium z-20"
            >
              ✓ 92% Success Rate
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section - Final Push */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 pt-12 border-t border-border/50"
        >
          <h3 className="text-2xl font-bold mb-4">
            {"Don't Let Your Dreams Wait"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {`Every day you wait is another day your visa application could be in process. 
            Start your journey now and join the thousands who've made their dreams reality.`}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>23 students started today</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>156 visas approved this week</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}