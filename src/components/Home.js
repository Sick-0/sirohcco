import React, {useEffect, useState} from 'react';
import axios from "axios";

function Home() {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'api/home',
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            );
            if (result.data) {
                setData(result.data);
            }
        };
        fetchData();
    });


    return (
        <div>
            <h1>Home</h1>
            <p>{data}</p>
            <p>Also I dont take any of your data! I just want to know who you are(some weird number) so I can get your achievements and games and show it to you in a nice way...</p>
        </div>
    );

}

export default Home;
