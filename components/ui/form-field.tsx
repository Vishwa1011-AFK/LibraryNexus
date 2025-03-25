"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  icon?: React.ReactNode
  required?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon,
  required = false,
  className,
  labelClassName,
  inputClassName,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn("text-sm font-medium flex items-center gap-2", labelClassName)}>
        {icon && <span className="text-primary">{icon}</span>}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full bg-background border-input focus-visible:ring-1 focus-visible:ring-primary",
            error && "border-destructive focus-visible:ring-destructive",
            inputClassName,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

