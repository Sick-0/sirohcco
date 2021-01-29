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
                console.log(result.data);
                console.log(data);
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            <h1>Home</h1>
            <p>{data}</p>

        </div>
    );

}

export default Home;
