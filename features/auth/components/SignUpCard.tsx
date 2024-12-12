"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRegister } from "../api/use-register";
import { signUpWithGoogle } from "@/lib/oauth";
import { signUpWithGithub } from "@/lib/oauth";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Minimum 8 characters required"),
});
const SignUpCard = () => {
  const { mutate, isPending } = useRegister();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
    console.log(data);
  };
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none ">
      <CardHeader className="flex item-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up!</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-blue-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-500">
            Privacy Policy
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-2">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      disabled={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      disabled={false}
                      min={8}
                      max={256}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              size={"lg"}
              variant="primary"
              className="w-full"
              type="submit"
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4 ">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={isPending}
          onClick={() => signUpWithGoogle()}
        >
          <FcGoogle /> Login with Google
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={isPending}
          onClick={() => signUpWithGithub()}
        >
          <FaGithub /> Login with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7 flex item-center justify-center">
        <p>Already have an account? </p>
        <Link href="/sign-in" className="ml-1">
          {" "}
          Sign In
        </Link>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
