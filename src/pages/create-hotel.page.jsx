import CreateHotelForm from "@/components/CreateHotelForm";
import { motion } from "framer-motion";

export default function CreateHotelPage() {

    return ( 
        <motion.main
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">Create a Hotel</h1>
            <CreateHotelForm />
        </motion.main>
     );
};


// manual way of creating a creating a form 



// const [createHotel, { isLoading, isError, error }] = useCreateHotelMutation();
// const [name, setName] = useState("");
// const [errors, setErrors] = useState({name: ""});


// const handleSubmit = async (e) => {

//     try {
//         e.preventDefault();
//         if (name.length === 0) {
//             setErrors({name: "Name is required"});
//             return;
//         }
//         console.log(name);
//         // toast.loading("Creating hotel...");
//         // await createHotel({
//         //     name: "Loire Luxury Lodge", 
//         //     location: "Sydney, Australia",
//         //     image:
//         //     "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
//         //     price: 350,
//         //     description:
//         //     "Overlooking Sydney Harbour, Loire Luxury Lodge provides unmatched waterfront views and a vibrant city experience. From $350 per night, relax in modern luxury while enjoying proximity to Sydney Opera House and Bondi Beach. Whether you’re seeking adventure or relaxation, this hotel offers a harmonious blend of urban excitement and tranquil sophistication.",
//         // }).unwrap();
//         // toast.success("Hotel created successfully");
//     } catch (error) {

//         // toast.error("Failed to create hotel");
//     }
// };



// return ( 
//     <main className="container mx-auto px-4 py-8 min-h-screen">
//         <h1 className="text-2xl md:text-4xl font-bold mb-4">Create a Hotel</h1>
//         <form action=""onSubmit={handleSubmit}>
//             <div>
//                 <label htmlFor="name">Name</label>
//                 <Input type="text"id="name" value={name} placeholder="Enter hotel name"
//                     onChange={(e) => {setName(e.target.value);
//                         if (e.target.value.length > 0) {
//                             setErrors({name: " "});   
//                            }
//                     }}
//                 />
//                <p className="text-red-500">{errors.name}</p>
//             </div>
//         <div className="mt-4"> 
//             <Button type="submit">Create Hotel</Button>
//         </div>
//         </form>
//     </main>
//  );
