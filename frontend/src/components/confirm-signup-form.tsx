"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import {CircleCheck, CircleX, ShieldCheck} from 'lucide-react'
import { Label } from "@radix-ui/react-label"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { usePost } from "@/hooks/use-request"
import { AxiosError } from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function InputOTPForm() {
  const SERVER_HOST=process.env.NEXT_PUBLIC_SERVER_HOST
	const router = useRouter();
	const searchParams = useSearchParams();
	const username = searchParams.get('username');
	const email = searchParams.get('email');

  // Use useEffect to check first username and email. 
	useEffect(() => {
		if (!username || !email) {
			router.back();
		}
	}, [username, email, router]);

	const [otp, setOtp] = useState<string>("");
	const [errorStatus, setErrorStatus] = useState<number>(0); //used for the error messages in the ui
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(30); // Cooldown in seconds

  const errorMessages: Record<number, string> = {
    400: "Incorrect code",
    406: "Expired code",
    500: "Something went wrong. Try again.",
  };
	
	const confirmSignupRequest= usePost(`http://${SERVER_HOST}/auth/signup/confirm`);
  const resendOtpRequest = usePost(`http://${SERVER_HOST}/auth/otp/resend`);
	
	// handle otp change
	const handleOTPChange = (value: string)=>{
		setErrorStatus(0); //reset error status
		setOtp(value);
	}

	// Action for resend OTP
	const requestNewCode = async () => {
    if (isCooldown) return;

    await resendOtpRequest.executePostRequest({username: username});

    // Start cooldown
    setIsCooldown(true);
    setCooldownTime(30); // Reset cooldown time

    //countdown for resending request
    const interval = setInterval(()=>{
      setCooldownTime((prev) => {
        if(prev === 1){
          clearInterval(interval);
          setIsCooldown(false);
          return 0;
        }

        return prev - 1;
      })
    }, 1000)
	};

  //use effect that listens to request new otp
  useEffect(()=>{
    if (resendOtpRequest?.status === 200) {
      toast.success("A new OTP has been sent to your email.");
      resendOtpRequest.clearResponseState();
      return;
    } 

    if(resendOtpRequest.error){
      toast.error("Unable to resend OTP right now. Please try again later.");
      resendOtpRequest.clearResponseState();
      return;
    }
  }, [resendOtpRequest.loading])

	// use effect that Triggers API request when OTP reaches 6 digits
  useEffect(() => {
    if (otp.length === 6) {
      setIsSubmitting(true);
			confirmSignupRequest.executePostRequest({
				username: username,
				confirmationCode: otp
			})
    }
  }, [otp]);

	// listens to on confirm signup loading change.
	useEffect(() => {
		if(confirmSignupRequest.status === 200){
			setTimeout(()=> {
				router.replace('/login')
			}, 1500);
      return;
		}

		if(confirmSignupRequest.error){
			const errorStatus = (confirmSignupRequest.error as AxiosError).response?.status;
			// 400 - incorrect confirmation code
      // 406 - confirmation expired 
      // 500 - internal server error
      if ([400, 406, 500].includes(errorStatus ?? 0)) {
        setErrorStatus(errorStatus!);
      }
      setOtp('')
      setIsSubmitting(false);
      confirmSignupRequest.clearResponseState();
		}		
	}, [confirmSignupRequest.loading])
  
  return (
		<Card>
			<form action="" className="flex flex-col justify-center items-center">
				<CardHeader>
						<ShieldCheck className={`h-12 w-12 md:h-20 md:w-20`}></ShieldCheck>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
						<Label className="text-xl md:text-2xl font-bold">OTP Verification</Label>
						<InputOTP 
							maxLength={6} 
							pattern={REGEXP_ONLY_DIGITS}
							value={otp}
							onChange={handleOTPChange}
							disabled={isSubmitting}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} id="firstSlot"/>
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

						{confirmSignupRequest.status === 200 && 
							<Label className="flex items-center text-xs md:text-sm text-green-500 gap-2">
								account confirmed <CircleCheck />
							</Label>
						}

            { errorMessages[errorStatus] && 
              <Label className="flex items-center text-xs md:text-sm text-destructive gap-2">
                {errorMessages[errorStatus]} {errorStatus !== 500 && <CircleX />}
              </Label>  
            }

						<div className="flex flex-col items-center gap-2">
							<Label className="text-sm text-primary font-bold md:text-base text-center">Hello, {username}</Label>
							<Label className="max-w-[500px] text-xs md:text-sm font-light text-center text-muted-foreground">Thankyou for registering. To confirm your account, please type the OTP sent to your {maskEmail(email!)}.</Label>
						</div>
				</CardContent>
			</form>
			<CardFooter className="w-full justify-center sm:justify-end">
					<Label className="text-xs md:text-sm">
						OTP not received? 
						<Button 
							variant={'ghost'} 
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
  )
}

/**Helper function that masks email */
const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  return `${local[0]}****${local.slice(-1)}@${domain}`;
};
