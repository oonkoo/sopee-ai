// components/letters/LetterActions.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Download,
  Heart,
  Share2,
  RefreshCw,
  Copy,
  Trash2,
  Star,
  Edit3,
  Printer,
  ExternalLink
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import type { GeneratedLetter } from '@/types/letter'
import { getModelDisplayName } from '@/lib/config/modelDisplay'

interface LetterActionsProps {
  letter: GeneratedLetter
  country: 'AUSTRALIA' | 'CANADA'
  onFavoriteToggle?: (letterId: string, isFavorite: boolean) => void
  onDelete?: (letterId: string) => void
  onRegenerate?: (letterId: string) => void
  onEdit?: (letterId: string) => void
  onRatingSubmit?: (letterId: string, rating: number) => void
  showAll?: boolean
  isDetailPage?: boolean // Flag to indicate if we're on the detail page
}

export default function LetterActions({ 
  letter, 
  country,
  onFavoriteToggle,
  onDelete,
  onRegenerate,
  onEdit,
  onRatingSubmit,
  showAll = false,
  isDetailPage = false
}: LetterActionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [currentRating, setCurrentRating] = useState(letter.feedbackRating || 0)
  const [copySuccess, setCopySuccess] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [showEmailContent, setShowEmailContent] = useState(false)
  const [emailContent, setEmailContent] = useState('')

  const countryInfo = {
    AUSTRALIA: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      name: 'Australia'
    },
    CANADA: {
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
      name: 'Canada'
    }
  }

  const info = countryInfo[country]


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter.content)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
      toast.success('Letter content copied to clipboard')
    } catch {
      toast.error('Failed to copy content')
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
      
      toast.success(`Letter downloaded as ${format.toUpperCase()}`)
      setDownloadDialogOpen(false)
    } catch (error) {
      toast.error('Failed to download letter')
      console.error('Download failed:', error)
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
    try {
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
        toast.success('Print dialog opened')
      }
    } catch {
      toast.error('Failed to print letter')
    }
  }

  const handleEmailShare = () => {
    if (!recipientEmail.trim()) {
      toast.error('Please enter recipient email')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail.trim())) {
      toast.error('Please enter a valid email address')
      return
    }

    const subject = `${letter.title} - ${info.name} SOP`
    const emailBody = `${personalMessage ? personalMessage + '\n\n' : ''}${letter.title}
${info.name} - ${letter.letterType.toUpperCase()}

${letter.content}

---
Generated using SopeeAI
Word Count: ${letter.wordCount || 0} words`

    // Store email content for fallback
    setEmailContent(`Subject: ${subject}\n\nTo: ${recipientEmail}\n\n${emailBody}`)

    try {
      // Simple mailto with basic info first
      const simpleMailto = `mailto:${recipientEmail.trim()}?subject=${encodeURIComponent(subject)}`
      
      // Try to open email client
      window.open(simpleMailto, '_blank')
      
      // Show the full content for user to copy
      setShowEmailContent(true)
      toast.success('Email client opened - Copy the content below into your email')
    } catch (error) {
      console.error('Email sharing error:', error)
      setShowEmailContent(true)
      toast.error('Could not open email client - Please copy the content below')
    }
  }

  const handleCopyEmailContent = async () => {
    try {
      await navigator.clipboard.writeText(emailContent)
      toast.success('Email content copied to clipboard')
    } catch {
      toast.error('Failed to copy content')
    }
  }

  const handleRatingSubmit = async (rating: number) => {
    setCurrentRating(rating)
    if (onRatingSubmit) {
      await onRatingSubmit(letter.id, rating)
      toast.success('Rating submitted successfully')
    }
    setRatingDialogOpen(false)
  }

  const primaryActions = [
    {
      id: 'view',
      label: 'View Details',
      icon: ExternalLink,
      variant: 'default' as const,
      href: `/${country.toLowerCase()}/letters/${letter.id}`,
      hideOnDetailPage: true // Hide when already on detail page
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      variant: 'outline' as const,
      onClick: () => setDownloadDialogOpen(true)
    },
    {
      id: 'favorite',
      label: letter.isFavorite ? 'Unfavorite' : 'Favorite',
      icon: Heart,
      variant: 'outline' as const,
      className: letter.isFavorite ? 'text-red-600 border-red-500 bg-red-500/10 hover:bg-red-600' : '',
      onClick: async () => {
        if (onFavoriteToggle) {
          setIsLoading('favorite')
          try {
            await onFavoriteToggle(letter.id, !letter.isFavorite)
            toast.success(letter.isFavorite ? 'Removed from favorites' : 'Added to favorites')
          } catch (error) {
            console.error('Failed to favorite:', error)
            toast.error('Failed to update favorite')
          } finally {
            setIsLoading(null)
          }
        }
      },
      loading: isLoading === 'favorite'
    }
  ]

  const secondaryActions = [
    {
      id: 'copy',
      label: copySuccess ? 'Copied!' : 'Copy Content',
      icon: Copy,
      onClick: handleCopy,
      className: copySuccess ? 'text-green-600 hover:text-green-700' : ''
    },
    {
      id: 'print',
      label: 'Print',
      icon: Printer,
      onClick: handlePrint
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: () => setShareDialogOpen(true)
    },
    {
      id: 'rate',
      label: 'Rate Letter',
      icon: Star,
      onClick: () => setRatingDialogOpen(true)
    }
  ]

  const dangerActions = [
    {
      id: 'regenerate',
      label: 'Regenerate',
      icon: RefreshCw,
      onClick: async () => {
        if (onRegenerate) {
          setIsLoading('regenerate')
          try {
            await onRegenerate(letter.id)
            toast.success('Letter regeneration started')
          } catch (error) {
            console.error('Failed to regenerate:', error)
            toast.error('Failed to regenerate letter')
          } finally {
            setIsLoading(null)
          }
        }
      },
      loading: isLoading === 'regenerate',
      disabled: !onRegenerate,
      hideOnDetailPage: true // Hide for future version
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit3,
      onClick: () => onEdit?.(letter.id),
      disabled: !onEdit
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: async () => {
        if (onDelete) {
          setIsLoading('delete')
          try {
            await onDelete(letter.id)
            toast.success('Letter deleted successfully')
          } catch (error) {
            console.error('Failed to delete:', error)
            toast.error('Failed to delete letter')
          } finally {
            setIsLoading(null)
          }
        }
      },
      loading: isLoading === 'delete',
      disabled: !onDelete,
      destructive: true
    }
  ]

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-2">
        {primaryActions
          .filter(action => !(isDetailPage && action.hideOnDetailPage))
          .map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            size="sm"
            className={action.className}
            onClick={action.onClick}
            disabled={action.loading}
            asChild={!!action.href}
          >
            {action.href ? (
              <a href={action.href}>
                <action.icon className="h-4 w-4 mr-2" />
                {action.loading ? 'Loading...' : action.label}
              </a>
            ) : (
              <>
                <action.icon className="h-4 w-4 mr-2" />
                {action.loading ? 'Loading...' : action.label}
              </>
            )}
          </Button>
        ))}
      </div>

      {/* Secondary Actions */}
      {showAll && (
        <div className="flex flex-wrap gap-2">
          {secondaryActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className={action.className}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Danger Actions */}
      {showAll && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
          {dangerActions
            .filter(action => !(isDetailPage && action.hideOnDetailPage))
            .map((action) => (
            action.id === 'delete' ? (
              <AlertDialog key={action.id}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={action.destructive ? 'text-red-600 hover:text-red-700' : ''}
                    disabled={action.disabled || action.loading}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.loading ? 'Deleting...' : action.label}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Letter</AlertDialogTitle>
                    <AlertDialogDescription>
                      {`Are you sure you want to delete "${letter.title}"? This action cannot be undone.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => action.onClick?.()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Letter
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled || action.loading}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.loading ? 'Loading...' : action.label}
              </Button>
            )
          ))}
        </div>
      )}

      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Letter</DialogTitle>
            <DialogDescription>
              {`Choose your preferred download format for "${letter.title}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button 
              onClick={() => handleDownload('txt')} 
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
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
              Print Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={(open) => {
        setShareDialogOpen(open)
        if (!open) {
          setShowEmailContent(false)
          setRecipientEmail('')
          setPersonalMessage('')
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Letter via Email</DialogTitle>
            <DialogDescription>
              {`Share "${letter.title}" directly through email`}
            </DialogDescription>
          </DialogHeader>
          
          {!showEmailContent ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient-email">Recipient Email</Label>
                <Input
                  id="recipient-email"
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="personal-message">Personal Message (Optional)</Label>
                <Textarea
                  id="personal-message"
                  placeholder="Add a personal message to include with the letter..."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setShareDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEmailShare} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Copy the content below and paste it into your email client:
                </p>
              </div>
              
              <div>
                <Label>Email Content</Label>
                <Textarea
                  value={emailContent}
                  readOnly
                  className="mt-1 min-h-[300px] font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowEmailContent(false)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleCopyEmailContent} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Content
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate This Letter</DialogTitle>
            <DialogDescription>
              {`Help us improve by rating the quality of "${letter.title}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingSubmit(rating)}
                className={`text-3xl transition-colors ${
                  rating <= currentRating ? 'text-yellow-500' : 'text-muted-foreground/30'
                } hover:text-yellow-400`}
              >
                <Star className={`h-8 w-8 ${rating <= currentRating ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}