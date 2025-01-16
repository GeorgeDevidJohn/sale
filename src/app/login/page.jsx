"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSession } from "@/lib/session";

export default function AboutUs() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure any client-specific logic is handled here
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName || !password) {
      setError("Both username and password are required.");
      return;
    }

    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        userName,
        password,
      }).toString();

      const response = await fetch(`/api/login?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed. Please try again.");
      }

      createSession(result.user.id, result.user.fullName, result.user.role);
      router.push('/lists');

      setUserName("");
      setPassword("");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  async function startTrial () {

    try {
    
      const queryParams = new URLSearchParams({
        userName :"Admin",
        password :"password@123",
      }).toString();

      const response = await fetch(`/api/login?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed. Please try again.");
      }

      createSession(result.user.id, result.user.fullName, result.user.role);
      router.push('/lists');

      setUserName("");
      setPassword("");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <div className="flex mt-10 min-h-full flex-col justify-center px-6 py-12 lg:px-8">
     

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Card className=" bg-[#202020bd] border-none">
          <CardHeader>
            <div className="flex justify-between">
            <CardTitle className="text-2xl text-gray-300">Login</CardTitle>  <Button
  onClick={() => startTrial()}
  className="bg-[#FF7518]"
  disabled={loading}
>
  {loading ? "Logging in..." : "Start Trial"}
</Button>
                </div>
            <CardDescription>
             This is a Trial  Version
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="userName" className="text-gray-300">User Name</Label>
                  <Input
                    id="userName"
                    type="text" className="text-gray-300 bg-gray-800 border-none"
                    placeholder="Admin"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password" className="text-gray-300 bg-gray-800 border-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* {error && <div className="text-red-500 text-sm">{error}</div>} */}
                <Button type="submit" className="w-full bg-[#FF7518]" disabled="true">
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
