"use client"

import React, { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  ArrowRight, 
  Chrome, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertTriangle,
  Car,
  Bell
} from "lucide-react"

export default function LoginPage() {
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth()
  const { toast } = useToast()

  const [mode, setMode] = useState<"login" | "signup" | "reset">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    name: false,
  })

  // Dynamic Validation Logic
  const emailError = !email
    ? "Email is required"
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "Please enter a valid email address"
    : ""

  const passwordError = !password
    ? "Password is required"
    : password.length < 6
    ? "Password must be at least 6 characters"
    : ""

  const nameError = mode === "signup" && !name ? "Name is required" : ""

  const handleBlur = (field: "email" | "password" | "name") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleGoogleLogin = async () => {
    setIsSubmitting(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Success",
        description: "Logged in via Google successfully.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: err.message || "Failed to log in with Google.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all as touched on submit
    setTouched({ email: true, password: true, name: true })

    if (mode === "login" && (emailError || passwordError)) return
    if (mode === "signup" && (emailError || passwordError || nameError)) return
    if (mode === "reset" && emailError) return

    setIsSubmitting(true)

    try {
      if (mode === "login") {
        await signIn(email, password)
        toast({
          title: "Success",
          description: "Logged in successfully.",
        })
      } else if (mode === "signup") {
        await signUp(email, password, name)
        toast({
          title: "Registration Success",
          description: "Account registered and logged in.",
        })
      } else if (mode === "reset") {
        await resetPassword(email)
        toast({
          title: "Reset Request Sent",
          description: "A password reset email has been sent.",
        })
        setMode("login")
      }
    } catch (err: any) {
      let friendlyMsg = err.message || "Authentication error."
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        friendlyMsg = "Invalid email or password. Please verify your inputs."
      } else if (err.code === "auth/email-already-in-use") {
        friendlyMsg = "This email is already in use by another account."
      } else if (err.code === "auth/network-request-failed") {
        friendlyMsg = "Network error. Please check your connection."
      }

      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: friendlyMsg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = (newMode: "login" | "signup" | "reset") => {
    setMode(newMode)
    setEmail("")
    setPassword("")
    setName("")
    setTouched({ email: false, password: false, name: false })
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Visual Sidebar Section (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r border-slate-800/60 flex-col justify-between p-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-500">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">SafeDriver</h1>
            <p className="text-xs text-slate-400">Transport Safety Authority</p>
          </div>
        </div>

        {/* Dynamic Mockup Safety Visuals */}
        <div className="relative my-auto py-8 z-10">
          <div className="space-y-6 max-w-md">
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Real-Time Fleet & Safety Monitoring Console.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              SafeDriver integrates direct telemetry tracking with computer vision, offering real-time driver sleepiness warnings, route compliance, and fast incident management.
            </p>

            {/* Simulated Live Alert Cards */}
            <div className="space-y-3 mt-8">
              {/* Alert 1 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 backdrop-blur-sm flex items-start gap-4">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 mt-0.5">
                  <AlertTriangle className="h-4 w-4 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Drowsiness Warning</span>
                    <span className="text-[10px] text-slate-500">Just now</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Driver <strong>Sunil Perera</strong> shows signs of fatigue on Route ND-02.</p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 backdrop-blur-sm flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 mt-0.5">
                  <Car className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Fleet Status</span>
                    <span className="text-[10px] text-slate-500">5m ago</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Bus <strong>WP ND-8890</strong> registered on system & dispatched.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer info */}
        <div className="text-xs text-slate-500 relative z-10 flex justify-between">
          <span>&copy; {new Date().getFullYear()} SafeDriver Systems</span>
          <span>v1.2.0 (Stable)</span>
        </div>
      </div>

      {/* Form Container Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative bg-slate-950">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8 self-start">
          <Shield className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-bold text-white">SafeDriver</span>
        </div>

        <div className="w-full max-w-[440px] space-y-8">
          {/* Form Header */}
          <div className="space-y-2">
            {mode === "login" && (
              <>
                <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to Dashboard</h2>
                <p className="text-sm text-slate-400">Enter your credentials to manage transport systems.</p>
              </>
            )}
            {mode === "signup" && (
              <>
                <h2 className="text-2xl font-bold tracking-tight text-white">Create Admin Account</h2>
                <p className="text-sm text-slate-400">Register as a transport safety administrator.</p>
              </>
            )}
            {mode === "reset" && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    onClick={() => toggleMode("login")} 
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-slate-400 font-medium">Back to Sign In</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
                <p className="text-sm text-slate-400">We will email you a secure link to reset your password.</p>
              </>
            )}
          </div>

          {/* Sandbox Access Helper (English, Sinhala, Tamil inline toggle context) */}
          {mode === "login" && (
            <div className="p-3.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-blue-400/90 leading-relaxed space-y-1">
              <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-blue-400" />
                <span>Sandbox / Evaluation Credentials:</span>
              </div>
              <p>Email: <span className="text-white font-mono">admin@safedriver.com</span></p>
              <p>Password: <span className="text-white font-mono">Password123</span></p>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name Input (Only on Sign Up) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-300 text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={`pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 ${
                      touched.name && nameError ? "border-red-500 focus-visible:ring-red-500" : ""
                    } ${touched.name && !nameError ? "border-emerald-500 focus-visible:ring-emerald-500" : ""}`}
                  />
                  {touched.name && nameError && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                  {touched.name && !nameError && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  )}
                </div>
                {touched.name && nameError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <span>{nameError}</span>
                  </p>
                )}
              </div>
            )}

            {/* Email Address Input */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300 text-sm">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@safedriver.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 ${
                    touched.email && emailError ? "border-red-500 focus-visible:ring-red-500" : ""
                  } ${touched.email && !emailError ? "border-emerald-500 focus-visible:ring-emerald-500" : ""}`}
                />
                {touched.email && emailError && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
                {touched.email && !emailError && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                )}
              </div>
              {touched.email && emailError && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password Input (Login and Register) */}
            {mode !== "reset" && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => toggleMode("reset")}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`pl-10 pr-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 ${
                      touched.password && passwordError ? "border-red-500 focus-visible:ring-red-500" : ""
                    } ${touched.password && !passwordError ? "border-emerald-500 focus-visible:ring-emerald-500" : ""}`}
                  />
                  {/* Eye Toggle password visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {touched.password && passwordError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full">
                  <span>
                    {mode === "login" && "Sign In"}
                    {mode === "signup" && "Create Account"}
                    {mode === "reset" && "Send Reset Link"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Form Switchers & Social Integrations */}
          {mode !== "reset" && (
            <div className="space-y-6 pt-4">
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-950 px-3 text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full bg-transparent border-slate-800 hover:bg-slate-900 hover:text-white text-slate-300 font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                <Chrome className="h-4 w-4 text-red-500" />
                <span>Sign in with Google</span>
              </Button>

              {/* Mode Switcher footer text */}
              <div className="text-center text-xs text-slate-400">
                {mode === "login" ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => toggleMode("signup")}
                      className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors"
                    >
                      Register Admin
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an admin account?{" "}
                    <button
                      type="button"
                      onClick={() => toggleMode("login")}
                      className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
