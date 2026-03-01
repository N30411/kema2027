import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg bg-navy-700 p-6 shadow-lg border border-navy-600 ${className}`}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  trendUp?: boolean
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        {icon && <div className="text-gold-500">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {trend && (
        <p
          className={`text-xs font-semibold ${
            trendUp ? "text-green-400" : "text-red-400"
          }`}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </Card>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle =
    "font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"

  const variants = {
    primary: "bg-gold-500 text-navy-900 hover:bg-gold-600",
    secondary: "bg-navy-600 text-white hover:bg-navy-500 border border-navy-500",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-navy-700 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
        <div className="mb-6 text-gray-300">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {actions}
        </div>
      </div>
    </div>
  )
}

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function FormInput({
  label,
  error,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <input
        className={`w-full rounded-lg border border-navy-500 bg-navy-600 px-4 py-2 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export function FormSelect({
  label,
  error,
  options,
  className = "",
  ...props
}: FormSelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <select
        className={`w-full rounded-lg border border-navy-500 bg-navy-600 px-4 py-2 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-opacity-50 ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
