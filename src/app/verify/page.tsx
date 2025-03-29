"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VerifyAccount() {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Auto-focus next input if current input is filled
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const code = verificationCode.join("")
    console.log("Verifying code:", code)
    // Add verification logic here
  }

  const handleResend = () => {
    console.log("Resending verification code")
    // Add resend logic here
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-4">Verify your account</h1>
          <p className="text-center text-muted-foreground mb-8">
            A verification code is just sent to your email address(***34@gmail.com). Enter the code below to confirm
            your account.
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-xl bg-muted/50 border-muted"
              />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8" onClick={handleVerify}>
              Verify
            </Button>
            <Button
              variant="outline"
              className="border-muted text-muted-foreground hover:text-foreground px-8"
              onClick={handleResend}
            >
              Resend
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

