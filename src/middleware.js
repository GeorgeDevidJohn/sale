"user server"
import { NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/report', '/users', '/product', '/logs','/expence', '/register','/lists']
const employerRoutes = ['/lists']
const adminRoutes = ['/report', '/users', '/product', '/logs','/expence', '/register']
const publicRoutes = ['/login', '/']


export default async function middleware(req) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  const isEmployerRoute = employerRoutes.includes(path)
  const isAdminRoute = adminRoutes.includes(path)
  const secretKey = "mysecretkey"
  const encodedKey = new TextEncoder().encode(secretKey)
  //decrypt session
  async function decrypt(session) {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
      })
      console.log("this is payload",payload)
      return payload
    } catch (error) {
      console.log('Failed to verify session')
    }
  }
  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  console.log("this is cookie",cookie)
  const session = await decrypt(cookie)

  console.log("this is session",session)
 

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId ) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 

  console.log("admin route = " + isAdminRoute)
  console.log("SESSION ROLE route = " + session?.role)
  console.log("isPublicRoute = " + isPublicRoute)
  // 6. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&   
    session?.userId && session?.role === 'employee' &&
    !req.nextUrl.pathname.startsWith('/lists')
  ) {
    return NextResponse.redirect(new URL('/lists', req.nextUrl))
  }

  if (
    isPublicRoute && 
    session?.userId && session?.role === 'admin' &&
    !req.nextUrl.pathname.startsWith('/lists')
  ) {
    return NextResponse.redirect(new URL('/report', req.nextUrl))
  }

  if (
    !isPublicRoute && 
    session?.userId && session?.role === 'employee' &&
    adminRoutes.includes(req.nextUrl.pathname)
  ) {
    console.log("redirecting to /lists")
    return NextResponse.redirect(new URL('/lists', req.nextUrl))
  }

  console.log("redirecting to /lists 22")
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}