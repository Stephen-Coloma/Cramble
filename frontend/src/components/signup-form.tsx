'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toggle } from "./ui/toggle"
import { Facebook, Eye, EyeClosed, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { usePost, PostApiResponse } from "@/hooks/use-request"
import { joiResolver } from "@hookform/resolvers/joi"
import { useState, useEffect } from "react"
import { AxiosError } from "axios"
import {SubmitHandler, useForm, ErrorOption} from 'react-hook-form' 
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schema/signup-schema"
import { SignUpFormData } from "@/form-types/SignupFormData"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const SERVER_HOST=process.env.NEXT_PUBLIC_SERVER_HOST
  console.log(SERVER_HOST);
  
  const router = useRouter();
  const [isVisible, setVisible] = useState<boolean>(false);
  const {register, setError, handleSubmit, getValues, formState: {errors, isSubmitting, isSubmitted }, reset, clearErrors} = useForm<SignUpFormData>({
      resolver: joiResolver(signupSchema)
  })

  const { status, error, loading, executePostRequest, clearResponseState }: PostApiResponse = usePost(`http://${SERVER_HOST}/auth/signup`);

  const onSubmit: SubmitHandler<SignUpFormData> = async (formData: SignUpFormData) => {
    await executePostRequest(formData);
  }

  // update the ui based on loading change
  useEffect(()=>{
    // 201 - user created successfully, redirect to confirming an account
    if(status === 201){
      const username = getValues('username');
      const email = getValues('email');
      router.replace(`/signup/confirm?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`)
      return;
    }

    if(error){
      // 406 - username or email already taken
      // 500 - internal server error  
      const errorStatus = (error as AxiosError).response?.status;
      if (errorStatus === 406) { 
        reset({username: '', email: ''})
        setError("root", {message: error.response.data.message});
        document.getElementById("username")?.focus();
      } else if(errorStatus === 500){
        reset();
        setError("root", {message: 'Something went wrong. Try again later.'});
      }
      clearResponseState(); // next request is not tied
    }
  }, [loading])  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
        <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Get Started</h1>
                <p className="text-balance text-muted-foreground">
                  Let's create your account!
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstname">Firstname</Label>
                <Input {...register('firstName')}
                  id="firstname"
                  type="text"
                  placeholder="John"
                  className={errors.firstName ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                />
                {errors.firstName && 
                  <Label className="text-xs text-destructive">{errors.firstName.message}</Label>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Lastname</Label>
                <Input {...register('lastName')}
                  id="lastname"
                  type="text"
                  placeholder="Doe"
                  className={errors.lastName ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                />
              {errors.lastName && 
                  <Label className="text-xs text-destructive">{errors.lastName.message}</Label>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input {...register('username')}
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  className={errors.username ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                />
                {errors.username && 
                  <Label className="text-xs text-destructive">{errors.username.message}</Label>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input {...register('email')}
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  className={errors.email ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                />
                {errors.email && 
                  <Label className="text-xs text-destructive">{errors.email.message?.replaceAll("\"", "")}</Label>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                <div className="flex w-full justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Toggle size={'sm'}  onClick={() => setVisible((prev) => !prev)}>
                      {isVisible ? (
                        <Eye className="h-6 w-6 " />
                      ) : (
                        <EyeClosed className="h-6 w-6 " />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Toggle>
                  </div>
                </div>
                <Input {...register('password')} 
                  id="password"
                  type={`${isVisible ? 'text' : 'password'}`}
                  className={errors.password ? 'border-destructive focus-visible:border-destructive focus-visible:ring-0' : ''}
                />
                {errors.password && 
                  <Label className="text-xs text-destructive">
                    {errors.password.message?.replaceAll('\"', "").split(" | ").map((rule, index) => (
                      <span key={index}>
                        {rule}
                        <br />
                      </span>
                    ))}  
                  </Label>}
              </div>

              <Button type="submit" disabled={isSubmitting ? true : false} className="w-full">
                {isSubmitting 
                ? <LoaderCircle className="animate-spin"></LoaderCircle>
                : 'Signup'}
              </Button>

              {errors.root && 
                  <Label className="text-xs text-destructive text-center">{errors.root.message}</Label>}

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <Facebook></Facebook>
                  <span className="sr-only">Login with Facebook</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-accent-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
