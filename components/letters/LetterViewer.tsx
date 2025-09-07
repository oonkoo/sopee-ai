// components/letters/LetterViewer.tsx
'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Calendar, 
  Clock, 
  Download,
  Copy,
  Heart,
  Star,
  Zap,
  Eye,
  Printer
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { GeneratedLetter } from '@/types/letter'
import { getModelDisplayName } from '@/lib/config/modelDisplay'

interface LetterViewerProps {
  letter: GeneratedLetter
  country: 'AUSTRALIA' | 'CANADA'
  onFavoriteToggle?: (letterId: string, isFavorite: boolean) => void
  onRatingSubmit?: (letterId: string, rating: number) => void
  onContentUpdate?: (letterId: string, content: string) => void
  isEditMode?: boolean
  onEditModeChange?: (editMode: boolean) => void
}

export default function LetterViewer({ 
  letter, 
  country, 
  onFavoriteToggle,
  onRatingSubmit,
  onContentUpdate,
  isEditMode: externalEditMode,
  onEditModeChange 
}: LetterViewerProps) {
  const [currentRating, setCurrentRating] = useState(letter.feedbackRating || 0)
  const [isEditing, setIsEditing] = useState(externalEditMode || false)
  const [editedContent, setEditedContent] = useState(letter.content)
  const [isFavoriting, setIsFavoriting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sync external edit mode with internal state
  useEffect(() => {
    if (externalEditMode !== undefined) {
      setIsEditing(externalEditMode)
    }
  }, [externalEditMode])

  // Notify parent when edit mode changes
  useEffect(() => {
    if (onEditModeChange) {
      onEditModeChange(isEditing)
    }
  }, [isEditing, onEditModeChange])

  const countryInfo = {
    AUSTRALIA: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      name: 'Australia'
    },
    CANADA: {
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      name: 'Canada'
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

  const handleRatingSubmit = async (rating: number) => {
    if (!onRatingSubmit) return
    
    setCurrentRating(rating)
    try {
      await onRatingSubmit(letter.id, rating)
    } catch (error) {
      console.error('Failed to submit rating:', error)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter.content)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy letter:', error)
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

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      toast.error('Content cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/letters/${letter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editedContent
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save changes')
      }

      toast.success('Letter updated successfully')
      setIsEditing(false)
      
      // Call the parent callback if provided
      if (onContentUpdate) {
        onContentUpdate(letter.id, editedContent)
      }
    } catch (error) {
      console.error('Failed to save changes:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const formatContentForPrint = (content: string): string => {
    return content
      // Convert headings (# Heading -> <h2>Heading</h2>)
      .replace(/^# (.+)$/gm, '<h2 style="font-size: 16pt; font-weight: bold; margin: 20px 0 10px 0; color: #333;">$1</h2>')
      .replace(/^## (.+)$/gm, '<h3 style="font-size: 14pt; font-weight: bold; margin: 18px 0 8px 0; color: #444;">$1</h3>')
      .replace(/^### (.+)$/gm, '<h4 style="font-size: 12pt; font-weight: bold; margin: 16px 0 6px 0; color: #555;">$1</h4>')
      
      // Convert bold text (**text** -> <strong>text</strong>)
      .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
      
      // Convert paragraphs (double line breaks -> <p> tags)
      .split('\n\n')
      .map(paragraph => {
        const trimmed = paragraph.trim()
        if (trimmed && !trimmed.startsWith('<h')) {
          return `<p style="margin: 12px 0; text-align: justify; line-height: 1.7;">${trimmed}</p>`
        }
        return trimmed
      })
      .join('\n')
      
      // Convert single line breaks to <br>
      .replace(/\n(?!<[hp])/g, '<br>')
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const formattedContent = formatContentForPrint(letter.content)
      const countryInfo = {
        AUSTRALIA: 'Australian Student Visa',
        CANADA: 'Canadian Study Permit'
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${letter.title}</title>
            <style>
              body {
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
                margin: 40px;
                color: #333;
                font-size: 12pt;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .meta {
                font-size: 10pt;
                color: #666;
                margin-top: 10px;
                line-height: 1.4;
                text-align: center;
              }
              .content {
                font-size: 12pt;
                text-align: justify;
                margin: 40px 0;
                line-height: 1.7;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ccc;
                text-align: center;
                color: #666;
                font-size: 9pt;
                line-height: 1.4;
              }
              h1 {
                margin: 0;
                font-size: 18pt;
                font-weight: bold;
              }
              h2 {
                font-size: 16pt;
                font-weight: bold;
                margin: 24px 0 12px 0;
                color: #333;
                page-break-after: avoid;
              }
              h3 {
                font-size: 14pt;
                font-weight: bold;
                margin: 20px 0 10px 0;
                color: #444;
                page-break-after: avoid;
              }
              h4 {
                font-size: 12pt;
                font-weight: bold;
                margin: 16px 0 8px 0;
                color: #555;
                page-break-after: avoid;
              }
              p {
                margin: 12px 0;
                text-align: justify;
                line-height: 1.7;
                orphans: 3;
                widows: 3;
              }
              strong {
                font-weight: bold;
              }
              @media print {
                body { 
                  margin: 20px;
                  font-size: 11pt;
                }
                .header { 
                  page-break-after: avoid;
                  margin-bottom: 30px;
                }
                .footer {
                  page-break-before: avoid;
                  margin-top: 30px;
                  text-align: center;
                }
              }
              @page {
                margin: 2cm;
                size: A4;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="text-align: center;">${letter.title}</h1>
              <div class="meta">
                <p style="text-align: center;">Generated on ${new Date(letter.createdAt).toLocaleDateString()}</p>
                <p style="text-align: center;">${country} • ${letter.letterType.toUpperCase()}</p>
                <p style="text-align: center;">${countryInfo[country as keyof typeof countryInfo]}</p>
              </div>
            </div>
            
            <div class="content">
              ${formattedContent}
            </div>
            
            <div class="footer">
              <p style="text-align: center;">Generated by SopeeAI • Word Count: ${letter.wordCount || 0} words • Model: ${getModelDisplayName(letter.modelUsed || 'AI')}</p>
              <p style="text-align: center;">© ${new Date().getFullYear()} SopeeAI. All rights reserved.</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const formatContent = (content: string) => {
    // Split content into paragraphs and format
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.trim().startsWith('#')) {
        // Format as heading
        return (
          <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-foreground">
            {paragraph.replace(/^#+\s*/, '')}
          </h3>
        )
      } else if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
        // Format as bold section
        return (
          <h4 key={index} className="font-medium mt-4 mb-2 text-foreground">
            {paragraph.replace(/\*\*/g, '')}
          </h4>
        )
      } else {
        // Regular paragraph
        return (
          <p key={index} className="mb-4 text-muted-foreground leading-relaxed text-justify">
            {paragraph}
          </p>
        )
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Letter Header */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg ${info.bgColor} flex items-center justify-center`}>
                <FileText className={`h-6 w-6 ${info.color}`} />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">{letter.title}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className={`${info.color} ${info.borderColor}`}>
                    {letter.letterType.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {info.name}
                  </Badge>
                  {letter.isFavorite && (
                    <Badge variant="secondary" className="text-red-600 bg-red-500/10 border-red-500/20">
                      <Heart className="h-3 w-3 mr-1 fill-current" />
                      Favorite
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                disabled={isFavoriting}
                className={letter.isFavorite ? 'text-red-600 border-red-500 bg-red-500/10 hover:bg-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-2 ${letter.isFavorite ? 'fill-current' : ''}`} />
                {letter.isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={copySuccess ? 'text-green-600 border-green-200' : ''}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Letter</DialogTitle>
                    <DialogDescription>
                      Choose your preferred download format
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleDownload('txt')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Plain Text (.txt) - {letter.wordCount || 0} words
                    </Button>
                    <Button 
                      onClick={() => handleDownload('pdf')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF Document - Formatted for printing
                    </Button>
                    <Button 
                      onClick={handlePrint} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Letter Stats */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xl font-bold text-foreground">{letter.wordCount || 0}</p>
              <p className="text-sm text-muted-foreground">Words</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mx-auto mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-foreground">
                {Math.round((letter.generationTime || 0) / 1000)}s
              </p>
              <p className="text-sm text-muted-foreground">Generation Time</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mx-auto mb-2">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xl font-bold text-foreground">
                {new Date(letter.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">Created</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mx-auto mb-2">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-foreground">{getModelDisplayName(letter.modelUsed || 'AI')}</p>
              <p className="text-sm text-muted-foreground">Model</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Section */}
      {onRatingSubmit && (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">Rate this letter</h3>
                <p className="text-sm text-muted-foreground">
                  Help us improve by rating the quality of this generated content
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingSubmit(rating)}
                    className={`text-2xl transition-colors ${
                      rating <= currentRating ? 'text-yellow-500' : 'text-muted-foreground/30'
                    } hover:text-yellow-400`}
                  >
                    <Star className={`h-6 w-6 ${rating <= currentRating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Letter Content */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Letter Content
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {letter.wordCount || 0} words
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs"
              >
                {isEditing ? 'View Mode' : 'Edit Mode'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[600px] font-mono text-sm"
                placeholder="Edit your letter content..."
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditedContent(letter.content) // Reset to original content
                    setIsEditing(false)
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={isSaving || editedContent.trim() === letter.content.trim()}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="bg-card/30 rounded-lg p-6 border border-border/30">
                {formatContent(letter.content)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}