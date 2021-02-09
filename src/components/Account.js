import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom"
import GameCard from "./GameCard";

function Account() {
    const [data, setData] = useState([{}]);
    const [games, setGames] = useState([{}]);

//TODO get this from session
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

            }
        };

        fetchData();
    }, []);
//TODO ONLY load the game if it has achievements
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
            }
        };

        fetchGame();
    }, []);

    //TODO DESIGN
    //TODO more account info?
    //TODO Account COMPONENT
    //TODO ALLGAMES COMPONENT
    return (
        <div>
            <h1>Account</h1>
            { data.user && <h1>user: {data.user.displayName}</h1>}
            { data.user && <img className="mx-auto" alt={"profile pic for " + data.user.displayName} src={data.user.photos[2].value}/>}


            <div className="grid grid-cols-3 gap-2 place-content-evenly">
            {games && games.map((value, index) => {
                return (
                    value.has_community_visible_stats &&
                    <Link key={index} to={{
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


