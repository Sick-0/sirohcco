import './App.css';
import {Link, Route, Switch} from 'react-router-dom'
import Home from "./components/Home";
import Account from "./components/Account";

import ProtectedRoute from "./components/ProtectedRoute";
import GameDetail from "./components/GameDetail";
import AllAchievements from "./components/AllAchievements";
import {useEffect, useState} from "react";
import axios from "axios";


function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'api/check',
                {
                    proxy: {
                        port: 8080
                    },
                    credentials: 'include',
                }
            );
            if (result.status === 200) {
                setIsLoggedIn(true);
            }
            else {
                setIsLoggedIn(false);
                throw new Error(result.error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/account">Account</Link></li>
                    <li><Link to="/all">All Achievements</Link></li>
                    {!isLoggedIn ? <li><a href="https://sirohcco.herokuapp.com/auth/steam">Login</a></li> : <li><a href="https://sirohcco.herokuapp.com/logout">Logout</a></li>}
                </ul>
            </header>


            <div className="App-body">
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <ProtectedRoute path="/account" component={Account}/>
                    <ProtectedRoute path="/detail" component={GameDetail}/>
                    <ProtectedRoute path="/all" component={AllAchievements}/>
                </Switch>
            </div>

        </div>
    );
}

export default App;
