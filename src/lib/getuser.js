"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = "mysecretkey"; // Replace with an environment variable in production
const encodedKey = new TextEncoder().encode(secretKey); // Encodes the secret key

export default async function getUser() {
  async function decrypt(session) {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
      });
      console.log("This is the payload:", payload);
      return payload;
    } catch (error) {
      console.error("Failed to verify session:", error.message);
      return null;
    }
  }

  const cookie = cookies().get("session")?.value; // Access cookies synchronously
  if (!cookie) {
    console.log("No session cookie found");
    return null;
  }

  const session = await decrypt(cookie); // Decrypt the session token
  return session;
}
