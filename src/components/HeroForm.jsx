import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateHotelMutation } from "@/lib/api";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

 
const formSchema = z.object({
  description: z.string().min(1, { message: "Your description is required" }),
  rating: z.number().min(1, { message: "Rating is required" }).max(5, { message: "Rating cannot be more than 5" }),
  location: z.string().min(1, { message: "Location is required" }),
  price: z.number().min(1, { message: "Price must be at least 1" }),
});


const HeroForm = () => {

    const [createHotel, { isLoading }] = useCreateHotelMutation();

    const form = useForm ({
            resolver: zodResolver(formSchema),
        });

    const handleSubmit = async (values) => {
        const { description, rating, location, price } = values;
        try {
            toast.loading("Creating hotel...");
            await createHotel({
                description,
                rating,
                location,
                price,
            }).unwrap();
            toast.success("Hotel created successfully");
        } catch (error) {
            toast.error("Failed to create hotel");
        }
    };

    return (
        <main>
            <Form {...form} >
                <form action="" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid md:grid-flow-col md:grid-rows-1 gap-4 items-center p-5 mt-40 md:mt-8 md:mb-20 lg:mb-12 w-full max-w-7xl min-w-[350px] h-fit md:h-32 bg-gray-100 drop-shadow-xl">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input 
                                 className="h-12 lg:w-96 lg:text-lg text-black placeholder:text-gray-500 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
                                 placeholder="What kind of hotel are you looking for?" {...field} />
                            </FormControl>
                            <FormMessage className="md:absolute md:ml-2" />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="rating"
                        
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input type="number" placeholder="Hotel rating"
                                        step="0.01"
                                        max="5"
                                        className="h-12 lg:text-lg text-black placeholder:text-gray-500 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
                                        onChange={(e) => {
                                        field.onChange(parseFloat(e.target.value));
                                    }} 
                                    value={field.value}
                                />
                            </FormControl>
                            <FormMessage className="md:absolute md:ml-2" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input placeholder="Hotel location"
                                 className=" h-12 lg:text-lg text-black placeholder:text-gray-500 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
                                 {...field} />
                            </FormControl>
                            <FormMessage className="md:absolute md:ml-2" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input type="number" placeholder="Price per night"
                                    step="0.01"
                                    className="h-12 lg:text-lg text-black placeholder:text-gray-500 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
                                    onChange={(e) => {
                                    field.onChange(parseFloat(e.target.value));
                                }} 
                                value={field.value}
                                />
                            </FormControl>
                            <FormMessage className="md:absolute md:ml-2" />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="rounded-md w-full md:w-44 gap-x-2 lg:h-12"
                    >
                        <Sparkles
                        style={{ width: "20px", height: "20px" }}
                        className="mr-2 animate-pulse text-sky-400"
                        />
                        <span className="lg:text-lg">AI Search</span>
                    </Button>
                
                    </div>

                </form>
            </Form>
        </main>
    );
};

export default HeroForm;