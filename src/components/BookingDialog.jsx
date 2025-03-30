import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCreateBookingMutation, useGetBookingsbyHotelIdQuery} from "@/lib/api";
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

const BookingDialog = ({ hotel}) => {
  const [price, setPrice] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  
  const { isSignedIn} = useUser();

  const hotelId = hotel?._id;

  const [createBooking, { isLoading }] = useCreateBookingMutation();

  const { data } = useGetBookingsbyHotelIdQuery(hotelId);

  const bookings = data?.bookings || []; 

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
  const { setValue } = form;
  useEffect(() => {
    if (arrivalDate && departureDate && roomType && hotel) {
      const diffInDays = Math.ceil((departureDate - arrivalDate) / (1000 * 3600 * 24));
      if (diffInDays > 0) {
        const roomPrice = hotel.price || 0;
        const totalPrice = diffInDays * roomPrice;
        setPrice(totalPrice);
        setValue("price", totalPrice);
      }
    }

   
  }, [arrivalDate, departureDate, roomType, hotel, setValue]);

  useEffect(() => {
    if (bookings?.length) {
      const booked = bookings.flatMap((booking) => {
        const start = new Date(booking.arrivalDate);
        const end = new Date(booking.departureDate);
        let dates = [];
        while (start <= end) {
          dates.push(new Date(start));
          start.setDate(start.getDate() + 1);
        }
        return dates;
      });
      setBookedDates(booked);
    }
  }, [bookings]); 

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
    } 
  };

  // Redirect to the login page if needed
  if (redirect) {
    return <Navigate to="/sign-in" />;
  }

  // Check if the selected date is booked
  const isDateBooked = (date) => bookedDates.some((booked) => booked.toDateString() === date.toDateString());

  // Check if the selected date is in the past
  const isPastDate = (date) => date < new Date();



  

  return (
    <Dialog>

      <DialogTrigger asChild>
      <span>
        <Button size="lg" onClick={handleBookNowClick}>Book Now</Button>
      </span>
      </DialogTrigger>

      <DialogContent className="grid grid-row-1 md:grid-cols-5 overflow-y-auto md:max-w-5xl w-11/12 h-5/6 md:h-[640px] md:w-full rounded-md">
        {/* Availability Calendar */}
        <div className="w-full px-2 py-1 md:col-span-2 md:border-0 border-b-2 pb-6 md:pb-0 border-gray-300">
          <DialogHeader>
              <DialogTitle className="text-xl font-bold">Hotel Booking Calander</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Check, If the booking datas are available.
              </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:items-start items-center gap-2 mt-3">
              <Calendar
                mode="single"
                className="shadow-md rounded-md lg:w-full lg:h-full lg:p-14"
                disabled={isDateBooked}
                modifiers={{
                  booked: bookedDates,
                  available: (date) => !isDateBooked(date) && !isPastDate(date),
                  past: isPastDate,
                }}
                modifiersClassNames={{
                  booked: "w-[33px] h-[33px] bg-red-600 text-white pointer-events-none",
                  available: "w-[33px] h-[33px] bg-green-500 text-white rounded-full pointer-events-none",
                  past: "w-[33px] h-[33px] bg-white text-gray-200  pointer-events-none",
                }}
            />
          <p className="text-black text-md font-semibold">Available Nights : 🟩</p>
          <p className="text-black text-md font-semibold">Booked Nights : 🟥</p>

          </div>
        </div>


      <div className="w-full md:col-span-3 md:border-l-2 md:pl-6 border-gray-300">
      {/* Booking Form */}
        <DialogHeader>
            <DialogTitle className="text-xl font-bold">Book Your Stay</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
                Complete the form below to request a reservation.
            </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">

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
            <DialogFooter className="flex flex-col md:flex-row w-full justify-between items-center gap-2">
              {/* Price */}
              <p className="text-lg text-black font-bold text-center md:text-left md:w-full">Price: ${price}</p>
              <DialogClose className="w-full md:w-fit" asChild><Button variant="outline">Close</Button></DialogClose>
              <Button className="w-full md:w-fit" type="submit" disabled={isLoading}>{isLoading ? "Booking..." : "Submit Booking"}</Button>
            </DialogFooter>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BookingDialog;