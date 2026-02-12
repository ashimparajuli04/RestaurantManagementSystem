'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginCard() {
  const router = useRouter()

  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [signupStep, setSignupStep] = useState<1 | 2>(1)

  const [firstNameInput, setFirstNameInput] = useState("")
  const [middleNameInput, setMiddleNameInput] = useState("")
  const [lastNameInput, setLastNameInput] = useState("")
  const [signUpEmailInput, setSignUpEmailInput] = useState("")
  const [signUpPasswordInput, setSignUpPasswordInput] = useState("")

  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const switchMode = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setSignupStep(1)
  }

  // 🔥 LOGIN MUTATION
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const res = await api.post(
        "/auth/token",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      return res.data
    },

    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token)
      router.push("/dashboard")
    },

    onError: () => {
      setAlertMessage("Invalid email or password.")
      setShowAlert(true)
    },
  })

  // 🔥 SIGNUP MUTATION
  const signupMutation = useMutation({
    mutationFn: async (payload: {
      first_name: string
      middle_name: string
      last_name: string
      email: string
      password: string
    }) => {
      const res = await api.post("/users/signup", payload)
      return res.data
    },

    onSuccess: () => {
      switchMode("login")
    },

    onError: () => {
      setAlertMessage("Signup failed. Please check your details.")
      setShowAlert(true)
    },
  })

  return (
    <Card className="w-full max-w-208 flex flex-row px-8 relative overflow-hidden bg-nj-cream">

      {/* LEFT IMAGE */}
      <div className="flex-1 relative flex items-center justify-center">
        <Image
          src="/hello.svg"
          alt="NJ'S Café and Restaurant"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* RIGHT CARD */}
      <Card className="flex-1 min-h-[25rem]">

        <CardHeader>
          <CardTitle>
            {authMode === "login"
              ? "Login to your account"
              : signupStep === 1
              ? "Create your account"
              : "Almost there"}
          </CardTitle>

          <CardDescription>
            {authMode === "login"
              ? "Enter your email below to login"
              : signupStep === 1
              ? "Tell us your name"
              : "Set your login details"}
          </CardDescription>

          <CardAction>
            <Button
              variant="link"
              onClick={() =>
                switchMode(authMode === "login" ? "signup" : "login")
              }
            >
              {authMode === "login" ? "Sign Up" : "Login"}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">

            {/* LOGIN */}
            {authMode === "login" && (
              <>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* SIGNUP STEP 1 */}
            {authMode === "signup" && signupStep === 1 && (
              <>
                <div className="grid gap-2">
                  <Label>First Name *</Label>
                  <Input
                    value={firstNameInput}
                    onChange={(e) => setFirstNameInput(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Middle Name</Label>
                  <Input
                    value={middleNameInput}
                    onChange={(e) => setMiddleNameInput(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* SIGNUP STEP 2 */}
            {authMode === "signup" && signupStep === 2 && (
              <>
                <div className="grid gap-2">
                  <Label>Email *</Label>
                  <Input
                    value={signUpEmailInput}
                    onChange={(e) => setSignUpEmailInput(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={signUpPasswordInput}
                    onChange={(e) => setSignUpPasswordInput(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">

          {/* LOGIN BUTTON */}
          {authMode === "login" && (
            <Button
              disabled={loginMutation.isPending}
              onClick={() =>
                loginMutation.mutate({
                  email: emailInput,
                  password: passwordInput,
                })
              }
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          )}

          {/* SIGNUP STEP 1 */}
          {authMode === "signup" && signupStep === 1 && (
            <Button
              onClick={() => {
                if (!firstNameInput || !lastNameInput) {
                  setAlertMessage("First and Last name required.")
                  setShowAlert(true)
                  return
                }
                setSignupStep(2)
              }}
            >
              Next
            </Button>
          )}

          {/* SIGNUP STEP 2 */}
          {authMode === "signup" && signupStep === 2 && (
            <Button
              disabled={signupMutation.isPending}
              onClick={() =>
                signupMutation.mutate({
                  first_name: firstNameInput,
                  middle_name: middleNameInput,
                  last_name: lastNameInput,
                  email: signUpEmailInput,
                  password: signUpPasswordInput,
                })
              }
            >
              {signupMutation.isPending
                ? "Creating..."
                : "Create Account"}
            </Button>
          )}

        </CardFooter>
      </Card>

      {/* ALERT */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Card>
  )
}
