import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="h-screen w-full p-6 md:p-10 flex flex-col min-h-svh items-center justify-center bg-muted bg-[url('/assets/cramble-background.svg')] bg-cover bg-center">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
