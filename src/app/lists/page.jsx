"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import SalesComponent from "@/components/salesList";
import NavigationButtons from "@/components/nav";
import getUser from "@/lib/getuser";

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [count, setCount] = useState("");
  const [user,setuser]= useState("") // Initialize with an empty string to avoid uncontrolled input issues

  useEffect(() => {
    async function fetchActiveProducts() {
      try {
        const userdatas = await getUser();
        setuser(userdatas)
        const response = await fetch("/api/activeproducts", { method: "GET" });
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Failed to fetch active products:", data.error);
        }
      } catch (error) {
        console.error("Error fetching active products:", error);
      }
    }

    fetchActiveProducts();
  }, []);

  const handleAddSale = async (productId, productName) => {
    if (!count || count < 1) {
      alert("Please enter a valid count.");
      return;
    }

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productid: productId,
          productName: productName,
          count: parseInt(count, 10),
        }),
      });

      onChangeLog(productName, count);

      const data = await response.json();
      if (data.success) {
        const updatedProductList = products.map((product) =>
          product._id === productId
            ? { ...product, soldCount: (product.soldCount || 0) + parseInt(count, 10) }
            : product
        );
        setProducts(updatedProductList);
        setCount(""); // Reset the count field to an empty string
        setCurrentProduct(null);
        updateProductCount(productId, count);
      } else {
        alert(`Failed to add sale: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      alert("Error adding sale. Please try again.");
    }
  };

  const updateProductCount = async (productId, count) => {
    try {
      const response = await fetch("/api/updateProductCount", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productid: productId,
          count: parseInt(count, 10),
        }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert(`Failed to update product: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating product table:", error);
      alert("Error updating product table. Please try again.");
    }
  };

  async function onChangeLog(prodName, cnt) {

    const userdata = await getUser();
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userdata.fullName,
        role: userdata.role,
        message: userdata.fullName + ` has sold ${cnt} of ${prodName}`,
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <>
       <NavigationButtons/>
   
    <div className="p-6 mt-16 space-y-8">
    <span className="text-gray-200  font-bold text-2xl">
          HI {user.fullName}!
        </span>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          
          <Card key={product._id} className="hover:shadow-lg bg-gradient-to-br from-slate-900 to-neutral-800 border-none">
            <CardHeader>
              <CardTitle className="2xl text-gray-200">{product.productName}</CardTitle>
              <CardDescription className="!3xl font-bold !text-gray-200">${product.salePrice.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#FF7518] border-none font-bold text-gray-200">Add Sale</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] backdrop-blur-md bg-[#20202066] max-w-[340px] top-40 border-none rounded-xl ">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200">Add Sale</DialogTitle>
                    <DialogDescription>
                      Enter the count for  {product.productName}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="number"
                      min={1}
                      className="text-gray-300 col-span-3 bg-gray-800 border-none"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      placeholder="Enter count"
                    />
                    <Button
                      onClick={() => handleAddSale(product._id, product.productName)}
                      className="bg-[#FF7518] text-white"
                    >
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-auto pb-10">
        <SalesComponent />
      </div>
    </div>
    </>
  );
}
