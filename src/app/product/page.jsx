"use client";
import * as React from "react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import AddProduct from "@/components/addProduct";
import AddItem from "@/components/addItem";
import EditProduct from "@/components/editProduct";
import { Check, Package, CupSoda,ShoppingCart } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavigationButtons from "@/components/nav";
import { useRouter } from "next/navigation";

const handleProductUpdate = (updatedProduct) => {
    setProducts((prevProducts) =>
        prevProducts.map((p) =>
            p._id === updatedProduct._id ? updatedProduct : p
        )
    );
};

export async function fetchProducts() {
    try {
        const response = await fetch("/api/product", { method: "GET" });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, products: [] };
    }
}

export default function Product() {
    const router = useRouter();
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        async function loadProducts() {
            const { success, products } = await fetchProducts();
            if (success) {
                // Sort products in ascending order (by createdAt or _id)
                const reversedProducts = products.reverse();
                setProducts(reversedProducts);
              
            }
        }
        loadProducts();
    }, []);

    const handleNavigate = () => {
        router.push("/lists");
      };

    async function updateProductStatus(productId, active) {
      try {
          const response = await fetch(`/api/activate/${productId}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ active }),
          });
  
          if (!response.ok) {
              throw new Error("Failed to update product status");
          }
  
          return await response.json();
      } catch (error) {
          console.error("Error updating product status:", error);
          return { success: false };
      }
  }
    const handleSwitchChange = async (productId, currentStatus) => {
      const newStatus = !currentStatus;

      console.log("Updating product status...");
      console.log("Product ID:", productId);
      console.log("New status:", newStatus);
      const { success } = await updateProductStatus(productId, newStatus);

      if (success) {
          setProducts((prevProducts) =>
              prevProducts.map((product) =>
                  product._id === productId
                      ? { ...product, active: newStatus }
                      : product
              )
          );
      } else {
          console.error("Failed to update product status");
      }
  };

    return (
        <>
        <NavigationButtons/>
      
            <div className="flex min-h-full flex-col  justify-center px-6 py-16 lg:px-8">
                <div className="sm:mx-auto  sm:w-full sm:max-w-6xl">
                    <Card className=" bg-[#202020bd]  border-none">
                        <CardHeader>
                            <div className="flex  justify-between">
                            <CardTitle className="text-2xl mb-8 text-gray-300">Product</CardTitle>
                           <Button className="border-none 2xl text-[#FF7518]" onClick={handleNavigate}>
                           <ShoppingCart/>
    </Button>
                            </div>
                            <AddProduct />
                        </CardHeader>
                        <CardContent>
                            {products.map((product) => (
                                <Card key={product._id}  className="mt-4 bg-black border-none text-white">
                                    <CardHeader>
                                        <div className="flex items-center justify-between w-full">
                                            <CardTitle className="text-xl">{product.productName}</CardTitle>
                                            <EditProduct product={product} onProductUpdate={handleProductUpdate} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        <div className="flex items-center bg-gray-900  space-x-4 rounded-md  p-4">
                                            <CupSoda />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    Activate the product
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Switch on to activate the product for sale
                                                </p>
                                            </div>
                                            <Switch className="" defaultChecked={product.active} 
                                            onCheckedChange={() =>
                                              handleSwitchChange(product._id, product.active)
                                          }
                                            />
                                        </div>
                                        <div>
                                            <div className="grid grid-cols-4 gap-4">
                                                <div className="grid grid-cols-[25px_1fr] items-start pb-4">
                                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-[#FF7518]" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">Cost Price</p>
                                                        <p className="text-sm text-muted-foreground">{product.costPrice}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-[25px_1fr] items-start pb-4">
                                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-[#FF7518]" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">Sale Price</p>
                                                        <p className="text-sm text-muted-foreground">{product.salePrice}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-[25px_1fr] items-start pb-4">
                                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-[#FF7518]" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">Total Count</p>
                                                        <p className="text-sm text-muted-foreground">{product.count}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-[25px_1fr] items-start pb-4">
                                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-[#FF7518]" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">Sold Count</p>
                                                        <p className="text-sm text-muted-foreground">{product.sold || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                    <AddItem productId={product._id} onItemAdded={(updatedProduct) => handleProductUpdate(updatedProduct)} />
                                    </CardFooter>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </>
    );
}
