import React from 'react';

function GameCard(props) {

    return (
        <div className="bg-green-200 w-100 m-2 rounded-2xl p-3 shadow-md md:text-sm hover:shadow-2xl text-black">

            <img className="mx-auto pb-2 rounded-3xl"
                 src={"http://media.steampowered.com/steamcommunity/public/images/apps/" + props.appid + "/" + props.img_icon_url + ".jpg"}
                 alt={"Card image for " + props.name}/>
                <h1 className="text-3xl p-1 mb-1">{props.name}</h1>
                <p className="text-sm p-1 mb-1">{props.appid}</p>
        </div>
    );
}

export default GameCard;
