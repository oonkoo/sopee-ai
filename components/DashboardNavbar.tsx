// components/DashboardNavbar.tsx
'use client'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { Button } from '@/components/ui/button'
import { User, FileText, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SopeeLogo from '@/components/SopeeLogo'
import type { User as UserType } from '@/types/auth'

interface DashboardNavbarProps {
  user: UserType
  country: 'CANADA' | 'AUSTRALIA'
}

export default function DashboardNavbar({ user, country }: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const countryImage = country === 'CANADA' ? '/countries/canada.png' : '/countries/australia.png'
  const countryName = country === 'CANADA' ? 'Canada' : 'Australia'
  
  const navLinks = [
    {
      href: `/${country.toLowerCase()}/letters`,
      label: 'My Letters',
      icon: FileText
    }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link 
              href={`/${country.toLowerCase()}/dashboard`} 
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <SopeeLogo size={28} />
              <div className="hidden sm:block">
                <span className="text-lg font-semibold tracking-tight">
                  SOPEE <span className="text-primary">AI</span>
                </span>
              </div>
            </Link>
            
            {/* Country Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50">
              <Image 
                src={countryImage} 
                alt={`${countryName} flag`} 
                width={16} 
                height={12} 
                className="rounded-sm object-cover"
              />
              <span className="text-sm font-medium text-foreground">{countryName}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-foreground hover:bg-accent">
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            
            {/* Usage Counter */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium">
                  {user.lettersGenerated}<span className="text-muted-foreground">/{user.lettersLimit}</span>
                </span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Link href="/onboarding/profile/personal">
                <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-foreground hover:bg-accent">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>

              <LogoutLink>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-red-600 hover:bg-red-950/50">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </LogoutLink>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col gap-2">
              
              {/* Country Indicator - Mobile */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 mb-2">
                <Image 
                  src={countryImage} 
                  alt={`${countryName} flag`} 
                  width={16} 
                  height={12} 
                  className="rounded-sm object-cover"
                />
                <span className="text-sm font-medium">{countryName} Portal</span>
                <div className="ml-auto text-sm text-muted-foreground">
                  {user.lettersGenerated}/{user.lettersLimit} used
                </div>
              </div>

              {/* Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-foreground/80 hover:text-foreground hover:bg-accent">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}