"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CircleCheck, CircleX, ShieldCheck } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useConfirmSignup from "@/hooks/use-confirm-signup";
import useResendOtp from "@/hooks/use-resend-otp";

const requestMessages: Record<number, string> = {
  200: "account verified",
  400: "Incorrect code",
  406: "Expired code",
  500: "Something went wrong. Try again.",
};

export function InputOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!username || !email) {
      router.back();
    }
  }, [username, email, router]);

  const [otp, setOtp] = useState<string>("");
  const { confirmOTP, isSubmitting, requestStatus, clearErrorStatus } = useConfirmSignup({username});
  const {requestNewCode, isCooldown, cooldownTime} = useResendOtp({username});

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  // useEffect that Triggers API request when OTP reaches 6 digits
  useEffect(() => {
    if (otp.length === 6) {
      confirmOTP(otp);
    }
  }, [otp]);

  // resets otp string
  useEffect(()=>{
    setOtp('')
    if(requestStatus !== 200){
      clearErrorStatus();
    }
  }, [requestStatus])

  return (
    <Card>
      <form action="" className="flex flex-col justify-center items-center">
        <CardHeader>
          <ShieldCheck className={`h-12 w-12 md:h-20 md:w-20`}></ShieldCheck>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Label className="text-xl md:text-2xl font-bold">
            OTP Verification
          </Label>
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={handleOTPChange}
            disabled={isSubmitting}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} id="firstSlot" />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {requestStatus === 200 && (
            <Label className="flex items-center text-xs md:text-sm text-green-500 gap-2">
              account confirmed <CircleCheck />
            </Label>
          )}

          {requestMessages[requestStatus] && requestStatus !== 200 && (
            <Label className="flex items-center text-xs md:text-sm text-destructive gap-2">
              {requestMessages[requestStatus]} {requestStatus !== 500 && <CircleX />}
            </Label>
          )}

          <div className="flex flex-col items-center gap-2">
            <Label className="text-sm text-primary font-bold md:text-base text-center">
              Hello, {username}
            </Label>
            <Label className="max-w-[500px] text-xs md:text-sm font-light text-center text-muted-foreground">
              Thankyou for registering. To confirm your account, please type the
              OTP sent to your {maskEmail(email!)}.
            </Label>
          </div>
        </CardContent>
      </form>
      <CardFooter className="w-full justify-center sm:justify-end">
        <Label className="text-xs md:text-sm">
          OTP not received?
          <Button
            variant={"ghost"}
            className="text-xs md:text-sm font-bold text-primary hover:bg-transparent hover:text-primary hover:text-md"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "scale(0.95)";
              setTimeout(() => {
                btn.style.transform = "scale(1)";
              }, 150);
              requestNewCode(); // Call function
            }}
            disabled={isCooldown}
          >
            {isCooldown ? `Resend OTP in ${cooldownTime}s` : "Resend OTP"}
          </Button>
        </Label>
      </CardFooter>
    </Card>
  );
}

/**Helper function that masks email */
const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  return `${local[0]}****${local.slice(-1)}@${domain}`;
};
