"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FormInput, Button } from "@/components/ui"
import { getSupabaseClient } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Test Supabase connection on page load
  if (typeof window !== "undefined") {
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase
        .from("llgs")
        .select("*")
        .then((result: any) => {
          console.log("Supabase connection test result:", result);
        }, (err: any) => {
          console.error("Supabase connection test error:", err);
        });
    } else {
      console.error("Supabase client is null");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // In production, this would call a server action to authenticate with Supabase
      // For now, this is a placeholder showing the structure
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Login failed")
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-navy px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gold-500">
            Honlly Isaac Campaign
          </h1>
          <p className="mt-2 text-gray-400">
            Morobe Regional Campaign Management
          </p>
        </div>

        {/* Login Card */}
        <div className="card space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Campaign Login</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your credentials to access the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-900 bg-opacity-50 p-3 text-red-200 border border-red-700">
                {error}
              </div>
            )}

            <FormInput
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="border-t border-navy-600 pt-4">
            <p className="text-center text-sm text-gray-400">
              Need help?{" "}
              <Link href="#" className="text-gold-500 hover:text-gold-400">
                Contact administrator
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            This system is private and for internal campaign use only.
          </p>
          <p className="mt-1">
            Authorized personnel only. All activities are logged.
          </p>
        </div>
      </div>
    </div>
  )
}
