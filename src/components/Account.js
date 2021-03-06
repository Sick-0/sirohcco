import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom"
import GameCard from "./GameCard";
import ReactPaginate from 'react-paginate';
import Loader from "react-loader-spinner";

function Account() {
    const [data, setData] = useState([{}]);
    const [games, setGames] = useState([{}]);

    const [pageCount, setPageCount] = useState(10);
    const [offset, setOffset] = useState(9);
    const [pagedData, setPagedData] = useState([]);

    const [error, setError] = useState('')

//TODO get this from session
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'api/account',
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            )
            if (result.data) {
                setData(result.data);

            }
        };

        fetchData();
    }, []);
//TODO ONLY load the game if it has achievements
    useEffect(() => {
        const fetchGame = async () => {
            const result = await axios.get(
                'api/allgames',
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            ).catch(err => {
                console.log(err);
                setError(err.response.data);
            });
            if (result && result.data) {
                let gamesOnly = result.data.filter((game) => {
                    return game.has_community_visible_stats;
                })
                let sortedNewArr = gamesOnly.sort(function (a,b) {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                setGames(sortedNewArr);
            }
        };

        fetchGame();
    }, []);

    //page changer for paged data
    const handlePageClick = (data) => {
        if (data.length !== 0) {
            let selected = data.selected;
            let off = Math.ceil(selected * offset);
            setPagedData(games.slice(off, off + offset));
        }
    };

    //calculate pages and set up
    useEffect(() => {
        let pages = games.length / offset;
        setPageCount(pages);
        handlePageClick({selected: 0});
    }, [games]);

    //TODO DESIGN
    //TODO more account info?
    //TODO Account COMPONENT
    //TODO ALLGAMES COMPONENT
    return (
        <div>
            <h1>Account</h1>
            { data.user && <h1>user: {data.user.displayName}</h1>}
            { data.user && <img className="mx-auto" alt={"profile pic for " + data.user.displayName} src={data.user.photos[2].value}/>}



            {pagedData.length > 1 ? <div className="grid grid-cols-3 gap-2 place-content-evenly"> { console.log(pagedData.length) } { pagedData.map((value, index) => {
                return (
                    <Link key={index} to={{
                        pathname: '/detail',
                        state: {
                            id: value.appid,
                        }
                    }}>
                     <GameCard name={value.name} appid={value.appid} img_icon_url={value.img_icon_url}/>
                    </Link>
                )
            }) } </div> : error !== '' ? <p>there is an error called {error}</p> : <div className={" mx-auto items-center px-8 py-6"}><h2>Loading: please hold...</h2> <Loader
                className={"mx-auto items-center"} type="Hearts" color="#DC143C" height={150} width={150}
                margin={'auto'}/> </div>}


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

export default Account;


