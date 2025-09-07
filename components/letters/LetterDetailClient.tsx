// components/letters/LetterDetailClient.tsx
'use client'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LetterViewer from './LetterViewer'
import LetterActions from './LetterActions'
import LetterTips from './LetterTips'
import type { GeneratedLetter } from '@/types/letter'
import { getModelDisplayName } from '@/lib/config/modelDisplay'

interface RelatedLetter {
  id: string
  title: string
  letterType: string
  createdAt: Date
  wordCount: number | null
}

interface LetterDetailClientProps {
  letter: GeneratedLetter
  country: 'AUSTRALIA' | 'CANADA'
  relatedLetters?: RelatedLetter[]
  onFavoriteToggle?: (letterId: string, isFavorite: boolean) => Promise<void>
  onDelete?: (letterId: string) => Promise<void>
  onRatingSubmit?: (letterId: string, rating: number) => Promise<void>
  onContentUpdate?: (letterId: string, content: string) => Promise<void>
}

export default function LetterDetailClient({
  letter,
  country,
  relatedLetters = [],
  onFavoriteToggle,
  onDelete,
  onRatingSubmit,
  onContentUpdate
}: LetterDetailClientProps) {
  const [isEditMode, setIsEditMode] = useState(false)

  const handleEditClick = useCallback(() => {
    setIsEditMode(true)
  }, [])

  const handleEditModeChange = useCallback((editMode: boolean) => {
    setIsEditMode(editMode)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        <LetterViewer 
          letter={letter}
          country={country}
          isEditMode={isEditMode}
          onEditModeChange={handleEditModeChange}
          onFavoriteToggle={onFavoriteToggle}
          onRatingSubmit={onRatingSubmit}
          onContentUpdate={onContentUpdate}
        />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Quick Actions */}
        <div className="bg-card/50 backdrop-blur rounded-lg border border-border/50 p-4">
          <h3 className="font-medium mb-4">Quick Actions</h3>
          <LetterActions 
            letter={letter}
            country={country}
            showAll={true}
            isDetailPage={true}
            onFavoriteToggle={onFavoriteToggle}
            onDelete={onDelete}
            onEdit={handleEditClick}
            onRatingSubmit={onRatingSubmit}
          />
        </div>

        {/* Letter Statistics */}
        <div className="bg-card/50 backdrop-blur rounded-lg border border-border/50 p-4">
          <h3 className="font-medium mb-4">Letter Statistics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Word Count:</span>
              <span className="font-medium">{letter.wordCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Generation Time:</span>
              <span className="font-medium">{Math.round((letter.generationTime || 0) / 1000)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model Used:</span>
              <span className="font-medium">{getModelDisplayName(letter.modelUsed || 'AI')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{new Date(letter.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{letter.letterType.toUpperCase()}</span>
            </div>
            {letter.feedbackRating && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-medium">
                  {'★'.repeat(letter.feedbackRating)} ({letter.feedbackRating}/5)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Related Letters */}
        {relatedLetters.length > 0 && (
          <div className="bg-card/50 backdrop-blur rounded-lg border border-border/50 p-4">
            <h3 className="font-medium mb-4">Other Letters</h3>
            <div className="space-y-3">
              {relatedLetters.map((relatedLetter) => (
                <Link 
                  key={relatedLetter.id} 
                  href={`/${country.toLowerCase()}/letters/${relatedLetter.id}`}
                  className="block p-3 rounded-lg bg-card/30 border border-border/30 hover:bg-card/50 transition-colors"
                >
                  <h4 className="font-medium text-sm truncate">{relatedLetter.title}</h4>
                  <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                    <span>{relatedLetter.letterType.toUpperCase()}</span>
                    <span>{relatedLetter.wordCount || 0} words</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(relatedLetter.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
            
            <Link href={`/${country.toLowerCase()}/letters`}>
              <Button variant="ghost" size="sm" className="w-full mt-3">
                View All Letters
              </Button>
            </Link>
          </div>
        )}

        {/* Tips */}
        <LetterTips country={country} />
      </div>
    </div>
  )
}