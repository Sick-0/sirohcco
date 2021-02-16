import React, {useEffect, useState} from 'react';
import axios from "axios";
import FlipBadge from "./FlipBadge";
import SearchBar from "./SearchBar";
import ReactPaginate from 'react-paginate';
import Select from "react-select";

// THANKS TO NIKITAAAAAAAAAH
import {sortAscDesc} from "./helpers/sortAscDesc";
import {isAchived} from "./helpers/isAchived";
import {isAchivedSortAscDesc} from "./helpers/isAchivedSortAscDesc";
import {searchFilter} from "./helpers/searchFilter";
import {sortDateAscDesc} from "./helpers/sortDateAscDesc";

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

    //TODO states for filters +
    const [isAchievedFilter, setIsAchievedFilter] = useState(1);

    const [isClickedAchived, setIsClickedAchived] = useState(false);
    const [rarityDirection, setRarityDirection] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateDirection, setDateDirection] = useState("");

    //siccos filter test
    const [filterArr, setFilterArr] = [{achieved: true,}];


    const getAchivements = (filtered) => {
        setFilteredAchievements(filtered);
        let pages = filtered.length / offset;
        setPageCount(pages);
        handlePageClick({selected: 0});
    };

    const theOne = () => {
        sortAscDesc(rarityDirection, filteredAchievements, setFilteredAchievements);
        isAchived(
            isClickedAchived,
            achievements,
            setFilteredAchievements,
            isAchievedFilter
        );
        isAchivedSortAscDesc(
            isClickedAchived,
            achievements,
            setFilteredAchievements,
            isAchievedFilter,
            rarityDirection
        );
        searchFilter(
            searchTerm,
            filteredAchievements,
            achievements,
            isClickedAchived,
            getAchivements
        );
    };

    const handleOnChange = ({target: {value}}) => {
        setSearchTerm(value);
    };

    const sortRarity = () => {
        setRarityDirection((prevCheck) => !prevCheck);
    };

    const achievedFilter = (e) => {
        if (isClickedAchived) {
            setIsClickedAchived(false);
        } else {
            setIsClickedAchived(true);
        }
    };

    const gameFilter = (e) => {
        let tempArr = [];
        console.log(e);
        e.forEach(game => {
            tempArr.push(game.value)
        })
        console.log(tempArr);
        setChosenGames(tempArr);
    };

    useEffect(() => {
        console.log(chosenGames);
        chosenGames.forEach(value => {
            const tempArr = filteredAchievements.filter(function (a) {
                return a.appid === value;
            });
            setFilteredAchievements(tempArr);
        })

    }, [chosenGames]);


    const handlePageClick = (data) => {
        if (filteredAchievements.length !== 0) {
            let selected = data.selected;
            let off = Math.ceil(selected * offset);
            setPagedData(filteredAchievements.slice(off, off + offset));
        }
    };

    useEffect(() => {
        theOne();
    }, [rarityDirection, isClickedAchived, searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("api/allachievements", {
                proxy: {
                    port: 8080,
                },
                credentials: "include",
            });
            if (result.data) {
                setData(result.data);
            }
            console.log(result.data);
        };

        fetchData();
    }, []);

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
        } else {
            console.log("EMPTY OBJECT");
        }
    }, [data]);

    useEffect(() => {
        let pages = filteredAchievements.length / offset;
        setPageCount(pages);
        handlePageClick({selected: 0});
    }, [filteredAchievements, rarityDirection]);

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
            <SearchBar handleOnChange={handleOnChange}>{searchTerm}</SearchBar>

            <div className="my-2">Sort rarity {rarityDirection}</div>

            <div className="w-12 relative my-1 cursor-pointer">
                <div className="h-8 w-12 bg-gray-300 rounded-full">
                    <div onClick={sortRarity}
                         className="mt-1 w-6 h-6 absolute transition-all transform ease-linear duration-100 flex items-center justify-center rounded-full bg-white shadow-toggle border-gray-300 top-0 left-4">
                    </div>
                </div>
            </div>

            <div className="w-12 relative my-1 cursor-pointer">
                <div className="h-8 w-12 bg-gray-300 rounded-full">
                    <div
                        className="mt-1 w-6 h-6 absolute transition-all transform ease-linear duration-100 flex items-center justify-center rounded-full bg-white shadow-toggle border-gray-300 top-0 left-4"></div>
                </div>
            </div>
            <div className="w-8 py-1 relative my-1 cursor-pointer">
                <div className="h-5 bg-gray-300 rounded-full">
                    <div
                        className="-ml-3 mt-p w-6 h-6 absolute transition-all transform ease-linear duration-100 flex items-center justify-center rounded-full bg-white shadow-toggle border-gray-300 top-0 left-4"></div>
                </div>
            </div>

            <div className="w-12 relative my-1 cursor-pointer">
                <div className="h-8 w-12 bg-purple-600 rounded-full">
                    <div
                        className="mt-1 -ml-6 w-6 h-6 absolute transition-all transform ease-linear duration-100 flex items-center justify-center rounded-full bg-white shadow-toggle border-gray-300 top-0 left-96"></div>
                </div>
            </div>
            <div className="w-8 py-1 relative my-1 cursor-pointer">
                <div className="h-5 bg-pink-600 rounded-full">
                    <div
                        className="-ml-3 mt-p w-6 h-6 absolute transition-all transform ease-linear duration-100 flex items-center justify-center rounded-full bg-white shadow-toggle border-gray-300 top-0 left-96"></div>
                </div>
            </div>

            <button onClick={achievedFilter}>Set achieved is {isAchievedFilter}</button>
            <Select options={selectOptions} isMulti onChange={gameFilter}/>
            <div className="grid grid-cols-3 gap-4">
                {
                    pagedData.length ? pagedData.map((value, index) => {
                        //hier?
                        var border = "";
                        var colorBackGround = "";
                        var textColor = "";

                        if (value.achieved === 1) {
                            colorBackGround = "purple-300"
                            textColor = "black"
                        } else {
                            colorBackGround = "gray-300"
                            textColor = "black"
                        }

                        if (value.percent < 100 && value.percent >= 70) {
                            border = "gray-700";
                        } else if (value.percent < 70 && value.percent >= 40) {
                            border = "green-600"
                        } else if (value.percent < 40 && value.percent >= 10) {
                            border = "blue-500"
                        } else if (value.percent < 10 && value.percent >= 1) {
                            border = "purple-500"
                        } else {
                            border = "yellow-500"
                        }


                        var rounded = (value.percent).toFixed(2);
                        var time = new Date(value.unlocktime * 1000)

                        return (
                            <div key={index}>
                                <FlipBadge name={value.displayName}
                                           description={value.description}
                                           date={value.unlocktime}
                                           percent={value.percent}
                                           achieved={value.achieved}
                                           icon={value.achieved ? value.icon : value.icongray} border={border}
                                           colorBackGround={colorBackGround}
                                           textColor={textColor}
                                           img_icon_url={value.img_icon_url}
                                           detailId={value.appid}
                                           parent_app={value.gameName}
                                           rounded={rounded}
                                           time={time}/>

                            </div>
                        )

                    }) : <p>LOADING LOADING LOADING</p>
                }
            </div>
            <ReactPaginate
                previousLabel={'previous'}
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


