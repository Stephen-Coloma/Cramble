import { InputOTPForm } from "@/components/confirm-signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-[url('/assets/cramble-background.svg')] bg-cover bg-center">
      <div className="w-full max-w-sm md:max-w-3xl">
        <InputOTPForm email={'testemail@gmail.com'} username="istipin"/>
      </div>
    </div>
  );
}
