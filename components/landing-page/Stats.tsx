// components/landing-page/Stats.tsx
'use client'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Users, Globe, Clock, Award, Target } from 'lucide-react'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import { Carousel, Card as CarouselCard } from '@/components/ui/apple-cards-carousel'
import { motion } from 'motion/react'

const stats = [
  {
    icon: Users,
    number: '500+',
    label: 'Students',
    sublabel: 'Made SOP easy',
    color: 'text-blue-500',
    category: 'impact'
  },
  {
    icon: TrendingUp,
    number: '92%',
    label: 'Approval Rate',
    sublabel: 'Canada & Australia',
    color: 'text-green-500',
    category: 'success'
  },
  {
    icon: Award,
    number: '1,200+',
    label: 'Letters',
    sublabel: 'Generated',
    color: 'text-pink-500',
    category: 'impact'
  },
  {
    icon: Target,
    number: '98%',
    label: 'Satisfaction',
    sublabel: 'User rating',
    color: 'text-cyan-500',
    category: 'success'
  },
  {
    icon: Globe,
    number: '2',
    label: 'Countries',
    sublabel: 'CA & AU',
    color: 'text-purple-500',
    category: 'coverage'
  },
  {
    icon: Clock,
    number: '8m',
    label: 'Avg Time',
    sublabel: 'Start to finish',
    color: 'text-amber-500',
    category: 'efficiency'
  }
]

const testimonials = [
  {
    src: 'https://images.unsplash.com/photo-1559202921-0e869c50c7a0?q=80&w=1636&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Rashid Ahmed',
    category: 'Bangladesh → Canada',
    content: (
      <div className="space-y-6">
        <div className="bg-primary/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-primary">Study Plan Success</h3>
          <p className="text-muted-foreground leading-relaxed">
            {`"SOPEE AI helped me craft a perfect study plan that highlighted my transition from BBA to Computer Science. 
            The detailed semester breakdown and career alignment impressed the visa officer. The AI understood my background 
            and created compelling narratives that connected my business education to my tech aspirations."`}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">University</h4>
            <p className="text-muted-foreground">University of Toronto</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Program</h4>
            <p className="text-muted-foreground">Master of Computer Science</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Approval Time</h4>
            <p className="text-muted-foreground">4 weeks</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Letter Type</h4>
            <p className="text-muted-foreground">Study Plan</p>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 dark:text-green-400 font-medium">Visa Approved ✓</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Successfully obtained Canadian study permit on first attempt
          </p>
        </div>
      </div>
    )
  },
  {
    src: 'https://images.unsplash.com/photo-1588534434902-85fe43d860f3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Karim Khan',
    category: 'Bangladesh → Australia',
    content: (
      <div className="space-y-6">
        <div className="bg-primary/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-primary">Financial Statement Excellence</h3>
          <p className="text-muted-foreground leading-relaxed">
            {`"The financial statement letter was incredibly comprehensive and addressed all concerns about funding from Bangladesh. 
            It included detailed cost breakdowns, sponsor documentation, and demonstrated clear financial planning that satisfied 
            all Australian visa requirements."`}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">University</h4>
            <p className="text-muted-foreground">University of Melbourne</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Program</h4>
            <p className="text-muted-foreground">Master of Business Analytics</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Funding Source</h4>
            <p className="text-muted-foreground">Family Sponsorship</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Letter Type</h4>
            <p className="text-muted-foreground">Financial Statement</p>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 dark:text-green-400 font-medium">Visa Approved ✓</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Australian student visa approved with no additional financial documentation requested
          </p>
        </div>
      </div>
    )
  },
  {
    src: 'https://images.unsplash.com/photo-1554493379-b47370c5dc82?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Karim Hassan',
    category: 'Bangladesh → Canada',
    content: (
      <div className="space-y-6">
        <div className="bg-primary/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-primary">Gap Year Explanation</h3>
          <p className="text-muted-foreground leading-relaxed">
            {`"Had a 3-year gap after HSC due to family business responsibilities. The AI explanation letter perfectly 
            addressed my situation with compelling reasons and demonstrated my renewed commitment to education. 
            It turned my gap into a strength by highlighting leadership and business experience gained."`}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">University</h4>
            <p className="text-muted-foreground">University of British Columbia</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Program</h4>
            <p className="text-muted-foreground">Bachelor of Engineering</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Gap Duration</h4>
            <p className="text-muted-foreground">3 years</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Letter Type</h4>
            <p className="text-muted-foreground">Letter of Explanation</p>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 dark:text-green-400 font-medium">Visa Approved ✓</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Canadian study permit approved despite significant study gap
          </p>
        </div>
      </div>
    )
  },
    {
    src: 'https://images.unsplash.com/photo-1536528947088-d655e462f4d3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Saiba Noor',
    category: 'Bangladesh → Australia',
    content: (
    <div className="space-y-6">
        <div className="bg-primary/10 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-3 text-primary">Professional Background Highlight</h3>
        <p className="text-muted-foreground leading-relaxed">
            {`"The AI-generated letter effectively connected my 5 years of HR experience to the Master's in Human Resource Management. 
            It highlighted transferable skills, leadership roles, and how my background aligns with the program's objectives."`}
        </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <h4 className="font-semibold text-foreground">University</h4>
            <p className="text-muted-foreground">Monash University</p>
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Program</h4>
            <p className="text-muted-foreground">Master of Human Resource Management</p>
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Experience Duration</h4>
            <p className="text-muted-foreground">5 years</p>
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Letter Type</h4>
            <p className="text-muted-foreground">Professional Background Letter</p>
        </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 dark:text-green-400 font-medium">
                Visa Approved ✓
            </span>
        </div>
        <p className="text-sm text-green-600 dark:text-green-400">
            Australian student visa approved with no additional documentation requested
        </p>
        </div>
    </div>
    )
    }
]

