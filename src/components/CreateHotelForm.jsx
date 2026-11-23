import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { useCreateHotelMutation, useUpdateHotelMutation } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AVAILABLE_AMENITIES = [
  "Free Wi-Fi",
  "Restaurant",
  "Swimming Pool",
  "Spa & Wellness",
  "Fitness Center",
  "Airport Shuttle",
  "Free Parking",
  "Air Conditioning",
  "Rooftop Bar",
  "Beach Access",
  "Flat-screen TV",
  "Coffee maker",
];

const formSchema = z.object({
  name: z.string().min(1, { message: "Hotel name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  image: z.string().min(1, { message: "Cover image is required" }),
  price: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(/[^0-9.-]+/g, ""));
      return Number.isFinite(parsed) ? parsed : NaN;
    }
    return val;
  }, z.number({ invalid_type_error: "Price must be a number" }).min(1, { message: "Price must be at least $1" })),
  description: z.string().min(5, { message: "Description is required" }),
  checkIn: z.string().default("14:00"),
  checkOut: z.string().default("11:00"),
  freeCancellationHours: z.coerce.number().min(0).default(48),
});

function compressImageFile(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const CreateHotelForm = ({ initialData = null, onSuccess }) => {
  const isEditMode = Boolean(initialData?._id);
  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();
  const isSaving = isCreating || isUpdating;

  const [previewSrc, setPreviewSrc] = useState(initialData?.image || "");
  const [selectedAmenities, setSelectedAmenities] = useState(
    initialData?.amenities?.length
      ? initialData.amenities
      : ["Free Wi-Fi", "Restaurant", "Flat-screen TV", "Coffee maker", "Air Conditioning"]
  );
  const [extraImages, setExtraImages] = useState(
    (initialData?.images || []).filter((u) => u && u !== initialData?.image)
  );
  const [extraImageInput, setExtraImageInput] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      location: initialData?.location || "",
      image: initialData?.image || "",
      price: initialData?.price ?? "",
      description: initialData?.description || "",
      checkIn: initialData?.policies?.checkIn || "14:00",
      checkOut: initialData?.policies?.checkOut || "11:00",
      freeCancellationHours: initialData?.policies?.freeCancellationHours ?? 48,
    },
    mode: "onTouched",
  });

  const { setValue, watch, reset } = form;
  const watchedImage = watch("image");

  useEffect(() => {
    if (!watchedImage) {
      setPreviewSrc("");
      return;
    }
    if (/^data:|^https?:\/\//i.test(watchedImage)) {
      setPreviewSrc(watchedImage);
    } else {
      setPreviewSrc("");
    }
  }, [watchedImage]);

  const handleFileChange = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setValue("image", dataUrl, { shouldValidate: true, shouldDirty: true });
      setPreviewSrc(dataUrl);
    } catch {
      toast.error("Failed to process image file");
    }
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addExtraImage = () => {
    const trimmed = extraImageInput.trim();
    if (!trimmed) return;
    if (!extraImages.includes(trimmed)) {
      setExtraImages((prev) => [...prev, trimmed]);
    }
    setExtraImageInput("");
  };

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      location: values.location,
      image: values.image,
      images: [values.image, ...extraImages],
      price: Number(values.price),
      description: values.description,
      amenities: selectedAmenities,
      policies: {
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        freeCancellationHours: Number(values.freeCancellationHours),
      },
    };

    const toastId = toast.loading(
      isEditMode ? "Updating hotel..." : "Creating hotel..."
    );
    try {
      if (isEditMode) {
        await updateHotel({ id: initialData._id, ...payload }).unwrap();
        toast.success("Hotel updated successfully", { id: toastId });
      } else {
        await createHotel(payload).unwrap();
        toast.success("Hotel created & indexed for AI search", { id: toastId });
        reset();
        setPreviewSrc("");
        setExtraImages([]);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save hotel", {
        id: toastId,
      });
    }
  };

  return (
    <div className="py-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cinnamon Grand Luxe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (City, Country)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Colombo, Sri Lanka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Base Rate (USD / Night)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                        USD $
                      </span>
                      <Input
                        {...field}
                        inputMode="decimal"
                        placeholder="180"
                        className="pl-16"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Double, Deluxe, and Suite rates scale automatically from this base rate, and guests can view prices in USD, LKR, EUR, AUD, or JPY.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe the atmosphere, views, nearby attractions, and signature experiences..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Policies */}
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-In</FormLabel>
                    <FormControl>
                      <Input placeholder="14:00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-Out</FormLabel>
                    <FormControl>
                      <Input placeholder="11:00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="freeCancellationHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Cancel (hrs)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Amenities */}
            <div>
              <FormLabel className="block mb-2">Amenities</FormLabel>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_AMENITIES.map((am) => {
                  const selected = selectedAmenities.includes(am);
                  return (
                    <button
                      key={am}
                      type="button"
                      onClick={() => toggleAmenity(am)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        selected
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {selected ? `✓ ${am}` : am}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Cover Image + Gallery */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image (URL or File Upload)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/hotel-cover.jpg"
                        {...field}
                      />
                      <label className="inline-flex items-center px-3 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50 shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange(file);
                          }}
                        />
                        <span className="text-sm font-medium">Upload</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-xl border p-3 flex items-center gap-4 bg-gray-50/60">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Cover preview"
                  className="h-44 w-56 object-cover rounded-lg shrink-0"
                />
              ) : (
                <div className="h-44 w-56 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground shrink-0">
                  Cover Preview
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Uploaded photos are automatically optimized for fast loading.
              </p>
            </div>

            {/* Extra Gallery Images */}
            <div>
              <FormLabel className="block mb-1.5">
                Additional Gallery Image URLs (Optional)
              </FormLabel>
              <div className="flex gap-2">
                <Input
                  value={extraImageInput}
                  onChange={(e) => setExtraImageInput(e.target.value)}
                  placeholder="https://example.com/room-photo.jpg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExtraImage}
                  className="gap-1 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              {extraImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {extraImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-16 rounded-lg overflow-hidden border group"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExtraImages((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute top-1 right-1 bg-black/75 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSaving} className="px-6">
                {isSaving
                  ? "Saving..."
                  : isEditMode
                  ? "Save Changes"
                  : "Create Hotel"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateHotelForm;
