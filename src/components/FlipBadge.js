import React, {useState} from "react";
import '../App.css';
import {Link} from "react-router-dom";

function FlipBadge(props) {

    const [isHover, setIsHover] = useState(false);


    let front = "CardFront bg-" + props.colorBackGround + " text-" + props.textColor + " border-solid border-8 border-" + props.border + " p-2 m-2 rounded-2xl"
    let back = "CardBack overflow-auto bg-" + props.colorBackGround + " text-" + props.textColor + " border-solid border-8 border-" + props.border + " p-2 m-2 rounded-2xl"
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
                    <Link className="w-1/8 h-1/8" to={{
                        pathname: '/detail',
                        state: {
                            id: props.detailId,
                        }
                    }}>
                        <img className=" mx-auto "
                             src={props.img_icon_url}
                             alt={props.parent_app}/>
                    </Link>
                </div>
            </div>
            }
        </div>
    )
}

export default FlipBadge
