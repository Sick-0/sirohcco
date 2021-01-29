import React, {Component} from 'react';
import {Redirect, Route} from "react-router-dom";
import axios from "axios";


class ProtectedRoute extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            redirect: false,
        };
    }

    componentDidMount() {
       console.log("PROTECTED TIME")
       axios.get(
           'api/check',
           {
               proxy: {
                   port: 8080
               },
               credentials: 'include',
           }
       )
           .then(res => {
               if (res.status === 200) {
                   console.log("ALL GOOD")
                   this.setState({ loading: false });
               } else {
                   throw new Error(res.error);
               }
           })
           .catch(err => {
               console.error(err);
               this.setState({ loading: false, redirect: true });
           });
    }

    render() {
        const { component: Component, ...props } = this.props
        const { loading, redirect } = this.state;

        if (loading) {
            return null;
        }
        if (redirect) {
            return<Route> <Redirect to="/" /></Route>;
        }
        return <Route><Component {...props} /></Route>;


    }
}

export default ProtectedRoute;
