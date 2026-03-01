// User roles
export type UserRole = "admin" | "campaign_manager" | "agent"

// Support levels
export type SupportLevel = "Strong" | "Leaning" | "Undecided" | "Opposition"

// Gender
export type Gender = "Male" | "Female" | "Other"

// Database Types
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface LLG {
  id: string
  name: string
  district: string
}

export interface Ward {
  id: string
  name: string
  llg_id: string
  llg?: LLG
}

export interface Supporter {
  id: string
  full_name: string
  gender: Gender
  phone: string
  occupation: string
  ward_id: string
  llg_id: string
  support_level: SupportLevel
  registered_by: string
  agent?: User
  ward?: Ward
  llg?: LLG
  notes?: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  location: string
  date: string
  attendance: number
  notes?: string
}

// Session/Auth types
export interface Session {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
  expires: number
}

// Dashboard stats
export interface DashboardStats {
  total_supporters: number
  strong_supporters: number
  total_agents: number
  total_wards: number
  weekly_growth_percentage: number
}

export interface SupportLevelStats {
  name: SupportLevel
  count: number
}

export interface LLGStats {
  name: string
  supporters: number
}

export interface GenderStats {
  name: Gender
  count: number
}
