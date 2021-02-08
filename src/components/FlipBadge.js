import {useState} from "react";
import '../App.css';
function FlipBadge(props) {

    const [isHover, setIsHover] = useState(false);


    let front="CardFront bg-"+props.colorBackGround+ " text-"+props.textColor+ " border-solid border-8 border-"+props.border +" p-2 m-2 rounded-2xl"
    let back="CardBack bg-"+props.colorBackGround+  " text-"+props.textColor+" border-solid border-8 border-"+props.border + " p-2 m-2 rounded-2xl"
    //thanks to kayalin


    return (
        <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className={""}>


            {!isHover && <div className={front}>
                <img className="mx-auto IconFront"
                     src={props.icon}
                     alt="Trophy icon but big"/>
                <p className="text-center pb-2">{props.name}</p>
            </div>}

            {isHover &&

            <div className={back}>
                <div className="flex items-center">
                    <img className="ml-6 w-1/4 h-1/4 mr-6"
                         src={props.icon}
                         alt="Trophy icon but small"/>
                    <p>{props.name}</p>
                </div>
                <div className="text-center pb-2">
                    <p>{props.percent}</p>
                    <br/>
                    <p>{props.date}</p>
                    <p>{props.description}</p>
                    <img className=" mx-auto w-1/4 h-1/4"
                         src="https://findicons.com/files/icons/770/token_dark/256/games.png"
                         alt="Trophy icon but small"/>
                </div>
            </div>
            }
        </div>
    )
}

export default FlipBadge
