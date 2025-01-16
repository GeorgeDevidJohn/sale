"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import getUser from "@/lib/getuser";

const formSchema = z.object({
  productName: z.string().nonempty({
    message: "Product Name is required",
  }),
  salePrice: z.coerce.number().min(0.01, {
    message: "Sale Price is required and must be greater than 0",
  }),
  costPrice: z.coerce.number().min(0.01, {
    message: "Cost Price is required and must be greater than 0",
  }),
  count: z.coerce.number().min(1, {
    message: "Count is required and must be at least 1",
  }),
  active: z.boolean().default(true),
});

export default function AddProduct() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "", // Always initialize as a string
      salePrice: "", // Always initialize as a number
      costPrice: "",
      count: "",
      active: true,
    },
  });

  async function onChangeLog(values) {
     const userdata = await getUser()
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userdata.fullName,
        role: userdata.role,
        message:
        userdata.fullName +  " has added " + values.productName + " to the product list",
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  async function onSubmit(values) {
    const response = await fetch("/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      console.log("All added successfully");
      await onChangeLog(values);
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      console.error("Failed to add product");
    }
  }

  return (
    <>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#FF7518] text-white"
          
        >
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] backdrop-blur-md bg-[#20202066] max-w-[340px] border-none  rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-300">Add Product</DialogTitle>
          <DialogDescription>Add a new product to the cart</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Product Name</FormLabel>
                  <FormControl>
                    <Input className="text-gray-300 bg-gray-800 border-none" placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Sale Price</FormLabel>
                  <FormControl>
                    <Input className="text-gray-300 bg-gray-800 border-none" type="number" placeholder="Sale Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Cost Price</FormLabel>
                  <FormControl>
                    <Input className="text-gray-300 bg-gray-800 border-none" type="number" placeholder="Cost Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Count</FormLabel>
                  <FormControl>
                    <Input className="text-gray-300 bg-gray-800 border-none" type="number" placeholder="Count" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#FF7518]">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
