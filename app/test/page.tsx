
import SopeeLogo from '@/components/SopeeLogo'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
     <SopeeLogo size={128} className="hover:scale-110 transition-transform" animated />
    </div>
  )
}