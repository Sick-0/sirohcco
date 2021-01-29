import './App.css';
import {Link, Route, Switch} from 'react-router-dom'
import Home from "./components/Home";
import Account from "./components/Account";

import ProtectedRoute from "./components/ProtectedRoute";
import GameDetail from "./components/GameDetail";


function App() {

    return (
        <div className="App">

            <header className="App-header">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/account">Account</Link></li>
                    <li><a href="http://localhost:8080/auth/steam">Login</a></li>
                </ul>
            </header>


            <div className="App-body">
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <ProtectedRoute path="/account" component={Account}/>
                    <ProtectedRoute path="/detail" component={GameDetail}/>
                </Switch>
            </div>

        </div>
    );
}

export default App;
