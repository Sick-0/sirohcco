import React, {useEffect, useState} from 'react';
import axios from "axios";
import Achievement from "./Achievement";

function GameDetail(props) {

    const [gameData, setGameData] = useState([]);
    const [achievementData, setAchievementData] = useState([]);
    const [percentageData, setPercentageData] = useState([]);
    const [allData, setAllData] = useState([]);

    //TODO Move partly to the backend (calls and joins 2 calls here array achievements + general gamedata?)
    //TODO Add filters
    //TODO Grayed icons and other conditional renders
    //TODO Datetime parsing

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'api/game/?appid=' + props.location.state.id,
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            );
            if (result.data) {
                setGameData(result.data.game);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAchievement = async () => {
            const res = await axios.get(
                'api/achievement/?appid=' + props.location.state.id,
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            );
            if (res.data) {
                setAchievementData(res.data);
            }
        };

        fetchAchievement();
    }, []);

    useEffect(() => {
        const fetchPercentage = async () => {
            const res = await axios.get(
                'api/percentage/?appid=' + props.location.state.id,
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            );
            if (res.data) {
                setPercentageData(res.data);
            }
        };

        fetchPercentage();
    }, []);

    useEffect(() => {
        if (gameData.availableGameStats && achievementData.playerstats && percentageData.achievementpercentages) {
            const arrs = [...gameData.availableGameStats.achievements, ...achievementData.playerstats.achievements, ...percentageData.achievementpercentages.achievements];
            const noDuplicate = arr => [...new Set(arr)]
            const allIds = arrs.map(ele => ele.apiname);
            const ids = noDuplicate(allIds);

            const result = ids.map(id =>
                arrs.reduce((self, item) => {
                    return item.apiname === id || item.name === id ?
                        {...self, ...item} : self
                }, {})
            )
            console.log(result);
            setAllData(result);
        }
    }, [gameData, achievementData, percentageData])


    return (
        <div>
            <p>THIS SHOULD BE THE GAME ID {props.location.state.id}</p>
            <div className="grid grid-cols-3 gap-2 place-content-evenly">
            {allData && allData.map((value, index) => {
                return (
                    <div key={index}>
                        <Achievement
                            image={value.icon}
                            name={value.displayName}
                            description={value.description}
                            checked={value.achieved}
                            date={value.unlocktime}
                            percent={value.percent}/>

                    </div>

                )
            })}
            </div>

        </div>
    );

}

export default GameDetail;
