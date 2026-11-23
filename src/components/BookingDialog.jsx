import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, MessageCircle, Tag } from "lucide-react";
import {
  useCreateBookingMutation,
  useGetHotelAvailabilityQuery,
  useValidatePromoMutation,
} from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const todayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const bookingSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("A valid email is required"),
    phone: z
      .string()
      .regex(/\+?[0-9\s-]{8,18}/, "A valid phone number is required"),
    arrivalDate: z
      .date({ required_error: "Please select an arrival date" })
      .min(todayMidnight(), "Arrival date cannot be in the past"),
    departureDate: z
      .date({ required_error: "Please select a departure date" })
      .min(todayMidnight(), "Departure date cannot be in the past"),
    roomType: z.string().min(1, "Room type is required"),
    adults: z.coerce.number().min(1, "At least 1 adult is required"),
    children: z.coerce.number().min(0, "Children count is required"),
    paymentMethod: z
      .enum(["whatsapp", "pay_at_hotel", "payhere_sandbox"])
      .default("whatsapp"),
    specialRequests: z.string().optional(),
  })
  .refine((data) => data.departureDate > data.arrivalDate, {
    message: "Departure must be after arrival",
    path: ["departureDate"],
  });

const PAYHERE_SANDBOX_MERCHANT_ID =
  import.meta.env.VITE_PAYHERE_MERCHANT_ID || "";

