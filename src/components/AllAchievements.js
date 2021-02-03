import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom"
import GameCard from "./GameCard";

function AllAchievements() {
    const [data, setData] = useState([{}]);
    const [achievements, setAchievements] = useState([]);


//TODO get this from session
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'api/allachievements',
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
        const orgAchievements = async () => {
            let tempArr = [];

            data.forEach(object => {
                if (object.achievements) {
                    object.achievements.forEach(function (achi, index) {
                        let tempObj = achi;
                        tempObj.gameName = object.name;
                        tempObj.appid = object.appid;
                        tempArr.push(tempObj);
                    })
                }
            })
            setAchievements(tempArr);
            console.log(tempArr);

        };

        orgAchievements();
    }, [data]);

    return (
        <div>
            <h1>All Achievements</h1>

            {
                achievements && <p>achievements</p>
            }


            <div className="grid grid-cols-3 gap-2 place-content-evenly">
               <p>HERE COMES DA BOOM</p>
            </div>
        </div>
    );

}

export default AllAchievements;


