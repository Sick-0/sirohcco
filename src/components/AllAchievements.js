import React, {useEffect, useReducer, useState} from 'react';
import axios from "axios";
import FlipBadge from "./FlipBadge";
import SearchBar from "./SearchBar";
import ReactPaginate from 'react-paginate';
import Select from "react-select";
import Loader from "react-loader-spinner";

// THANKS TO NIKITAAAAAAAAAH
import {filterAndSort} from "./helpers/filterAndSort";
import {flipStyler} from "./helpers/flipStyler";
import FilterSortComponent from "./FilterSortComponent";


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
    const [searchTerm, setSearchTerm] = useState("");

    const [activeFilters, setActiveFilters] = useState({
        isRaritySort: false,
        isDateSort: false,
        isAchievedFilter: false,
        isGameNameFilter: false,
        isAchievementNameFilter: false
    });
    const [sortDirections, setSortDirections] = useState({rarityDirection: false, dateDirection: false});
    const [filterValues, setFilterValues] = useState({isAchieved: 0, chosenGames: [], searchTerm: ''})

    const [error, setError] = useState('');

    //searchterm typer
    const handleSearchChange = ({target: {value}}) => {

        let stringFil = JSON.stringify(filterValues);
        let curFilters = JSON.parse(stringFil);

        curFilters.searchTerm = value;
        setFilterValues(curFilters);
    };

    //rarity direction clicker
    const sortRarity = () => {
        let stringDir = JSON.stringify(sortDirections)
        let curDirections = JSON.parse(stringDir);

        curDirections.rarityDirection = !curDirections.rarityDirection;
        setSortDirections(curDirections);
    };

    //date direction clicker
    const sortDate = () => {
        let stringDir = JSON.stringify(sortDirections)
        let curDirections = JSON.parse(stringDir);

        curDirections.dateDirection = !curDirections.dateDirection;
        setSortDirections(curDirections);
    };

    //active filter changer (checkbox to enable and disable certain sorts and filters
    const setFilters = async (e) => {
        let stringFil = JSON.stringify(activeFilters);
        let curFilters = JSON.parse(stringFil);
        if (e.target.id === "Rarity") {
            if (activeFilters.isRaritySort) {
                curFilters.isRaritySort = false;
            } else {
                curFilters.isRaritySort = true;
                curFilters.isDateSort = false;
            }
        } else if (e.target.id === "Date") {
            if (activeFilters.isDateSort) {
                curFilters.isDateSort = false;
            } else {

                let stringVal = JSON.stringify(filterValues);
                let curVals = JSON.parse(stringVal);
                curVals.isAchieved = 1;

                curFilters.isDateSort = true;
                curFilters.isAchievedFilter = true;
                curFilters.isRaritySort = false;

                setFilterValues(curVals);
            }
        } else if (e.target.id === "Achieved") {
            curFilters.isAchievedFilter = !activeFilters.isAchievedFilter;
        }
        setActiveFilters(curFilters);
    }

    //achieved direction clicker
    const achievedFilter = async (e) => {
        let stringFil = JSON.stringify(filterValues);
        let curFilters = JSON.parse(stringFil);
        if (curFilters.isAchieved === 1) {
            curFilters.isAchieved = 0;
        } else {
            curFilters.isAchieved = 1;
        }
        setFilterValues(curFilters);
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

    useEffect (() => {
            console.log("i is triggered")
            const doTheDance = async () => {
                setFilteredAchievements([...await filterAndSort(chosenGames, achievements, activeFilters, sortDirections, filterValues)]);
            }
            doTheDance();
        },[activeFilters, sortDirections, filterValues, chosenGames, achievements]
    )




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
                            tempObj.img_icon_url = "https://media.steampowered.com/steamcommunity/public/images/apps/" + object.appid + "/" + object.img_icon_url + ".jpg";
                            tempObj.gameName = object.name;
                            tempObj.appid = object.appid;
                            tempArr.push(tempObj);
                        });
                    }
                });
                setAchievements(tempArr);
                setFilteredAchievements([...tempArr]);
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


//TODO: select box for rarity
//TODO: neutral state for sort and filters
//TODO: checkbox for filters & sorts?


//set up of the select box
    useEffect(() => {
        let tempArr = [];

        achievements.forEach(achi => {
            if (!tempArr.some(e => e.value === achi.appid)) {
                tempArr.push({value: achi.appid, label: achi.gameName})
            }
        })
        let sortedNewArr = tempArr.sort(function (a, b) {
            var textA = a.label.toUpperCase();
            var textB = b.label.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        setSelectOptions(sortedNewArr);

    }, [achievements])

    return (
        <div>
            <h1>All Achievements</h1>
            <br />

            <h2>SORTING</h2>
            <br />
            <FilterSortComponent isActive={activeFilters.isRaritySort} callbackActive={setFilters}
                                 callbackDirection={sortRarity} direction={sortDirections.rarityDirection}
                                 type={"Rarity"}/>

            <FilterSortComponent isActive={activeFilters.isDateSort} callbackActive={setFilters}
                                 callbackDirection={sortDate} direction={sortDirections.dateDirection}
                                 type={"Date"}/>

            <h2>FILTERING</h2>
            <br />
            <SearchBar handleOnChange={handleSearchChange}>{searchTerm}</SearchBar>

            <FilterSortComponent isActive={activeFilters.isAchievedFilter} callbackActive={setFilters}
                                 callbackDirection={achievedFilter} direction={filterValues.isAchieved}
                                 type={"Achieved"}/>


            <Select className={"gameSelect"} options={selectOptions} isMulti onChange={gameFilter}/>
            <br />
            <h2>RESULT</h2>
            <br />
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

                })} </div> : error !== '' ? <p>there is an error called {error}</p> :
                    <div className={" mx-auto items-center px-8 py-6"}><h2>Loading: please hold...</h2> <Loader
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