const BookingDialog = ({ hotel, defaultRoomType = "single" }) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [open, setOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const hotelId = hotel?._id;
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const [validatePromo, { isLoading: isCheckingPromo }] =
    useValidatePromoMutation();

  const { data: availability } = useGetHotelAvailabilityQuery(hotelId, {
    skip: !hotelId,
  });

  const roomTypes = useMemo(() => {
    if (availability?.roomTypes?.length) return availability.roomTypes;
    if (hotel?.roomTypes?.length) return hotel.roomTypes;
    const base = Number(hotel?.price) || 150;
    return [
      { type: "single", name: "Classic Single Room", price: base, totalRooms: 5 },
      {
        type: "double",
        name: "Superior Double Room",
        price: Math.round(base * 1.3),
        totalRooms: 5,
      },
      {
        type: "deluxe",
        name: "Deluxe Panoramic Room",
        price: Math.round(base * 1.65),
        totalRooms: 3,
      },
      {
        type: "suite",
        name: "Executive Luxury Suite",
        price: Math.round(base * 2.15),
        totalRooms: 2,
      },
    ];
  }, [availability, hotel]);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      arrivalDate: undefined,
      departureDate: undefined,
      roomType: defaultRoomType,
      adults: 2,
      children: 0,
      paymentMethod: "whatsapp",
      specialRequests: "",
    },
  });

  // Pre-fill signed-in Clerk user details
  useEffect(() => {
    if (user) {
      if (!form.getValues("firstName") && user.firstName) {
        form.setValue("firstName", user.firstName);
      }
      if (!form.getValues("lastName") && user.lastName) {
        form.setValue("lastName", user.lastName);
      }
      const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
      if (!form.getValues("email") && primaryEmail) {
        form.setValue("email", primaryEmail);
      }
    }
  }, [user, form]);

  useEffect(() => {
    if (defaultRoomType) {
      form.setValue("roomType", defaultRoomType);
    }
  }, [defaultRoomType, form]);

  const arrivalDate = form.watch("arrivalDate");
  const departureDate = form.watch("departureDate");
  const selectedRoomType = form.watch("roomType") || "single";

  const selectedRoomObj =
    roomTypes.find((r) => r.type === selectedRoomType) || roomTypes[0];

  const nights = useMemo(() => {
    if (!arrivalDate || !departureDate) return 0;
    const diff = Math.ceil((departureDate - arrivalDate) / 86_400_000);
    return diff > 0 ? diff : 0;
  }, [arrivalDate, departureDate]);

  const subtotal = nights * (Number(selectedRoomObj?.price) || Number(hotel?.price) || 0);
  const discountAmount = useMemo(() => {
    if (!appliedPromo || subtotal <= 0) return 0;
    return Math.round(((subtotal * appliedPromo.discountPercent) / 100) * 100) / 100;
  }, [appliedPromo, subtotal]);
  const totalPrice = Math.max(0, subtotal - discountAmount);

  // Compute unavailable dates for currently selected roomType
  const bookedDates = useMemo(() => {
    const rawKeys =
      availability?.unavailableDatesByRoomType?.[selectedRoomType] ||
      availability?.fullyBookedDates ||
      [];
    return rawKeys.map((iso) => new Date(`${iso}T00:00:00`));
  }, [availability, selectedRoomType]);

  const isDateBooked = (date) =>
    bookedDates.some((b) => b.toDateString() === date.toDateString());
  const isPastDate = (date) => date < todayMidnight();

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    try {
      const res = await validatePromo({
        promoCode: promoInput.trim(),
        subtotal: subtotal || selectedRoomObj?.price || 100,
        roomType: selectedRoomType,
        nights: nights || 1,
      }).unwrap();
      setAppliedPromo(res);
      toast.success(`Promo ${res.code} applied (${res.discountPercent}% off)!`);
    } catch (err) {
      setAppliedPromo(null);
      toast.error(err?.data?.message || "Promo code not valid for this selection");
    }
  };

  const onSubmit = async (values) => {
    try {
      const result = await createBooking({
        hotelId,
        ...values,
        arrivalDate: values.arrivalDate.toISOString(),
        departureDate: values.departureDate.toISOString(),
        promoCode: appliedPromo?.code || "",
        payment: totalPrice,
      }).unwrap();

      setConfirmedOrder({
        booking: result.booking,
        whatsappOrderUrl: result.whatsappOrderUrl,
        totalPrice,
        nights,
        roomName: selectedRoomObj?.name,
      });

      toast.success(`Reservation ${result.booking?.bookingRef || ""} created!`);

      if (values.paymentMethod === "whatsapp" && result.whatsappOrderUrl) {
        window.open(result.whatsappOrderUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Booking failed. Please check your dates.");
    }
  };

  const handleTriggerClick = (e) => {
    if (!isSignedIn) {
      e.preventDefault();
      toast.info("Please sign in to book your stay");
      navigate("/sign-in");
      return;
    }
    setConfirmedOrder(null);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" onClick={handleTriggerClick}>
          Book Now
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-11/12 max-h-[90vh] overflow-y-auto rounded-2xl">
        {confirmedOrder ? (
          <div className="py-6 px-4 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="text-2xl font-bold">Reservation Confirmed!</h3>
            <p className="text-sm text-muted-foreground">
              Reference:{" "}
              <span className="font-mono font-bold text-black">
                {confirmedOrder.booking?.bookingRef}
              </span>
            </p>

            <div className="bg-gray-50 border rounded-xl p-4 text-left text-sm space-y-1.5">
              <p>
                <strong>Hotel:</strong> {hotel?.name}
              </p>
              <p>
                <strong>Room:</strong> {confirmedOrder.roomName} (
                {confirmedOrder.nights} night{confirmedOrder.nights > 1 ? "s" : ""})
              </p>
              <p>
                <strong>Total Amount:</strong>{" "}
                {formatPrice(confirmedOrder.totalPrice)}
              </p>
              <p>
                <strong>Checkout Method:</strong>{" "}
                {confirmedOrder.booking?.paymentMethod === "whatsapp"
                  ? "WhatsApp Store Instant Order"
                  : "Pay at Property"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {confirmedOrder.whatsappOrderUrl && (
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <a
                    href={confirmedOrder.whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Confirm Order on WhatsApp Store
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate("/account");
                }}
              >
                View in My Bookings
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left Column: Live Per-Room Availability Calendar */}
            <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-gray-200 pb-5 md:pb-0 md:pr-5">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Room Availability
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Showing live inventory for{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedRoomObj?.name}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center mt-3 space-y-3">
                <Calendar
                  mode="single"
                  className="rounded-xl border shadow-sm"
                  disabled={(d) => isDateBooked(d) || isPastDate(d)}
                  modifiers={{
                    booked: bookedDates,
                    available: (date) => !isDateBooked(date) && !isPastDate(date),
                    past: isPastDate,
                  }}
                  modifiersClassNames={{
                    booked: "bg-red-600 text-white rounded-full pointer-events-none",
                    available: "bg-emerald-50 text-emerald-800 font-medium rounded-full",
                    past: "text-gray-300 pointer-events-none",
                  }}
                />
                <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-200 inline-block" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                    Sold Out
                  </span>
                </div>

                {/* Promo Codes Hint */}
                <div className="w-full rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> Available Promo Codes:
                  </p>
                  <p>• <strong>STAYLUX10</strong> — 10% off any stay</p>
                  <p>• <strong>WELCOME15</strong> — 15% off Deluxe/Suite</p>
                  <p>• <strong>LUXURY20</strong> — 20% off 4+ nights</p>
                </div>
              </div>
            </div>

            {/* Right Column: Reservation & WhatsApp Store Form */}
            <div className="md:col-span-3">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Book Your Stay — {hotel?.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Reserve instantly and confirm via StayLux WhatsApp Store or Pay on Arrival.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3.5 mt-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="firstName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="First name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="lastName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Last name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              placeholder="you@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp / Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              {...field}
                              placeholder="+94 77 123 4567"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Arrival & Departure */}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="arrivalDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-In</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex justify-between w-full font-normal"
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Select check-in"}
                                <CalendarIcon className="h-4 w-4 opacity-60" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(d) =>
                                  isPastDate(d) ||
                                  isDateBooked(d) ||
                                  (departureDate && d >= departureDate)
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="departureDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check-Out</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex justify-between w-full font-normal"
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Select check-out"}
                                <CalendarIcon className="h-4 w-4 opacity-60" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(d) =>
                                  isPastDate(d) ||
                                  (arrivalDate ? d <= arrivalDate : d <= todayMidnight())
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Room Type & Guest Counts */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField
                      name="roomType"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Category</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              field.onChange(val);
                              setAppliedPromo(null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select room" />
                            </SelectTrigger>
                            <SelectContent>
                              {roomTypes.map((rt) => (
                                <SelectItem key={rt.type} value={rt.type}>
                                  {rt.name} ({formatPrice(rt.price)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="adults"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adults</FormLabel>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(Number(v))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Adults" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num} {num === 1 ? "Adult" : "Adults"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="children"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Children</FormLabel>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(Number(v))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Children" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map((num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num} {num === 1 ? "Child" : "Children"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Promo Code & Checkout Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <FormLabel>Promo Code</FormLabel>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="e.g. STAYLUX10"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isCheckingPromo || !promoInput.trim()}
                          onClick={handleApplyPromo}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    <FormField
                      name="paymentMethod"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Checkout Option</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="whatsapp">
                                WhatsApp Store Checkout (Instant)
                              </SelectItem>
                              <SelectItem value="pay_at_hotel">
                                Pay at Property on Arrival
                              </SelectItem>
                              {PAYHERE_SANDBOX_MERCHANT_ID && (
                                <SelectItem value="payhere_sandbox">
                                  PayHere Sandbox Card Checkout
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="specialRequests"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            {...field}
                            placeholder="Airport pickup, late check-in, dietary preferences..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price Summary & Submit */}
                  <DialogFooter className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
                    <div className="text-left">
                      {nights > 0 ? (
                        <>
                          <p className="text-xs text-muted-foreground">
                            {nights} night{nights > 1 ? "s" : ""} ×{" "}
                            {formatPrice(selectedRoomObj?.price || hotel?.price)}
                            {discountAmount > 0 &&
                              ` − ${formatPrice(discountAmount)} (${appliedPromo?.code})`}
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            Total: {formatPrice(totalPrice)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Select dates to see total ({formatPrice(selectedRoomObj?.price)} / night)
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Close
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {isLoading
                          ? "Reserving..."
                          : form.watch("paymentMethod") === "whatsapp"
                          ? "Reserve via WhatsApp Store"
                          : "Confirm Reservation"}
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
