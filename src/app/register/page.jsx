"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import NavigationButtons from "@/components/nav";

// Zod Schema
const formSchema = z.object({
  fullName: z.string().nonempty({
    message: "Full Name is required",
  }),
  userName: z.string().nonempty({
    message: "User Name is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  })
  .min(8, { message: 'Be at least 8 characters long' })
  .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
  .regex(/[0-9]/, { message: 'Contain at least one number.' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Contain at least one special character.',
  })
  .trim(),
});

export default function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      userName: "",
      password: "",
    },
  });

  // Handle Form Submission
  async function onSubmit(values) {
    console.log("Registering user", values);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      console.log("User registered successfully");
      window.location.reload();
    } else {
      console.error("Failed to register user");
    }
  }

  return (
    <>
    <NavigationButtons/>
   
    <div className="flex mt-10 min-h-full flex-col justify-center px-6 py-12 lg:px-8">

      <div className="  sm:mx-auto sm:w-full sm:max-w-sm">
        <Card className=" bg-[#202020bd] border-none" >
          <CardHeader>
            <CardTitle  className="text-2xl text-gray-300">Register New User</CardTitle>
            <CardDescription >Register new employee</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <Input className="text-gray-300 bg-gray-800 border-none" placeholder="George Devid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* User Name */}
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">User Name</FormLabel>
                      <FormControl>
                        <Input className="text-gray-300 bg-gray-800 border-none" placeholder="Tgeorge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input type="password" className="text-gray-300 bg-gray-800 border-none" placeholder="Enter Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-[#FF7518]">
                  Register
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
