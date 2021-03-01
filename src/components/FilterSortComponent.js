import React from 'react';

function FilterSortComponent(props) {

    return (
        <div className="flex justify-between items-center px-8 py-6">
            <div className={props.isActive ? 'flex flex-wrap border-solid border-4 border-green-600 text-green-600 w-16' : 'border-solid  border-4 border-red-600 text-red-600 w-16'}>
            <h1 id={props.type}
                onClick={props.callbackActive}>{props.isActive ? "ON" : "OFF"} </h1>
            </div>
            {props.type === "Achieved" ? <h2>Set achieved on/off</h2> : props.isActive ?
                <h2>Sorting by {props.type}</h2> : <h2>Sort by {props.type}</h2>}
            <div className="w-16 h-10 bg-gray-300 rounded-full flex-shrink-0 p-1 transform -translate-x-6">
                <div
                    className={props.direction !== 1 && !props.direction ? "bg-white w-8 h-8 rounded-full shadow-md  transform  ease-linear duration-100" : "bg-blue-500 w-8 h-8 rounded-full shadow-md transform  ease-linear duration-100 translate-x-6"}
                    onClick={props.callbackDirection}>
                </div>
            </div>
        </div>
    )

}

export default FilterSortComponent;
