"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { userDetails } from "@/lib/getUserDetails";

// Profile form schema
const profileFormSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().messages({
    "string.empty": "firstname is required",
    "string.max": "max 50 characters",
  }),

  lastName: Joi.string().min(1).max(50).required().messages({
    "string.empty": "lastname is required",
    "string.max": "max 50 characters",
  }),

  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "username is required",
    "string.min": "minimum 3 characters",
    "string.max": "max 30 characters",
  }),
});

// Password form schema
const passwordFormSchema = Joi.object({
  currentPassword: Joi.string().min(8).max(100).required().messages({
    "string.empty": "enter your current password",
    "string.min": "current password must be at least 8 characters long",
    "string.max": "max 100 characters",
  }),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\"#$%&'()*+,-./:;<=>?@^_`{|}~])(?=.{8,})"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Atleast: | 1 uppercase letter | 1 lowercase letter | 1 number | 1 special character",
      "string.empty": "new password is required",
      "string.min": "new password must be at least 8 characters long",
      "string.max": "new max 100 characters",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "passwords do not match",
    "any.required": "confirm password is required",
  }),
});

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  username: string;
};
type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = userDetails;

  // profile form
  const {
    register: profileRegister,
    setError: profileSetError,
    handleSubmit: handleProfileSubmit,
    getValues: profileGetValues,
    formState: {
      errors: profileErrors,
      isSubmitting: profileIsSubmitting,
      isSubmitted: profileIsSubmitted,
    },
    reset: profileReset,
    clearErrors: profileClearErrors,
  } = useForm<ProfileFormValues>({
    resolver: joiResolver(profileFormSchema),
  });

  // password form
  const {
    register: passwordRegister,
    setError: passwordSetError,
    handleSubmit: handlePasswordSubmit,
    getValues: passwordGetValues,
    formState: {
      errors: passwordErrors,
      isSubmitting: passwordIsSubmitting,
      isSubmitted: passwordIsSubmitted,
    },
    reset: passwordReset,
    clearErrors: passwordClearErrors,
  } = useForm<PasswordFormValues>({
    resolver: joiResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle profile form submission
  function onProfileSubmit(data: ProfileFormValues) {}

  // Handle password form submission
  function onPasswordSubmit(data: PasswordFormValues) {}

  return (
    <div className="container mx-auto max-w-2xl">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </label>
                    <Input
                      id="firstName"
                      placeholder={`${user.firstName}`}
                      className={
                        profileErrors.firstName ? "border-destructive" : ""
                      }
                    />
                    {profileErrors.firstName && (
                      <span className="text-xs text-destructive">
                        {profileErrors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </label>
                    <Input
                      id="lastName"
                      placeholder={`${user.lastName}`}
                      {...profileRegister("lastName")}
                      className={
                        profileErrors.lastName ? "border-destructive" : ""
                      }
                    />
                    {profileErrors.lastName && (
                      <span className="text-xs text-destructive">
                        {profileErrors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder={`${user.username}`}
                    {...profileRegister("username")}
                    className={
                      profileErrors.username ? "border-destructive" : ""
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    This is your public display name.
                  </p>
                  {profileErrors.username && (
                    <span className="text-xs text-destructive">
                      {profileErrors.username.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    value={`${user.email}`}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email cannot be changed.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">Saving...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" /> Save changes
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Current password
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    {...passwordRegister("currentPassword")}
                    className={
                      passwordErrors.currentPassword ? "border-destructive" : ""
                    }
                  />
                  {passwordErrors.currentPassword && (
                    <span className="text-xs text-destructive">
                      {passwordErrors.currentPassword.message}
                    </span>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    New password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...passwordRegister("newPassword")}
                    className={
                      passwordErrors.newPassword ? "border-destructive" : ""
                    }
                  />
                  {passwordErrors.newPassword && (
                    <span className="text-xs text-destructive">
                      {passwordErrors.newPassword.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...passwordRegister("confirmPassword")}
                    className={
                      passwordErrors.confirmPassword ? "border-destructive" : ""
                    }
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="text-xs text-destructive">
                      {passwordErrors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">Updating...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" /> Update password
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
