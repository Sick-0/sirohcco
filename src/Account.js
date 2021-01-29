import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, Redirect} from "react-router-dom"
import GameCard from "./GameCard";

function Account() {
    const [data, setData] = useState([{}]);
    const [games, setGames] = useState([{}]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'api/account',
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

            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchGame = async () => {
            const result = await axios.get(
                'api/allgames',
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            );
            if (result.data) {
                setGames(result.data);
                console.log(result.data);

            }
        };

        fetchGame();
    }, []);

    function showDetails(id) {
        console.log("DA ID");
        console.log(id);
        return <Redirect to={"/gamedetail"} />;
    }

    //TODO DESIGN
    //TODO more account info?

    return (
        <div>
            <h1>Account</h1>

            { data.user && <h1>user: {data.user.displayName}</h1>}
            { data.user && <img src={data.user.photos[2].value}/>}

            <div className="grid grid-cols-3 gap-2 place-content-evenly">
            {games && games.map((value, index) => {
                return (
                    <Link to={{
                        pathname: '/detail',
                        state: {
                            id: value.appid,
                        }
                    }}>
                     <GameCard name={value.name} appid={value.appid} img_icon_url={value.img_icon_url}/>
                    </Link>
                )
            })}
            </div>
        </div>
    );

}

export default Account;

//


