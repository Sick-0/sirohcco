import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom"
import GameCard from "./GameCard";
import Achievement from "./Achievement";
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
            setFilteredAchievements(tempArr);
            let pages = tempArr.length/100;
            setPageCount(pages);
            console.log(tempArr);
            handlePageClick({selected: 0});

        };

        orgAchievements();
    }, [data]);

    const handleOnChange = e => {
        const filtered = achievements.filter(achi => {
            return achi.displayName.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setFilteredAchievements(filtered);
        let pages = filtered.length/100;
        setPageCount(pages);
        console.log(filtered);
        handlePageClick({selected: 0});
    }

   const handlePageClick = (data) => {
        let selected = data.selected;
        setOffset(Math.ceil(selected * 99));
        setPagedData(filteredAchievements.slice(offset ,offset+99));
        console.log("click happend! on" + data.selected);

    };

    return (
        <div>
            <h1>All Achievements</h1>
            <SearchBar handleOnChange={handleOnChange}>...</SearchBar>

            {
                pagedData && pagedData.map((value, index) => {
                    return(
                        <div key={index}>
                            <FlipBadge name={value.displayName} description={value.description} date={value.unlocktime} percent={value.percent} achieved={value.achieved} icon={value.achieved ? value.icon : value.icongray} />
                        </div>
                    )

                })
            }
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


