import { useEffect, useState } from 'react';
import { useGetBookingsbyUserIdQuery, useCancelBookingMutation } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { useUser } from "@clerk/clerk-react";
import { FaMapMarkerAlt, FaBed } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MyBookings = () => {

    const { user } = useUser();

    const userId = user?.id;

    const { data, isLoading } = useGetBookingsbyUserIdQuery(userId);
    const [cancelBooking] = useCancelBookingMutation();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);


    useEffect(() => {
        if (data) {
            setBookings(data.bookings || []);
        }
    }, [data]);

    const handleCancel = async (values) => {
        try {
            const {bookingId, userId} = values;

            await cancelBooking({
                bookingId,
                userId
            });

        window.location.reload();


            toast.success('Booking cancelled successfully');
        } catch (error) {
            toast.error("Failed to cancel the Booking");
        }
    };

    const categorizedBookings = {
        Ongoing: [],
        Completed: [],
        Canceled: []
    };

    bookings?.forEach(booking  => {
        if (booking.status === 'Ongoing') {
            categorizedBookings.Ongoing.push(booking);
        } else if (booking.status === 'Completed') {
            categorizedBookings.Completed.push(booking);
        } else {
            categorizedBookings.Canceled.push(booking);
        }
    });

    if (isLoading) {

        return (
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <h2 className="text-2xl font-bold text-center md:text-left mb-5">
                    My Bookings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Skeleton for Booking Cards */}
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-40 w-full rounded-lg" />
                    </div>
                    <div className="space-y-6">
                        {/* Skeleton for Additional Booking Details */}
                        <Skeleton className="h-12 w-3/4 rounded-lg" />
                        <Skeleton className="h-12 w-3/4 rounded-lg" />
                        <Skeleton className="h-12 w-3/4 rounded-lg" />
                        <Skeleton className="h-12 w-1/2 rounded-lg" />
                    </div>
                </div>
            </div>

        );
    };



    return (
        <div className="mx-4 my-5">
            <h2 className="text-2xl font-bold text-center md:text-left mb-5">My Bookings</h2>
            <div className="grid grid-row-3 ml-3">
                {['Ongoing', 'Completed', 'Canceled'].map((status) => (
                    <div key={status}>
                        <h3 className="text-lg font-semibold  mb-3">{status.charAt(0) + status.slice(1)} Bookings</h3>
                        {categorizedBookings[status].length === 0 ? (
                            <Card  className="shadow-lg rounded-2xl px-5 py-8 mb-4">
                                <p className="text-muted-foreground">No {status} bookings</p>
                            </Card>
                        ) : (
                            categorizedBookings[status].map((booking) => (
                                <Card 
                                    key={booking._id} 
                                    className="my-5 grid grid-cols-1 md:grid-cols-5 shadow-lg rounded-2xl w-full h-fit max-h-lg overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300 relative"
                                >
                                    <div className="col-span-2">
                                        <img 
                                            src={booking?.hotelId?.image || "/assets/hero/hero.jpg"} 
                                            alt={booking?.hotelId?.name || "Hotel"} 
                                            className="w-fit h-0 md:h-fit object-cover"
                                        />
                                    </div>
                                    <div className="col-span-3 p-6 w-full h-full">
                                        <div className="lg:space-y-1">
                                            <h3 className="text-2xl font-bold">{booking?.hotelId?.name ?? "Hotel Name"}</h3>
                                            <p className="text-gray-500 flex items-center ml-2"><FaMapMarkerAlt className="mr-2" /> {booking?.hotelId?.location ?? "Location"}</p>
                                            <p className="text-gray-500 flex items-center ml-2"><FaBed className="mr-2 ml-1" /> {booking?.roomType ?? "Room Type"}</p>
                                            <p className="text-gray-500 ml-2">Guests: {booking?.adults ?? "0"} Adults, {booking?.children ?? "0"} Children</p>
                                            <p className="text-gray-500 ml-2">
                                                Total Nights: {booking?.arrivalDate && booking?.departureDate ? ( 
                                                    Math.floor((new Date(booking?.departureDate) - new Date(booking?.arrivalDate)) / (1000 * 3600 * 24)) ) : ('Dates unavailable')}
                                            </p>
                                            <p className="text-gray-500 ml-2">
                                                Special Requests: {booking?.specialRequests 
                                                    ? booking.specialRequests.split(' ').slice(0, 20).join(' ') + (booking.specialRequests.split(' ').length > 20 ? '...' : '') 
                                                    : "None"}
                                            </p>
                                            <p className="text-black text-xl font-semibold lg:pt-4">Payment: <span className="font-semibold">${booking?.payment ?? "N/A"}</span></p>
                                            <p className="text-gray-400 text-sm pb-4">Booking ID: {booking?._id ?? "N/A"}</p>

                                            <div className="lg:absolute lg:top-6 lg:right-8 lg:ml-2 text-right border-t-2 border-gray-300 pt-3 md:border-t-0">
                                                <p className="text-black text-lg flex items-center  lg:mb-2"><MdDateRange className="mr-2" /> Arrival: {new Date(booking?.arrivalDate).toLocaleDateString()} </p>
                                                <p className="text-black text-lg flex items-center  lg:mb-2"><MdDateRange className="mr-2" /> Depart: {new Date(booking?.departureDate).toLocaleDateString()}</p>
                                            </div>

                                            <div className="pt-3 md:pt-6 flex justify-end gap-2">
                                                <span className={`px-3 py-1 rounded-lg ${
                                                    booking?.status === 'Ongoing' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : booking?.status === 'Canceled' 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : booking?.status === 'Completed' 
                                                        ? 'bg-gray-100 text-gray-700' 
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {booking?.status === 'Ongoing' 
                                                        ? 'Upcoming' 
                                                        : booking?.status === 'Canceled' 
                                                        ? 'Canceled' 
                                                        : booking?.status === 'Completed' 
                                                        ? 'Completed' 
                                                        : 'Unknown'}
                                                </span>
                                                {booking?.status === 'Ongoing' && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger>
                                                            <Button onClick={() => setSelectedBooking(booking)}>Cancel</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                Are you sure you want to cancel this booking?
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogAction onClick={() => handleCancel({bookingId: booking?._id, userId: booking?.userId})}>Yes, Cancel</AlertDialogAction>
                                                                <AlertDialogCancel variant="secondary">No</AlertDialogCancel>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBookings;
