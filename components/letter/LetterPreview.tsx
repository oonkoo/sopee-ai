// components/letter/LetterPreview.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Download, Edit3, Save } from 'lucide-react'
import type { GeneratedLetter } from '@/types/letter'

interface LetterPreviewProps {
  letter: GeneratedLetter
  onBack?: () => void // Make optional for flexibility
}

export default function LetterPreview({ letter, onBack }: LetterPreviewProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(letter.content)

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      // Default navigation - go back to letters list
      router.push('/dashboard/letters')
    }
  }

  const handleSave = async () => {
    // TODO: Implement save functionality
    setIsEditing(false)
    console.log('Saving edited content:', editedContent)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([editedContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${letter.title.replace(/\s+/g, '_').toLowerCase()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{letter.title}</h1>
            <p className="text-sm text-gray-600">
              Generated in {letter.generationTime}ms • {letter.wordCount} words
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Letter Content */}
      <Card>
        <CardHeader>
          <CardTitle>Letter Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Edit your letter content..."
            />
          ) : (
            <div className="whitespace-pre-wrap font-sans text-lg bg-background p-4 rounded-md min-h-[500px]">
              {editedContent}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}