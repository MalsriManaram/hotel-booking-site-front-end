import { useState} from "react";
import { motion } from "framer-motion";

// components
import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";


// hooks
import { useSelector } from "react-redux";
import { useGetHotelsForSearchQueryQuery } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";


export default function HotelListings() {

  // get the search value from the store
  const searchValue = useSelector((state) => state.search.value);

  const locations = ["ALL", "France", "Italy", "Australia", "Japan"];// state for the selected location
  const [selectedLocation, setSelectedLocation] = useState("ALL");

  // use the useGetHotelForSearchQueryQuery hook to fetch the searched hotels
  const { data: hotels, isLoading, isError, error } = useGetHotelsForSearchQueryQuery({
    query: searchValue,
    location: selectedLocation === "ALL" ? null : selectedLocation,
  });

  // function to handle the selected location
  const handleSelectedLocation = (location) => {
    setSelectedLocation(location);
  };

  // if the data is loading, return a loading UI
  if (isLoading) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>
        <div className="flex items-center gap-x-1 md:gap-x-4">
          {locations.map((location, i) => {
            return (
              <LocationTab
                key={i}
                selectedLocation={selectedLocation}
                name={location}
                onClick={handleSelectedLocation}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  // if there is an error, return a error UI 
  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>
        <div className="flex items-center gap-x-1 md:gap-x-4">
          {locations.map((location, i) => {
            return (
              <LocationTab
                key={i}
                selectedLocation={selectedLocation}
                name={location}
                onClick={handleSelectedLocation}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // filter the hotels based on the selected location
  const filteredHotels = selectedLocation === "ALL" ? hotels : hotels.filter(({ hotel }) => {
    return hotel.location.toLowerCase().includes(selectedLocation.toLowerCase()); // uses includes() to check if the location string contains the selectedLocation string we get from the LocationTab component
                                                                                  // ex: "Paris, France".includes("France") returns true
  });

 

  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>

        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </div>
      <div className="flex items-center gap-x-1 md:gap-x-4">
        {
          locations.map((location, i) => {
            return (<LocationTab key={i} selectedLocation={selectedLocation} name={location} onClick={handleSelectedLocation} />)
          })
        }
      </div>
      <div key={selectedLocation} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {filteredHotels?.length > 0 &&
          filteredHotels.map(({ hotel, confidence }, index) => (
            <motion.div
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HotelCard hotel={hotel} confidence={confidence} />
            </motion.div>
          ))}
      </div>
    </section>
  );
};