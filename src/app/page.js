"use client";

import Image from "next/image";
import { LineChart, Line, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export default function HeroSection() {
  return (
    <>
    <div className="relative isolate h-screen overflow-hidden bg-gray-900">
      {/* Line Graph Background */}
      <div
        className="absolute inset-0 -z-10 flex justify-center opacity-20"
        aria-hidden="true"
      >
        <LineChart
          width={800}
          height={400}
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Line
            dataKey="desktop"
            type="monotone"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="mobile"
            type="monotone"
            stroke="#80caff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </div>

      {/* Hero Content */}
      <div className="flex h-full items-center justify-between px-10">
        {/* Left Content */}
        <div className="max-w-lg text-center lg:text-left">
          <h1 className="text-3xl text-left font-bold tracking-tight text-white sm:text-6xl">
            Simplify
            <span className="text-orange-500">
              {" "}
              Sales & Inventory Management
            </span>{" "}
            with
            <span className="text-orange-500"> Ease!</span>
          </h1>
          <p className="mt-6 text-lg  text-left leading-8 text-gray-300">
            Track, manage, and grow your business with our powerful tool built
            for modern needs.
          </p>
          <div className="mt-5 flex justify-start lg:justify-start gap-x-6">
            <a
              href="/login"
              className="rounded-md bg-orange-500 px-3.5 py-2.5  text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              rel="noreferrer"
            >
              Try Now →
            </a>
          </div>
        </div>

        {/* Right Content */}
       
      </div>
    </div>
    </>
  );
}
