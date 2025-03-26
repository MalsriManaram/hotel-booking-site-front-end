import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { submit } from "@/lib/features/searchSlice";
import HeroForm from "./HeroForm";

export default function Hero() {
  const dispatch = useDispatch();
  
  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.search.value;
    console.log(searchQuery);

    dispatch(submit(searchQuery));
  };

  return (
    <div className="">
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-white justify-center px-8 pt-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
          Find Your Best Staycation
        </h1>
        <p className="text-xl  mb-12 text-center max-w-2xl">
          Describe your dream destination and experience, and we'll find the
          perfect place for you.
        </p>

        {/* Search Form */}
        <HeroForm />
        {/* <form
          onSubmit={handleSearch}
          className="w-full max-w-7xl bg-gray-100 drop-shadow-xl h-fit md:h-40 p-3 md:flex items-center"
        >
          <Input
            type="text"
            name=""
            placeholder="Describe your destination, experience, or hotel..."          
            className="flex-grow h-12 lg:text-lg mx-2 text-black placeholder:text-gray-500 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
          />
          <Input
            type="text"
            name="search"
            placeholder="Describe your destination, experience, or hotel..."          
            className="flex-grow h-12 lg:text-lg mx-2 text-black placeholder:text-gray-500 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
          />
          <Input
            type="text"
            name="search"
            placeholder="Describe your destination, experience, or hotel..."          
            className="flex-grow h-12 lg:text-lg mx-2 text-black placeholder:text-gray-500 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            className="rounded-xl w-48 flex items-center gap-x-2 lg:h-12 ml-4"
          >
            <Sparkles
              style={{ width: "20px", height: "20px" }}
              className=" mr-2 animate-pulse text-sky-400"
            />
            <span className="lg:text-lg">AI Search</span>
          </Button> */}
        {/* </form> */}
      </div>
    </div>
  );
}