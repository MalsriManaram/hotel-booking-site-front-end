import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateHotelMutation } from "@/lib/api";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

 
const formSchema = z.object({
  name: z.string().min(1, { message: "Hotel name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  image: z.string().min(1, { message: "Image is required" }),
  price: z.number(),
  description: z.string().min(1, { message: "Description is required" }),
});


const CreateHotelForm = () => {

    const [createHotel, { isLoading }] = useCreateHotelMutation();

    const form = useForm ({
            resolver: zodResolver(formSchema),
        });

    const handleSubmit = async (values) => {
        const { name, location, image, price, description } = values;
        // console.log(values);
        try {
            toast.loading("Creating hotel...");
            await createHotel({
                name, 
                location,
                image,
                price,
                description,
            }).unwrap();
            toast.success("Hotel created successfully");
        } catch (error) {
            toast.error("Failed to create hotel");
        }
    };

    return (
        <main>
            <Form {...form} >
                <form action="" className="w-1/2" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Hotel name</FormLabel>
                            <FormControl>
                                <Input placeholder="Hotel Name" {...field} />
                            </FormControl>
                            {/* <FormDescription> Enter the name of the hotel </FormDescription> */}
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
                                <Input placeholder="Location" {...field} />
                            </FormControl>
                            {/* <FormDescription> Enter the Hotel Location </FormDescription> */}
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input placeholder="Image" {...field} />
                            </FormControl>
                            {/* <FormDescription> Enter the Image </FormDescription> */}
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
                                <Input type="number" placeholder="Price" onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value));
                                }} 
                                value={field.value}
                                />
                            </FormControl>
                            {/* <FormDescription> Enter the Price </FormDescription> */}
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
                                <Textarea placeholder="Description" {...field} />
                            </FormControl>
                            {/* <FormDescription> Enter the Description </FormDescription> */}
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                <div className="mt-4"> 
                    <Button type="submit">Create Hotel</Button>
                </div>
                </form>
            </Form>
        </main>
    );
};

export default CreateHotelForm;