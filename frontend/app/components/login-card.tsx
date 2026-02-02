'use client'
import Image from "next/image";
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";

export function LoginCard() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const switchMode = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setSignupStep(1);
  };

  return (
    <Card className="w-full max-w-208 flex flex-row px-8 relative overflow-hidden">
      
      {/* BACKGROUND LAYER */}
      <div
        className="
          absolute inset-0
          bg-[url('/food-doodle.svg')]
          bg-repeat
          bg-center
          z-0
        "
      />
      <div className="flex-1 relative flex items-center justify-center z-10 bg-white">
          <Image
            src="/hello.svg"
            alt="NJ'S Café and Restaurant"
            fill
            className="object-contain"
            priority
          />
        <Image
          src="/hello.svg"
          alt="NJ'S Café and Restaurant"
          fill
          className="object-contain"
          priority
        />
      </div>
      <Card className="flex-1 min-h-[25rem] z-10">
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
          {/*className="flex-1 flex items-center justify-center"*/}
          <form>
            {/*className="w-full max-w-sm"*/}
            <div className="flex flex-col gap-6">
        
              {/* LOGIN */}
              {authMode === "login" && (
                <>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input placeholder="m@example.com" type="email" required />
                  </div>
        
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input placeholder="********" type="password" required />
                  </div>
                </>
              )}
        
              {/* SIGNUP STEP 1 */}
              {authMode === "signup" && signupStep === 1 && (
                <>
                  <div className="grid gap-2">
                    <Label>First name<span className="text-red-500">*</span></Label>
                    <Input placeholder="Ashim" required />
                  </div>
        
                  <div className="grid gap-2">
                    <Label>Middle name</Label>
                    <Input placeholder="Raj" />
                  </div>
        
                  <div className="grid gap-2">
                    <Label>Last name<span className="text-red-500">*</span></Label>
                    <Input placeholder="Parajuli" required />
                  </div>
                </>
              )}
        
              {/* SIGNUP STEP 2 */}
              {authMode === "signup" && signupStep === 2 && (
                <>
                  <div className="grid gap-2">
                    <Label>Email<span className="text-red-500">*</span></Label>
                    <Input placeholder="m@example.com" type="email" required />
                  </div>
        
                  <div className="grid gap-2">
                    <Label>Password<span className="text-red-500">*</span></Label>
                    <Input placeholder="********" type="password" required />
                  </div>
                </>
              )}
        
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
        
          {/* LOGIN */}
          {authMode === "login" && (
            <>
              <Button className="w-full">Login</Button>
              {/*<Button variant="outline" className="w-full">
                Login with Google
              </Button>*/}
            </>
          )}
        
          {/* SIGNUP STEP 1 */}
          {authMode === "signup" && signupStep === 1 && (
            <Button
              className="w-full"
              onClick={() => setSignupStep(2)}
            >
              Next
            </Button>
          )}
        
          {/* SIGNUP STEP 2 */}
          {authMode === "signup" && signupStep === 2 && (
            <Button className="w-full">
              Create Account
            </Button>
          )}
        
        </CardFooter>

      </Card>
    </Card>
  )
}