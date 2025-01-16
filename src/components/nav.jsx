"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  User,
  Package,
  Logs,
  CircleDollarSign,
  LucideLogOut,
} from "lucide-react";
import { deleteSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import getUser from "@/lib/getuser";
import { useState, useEffect } from "react";

export default function NavigationButtons({ triggerUpdate }) {
  const [userdata, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const userset = await getUser();
      console.log("Fetched user:", userset.userId);
      setUser(userset);
    }

    fetchUserData();
  }, [triggerUpdate]);

  const handleLogOut = () => {
    deleteSession();
    router.push("/login");
  };

  return (
    <>
      {userdata?.userId && (
        <>
          <div className="fixed top-4 right-4">
            <Button
              onClick={handleLogOut}
              className="flex items-center space-x-2 text-gray-200"
            >
              <LucideLogOut />
              <span>Log Out</span>
            </Button>
          </div>

          <div className="fixed bottom-0 left-0 w-full z-10 flex items-center justify-center backdrop-blur-md bg-black/30">
            <div className="flex items-center gap-8 py-4 px-4">
              {userdata?.role === "admin" && (
                <>
                  <Link href="/report" passHref>
                    <ChartLine
                      className="text-[#FF7518] hover:text-white"
                      title="Reports"
                    />
                  </Link>
                  <Link href="/users" passHref>
                    <User
                      className="text-[#FF7518] hover:text-white"
                      title="Users"
                    />
                  </Link>
                  <Link href="/product" passHref>
                    <Package
                      className="text-[#FF7518] hover:text-white"
                      title="Products"
                    />
                  </Link>
                  <Link href="/logs" passHref>
                    <Logs
                      className="text-[#FF7518] hover:text-white"
                      title="Logs"
                    />
                  </Link>
                  <Link href="/expence" passHref>
                    <CircleDollarSign
                      className="text-[#FF7518] hover:text-white"
                      title="Expenses"
                    />
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
