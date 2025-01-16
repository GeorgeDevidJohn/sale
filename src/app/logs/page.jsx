"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { add, format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NavigationButtons from "@/components/nav"

// Define frameworks array
// const frameworks = [
//   { value: "react", label: "React" },
//   { value: "vue", label: "Vue.js" },
//   { value: "angular", label: "Angular" },
//   { value: "svelte", label: "Svelte" },
// ];

export default function Logs() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [date, setDate] = React.useState(new Date()) // Set initial date to yesterday
  const [logs, setLogs] = React.useState([])

  // Fetch logs based on the selected date
  React.useEffect(() => {
    async function fetchLogs() {
      let url = "/api/logbydate";
      if (date) {
        // Format the selected date into a string (e.g., "2025-01-07")
     
        const formattedDate = format(date, "yyyy-MM-dd");
        url = `/api/logbydate?date=${formattedDate}`; // Pass date as query param
      }

      try {
        const response = await fetch(url, { method: "GET" })
        const data = await response.json()
        if (data.success) {
          setLogs(data.logs.reverse()) // Reverse the logs to show the latest first
        }
      } catch (error) {
        console.error("Error fetching logs:", error)
      }
    }

    fetchLogs();
  }, [date]) // Fetch logs whenever the date changes

  return (
    <>
     <NavigationButtons />
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
          <Card className="bg-[#202020bd] border-none"> 
            <CardHeader>
              <CardTitle className="text-2xl mb-8 text-gray-300">Logs</CardTitle>
              <div className="flex gap-4">
                {/* <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? frameworks.find((framework) => framework.value === value)?.label
                        : "Choose Name"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search framework..." />
                      <CommandList>
                        <CommandEmpty>No Name found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === framework.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {framework.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                     
                      className={cn( 
                        "w-[240px] justify-start text-left font-normal !bg-[#000000bf]",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0  bg-[#ffffffb8] backdrop-blur-md  border-none" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Activity logs recorded in the system.</TableCaption>
                <TableHeader>
                  <TableRow className="text-gray-200">
                    <TableHead className="text-gray-200">User</TableHead>
                    <TableHead className="text-gray-200">Name</TableHead>
                    <TableHead className="text-right text-gray-200">Log message</TableHead>
                    <TableHead className="text-right text-gray-200">Date and Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                  {logs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-gray-200">{log.role}</TableCell>
                      <TableCell className="text-gray-200">{log.name}</TableCell>
                      <TableCell className="text-right text-gray-200">{log.message}</TableCell>
                      <TableCell className="text-right text-gray-200">
                        {log.createdAt ? format(new Date(log.createdAt), "PPpp") : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
