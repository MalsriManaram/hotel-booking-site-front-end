import { useState, useEffect} from "react";

// components
import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";

// import { getHotels } from "@/lib/api/hotels";
// import { Button } from "./ui/button";

// import useSelector from react-redux to access the user slice
import { useSelector } from "react-redux";

// // import setUser action from the userSlice
// import { setUser } from "@/lib/features/userSlice";
// import { useDispatch } from "react-redux";

// import the useGetHotelsQuery hook from the api file for rtks query
import { useGetHotelsQuery } from "@/lib/api";


export default function HotelListings() {

  // use the useGetHotelsQuery hook to  get the hotel data, isLoading, isError, and error
  const { data: hotels, isLoading, isError, error } = useGetHotelsQuery();

  // const [hotels, setHotels] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);
  // const [error, setError] = useState("");

  // // use the useDispatch hook to dispatch the setUser action
  // const dispatch = useDispatch();

  const userSlice = useSelector((state) => state.user);

  const locations = ["ALL", "France", "Italy", "Australia", "Japan"]

  const [selectedLocation, setSelectedLocation] = useState("ALL");

  const handleSelectedLocation = (location) => {
    setSelectedLocation(location);
  };

  const filteredHotels = selectedLocation === "ALL" ? hotels : hotels.filter((hotel) => {
    return hotel.location.toLowerCase().includes(selectedLocation.toLowerCase()); // uses includes() to check if the location string contains the selectedLocation string we get from the LocationTab component
                                                                                  // ex: "Paris, France".includes("France") returns true
  });

  // useEffect(() => {
  //   getHotels().then((data) => {
  //     setHotels(data);
  //   }).catch((error) => {
  //     setIsError(true);
  //     setError(error.message);
  //   }).finally(() => {
  //     setIsLoading(false);
  //   }); // finally() is called after the promise is resolved or rejected
  // }, []);

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
        <div className="flex items-center gap-x-4">
          {
            locations.map((location, i) => {
              return (<LocationTab key={i} selectedLocation={selectedLocation} name={location} onClick={handleSelectedLocation} />)
            })
          }
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <p>Loading...</p>
        </div>
      </section>
    );
  };

 if (isError) {
    return(
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
        <div className="flex items-center gap-x-4">
          {
            locations.map((location, i) => {
              return (<LocationTab key={i} selectedLocation={selectedLocation} name={location} onClick={handleSelectedLocation} />)
            })
          }
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  };

  return (
    <section className="px-8 py-8 lg:py-16">
      <div className="mb-12">
        {/* <p>Hello, {userSlice.user.name}</p>

        <Button onClick={() => {
          dispatch(setUser({ name: "Malsri-2" }));
        }}>Click me</Button> */}

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>

        {/* Button to fetch all the hotels
        <Button onClick={async () => {
          const hotels = await getHotels();
          setHotels(hotels);
        }}>
          Fetch Data
        </Button> */}

        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        {
          locations.map((location, i) => {
            return (<LocationTab key={i} selectedLocation={selectedLocation} name={location} onClick={handleSelectedLocation} />)
          })
        }
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {
          filteredHotels.map((hotel) => {
            return (<HotelCard key={hotel._id} hotel={hotel} />)
          })
        }
      </div>
    </section>
  );
};