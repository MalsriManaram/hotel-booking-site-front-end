import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCreateBookingMutation } from "@/lib/api";
import { useUser } from "@clerk/clerk-react";
import { Navigate} from "react-router";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";

// Schema Form validation
const bookingSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("A valid email is required"),
    phone: z.string().regex(/\+?[0-9]{10,15}/, "A valid phone number is required"),
    arrivalDate: z.date({ required_error: "Please select an arrival date"}).min(new Date(), "Arrival date cannot be in the past"),
    departureDate: z.date({ required_error: "Please select a departure date"}).min(new Date(), "Departure date cannot be in the past"),
    roomType: z.string().min(1, "Room type is required"),
    adults: z.coerce.number().min(1, "Adult is required"),
    children: z.coerce.number().min(0, "children is required"),
    specialRequests: z.string().optional(),
  }).refine(data => data.departureDate > data.arrivalDate, {
    message: "Must be after arrival",
    path: ["departureDate"]
  });

export default function BookingDialog({ hotel}) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [redirect, setRedirect] = useState(false);

  const [createBooking, { isLoading }] = useCreateBookingMutation();

  const { isSignedIn } = useUser();

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      arrivalDate: undefined,
      departureDate: undefined,
      roomType: "",
      adults: "",
      children: "",
      specialRequests: "",
    },
  });

  const { watch, handleSubmit } = form;

  const arrivalDate = watch("arrivalDate");
  const departureDate = watch("departureDate");
  const roomType = watch("roomType");

  // Calculate price
  const { setValue } = form; // Get form instance
  useEffect(() => {
    if (arrivalDate && departureDate && roomType && hotel) {
      const diffInDays = Math.ceil((departureDate - arrivalDate) / (1000 * 3600 * 24));
      if (diffInDays > 0) {
        const roomPrice = hotel.price || 0;
        const totalPrice = diffInDays * roomPrice;
        setPrice(totalPrice);
        setValue("price", totalPrice); // Update form value
      }
    }
  }, [arrivalDate, departureDate, roomType, hotel, setValue]);



  const onSubmit = async (values) => {

    const hotelId = hotel ? hotel._id : null;
    const payment = price;


    const { firstName, lastName, email, phone, arrivalDate, departureDate, roomType, adults, children, specialRequests  } = values;
    console.log(values);
    console.log(payment);
    try {
      await createBooking({
        hotelId,
        firstName, 
        lastName, 
        email, 
        phone, 
        arrivalDate, 
        departureDate, 
        roomType, 
        adults, 
        children, 
        specialRequests,
        payment,
    }).unwrap();

        toast.success("Booking successful");
    } catch (error) {
        console.error(error); 
        toast.error("Booking failed");
    }
  };

  // Redirect to Sign In page if not signed in
  const handleBookNowClick = () => {
    if (!isSignedIn) {
      setRedirect(true);
    } else {
      setOpen(true);
    }
  };

  // Redirect to the login page if needed
  if (redirect) {
    return <Navigate to="/sign-in" />;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" onClick={handleBookNowClick}>Book Now</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl overflow-y-auto w-11/12 h-5/6 md:h-[640px] md:w-fit rounded-md">
        <DialogHeader>
            <DialogTitle className="text-xl font-bold">Book Your Stay</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
                Complete the form below to request a reservation.
            </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField name="firstName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Enter first name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="lastName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Enter last name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} placeholder="example@gmail.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input type="tel" {...field} placeholder="+94 77 123 4567" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <FormField name="arrivalDate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex justify-between w-full text-gray-500 font-normal">
                        {field.value ? format(field.value, "PPP") : "Select date"}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="overflow-y-auto h-80" >
                    <Calendar className="p-0"
                        mode="single" 
                        selected={field.value} 
                        onSelect={field.onChange}
                        fromDate={new Date()}
                        disabled={(date) =>  departureDate && date > departureDate }
                    />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="departureDate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex justify-between w-full text-gray-500 font-normal">
                        {field.value ? format(field.value, "PPP") : "Select date"}
                        <CalendarIcon className=" h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="overflow-y-auto h-80">
                    <Calendar className="p-0"
                        mode="single" 
                        selected={field.value} 
                        onSelect={field.onChange}
                        fromDate={arrivalDate ? new Date(arrivalDate.getTime() + 86400000) : new Date()}
                        disabled={(date) => 
                            date <= new Date() || (arrivalDate && date <= arrivalDate)
                        }
                    />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Room Type & Guests */}
            <div className="grid grid-cols-3 gap-4">
              <FormField name="roomType" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Room</SelectItem>
                      <SelectItem value="double">Double Room</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Adults Count */}
              <FormField name="adults" control={form.control} render={({ field }) => (
                <FormItem>
                    <FormLabel>Adults</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))}>
                    <SelectTrigger><SelectValue placeholder="Select Adults" /></SelectTrigger>
                    <SelectContent>
                        {[...Array(6).keys()].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
               )} />

              {/* Children Count */}
              <FormField name="children" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Children</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))}>
                    <SelectTrigger><SelectValue placeholder="Select Children" /></SelectTrigger>
                    <SelectContent>
                      {[...Array(6).keys()].map((num1) => (
                        <SelectItem key={num1} value={num1.toString()}>{num1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Special Requests */}
            <FormField name="specialRequests" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea  {...field} placeholder="Any special requests?"  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )} />

            {/* Submit Button */}
            <DialogFooter>
              {/* Price */}
                <p className="text-lg text-black font-bold text-center md:text-left md:w-full">Price: ${price}</p>
              <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Booking..." : "Submit Booking"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
