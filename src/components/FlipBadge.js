import React, {useState} from "react";
import '../App.css';
import {Link} from "react-router-dom";
import {Progress} from "react-sweet-progress"

import "react-sweet-progress/lib/style.css";

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
                    <br/>
                    <Progress
                        //test -hier voor symbols
                        theme={{
                            default: {
                                symbol: props.achieved ? <img
                                    src={props.iconAchieved}/> : ' ',
                                color: props.progress,
                                trailColor: '#EFEFEF',
                            }
                        }
                        }
                        type="circle"
                        percent={props.percent}
                        status="default"
                    />
                    <p>{props.rounded}%</p>
                    <p>{props.achieved ? props.time.toLocaleDateString() : ""}</p>
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
