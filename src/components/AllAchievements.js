import React, {useEffect, useState} from 'react';
import axios from "axios";
import FlipBadge from "./FlipBadge";
import SearchBar from "./SearchBar";
import ReactPaginate from 'react-paginate';
import Select from "react-select";

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
    const [searchTerm, setSearchTerm] = useState("");

    //searchterm typer
    const handleSearchChange = ({target: {value}}) => {
        setSearchTerm(value);
    };

    //rarity clicker
    const sortRarity = () => {
        setRarityDirection((prevCheck) => !prevCheck);
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
        console.log(achievements);
        const setFiltered = async () => {
            setFilteredAchievements(await filterAndSort({achieved: isAchievedFilter}, {rarity: rarityDirection}, chosenGames, searchTerm, achievements));
        }
        console.log(filteredAchievements);
        setFiltered();
    }, [rarityDirection, isAchievedFilter, chosenGames, searchTerm]);

    //set up get da data
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
        } else {
            console.log("EMPTY OBJECT");
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

                        className={isAchievedFilter === 0 ? "bg-white w-8 h-8 rounded-full shadow-md  transform  ease-linear duration-100   " : "bg-blue-500 w-8 h-8 rounded-full shadow-md transform  ease-linear duration-100 translate-x-6 "}
                        onClick={achievedFilter}>
                    </div>
                </div>


            </div>

            <Select className={"gameSelect"} options={selectOptions} isMulti onChange={gameFilter}/>
            <div className="grid grid-cols-3 gap-4">
                {
                    pagedData.length ? pagedData.map((value, index) => {

                        //made a function to handle all of kayastyle
                        let styleO = flipStyler(value.percent, value.achieved, value.unlocktime);

                        return (
                            <div key={index}>
                                <FlipBadge name={value.displayName}
                                           description={value.description}
                                           date={value.unlocktime}
                                    //hier aant cheaten
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
                                />

                            </div>
                        )

                    }) : <p>LOADING: please wait and check if your steam data is public ;)</p>
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


