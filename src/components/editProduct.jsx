"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import getUser from "@/lib/getuser";

const formSchema = z.object({
  productName: z.string().nonempty({ message: "Product Name is required" }),
  salePrice: z
    .preprocess((value) => Number(value), z.number().min(0.01, "Must be greater than 0")),
  costPrice: z
    .preprocess((value) => Number(value), z.number().min(0.01, "Must be greater than 0")),
  count: z
    .preprocess((value) => Number(value), z.number().min(1, "Must be at least 1")),
  active: z.boolean().default(true),
});

export default function EditProduct({ product, onProductUpdate }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      salePrice: 0,
      costPrice: 0,
      count: 0,

    },
  });

  async function onChangeLog(values){
    const userdata = await getUser()
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userdata.fullName,
        role: userdata.role,
        message:  userdata.fullName + " have updated the details of "+ values.productName ,
      }),
    });
    window.location.reload();
  }
  const { reset } = form;

  React.useEffect(() => {
    if (product) {
      reset({
        productName: product?.productName || "",
        salePrice: product?.salePrice || 0,
        costPrice: product?.costPrice || 0,
        count: product?.count || 0
      });
    }
  }, [product, reset]);

  async function onSubmit(values) {
    try {
      const response = await fetch("/api/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, ...values }),
      });
     
      if (response.ok) {
        console.log("Product updated successfully");
        onChangeLog(values)
       
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
    <Dialog>
      <DialogTrigger asChild>
        
          <Pencil className=" text-lg text-[#FF7518]" />
     
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-none backdrop-blur-md bg-[#20202066] max-w-[340px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
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
                    <Input type="number" className="text-gray-300 bg-gray-800 border-none" placeholder="Sale Price" {...field} />
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
                    <Input type="number" className="text-gray-300 bg-gray-800 border-none" placeholder="Cost Price" {...field} />
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
                    <Input type="number" className="text-gray-300 bg-gray-800 border-none" placeholder="Count" {...field} />
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