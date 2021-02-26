import React, {useEffect, useState} from 'react';
import axios from "axios";
import FlipBadge from "./FlipBadge";
import SearchBar from "./SearchBar";
import ReactPaginate from 'react-paginate';
import Select from "react-select";
import Loader from "react-loader-spinner";

// THANKS TO NIKITAAAAAAAAAH
import {filterAndSort} from "./helpers/filterAndSort";
import {flipStyler} from "./helpers/flipStyler";

function AllAchievements() {
    //TODO replace with REDUX or context
    const [data, setData] = useState([{}]);
    const [achievements, setAchievements] = useState([]);
    const [filteredAchievements, setFilteredAchievements] = useState([]);

    const [pageCount, setPageCount] = useState(10);
    const [offset, setOffset] = useState(99);
    const [pagedData, setPagedData] = useState([]);

    const [selectOptions, setSelectOptions] = useState([{}]);
    const [chosenGames, setChosenGames] = useState([]);

    const [isAchievedFilter, setIsAchievedFilter] = useState(0);
    const [rarityDirection, setRarityDirection] = useState(false);
    const [dateDirection, setDateDirection] = useState(true);
    const [lastClicked, setLastClicked] = useState("date");
    const [searchTerm, setSearchTerm] = useState("");

    const [error, setError] = useState('');

    //searchterm typer
    const handleSearchChange = ({target: {value}}) => {
        setSearchTerm(value);
    };

    //rarity clicker
    const sortRarity = () => {
        setRarityDirection((prevCheck) => !prevCheck);
        setLastClicked("rarity");
    };

    //date clicker
    const sortDate = () => {
        setDateDirection((prevCheck) => !prevCheck);
        setLastClicked("date");
    };

    //achieved clicker
    const achievedFilter = (e) => {
        if (isAchievedFilter === 1) {
            setIsAchievedFilter(0);
        } else {
            setIsAchievedFilter(1);
        }
    };

    //fill up the game id array for filter by game
    const gameFilter = (e) => {
        let tempArr = [];
        e.forEach(game => {
            tempArr.push(game.value)
        })
        setChosenGames(tempArr);
    };


    //page changer for paged data
    const handlePageClick = (data) => {
        if (filteredAchievements.length !== 0) {
            let selected = data.selected;
            let off = Math.ceil(selected * offset);
            setPagedData(filteredAchievements.slice(off, off + offset));
        }
    };


    //if a filter or sort changes apply all active needs update on on or off
    useEffect(() => {
        const setFiltered = async () => {
            let direction = false;

            if (lastClicked === "date") {
                direction = dateDirection
                setIsAchievedFilter(1)
            }
            else if (lastClicked === "rarity") {
                direction = rarityDirection
            }
            setFilteredAchievements(await filterAndSort({achieved: isAchievedFilter}, {sort: lastClicked, direction: direction}, chosenGames, searchTerm, achievements));
        }
        setFiltered();
    }, [rarityDirection, dateDirection, isAchievedFilter, chosenGames, searchTerm, achievements]);

    //set up get da data
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("api/allachievements", {
                proxy: {
                    port: 8080,
                },
                credentials: "include",
            }).catch(error => {
                    console.log(error);
                setError(error.response.data);
                }
            );

            if (result) {
                setData(result.data);
            }
        };

        fetchData();
    }, []);

    //organise into achievements
    useEffect(() => {
        if (data.length !== {}) {
            const orgAchievements = async () => {
                let tempArr = [];

                data.forEach((object) => {
                    if (object.achievements) {
                        object.achievements.forEach(function (achi, index) {
                            let tempObj = achi;
                            tempObj.img_icon_url = "http://media.steampowered.com/steamcommunity/public/images/apps/" + object.appid + "/" + object.img_icon_url + ".jpg";
                            tempObj.gameName = object.name;
                            tempObj.appid = object.appid;
                            tempArr.push(tempObj);
                        });
                    }
                });
                setAchievements(tempArr);
                setFilteredAchievements(tempArr);
            };

            orgAchievements();
        }
    }, [data]);

    //calculate pages and set up
    useEffect(() => {
        let pages = filteredAchievements.length / offset;
        setPageCount(pages);
        handlePageClick({selected: 0});
    }, [filteredAchievements]);


    //set up of the select box
    useEffect(() => {
        let tempArr = [];
        achievements.forEach(achi => {
            if (!tempArr.some(e => e.value === achi.appid)) {
                tempArr.push({value: achi.appid, label: achi.gameName})
            }
        })

        setSelectOptions(tempArr);

    }, [achievements])

    return (
        <div>
            <h1>All Achievements</h1>
            <SearchBar handleOnChange={handleSearchChange}>{searchTerm}</SearchBar>

            <div className="flex justify-between items-center px-8 py-6">
                {lastClicked === "rarity" ? <h2>Sorting by rarity</h2> : <h2>Sort by rarity</h2>}
                <div className="w-16 h-10 bg-gray-300 rounded-full flex-shrink-0 p-1 transform -translate-x-6">
                    {/* Trying to make it a point that if it's clicked to move the ball to X-6*/}
                    <div

                        className={rarityDirection === false ? "bg-white w-8 h-8 rounded-full shadow-md  transform  ease-linear duration-100   " : "bg-blue-500 w-8 h-8 rounded-full shadow-md transform  ease-linear duration-100 translate-x-6 "}
                        onClick={sortRarity}>
                    </div>
                </div>


            </div>

            <div className="flex justify-between items-center px-8 py-6">
                {lastClicked === "date" ? <h2>Sorting by date achieved</h2> : <h2>Sort by date achieved</h2>}
                <div className="w-16 h-10 bg-gray-300 rounded-full flex-shrink-0 p-1 transform -translate-x-6">
                    {/* Trying to make it a point that if it's clicked to move the ball to X-6*/}
                    <div

                        className={dateDirection === false ? "bg-white w-8 h-8 rounded-full shadow-md  transform  ease-linear duration-100   " : "bg-blue-500 w-8 h-8 rounded-full shadow-md transform  ease-linear duration-100 translate-x-6 "}
                        onClick={sortDate}>
                    </div>
                </div>


            </div>

            <div className="flex justify-between items-center px-8 py-6">
                <h2>Set achieved</h2>
                <div className="w-16 h-10 bg-gray-300 rounded-full flex-shrink-0 p-1 transform -translate-x-6">
                    {/* Trying to make it a point that if it's clicked to move the ball to X-6*/}
                    <div

                        className={isAchievedFilter === 0 ? "bg-white w-8 h-8 rounded-full shadow-md  transform  ease-linear duration-100   " : "bg-blue-500 w-8 h-8 rounded-full shadow-md transform  ease-linear duration-100 translate-x-6 "}
                        onClick={achievedFilter}>
                    </div>
                </div>


            </div>

            <Select className={"gameSelect"} options={selectOptions} isMulti onChange={gameFilter}/>

            {
                pagedData.length ? <div className="grid grid-cols-3 gap-4 mx-auto"> {pagedData.map((value, index) => {

                    //made a function to handle all of kayastyle
                    let styleO = flipStyler(value.percent, value.achieved, value.unlocktime);

                    return (
                        <div key={index}>
                            <FlipBadge name={value.displayName}
                                       description={value.description}
                                       date={value.unlocktime}

                                       percent={styleO.finalPercent}

                                       achieved={value.achieved}
                                       icon={value.achieved ? value.icon : value.icongray} border={styleO.border}
                                       colorBackGround={styleO.colorBackGround}
                                       textColor={styleO.textColor}
                                       img_icon_url={value.img_icon_url}
                                       detailId={value.appid}
                                       parent_app={value.gameName}
                                       rounded={styleO.rounded}
                                       time={styleO.time}
                                       progress={styleO.progress}
                                       iconAchieved={styleO.iconAchieved}
                            />

                        </div>
                    )

                })} </div> : error !== '' ? <p>there is an error called {error}</p> : <div className={" mx-auto items-center px-8 py-6"}><h2>Loading: please hold...</h2> <Loader
                    className={"mx-auto items-center"} type="Hearts" color="#DC143C" height={150} width={150}
                    margin={'auto'}/> <p>PS: make sure your data is public</p></div>
            }

            <ReactPaginate
                previousLabel={'prev'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
            />
        </div>
    );

}

export default AllAchievements;


