import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateHotelMutation } from "@/lib/api";

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

// --- Validation schema ---
const formSchema = z.object({
  name: z.string().min(1, { message: "Hotel name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  // image is a string that can be either a URL or a base64 payload
  image: z
    .string()
    .min(1, { message: "Image (URL or uploaded file) is required" }),
  price: z.preprocess((val) => {
    // Accept numbers OR strings from the input
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(/[^0-9.-]+/g, ""));
      return Number.isFinite(parsed) ? parsed : NaN;
    }
    return val;
  }, z.number({ invalid_type_error: "Price must be a number" }).min(0, { message: "Price must be >= 0" })),
  description: z.string().min(1, { message: "Description is required" }),
});

const CreateHotelForm = () => {
  const [createHotel, { isLoading }] = useCreateHotelMutation();
  const [previewSrc, setPreviewSrc] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      image: "",
      price: "",
      description: "",
    },
    mode: "onTouched",
  });

  const { setValue, watch, reset } = form;

  // Keep preview in sync when user types an image URL
  const watchedImage = watch("image");
  React.useEffect(() => {
    if (!watchedImage) {
      setPreviewSrc("");
      return;
    }

    // if it looks like a data URL or http url, show it
    if (/^data:|^https?:\/\//i.test(watchedImage)) {
      setPreviewSrc(watchedImage);
      return;
    }

    // otherwise clear preview (backend might accept other token strings)
    setPreviewSrc("");
  }, [watchedImage]);

  // Convert chosen file to base64 and set as image value
  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setValue("image", result, { shouldValidate: true, shouldDirty: true });
        setPreviewSrc(result);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values) => {
    try {
      const toastId = toast.loading("Creating hotel...");
      await createHotel(values).unwrap();
      toast.success("Hotel created successfully", { id: toastId });
      reset();
      setPreviewSrc("");
    } catch (err) {
      // If your API returns a structured error you can extract message here
      toast.error("Failed to create hotel");
    }
  };

  return (
    <main className="max-w-8xl  py-3 px-6">
      <p className="text-sm text-muted-foreground mb-6">
        Add hotel details below to create a new hotel listing.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 md:grid-cols-2"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hotel name"
                      {...field}
                      aria-invalid={!!form.formState.errors.name}
                    />
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City, area or address"
                      {...field}
                      aria-invalid={!!form.formState.errors.location}
                    />
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                        LKR
                      </span>
                      <Input
                        {...field}
                        inputMode="decimal"
                        placeholder="0.00"
                        className="pl-12"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-invalid={!!form.formState.errors.price}
                      />
                    </div>
                  </FormControl>
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
                      placeholder="Short description about the hotel"
                      {...field}
                      aria-invalid={!!form.formState.errors.description}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image (URL)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        {...field}
                        aria-invalid={!!form.formState.errors.image}
                      />
                      <label className="inline-flex items-center px-3 py-2 bg-white border rounded cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange(file);
                          }}
                        />
                        <span className="text-sm">Upload</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2">
              <div className="rounded border p-3 flex items-center gap-3">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="preview"
                    className="h-64 w-64 object-cover rounded"
                  />
                ) : (
                  <div className="h-64 w-64 rounded bg-muted flex items-center justify-center text-sm">
                    Preview
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Here’s the preview of the image you added.
                </div>
              </div>
            </div>{" "}
            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || form.formState.isSubmitting}
              >
                {isLoading || form.formState.isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Hotel"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default CreateHotelForm;
