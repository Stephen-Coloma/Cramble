import { useState, useEffect } from "react";
import { usePost } from "@/hooks/use-request";
import { toast } from "sonner";

import { API_BASE_URL } from "@/constants";

interface UseResendOtpProps {
  username: string | null;
}

export default function useResendOtp({ username }: UseResendOtpProps) {
  const {status, error, loading, executePostRequest , clearResponseState } = usePost(`${API_BASE_URL}/auth/otp/resend`);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(30);

  const requestNewCode = async () => {
    if (isCooldown || !username) return;

    await executePostRequest({ username: username });

    setIsCooldown(true);
    setCooldownTime(30);

    const interval = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (status === 200) {
      toast.success("A new OTP has been sent to your email.");
      clearResponseState();
    }

    if (error) {
      toast.error("Unable to resend OTP right now. Please try again later.");
      clearResponseState();
    }
  }, [loading]);

  return { requestNewCode, isCooldown, cooldownTime };
}