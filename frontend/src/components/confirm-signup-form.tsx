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

export function InputOTPForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const email = searchParams.get('email');

	if(!username || !email){
		router.back()
	}

	const [otp, setOtp] = useState<string>("");
	const [errorStatus, setErrorStatus] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	
	const {status, statusText, data, error, loading, executePostRequest , clearResponseState  } = usePost('http://localhost:3001/auth/confirm');
	
	// handle otp change
	const handleChange = (value: string)=>{
		setErrorStatus(0); //reset error status
		setOtp(value);
	}

	//action for resend
	const requestNewCode = () => {
		//call endpoint for the new code request
	}

	// Trigger API request when OTP reaches 6 digits
  useEffect(() => {
    if (otp.length === 6) {
      setIsSubmitting(true);
			executePostRequest({
				username: username,
				confirmationCode: otp
			})
    }
  }, [otp]);

	// listens to on loading change.
	useEffect(() => {
		if(status === 200){
			setTimeout(()=> {
				router.replace('/login')
			}, 2000);
		}

		if(error){
			const errorStatus = (error as AxiosError).response?.status;
			//incorrect confirmation code
			if(errorStatus === 400){
				setOtp('')
				setErrorStatus(errorStatus);
				setIsSubmitting(false);
				clearResponseState();
				return;
			}
			
			//confirmation expired 
			if(errorStatus === 406){
				setOtp('')
				setErrorStatus(errorStatus);
				setIsSubmitting(false);
				clearResponseState();
				return;
			}
			
			// internal server error
			if(errorStatus === 500){
				setOtp('')
				setErrorStatus(errorStatus);
				setIsSubmitting(false);
				clearResponseState();
				return;
			}
		}		
	}, [loading])
  
  return (
		<Card>
			<form action="" className="flex flex-col justify-center items-center">
				<CardHeader>
						<ShieldCheck className={`h-16 w-16 md:h-24 md:w-24`}></ShieldCheck>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
						<Label className="text-xl md:text-2xl font-bold">OTP Verification</Label>
						<InputOTP 
							maxLength={6} 
							pattern={REGEXP_ONLY_DIGITS}
							value={otp}
							onChange={handleChange}
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

						{status === 200 && 
							<Label className="flex items-center text-xs md:text-sm text-green-500 gap-2">
								account confirmed <CircleCheck />
							</Label>
						}

						{errorStatus === 400 && 
								<Label className="flex items-center text-xs md:text-sm text-destructive gap-2">
									incorrect code <CircleX />
								</Label>
						}

						{errorStatus === 406 && 
								<Label className="flex items-center text-xs md:text-sm text-destructive gap-2">
									expired code <CircleX />
								</Label>
						}

						{errorStatus === 500 && 
								<Label className="flex items-center text-xs md:text-sm text-destructive gap-2">
									Something went wrong. Try again.
								</Label>
						}

						<div className="flex flex-col items-center gap-2">
							<Label className="text-sm md:text-base text-center">Hello, {username}</Label>
							<Label className="max-w-[500px] text-xs md:text-sm font-light text-center text-muted-foreground">Thankyou for registering. To confirm your account, please type the OTP sent to your {email}.</Label>
						</div>
				</CardContent>
			</form>
			<CardFooter className="w-full justify-center sm:justify-end">
					<Label className="text-sm">
						OTP not received? 
						<Button 
							variant={'ghost'} 
							className="font-bold text-primary hover:bg-transparent hover:text-primary hover:text-md"
							onClick={requestNewCode}
							>
								Resend
						</Button>
					</Label>
			</CardFooter>
		</Card>
  )
}
