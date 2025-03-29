"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const validateForm = () => {
      const newErrors: Record<string, string> = {};
      if (!currentPassword) newErrors.currentPassword = "Current password is required.";
      if (!newPassword) newErrors.newPassword = "New password is required.";
       else if (newPassword.length < 8) newErrors.newPassword = "New password must be at least 8 characters.";
      if (newPassword !== confirmPassword) newErrors.confirmPassword = "New passwords do not match.";
      if (currentPassword && newPassword && currentPassword === newPassword) newErrors.newPassword = "New password cannot be the same as the current password.";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {
      setErrors({});
      if (!validateForm()) {
           toast({ title: "Validation Error", description: "Please check the fields below.", variant: "destructive" });
          return;
      }

      setIsLoading(true);
      try {
          const payload = { currentPassword, newPassword };
          await apiClient('/users/me/password', 'PUT', payload);

          toast({ title: "Success", description: "Password changed successfully! Please log in again." });
          router.replace('/signin');

      } catch (error: any) {
          console.error("Failed to change password:", error);
          const message = error.message || "Failed to change password. Please check your current password.";
          if (message.toLowerCase().includes("invalid current password")) {
              setErrors({ currentPassword: message, form: message });
          } else {
             setErrors({ form: message });
           }
          toast({ title: "Error", description: message, variant: "destructive" });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader/>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Change Password</h1>

          <div className="bg-card rounded-lg p-6 mb-6">
              <div className="space-y-1">
                  <Label htmlFor="current-password" className={cn("text-lg", errors.currentPassword && "text-destructive")}>
                      Current Password
                  </Label>
                  <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={cn("flex-1 bg-muted/50 border-muted", errors.currentPassword && "border-destructive")}
                      disabled={isLoading}
                  />
                   {errors.currentPassword && <p className="text-sm text-destructive mt-1">{errors.currentPassword}</p>}
              </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-6">
              <div className="space-y-6">
                  <div className="space-y-1">
                       <Label htmlFor="new-password" className={cn("text-lg", errors.newPassword && "text-destructive")}>
                          New Password
                      </Label>
                      <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={cn("flex-1 bg-muted/50 border-muted", errors.newPassword && "border-destructive")}
                          disabled={isLoading}
                      />
                       {errors.newPassword && <p className="text-sm text-destructive mt-1">{errors.newPassword}</p>}
                  </div>
                  <div className="space-y-1">
                       <Label htmlFor="confirm-password" className={cn("text-lg", errors.confirmPassword && "text-destructive")}>
                          Re-enter new Password
                      </Label>
                      <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={cn("flex-1 bg-muted/50 border-muted", errors.confirmPassword && "border-destructive")}
                          disabled={isLoading}
                      />
                      {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                  </div>
              </div>
          </div>

          {errors.form && !errors.currentPassword && (
                <p className="text-center text-destructive mb-4">{errors.form}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center">
              <div />
              <div className="space-x-4 mt-4 sm:mt-0">
                  <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleSubmit}
                      disabled={isLoading}
                  >
                      {isLoading ? "Updating..." : "Submit"}
                  </Button>

                  <Link href="/account">
                      <Button variant="outline" className="border-muted text-muted-foreground hover:text-foreground" disabled={isLoading}>
                      Cancel
                      </Button>
                  </Link>
              </div>
          </div>
        </div>
      </main>
    </div>
  )
}
