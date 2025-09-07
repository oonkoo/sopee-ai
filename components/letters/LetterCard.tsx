// components/letters/LetterCard.tsx
'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Calendar, 
  Clock, 
  Eye, 
  Download,
  Heart,
  MoreHorizontal,
  Copy,
  Trash2,
  RefreshCw
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { GeneratedLetter } from '@/types/letter'
import { getModelDisplayName } from '@/lib/config/modelDisplay'

// Function to strip markdown formatting and return plain text
function stripMarkdown(content: string): string {
  return content
    // Remove headers (# ## ### anywhere in text)
    .replace(/#{1,6}\s*/g, '')
    // Remove bold (**text** or __text__)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    // Remove italic (*text* or _text_)
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove links [text](url)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove inline code `code`
    .replace(/`([^`]*)`/g, '$1')
    // Remove bullet points and list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    // Remove numbered list markers
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove line breaks and normalize whitespace
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

interface LetterCardProps {
  letter: GeneratedLetter
  country: 'AUSTRALIA' | 'CANADA'
  onFavoriteToggle?: (letterId: string, isFavorite: boolean) => void
  onDelete?: (letterId: string) => void
  onRegenerate?: (letterId: string) => void
}

export default function LetterCard({ 
  letter, 
  country, 
  onFavoriteToggle,
  onDelete,
  onRegenerate 
}: LetterCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFavoriting, setIsFavoriting] = useState(false)

  const countryInfo = {
    AUSTRALIA: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      route: '/australia'
    },
    CANADA: {
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      route: '/canada'
    }
  }

  const info = countryInfo[country]

  const handleFavoriteToggle = async () => {
    if (!onFavoriteToggle || isFavoriting) return
    
    setIsFavoriting(true)
    try {
      await onFavoriteToggle(letter.id, !letter.isFavorite)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsFavoriting(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return
    
    setIsDeleting(true)
    try {
      await onDelete(letter.id)
    } catch (error) {
      console.error('Failed to delete letter:', error)
      setIsDeleting(false)
    }
  }

  const handleDownload = async (format: 'txt' | 'pdf' = 'txt') => {
    try {
      const response = await fetch(`/api/letters/${letter.id}/download?format=${format}`)
      
      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const element = document.createElement('a')
      element.href = url
      
      // Get filename from Content-Disposition header or create one
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `${letter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`
      
      element.download = filename
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter.content)
    } catch (error) {
      console.error('Failed to copy letter:', error)
    }
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border/50 bg-card/50 backdrop-blur group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-lg ${info.bgColor} flex items-center justify-center flex-shrink-0`}>
              <FileText className={`h-6 w-6 ${info.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start sm:items-center gap-2 mb-2 flex-wrap">
                <Link href={`${info.route}/letters/${letter.id}`} className="flex min-w-0">
                  <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors cursor-pointer">
                    {letter.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className={`${info.color} ${info.borderColor} text-xs`}>
                    {letter.letterType.toUpperCase()}
                  </Badge>
                  {letter.isFavorite && (
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">{new Date(letter.createdAt).toLocaleDateString()}</span>
                  <span className="sm:hidden">{new Date(letter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{letter.wordCount || 0}w</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.round((letter.generationTime || 0) / 1000)}s</span>
                </div>
                {letter.modelUsed && (
                  <Badge variant="secondary" className="text-xs">
                    {getModelDisplayName(letter.modelUsed)}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {stripMarkdown(letter.content).substring(0, 200)}...
              </p>

              {letter.feedbackRating && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">Rating:</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-sm ${i < letter.feedbackRating! ? 'text-yellow-500' : 'text-muted-foreground/30'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`${info.route}/letters/${letter.id}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => handleDownload()}
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 ${letter.isFavorite ? 'text-red-500' : ''}`}
                onClick={handleFavoriteToggle}
                disabled={isFavoriting}
              >
                <Heart className={`h-4 w-4 ${letter.isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* More Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Content
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload()}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFavoriteToggle} disabled={isFavoriting}>
                  <Heart className={`h-4 w-4 mr-2 ${letter.isFavorite ? 'fill-current text-red-500' : ''}`} />
                  {letter.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </DropdownMenuItem>
                {onRegenerate && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onRegenerate(letter.id)}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Letter'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Letter Stats Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Created {new Date(letter.createdAt).toLocaleDateString()}</span>
            {letter.generationTime && (
              <span>Generated in {Math.round(letter.generationTime / 1000)}s</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {letter.isFavorite && (
              <Badge variant="secondary" className="text-xs">
                Favorite
              </Badge>
            )}
            <Link href={`${info.route}/letters/${letter.id}`}>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}