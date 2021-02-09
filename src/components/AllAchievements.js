import React, {useEffect, useState} from 'react';
import axios from "axios";
import FlipBadge from "./FlipBadge";
import SearchBar from "./SearchBar";
import ReactPaginate from 'react-paginate';

function AllAchievements() {
    //TODO replace with REDUX or context
    const [data, setData] = useState([{}]);
    const [achievements, setAchievements] = useState([]);
    const [filteredAchievements, setFilteredAchievements] = useState([]);
    const [pageCount, setPageCount] = useState(10);
    const [offset, setOffset] = useState(99);
    const [pagedData, setPagedData] = useState([]);
    //TODO states for filters +

    const [isAchievedFilter, setIsAchievedFilter] = useState(1);

    const [isClickedAchived, setIsClickedAchived] = useState(false);
    const [rarityDirection, setRarityDirection] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const getAchivements = (filtered) => {
        setFilteredAchievements(filtered);
        let pages = filtered.length / offset;
        setPageCount(pages);
        handlePageClick({ selected: 0 });
    };

    const theOne = (rarityDirection, isClickedAchived, search) => {
        if (rarityDirection) {
            const tempArr = filteredAchievements.sort(function (a, b) {
                return a.percent - b.percent;
            });
            setFilteredAchievements(tempArr);
        }
        if (!rarityDirection && rarityDirection !== "") {
            const tempArr = filteredAchievements.sort(function (a, b) {
                return b.percent - a.percent;
            });
            setFilteredAchievements(tempArr);
        }
        if (isClickedAchived) {
            const tempArr = achievements.filter(function (a) {
                return a.achieved === isAchievedFilter;
            });
            setFilteredAchievements(tempArr);
        }
        if (isClickedAchived && rarityDirection) {
            const tempArr = achievements.filter(function (a) {
                return a.achieved === isAchievedFilter;
            });
            setFilteredAchievements(
                tempArr.sort(function (a, b) {
                    return a.percent - b.percent;
                })
            );
        }
        if (isClickedAchived && !rarityDirection && rarityDirection !== "") {
            const tempArr = achievements.filter(function (a) {
                return a.achieved === isAchievedFilter;
            });
            setFilteredAchievements(
                tempArr.sort(function (a, b) {
                    return b.percent - a.percent;
                })
            );
        }
        if (search && !isClickedAchived) {
            const filteredData = achievements.filter((achi) => {
                return achi.displayName.toLowerCase().includes(search.toLowerCase());
            });
            return getAchivements(filteredData);
        }
        if (search && isClickedAchived) {
            const filteredData = filteredAchievements.filter((achi) => {
                return achi.displayName.toLowerCase().includes(search.toLowerCase());
            });
            return getAchivements(filteredData);
        }
        if (!search && !isClickedAchived) return getAchivements(achievements);
    };

    const handleOnChange = ({ target: { value } }) => {
        setSearchTerm(value);
    };

    const sortRarity = () => {
        setRarityDirection((prevCheck) => !prevCheck);
    };

    const achievedFilter = (e) => {
        setIsClickedAchived(true);
    };

    const handlePageClick = (data) => {
        if (filteredAchievements.length !== 0) {
            let selected = data.selected;
            let off = Math.ceil(selected * offset);
            setPagedData(filteredAchievements.slice(off, off + offset));
        } else {
            console.log("Gonna have toclick again");
        }
    };

    useEffect(() => {
        theOne(rarityDirection, isClickedAchived, searchTerm);
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
        handlePageClick({ selected: 0 });
    }, [filteredAchievements, rarityDirection]);

    return (
        <div>
            <h1>All Achievements</h1>
            <SearchBar handleOnChange={handleOnChange}>{searchTerm}</SearchBar>
            <p onClick={sortRarity}>Sort rarity {rarityDirection}</p>
            <p onClick={achievedFilter}>Set achieved is {isAchievedFilter}</p>
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
                                           parent_app={value.gameName}/>
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


