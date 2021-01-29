import React from 'react';

function Achievement(props) {

    return (
        <div className="bg-green-400 w-100 m-2 rounded-2xl p-3 shadow-md md:text-sm hover:shadow-2xl text-black">

            <img className="mx-auto pb-2 rounded-3xl"
                 src={props.image}
                 alt="Card image cap"/>
            <h1 className="text-3xl p-1 mb-1">{props.name}</h1>
            <p>PERCENT = {props.percent}</p>
            <p className="text-sm p-1 mb-1">{props.description}</p>
            <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600 text-lg" checked={props.checked}/>
                <span className="ml-2 text-gray-700">ACHIEVED</span>
            <p>ACHIEVED ON {props.date}</p>
        </div>
    );
}

export default Achievement;