export default function Stats() {
  // const impactStats = stats.filter(stat => stat.category === 'impact')
  // const successStats = stats.filter(stat => stat.category === 'success')
  // const serviceStats = stats.filter(stat => stat.category === 'coverage' || stat.category === 'efficiency')

  const testimonialCards = testimonials.map((testimonial, index) => (
    <CarouselCard key={index} card={testimonial} index={index} layout={true} />
  ))

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] -z-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-background/5 via-primary/5 to-transparent -z-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats Grid - Organized by Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Bangladeshi Students
            <br />
            <span className="text-primary">Going to Canada & Australia</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {`Join hundreds of successful Bangladeshi students who've secured their study permits with professionally crafted SOP letters.`}
          </p>
        </motion.div>

        {/* Compact Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Card className="text-center group hover:shadow-md transition-all duration-300 bg-card/20 backdrop-blur-sm border-border/30 hover:border-border/60">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex justify-center mb-2">
                        <div className="p-2 rounded-full bg-background/30">
                          <Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                        </div>
                      </div>
                      <div className="text-lg md:text-xl lg:text-2xl font-bold mb-1">{stat.number}</div>
                      <div className="text-xs md:text-sm font-medium mb-1 leading-tight">{stat.label}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground leading-tight">{stat.sublabel}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Success Stories Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl font-bold mb-4">Success Stories from Bangladesh</h3>
          <p className="text-muted-foreground">Real Bangladeshi students, real results • Click any card to read full story</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          <ProgressiveBlur 
            direction="left"
            blurLayers={4}
            blurIntensity={0.4}
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          />
          <ProgressiveBlur 
            direction="right"
            blurLayers={4}
            blurIntensity={0.4}
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          />
          <Carousel items={testimonialCards} />
        </motion.div>

        {/* Focus Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <div className="flex gap-1">
              <span className="text-lg">🇧🇩</span>
              <span className="text-lg">→</span>
              <span className="text-lg">🇨🇦</span>
              <span className="text-lg">🇦🇺</span>
            </div>
            <span className="text-primary font-medium">
              Specialized for Bangladesh → Canada & Australia Student Visas
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}