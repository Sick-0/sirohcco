import React from "react";

function SearchBar({handleOnChange}) {
    return (
        <>
            <div className="searchbar">
                    <input type="text" onChange={handleOnChange}/>
            </div>
        </>
    );
}

export default SearchBar;
