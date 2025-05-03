import { useRouter } from "next/navigation";
import { usePost } from "./use-request";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { API_BASE_URL } from '@/constants';

interface UseConfirmSignupProps {
  username: string | null;
}

export default function useConfirmSignup({ username }: UseConfirmSignupProps) {
  const router = useRouter();
  const { status, error, loading, executePostRequest , clearResponseState } = usePost(`${API_BASE_URL}/auth/signup/confirm`); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<number>(0);

  // function that requests server to verify OTP
  const confirmOTP = async (otp: string) =>{
    if(!username){
      console.error("Username is missing.")
      return;
    }

    setIsSubmitting(true);
    await executePostRequest({
      username: username,
      confirmationCode: otp,
    });
  }

  useEffect(() => {
    if (status === 200) {
      setRequestStatus(status);
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    if (error) {
      const errorStatus = (error as AxiosError).response?.status;
      if ([400, 406, 500].includes(errorStatus ?? 0)) {
        setRequestStatus(errorStatus!);
      }
      setIsSubmitting(false);
      // Consider if clearing OTP should happen here or in the component
      clearResponseState();
    }
  }, [loading, router, username]);

  return { confirmOTP, isSubmitting, requestStatus, clearErrorStatus: () => setRequestStatus(0) };
}
