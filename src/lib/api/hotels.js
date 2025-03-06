export const getHotels = async () => {
    try {
            const res = await fetch("http://localhost:8000/api/hotels", {
                method: "GET",
            });

            const data = await res.json();
            return data;
            
        } catch (error) {
            console.log(error); 
        }

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