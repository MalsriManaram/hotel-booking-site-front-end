export const getHotels = async () => {
            const res = await fetch("http://localhost:8000/api/hotels", {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch hotels.");
            }

            const data = await res.json();
            return data;
            

        // const res = fetch("http://localhost:8000/api/hotels", {
        //     method: "GET",
        // });

        // res.then((body) => {
        //     console.log(body);
        //     return body.json();
        // }).then((data) => {
        //     console.log(data);
        // }).catch((err) => {
        //     console.log(err);
        // });
};