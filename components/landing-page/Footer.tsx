// components/landing-page/Footer.tsx
'use client'
import { motion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { 
  ArrowRight, 
  Mail, 
  MapPin,  
  Globe, 
  FileText, 
  BookOpen, 
  DollarSign,
  Users,
  Shield,
  Zap,
  Heart,
  ExternalLink,
  MessageCircle
} from 'lucide-react'
import SopeeLogo from '@/components/SopeeLogo'

const journeySteps = [
  {
    icon: '🇧🇩',
    title: 'Start in Bangladesh',
    description: 'Begin your journey'
  },
  {
    icon: '📝',
    title: 'Create Profile',
    description: 'Share your story'
  },
  {
    icon: '🤖',
    title: 'AI Generation',
    description: 'Get professional letters'
  },
  {
    icon: '✈️',
    title: 'Study Abroad',
    description: 'Canada & Australia'
  }
]

const quickLinks = [
  { icon: FileText, label: 'Letter of Explanation', href: '/features/explanation' },
  { icon: BookOpen, label: 'Study Plan', href: '/features/study-plan' },
  { icon: DollarSign, label: 'Financial Statement', href: '/features/financial' },
  { icon: Users, label: 'Success Stories', href: '/success-stories' }
]

const supportLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Contact Support', href: '/contact' },
  { label: 'Video Tutorials', href: '/tutorials' },
  { label: 'Sample Letters', href: '/samples' }
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Refund Policy', href: '/refund' }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background/5 via-transparent to-primary/5" />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: ['-100%', '100%'],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: ['100%', '-100%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 10
          }}
          className="absolute bottom-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
          
          {/* Top Section - Brand & Journey */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <SopeeLogo size={48} className="hover:scale-110 transition-transform duration-300" />
                <div>
                  <h3 className="text-2xl font-bold">SOPEE <span className="text-primary">AI</span></h3>
                  <p className="text-sm text-muted-foreground">SOP Made Easy</p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Empowering Bangladeshi students to achieve their dreams of studying in Canada and Australia 
                through AI-powered professional documentation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <RegisterLink>
                  <Button className="group">
                    <Zap className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </RegisterLink>
                <Button variant="outline" className="group">
                  <MessageCircle className="mr-2 w-4 h-4" />
                  Contact Support
                </Button>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>support@sopee.ai</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Available 24/7 for students worldwide</span>
                </div>
              </div>
            </motion.div>

            {/* Student Journey Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-xl font-semibold mb-6">Your Study Abroad Journey</h4>
              <div className="relative">
                {/* Journey Path */}
                <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary opacity-30" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {journeySteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative"
                    >
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
                        <CardContent className="p-4 text-center">
                          <motion.div 
                            className="text-2xl mb-2"
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          >
                            {step.icon}
                          </motion.div>
                          <h5 className="font-semibold text-sm mb-1">{step.title}</h5>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </CardContent>
                      </Card>
                      
                      {/* Step Number */}
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Section - Card Layout */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            
            {/* Quick Access */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold">Quick Access</h4>
                  </div>
                  <div className="space-y-3">
                    {quickLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
                      >
                        <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <h4 className="font-semibold">Support & Help</h4>
                  </div>
                  <div className="space-y-3">
                    {supportLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="block text-sm hover:text-primary transition-colors"
                      >
                        {link.label}
                      </motion.a>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Support team online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <h4 className="font-semibold">Company</h4>
                  </div>
                  <div className="space-y-3">
                    {companyLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="block text-sm hover:text-primary transition-colors"
                      >
                        {link.label}
                      </motion.a>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span>Made with love for students</span>
                      </div>
                      <div>Trusted by 500+ Bangladeshi students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 gap-4"
          >
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} SOPEE AI. All rights reserved.</span>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>Empowering students worldwide</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Success Indicators */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>92% Success Rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>500+ Students Helped</span>
                </div>
              </div>

              {/* Country Flags */}
              <div className="flex items-center gap-2 text-lg">
                <span title="Bangladesh">🇧🇩</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span title="Canada">🇨🇦</span>
                <span title="Australia">🇦🇺</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Bottom Border */}
        <motion.div
          animate={{
            background: [
              "linear-gradient(90deg, transparent, rgba(var(--primary), 0.5), transparent)",
              "linear-gradient(90deg, transparent, rgba(var(--primary), 0.8), transparent)",
              "linear-gradient(90deg, transparent, rgba(var(--primary), 0.5), transparent)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="h-0.5 w-full"
        />
      </div>
    </footer>
  )
}