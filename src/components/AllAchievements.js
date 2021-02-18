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
    const [rarityDirection, setRarityDirection] = useState(false);
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

            <div className="flex justify-between items-center px-8 py-6">
                <h2>Sort rarity</h2>
                <div className="w-16 h-10 bg-gray-300 rounded-full flex-shrink-0 p-1 transform -translate-x-6">
                    {/* Trying to make it a point that if it's clicked to move the ball to X-6*/}
                    <div

                        className={rarityDirection === false ? "bg-white w-8 h-8 rounded-full shadow-md  transform  ease-linear duration-100   " : "bg-blue-500 w-8 h-8 rounded-full shadow-md transform  ease-linear duration-100 translate-x-6 "}
                        onClick={sortRarity}>
                    </div>
                </div>


            </div>
            <div className="flex justify-between items-center px-8 py-6">
                <h2>Set achieved</h2>
                <div className="w-16 h-10 bg-gray-300 rounded-full flex-shrink-0 p-1 transform -translate-x-6">
                    {/* Trying to make it a point that if it's clicked to move the ball to X-6*/}
                    <div

                        className={isClickedAchived === false ? "bg-white w-8 h-8 rounded-full shadow-md  transform  ease-linear duration-100   " : "bg-blue-500 w-8 h-8 rounded-full shadow-md transform  ease-linear duration-100 translate-x-6 "}
                        onClick={achievedFilter}>
                    </div>
                </div>


            </div>

            <Select className={"gameSelect"} options={selectOptions} isMulti onChange={gameFilter}/>
            <div className="grid grid-cols-3 gap-4">
                {
                    //moet naar functie
                    pagedData.length ? pagedData.map((value, index) => {
                        //hier?
                        var border = "";
                        var progress = "";
                        var colorBackGround = "";
                        var textColor = "";
                        var percentInvert = 100 - value.percent;
                        var uitkomstPercent = 0;

                        if (value.achieved === 1) {
                            colorBackGround = "purple-300"
                            textColor = "black"
                        } else {
                            colorBackGround = "gray-300"
                            textColor = "black"
                        }

                        if (value.percent < 100 && value.percent >= 70) {
                            border = "gray-700";
                            progress = "#374151"

                            var res1 = 100 - 70;
                            var res2 = res1 - (value.percent - 70);
                            var res3 = res2 / res1;
                            uitkomstPercent = res3 * 100;

                        } else if (value.percent < 70 && value.percent >= 40) {
                            border = "green-600"
                            progress = "#059669"

                            var res1 = 70 - 40;
                            var res2 = res1 - (value.percent - 40);
                            var res3 = res2 / res1;
                            uitkomstPercent = res3 * 100;

                        } else if (value.percent < 40 && value.percent >= 10) {
                            border = "blue-500"
                            progress = "#3B82F6"

                            var res1 = 40 - 10;
                            var res2 = res1 - (value.percent - 10);
                            var res3 = res2 / res1;
                            uitkomstPercent = res3 * 100;
                        } else if (value.percent < 10 && value.percent >= 1) {
                            border = "purple-500"
                            progress = "#8B5CF6"

                            var res1 = 10 - 1;
                            var res2 = res1 - (value.percent - 1);
                            var res3 = res2 / res1;
                            uitkomstPercent = res3 * 100;
                        } else {
                            border = "yellow-500"
                            progress = "#D97706"

                            var res1 = 1 - 0;
                            var res2 = res1 - (value.percent - 0);
                            var res3 = res2 / res1;
                            uitkomstPercent = res3 * 100;
                        }

                        var rounded = (value.percent).toFixed(2);
                        var time = new Date(value.unlocktime * 1000)

                        return (
                            <div key={index}>
                                <FlipBadge name={value.displayName}
                                           description={value.description}
                                           date={value.unlocktime}
                                    //hier aant cheaten
                                           percent={uitkomstPercent}

                                           achieved={value.achieved}
                                           icon={value.achieved ? value.icon : value.icongray} border={border}
                                           colorBackGround={colorBackGround}
                                           textColor={textColor}
                                           img_icon_url={value.img_icon_url}
                                           detailId={value.appid}
                                           parent_app={value.gameName}
                                           rounded={rounded}
                                           time={time}
                                           progress={progress}
                                />

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


