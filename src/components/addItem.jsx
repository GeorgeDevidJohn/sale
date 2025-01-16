import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import getUser from "@/lib/getuser";

export default function AddItem({ productId, onItemAdded }) {
const [count, setCount] = useState(0);
const [open, setOpen] = useState(false);


async function onChangeLog(values){

  console.log("VALUES ARE" + values);
  const userdata =  await getUser()
  console.log("VALUES ARE USRES" + userdata);
  console.log(userdata);
  const response = await fetch("/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userdata.fullName,
      role: userdata.role,
      message:  userdata.fullName + " have updated the count of "+ values.productName + " to " + values.count,
    }),
    
  });
  window.location.reload();
}


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`/api/addcount/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: parseInt(count, 10) }),
    });

    const data = await response.json();
    console.log(data);
    setOpen(false);
    if (response.ok && data.success) {
      onChangeLog(data.product)
      setCount(0);
      setOpen(false);
    } else {
      alert("Failed to update item count");
    }
  } catch (error) {
   
  }
};

return (
  <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border-none bg-[#FF7518]">
          <PlusCircleIcon /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px] max-w-[340px] backdrop-blur-md bg-[#20202066]  border-none rounded-xl top-60">
        <DialogHeader>
          <DialogTitle className="text-gray-300">Add Number</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="count" className="text-right text-gray-300">
                Count
              </Label>
              <Input
                id="count"
                type="number"
                className="text-gray-300 col-span-3 bg-gray-800 border-none"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-[#FF7518]" type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </>
);
}
