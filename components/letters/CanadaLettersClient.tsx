// components/letters/CanadaLettersClient.tsx
'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Clock, 
  Plus, 
  Search, 
  Heart,
  Grid,
  List
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LetterCard from '@/components/letters/LetterCard'
import { toast } from 'sonner'
import type { GeneratedLetter } from '@/types/letter'
import type { User } from '@/types/auth'

interface CanadaLettersClientProps {
  initialLetters: GeneratedLetter[]
  user: User
}

export default function CanadaLettersClient({ initialLetters, user }: CanadaLettersClientProps) {
  const [letters, setLetters] = useState<GeneratedLetter[]>(initialLetters)
  const [filteredLetters, setFilteredLetters] = useState<GeneratedLetter[]>(initialLetters)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [filterBy, setFilterBy] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const remainingLetters = user.lettersLimit - user.lettersGenerated

  useEffect(() => {
    let filtered = [...letters]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(letter => 
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    switch (filterBy) {
      case 'favorites':
        filtered = filtered.filter(letter => letter.isFavorite)
        break
      case 'rated':
        filtered = filtered.filter(letter => letter.feedbackRating !== null)
        break
      case 'recent':
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        filtered = filtered.filter(letter => letter.createdAt > oneWeekAgo)
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'words-desc':
        filtered.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0))
        break
      case 'rating-desc':
        filtered.sort((a, b) => (b.feedbackRating || 0) - (a.feedbackRating || 0))
        break
    }

    setFilteredLetters(filtered)
  }, [letters, searchTerm, sortBy, filterBy])

  const handleFavoriteToggle = async (letterId: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/letters/${letterId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite })
      })

      if (!response.ok) throw new Error('Failed to update favorite')

      setLetters(prev => prev.map(letter => 
        letter.id === letterId ? { ...letter, isFavorite } : letter
      ))

      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites')
    } catch (error) {
      toast.error('Failed to update favorite')
      console.error('Error updating favorite:', error)
    }
  }

  const handleDelete = async (letterId: string) => {
    try {
      const response = await fetch(`/api/letters/${letterId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete letter')

      setLetters(prev => prev.filter(letter => letter.id !== letterId))
      toast.success('Letter deleted successfully')
    } catch (error) {
      toast.error('Failed to delete letter')
      console.error('Error deleting letter:', error)
    }
  }

  const stats = {
    total: letters.length,
    favorites: letters.filter(l => l.isFavorite).length,
    avgWords: letters.length > 0 ? Math.round(letters.reduce((acc, l) => acc + (l.wordCount || 0), 0) / letters.length) : 0,
    avgTime: letters.length > 0 ? Math.round(letters.reduce((acc, l) => acc + (l.generationTime || 0), 0) / letters.length / 1000) : 0
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
                <Image 
                  src="/countries/canada.png" 
                  alt="Canada flag" 
                  width={64} 
                  height={48} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Canada Letters</h1>
                <p className="text-muted-foreground">
                  Your generated statements and documents for Canadian study permit applications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-red-600">{remainingLetters}</p>
              </div>
              <Link href="/canada/letters/generate">
                <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700" disabled={remainingLetters <= 0}>
                  <Plus className="h-5 w-5" />
                  {remainingLetters <= 0 ? 'Upgrade Plan' : 'Generate New SOP'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.total}</p>
                    <p className="text-sm text-red-600/80">Total Generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.favorites}</p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.avgTime}s</p>
                    <p className="text-sm text-muted-foreground">Avg Generation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.avgWords}</p>
                    <p className="text-sm text-muted-foreground">Avg Words</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search letters by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Letters</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                      <SelectItem value="rated">Rated</SelectItem>
                      <SelectItem value="recent">Recent (7 days)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="title-asc">Title A-Z</SelectItem>
                      <SelectItem value="title-desc">Title Z-A</SelectItem>
                      <SelectItem value="words-desc">Most Words</SelectItem>
                      <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center border border-border rounded-md w-full sm:w-auto">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none flex-1 sm:flex-none"
                    >
                      <Grid className="h-4 w-4" />
                      <span className="ml-2 sm:hidden">Grid</span>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none flex-1 sm:flex-none"
                    >
                      <List className="h-4 w-4" />
                      <span className="ml-2 sm:hidden">List</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || filterBy !== 'all') && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary">
                      Search: {`"${searchTerm}"`}
                    </Badge>
                  )}
                  {filterBy !== 'all' && (
                    <Badge variant="secondary">
                      Filter: {filterBy}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setFilterBy('all')
                    }}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Letters List */}
          {filteredLetters.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {filteredLetters.length} Letter{filteredLetters.length !== 1 ? 's' : ''}
                  {searchTerm && ` matching "${searchTerm}"`}
                </h2>
                <div className="text-sm text-muted-foreground">
                  Sorted by {sortBy.replace('-', ' ').replace('desc', '(newest first)').replace('asc', '(oldest first)')}
                </div>
              </div>
              
              <div className={viewMode === 'grid' ? 'grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2' : 'space-y-4'}>
                {filteredLetters.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    country="CANADA"
                    onFavoriteToggle={handleFavoriteToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ) : letters.length > 0 ? (
            <Card className="text-center py-12 border-border/50 bg-card/50">
              <CardContent>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No letters found</h3>
                  <p className="text-muted-foreground">
                    No letters match your current search and filter criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setFilterBy('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12 border-border/50 bg-card/50">
              <CardContent>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                    <FileText className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold">No Letters Generated Yet</h3>
                  <p className="text-muted-foreground">
                    Generate your first Statement of Purpose for Canadian study permit applications using our AI-powered service.
                  </p>
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <strong>Note:</strong> {"Canada SOP generation is coming soon. We're working on implementing Canada-specific patterns."}
                  </div>
                  <Link href="/canada/letters/generate">
                    <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700" disabled={remainingLetters <= 0}>
                      <Plus className="h-5 w-5" />
                      {remainingLetters <= 0 ? 'Upgrade Plan' : 'Generate Your First SOP'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back to Dashboard */}
          <div className="text-center">
            <Link href="/canada/dashboard">
              <Button variant="ghost">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}