import React, {useEffect, useState} from 'react';
import axios from "axios";
import FlipBadge from "./FlipBadge";
import SearchBar from "./SearchBar";
import ReactPaginate from 'react-paginate';

function AllAchievements() {
    const [data, setData] = useState([{}]);
    const [achievements, setAchievements] = useState([]);
    const [filteredAchievements, setFilteredAchievements] = useState([]);
    const [pageCount, setPageCount] = useState(10);
    const [offset, setOffset] = useState(99);
    const [pagedData, setPagedData] = useState([]);


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
            setFilteredAchievements(tempArr);
            let pages = tempArr.length / offset;
            setPageCount(pages);

        };

        orgAchievements();
    }, [data]);

    const handleOnChange = e => {
        const filtered = achievements.filter(achi => {
            return achi.displayName.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setFilteredAchievements(filtered);
        let pages = filtered.length / offset;
        setPageCount(pages);
        handlePageClick({selected: 0});
    }

    const handlePageClick = (data) => {
        let selected = data.selected;
        let off = Math.ceil(selected * offset);
        setPagedData(filteredAchievements.slice(off, off + offset));
    };

    return (
        <div>
            <h1>All Achievements</h1>
            <SearchBar handleOnChange={handleOnChange}>...</SearchBar>
            <div className="grid grid-cols-3 gap-4">
                {
                    pagedData ? pagedData.map((value, index) => {
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
                            border = "purple-500"
                        } else {
                            border = "yellow-500"
                        }
                        return (
                            <div key={index}>
                                <FlipBadge name={value.displayName} description={value.description}
                                           date={value.unlocktime} percent={value.percent} achieved={value.achieved}
                                           icon={value.achieved ? value.icon : value.icongray} border={border}
                                           colorBackGround={colorBackGround} textColor={textColor}/>
                            </div>


                        )

                    }) : <p>LOADING</p>
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
                initialPage={0}
            />
        </div>
    );

}

export default AllAchievements;


