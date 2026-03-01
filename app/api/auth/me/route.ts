import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value
  const userRole = request.cookies.get('user_role')?.value
  const userName = request.cookies.get('user_name')?.value

  if (!authToken || !userRole) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    email: authToken,
    role: userRole,
    name: userName,
  })
}
