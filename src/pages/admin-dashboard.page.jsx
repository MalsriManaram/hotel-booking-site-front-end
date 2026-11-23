import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  Building2,
  CalendarCheck2,
  DollarSign,
  Edit3,
  Mail,
  MessageCircle,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  useGetAdminStatsQuery,
  useGetHotelsQuery,
  useDeleteHotelMutation,
  useSyncEmbeddingsMutation,
  useGetAllBookingsQuery,
  useUpdateBookingStatusAdminMutation,
  useGetAllContactsQuery,
  useUpdateContactStatusMutation,
} from "@/lib/api";
import { useCurrency } from "@/lib/currency";
import CreateHotelForm from "@/components/CreateHotelForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminDashboardPage = () => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("overview");
  const [hotelFilter, setHotelFilter] = useState("");
  const [bookingFilter, setBookingFilter] = useState("ALL");
  const [editingHotel, setEditingHotel] = useState(null);

  const { data: stats } = useGetAdminStatsQuery();
  const { data: hotels = [], isLoading: loadingHotels } = useGetHotelsQuery();
  const { data: bookingsData, isLoading: loadingBookings } =
    useGetAllBookingsQuery();
  const { data: contactsData, isLoading: loadingContacts } =
    useGetAllContactsQuery();

  const [deleteHotel] = useDeleteHotelMutation();
  const [syncEmbeddings, { isLoading: isSyncing }] = useSyncEmbeddingsMutation();
  const [updateBookingStatus] = useUpdateBookingStatusAdminMutation();
  const [updateContactStatus] = useUpdateContactStatusMutation();

  const bookings = bookingsData?.bookings || [];
  const contacts = contactsData?.contacts || [];

  const handleSyncVectors = async () => {
    try {
      const res = await syncEmbeddings().unwrap();
      toast.success(res.message || "AI embeddings synced!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to sync embeddings");
    }
  };

  const handleDeleteHotel = async (id, name) => {
    try {
      await deleteHotel(id).unwrap();
      toast.success(`Deleted ${name}`);
    } catch {
      toast.error("Failed to delete hotel");
    }
  };

  const handleBookingChange = async (id, patch) => {
    try {
      await updateBookingStatus({ id, ...patch }).unwrap();
      toast.success("Booking updated");
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const handleToggleContact = async (contact) => {
    const next = contact.status === "resolved" ? "unread" : "resolved";
    try {
      await updateContactStatus({ id: contact._id, status: next }).unwrap();
      toast.success(`Marked inquiry as ${next}`);
    } catch {
      toast.error("Failed to update inquiry");
    }
  };

  const filteredHotels = hotels.filter(
    (h) =>
      h.name?.toLowerCase().includes(hotelFilter.toLowerCase()) ||
      h.location?.toLowerCase().includes(hotelFilter.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "ALL") return true;
    if (bookingFilter === "Pending_WhatsApp") {
      return b.paymentStatus === "Pending_WhatsApp" && b.status !== "Canceled";
    }
    return b.status === bookingFilter;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            StayLux Admin Control Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage properties, WhatsApp Store reservations, AI vector search, and guest inquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleSyncVectors}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing..." : "Re-Sync AI Vectors"}
          </Button>
          <Button asChild className="gap-2">
            <Link to="/hotels/create">
              <Plus className="h-4 w-4" /> Add New Hotel
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Confirmed Revenue
              </p>
              <p className="text-2xl font-bold mt-1">
                {formatPrice(stats?.totalRevenue || 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Reservations
              </p>
              <p className="text-2xl font-bold mt-1">
                {stats?.totalBookings ?? bookings.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats?.whatsappPendingCount || 0} awaiting WhatsApp confirm
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Listed Properties
              </p>
              <p className="text-2xl font-bold mt-1">
                {stats?.hotelsCount ?? hotels.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Unread Inquiries
              </p>
              <p className="text-2xl font-bold mt-1">
                {stats?.unreadContactsCount ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
              <Mail className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {[
          { id: "overview", label: `Reservations & WhatsApp Orders (${bookings.length})` },
          { id: "hotels", label: `Properties (${hotels.length})` },
          { id: "contacts", label: `Contact Inquiries (${contacts.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Bookings & WhatsApp Store Orders */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "ALL", label: "All Bookings" },
              { key: "Pending_WhatsApp", label: "WhatsApp Store Pending" },
              { key: "Ongoing", label: "Upcoming / Ongoing" },
              { key: "Completed", label: "Completed" },
              { key: "Canceled", label: "Canceled" },
            ].map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={bookingFilter === f.key ? "default" : "outline"}
                onClick={() => setBookingFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {loadingBookings ? (
            <p className="text-sm text-muted-foreground">Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <Card className="p-8 text-center rounded-2xl border-dashed">
              <p className="text-muted-foreground">No bookings in this filter.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => {
                const guestPhone = (b.phone || "").replace(/[^0-9]/g, "");
                const replyGuestWa = guestPhone
                  ? `https://wa.me/${guestPhone}?text=${encodeURIComponent(
                      `Hello ${b.firstName}! Your StayLux booking (${
                        b.bookingRef || b._id
                      }) at ${
                        b.hotelId?.name || "our property"
                      } is confirmed. Let us know if you need anything before check-in!`
                    )}`
                  : null;

                return (
                  <Card key={b._id} className="rounded-2xl shadow-sm">
                    <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded font-semibold">
                            {b.bookingRef || b._id.slice(-6)}
                          </span>
                          <span className="font-bold text-base">
                            {b.hotelId?.name || "Deleted Property"}
                          </span>
                          <Badge variant="outline" className="capitalize">
                            {b.roomType}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          Guest: <strong>{b.firstName} {b.lastName}</strong> •{" "}
                          {b.email} • {b.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(b.arrivalDate).toLocaleDateString()} →{" "}
                          {new Date(b.departureDate).toLocaleDateString()} •{" "}
                          {b.adults} Adults, {b.children} Children • Total:{" "}
                          <strong className="text-gray-900">
                            {formatPrice(b.payment)}
                          </strong>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {replyGuestWa && (
                          <Button
                            size="sm"
                            asChild
                            className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                          >
                            <a
                              href={replyGuestWa}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              Message Guest
                            </a>
                          </Button>
                        )}

                        <Select
                          value={b.paymentStatus || "Pending_WhatsApp"}
                          onValueChange={(val) =>
                            handleBookingChange(b._id, { paymentStatus: val })
                          }
                        >
                          <SelectTrigger className="w-44 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending_WhatsApp">
                              Pending WhatsApp
                            </SelectItem>
                            <SelectItem value="Pay_At_Hotel">
                              Pay at Hotel
                            </SelectItem>
                            <SelectItem value="Paid">Paid / Verified</SelectItem>
                            <SelectItem value="Refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={b.status}
                          onValueChange={(val) =>
                            handleBookingChange(b._id, { status: val })
                          }
                        >
                          <SelectTrigger className="w-36 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Hotels Management */}
      {activeTab === "hotels" && (
        <div className="space-y-4">
          <Input
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
            placeholder="Search hotels by name or destination..."
            className="max-w-md"
          />

          {loadingHotels ? (
            <p className="text-sm text-muted-foreground">Loading properties...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHotels.map((hotel) => (
                <Card key={hotel._id} className="rounded-2xl overflow-hidden">
                  <CardContent className="p-4 flex gap-4 items-center">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-base truncate">
                        {hotel.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {hotel.location}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatPrice(hotel.price)} / night •{" "}
                        {hotel.rating || "New"}★
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingHotel(hotel)}
                        className="gap-1"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="gap-1">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete {hotel.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently removes the hotel listing and its AI search vector.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteHotel(hotel._id, hotel.name)
                              }
                            >
                              Delete Hotel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Property Modal */}
          <Dialog
            open={Boolean(editingHotel)}
            onOpenChange={(open) => !open && setEditingHotel(null)}
          >
            <DialogContent className="max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Property — {editingHotel?.name}</DialogTitle>
              </DialogHeader>
              {editingHotel && (
                <CreateHotelForm
                  initialData={editingHotel}
                  onSuccess={() => setEditingHotel(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* TAB 3: Customer Contact Inquiries */}
      {activeTab === "contacts" && (
        <div className="space-y-3">
          {loadingContacts ? (
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          ) : contacts.length === 0 ? (
            <Card className="p-8 text-center rounded-2xl border-dashed">
              <p className="text-muted-foreground">No customer inquiries yet.</p>
            </Card>
          ) : (
            contacts.map((c) => (
              <Card key={c._id} className="rounded-2xl">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({c.email})
                      </span>
                      <Badge
                        variant={c.status === "resolved" ? "secondary" : "default"}
                      >
                        {c.status || "unread"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{c.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`mailto:${c.email}?subject=Re: Your StayLux Inquiry`}
                      >
                        Reply via Email
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleToggleContact(c)}
                    >
                      {c.status === "resolved" ? "Mark Unread" : "Mark Resolved"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </main>
  );
};

export default AdminDashboardPage;
