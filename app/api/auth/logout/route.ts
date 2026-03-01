import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )

  // Clear auth cookies
  response.cookies.delete('auth_token')
  response.cookies.delete('user_role')
  response.cookies.delete('user_name')

  return response
}
