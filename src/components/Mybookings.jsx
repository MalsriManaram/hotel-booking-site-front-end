import { Link } from "react-router";
import {
  useGetBookingsbyUserIdQuery,
  useCancelBookingMutation,
} from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/clerk-react";
import { FaMapMarkerAlt, FaBed, FaWhatsapp } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { Printer, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MyBookings = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { formatPrice } = useCurrency();

  const { data, isLoading } = useGetBookingsbyUserIdQuery(userId, {
    skip: !userId,
  });
  const [cancelBooking, { isLoading: isCanceling }] = useCancelBookingMutation();

  const bookings = data?.bookings || [];

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking({ bookingId, userId }).unwrap();
      toast.success("Booking canceled successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel booking");
    }
  };

  const handlePrintVoucher = (booking) => {
    const win = window.open("", "_blank", "width=720,height=680");
    if (!win) return;
    const hotelName = booking?.hotelId?.name || "StayLux Property";
    const hotelLoc = booking?.hotelId?.location || "";
    win.document.write(`
      <html>
        <head>
          <title>StayLux Booking Voucher - ${booking.bookingRef || booking._id}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 32px; color: #111827; }
            .box { border: 2px solid #111827; border-radius: 14px; padding: 24px; }
            h1 { margin: 0 0 4px; }
            .muted { color: #6b7280; font-size: 14px; }
            .row { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>StayLux Reservation Voucher</h1>
            <p class="muted">Reference: ${booking.bookingRef || booking._id}</p>
            <hr />
            <div class="row"><strong>Property:</strong> ${hotelName} (${hotelLoc})</div>
            <div class="row"><strong>Guest:</strong> ${booking.firstName} ${booking.lastName} (${booking.email})</div>
            <div class="row"><strong>Room Category:</strong> ${booking.roomType?.toUpperCase()}</div>
            <div class="row"><strong>Guests:</strong> ${booking.adults} Adults, ${booking.children} Children</div>
            <div class="row"><strong>Check-In:</strong> ${new Date(booking.arrivalDate).toDateString()}</div>
            <div class="row"><strong>Check-Out:</strong> ${new Date(booking.departureDate).toDateString()}</div>
            <div class="row"><strong>Total Amount:</strong> $${booking.payment} USD</div>
            <div class="row"><strong>Status:</strong> ${booking.status} (${booking.paymentStatus || "Confirmed"})</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const categorizedBookings = {
    Ongoing: [],
    Completed: [],
    Canceled: [],
  };

  bookings.forEach((booking) => {
    if (booking.status === "Ongoing") {
      categorizedBookings.Ongoing.push(booking);
    } else if (booking.status === "Completed") {
      categorizedBookings.Completed.push(booking);
    } else {
      categorizedBookings.Canceled.push(booking);
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6 py-4">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {["Ongoing", "Completed", "Canceled"].map((status) => (
        <div key={status}>
          <h3 className="text-xl font-bold mb-3">
            {status === "Ongoing" ? "Upcoming & Active" : status} Bookings (
            {categorizedBookings[status].length})
          </h3>
          {categorizedBookings[status].length === 0 ? (
            <Card className="rounded-2xl px-6 py-8 bg-gray-50/70 border-dashed text-center">
              <p className="text-muted-foreground">
                No {status.toLowerCase()} bookings yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-5">
              {categorizedBookings[status].map((booking) => {
                const nights =
                  booking?.arrivalDate && booking?.departureDate
                    ? Math.max(
                        1,
                        Math.round(
                          (new Date(booking.departureDate) -
                            new Date(booking.arrivalDate)) /
                            86_400_000
                        )
                      )
                    : 1;

                return (
                  <Card
                    key={booking._id}
                    className="grid grid-cols-1 md:grid-cols-5 shadow-md rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow"
                  >
                    <div className="md:col-span-2 relative min-h-[200px]">
                      <img
                        src={booking?.hotelId?.image || "/assets/hero/hero.jpg"}
                        alt={booking?.hotelId?.name || "Hotel"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/hero/hero.jpg";
                        }}
                        className="w-full h-full object-cover"
                      />
                      {booking.bookingRef && (
                        <span className="absolute top-3 left-3 bg-black/80 text-white text-xs font-mono px-2.5 py-1 rounded-md">
                          {booking.bookingRef}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-3 p-6 flex flex-col justify-between space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold">
                            {booking?.hotelId ? (
                              <Link
                                to={`/hotels/${booking.hotelId._id}`}
                                className="hover:text-amber-600 transition-colors"
                              >
                                {booking.hotelId.name}
                              </Link>
                            ) : (
                              "StayLux Property"
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <FaMapMarkerAlt />
                            {booking?.hotelId?.location || "Destination"}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1.5 capitalize">
                            <FaBed /> {booking.roomType} Room • {booking.adults}{" "}
                            Adults, {booking.children} Children ({nights} night
                            {nights > 1 ? "s" : ""})
                          </p>
                          {booking.specialRequests && (
                            <p className="text-xs text-gray-500 pt-1 line-clamp-2">
                              <strong>Note:</strong> {booking.specialRequests}
                            </p>
                          )}
                        </div>

                        <div className="text-sm bg-gray-50 border rounded-xl px-3.5 py-2.5 space-y-1 shrink-0">
                          <p className="flex items-center gap-1.5 font-medium">
                            <MdDateRange /> Check-In:{" "}
                            {new Date(booking.arrivalDate).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-1.5 font-medium">
                            <MdDateRange /> Check-Out:{" "}
                            {new Date(booking.departureDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl font-bold">
                            {formatPrice(booking.payment)}
                          </span>
                          {booking.promoCode && (
                            <Badge variant="secondary" className="text-xs">
                              Promo: {booking.promoCode}
                            </Badge>
                          )}
                          <Badge
                            className={
                              booking.status === "Ongoing"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : booking.status === "Canceled"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {booking.status === "Ongoing"
                              ? "Upcoming"
                              : booking.status}
                          </Badge>
                          {booking.paymentStatus && (
                            <Badge variant="outline" className="text-xs">
                              {booking.paymentStatus.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintVoucher(booking)}
                            className="gap-1.5"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            Voucher
                          </Button>

                          {booking.whatsappOrderUrl &&
                            booking.status !== "Canceled" && (
                              <Button
                                size="sm"
                                asChild
                                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                              >
                                <a
                                  href={booking.whatsappOrderUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaWhatsapp className="h-4 w-4" />
                                  WhatsApp Store
                                </a>
                              </Button>
                            )}

                          {booking?.hotelId?._id &&
                            booking.status !== "Canceled" && (
                              <Button size="sm" variant="secondary" asChild>
                                <Link
                                  to={`/hotels/${booking.hotelId._id}#reviews`}
                                  className="gap-1"
                                >
                                  <Star className="h-3.5 w-3.5" />
                                  Review
                                </Link>
                              </Button>
                            )}

                          {booking.status === "Ongoing" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={isCanceling}
                                >
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel reservation {booking.bookingRef || ""}?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Your reserved dates for{" "}
                                    {booking?.hotelId?.name || "this property"}{" "}
                                    will be released immediately.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Keep Booking
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancel(booking._id)}
                                  >
                                    Yes, Cancel Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
