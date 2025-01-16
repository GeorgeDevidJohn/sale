"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NavigationButtons from "@/components/nav";

export default function Users() {
  const [users, setUsers] = React.useState([]);

  // Fetch user data
  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/register"); // Replace with your API endpoint
        
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsers(data.users);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
    <NavigationButtons/>
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
          <Card className=" bg-[#202020bd] border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-left mb-8 text-white">Users List</CardTitle>
              <Link href="/register" passHref>
                <Button className="!bg-[#FF7518] w-full  text-white" >
                  Register User
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              <Table>
                <TableCaption>Users List</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>Role</TableHead>
                   
                  </TableRow>
                </TableHeader>
                <TableBody className="text-gray-400">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow className="text-gray-400" key={user.id}>
                        <TableCell className="text-gray-400">{user.fullName}</TableCell>
                        <TableCell className="text-gray-400">{user.userName}</TableCell>
                        <TableCell className="text-gray-400">{user.role}</TableCell>
                       
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
