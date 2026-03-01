

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }
    // Authenticate with Supabase
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Optionally, fetch user profile data from your users table
    // const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single()

    // Set cookies for session (for demo, not httpOnly)
    const response = NextResponse.json(
      {
        success: true,
        user: {
          email: data.user.email,
          id: data.user.id,
        },
      },
      { status: 200 }
    )
    response.cookies.set('auth_token', data.session?.access_token || '', {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      secure: false,
      httpOnly: false,
    })
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
