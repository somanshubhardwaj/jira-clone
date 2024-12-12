"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { useLogin } from "../api/use-login";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none ">
      <CardHeader className="flex item-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
      </CardHeader>
      <div className="px-7 mb-2">
        <Separator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      type="email"
                      placeholder="Enter your email"
                      {...field}
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
                      required
                      type="password"
                      placeholder="Enter your password"
                      {...field}
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
              Sign In
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
        <p>Don&apos;t have an account? </p>
        <Link href="/sign-up" className="ml-1">
          {" "}
          Sign Up
        </Link>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
