// middleware.ts
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware'
import { NextRequest } from 'next/server'

export default withAuth(
  async function middleware(req: NextRequest) {
    console.log('Protected route accessed:', req.nextUrl.pathname)
  },
  {
    isReturnToCurrentPage: true,
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/user/:path*',
    '/api/profile/:path*',
    '/api/generate-letter/:path*',
    '/api/upload/:path*'
  ]
}