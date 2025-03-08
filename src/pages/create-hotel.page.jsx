import { useCreateHotelMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateHotelPage() {

    const [createHotel, { isLoading, isError, error }] = useCreateHotelMutation();


    const handleClick = async () => {

        try {
            toast.loading("Creating hotel...");
            await createHotel({
                name: "Loire Luxury Lodge", 
                location: "Sydney, Australia",
                rating: 4.9,
                reviews: 985,
                image:
                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
                price: 350,
                description:
                "Overlooking Sydney Harbour, Loire Luxury Lodge provides unmatched waterfront views and a vibrant city experience. From $350 per night, relax in modern luxury while enjoying proximity to Sydney Opera House and Bondi Beach. Whether you’re seeking adventure or relaxation, this hotel offers a harmonious blend of urban excitement and tranquil sophistication.",
            }).unwrap();
            toast.success("Hotel created successfully");
        } catch (error) {

            toast.error("Failed to create hotel");
        }

        // createHotel({
        //     name: "Loire Luxury Lodge", 
        //     location: "Sydney, Australia",
        //     rating: 4.9,
        //     reviews: 985,
        //     image:
        //     "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
        //     price: 350,
        //     description:
        //     "Overlooking Sydney Harbour, Loire Luxury Lodge provides unmatched waterfront views and a vibrant city experience. From $350 per night, relax in modern luxury while enjoying proximity to Sydney Opera House and Bondi Beach. Whether you’re seeking adventure or relaxation, this hotel offers a harmonious blend of urban excitement and tranquil sophistication.",
        // });
    };

    return ( 
        <main className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl font-bold">Create a Hotel</h1>
            <div className="mt-8">
                <Button onClick={handleClick}>Create Hotel</Button>
            </div>
        </main>
     );
};
