import React, { Component } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import NavbarMenu from './components/layouts/NavbarMenu'

import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Playground from './components/pages/Playground'

import CheckLoginRoute from './components/methods/CheckLoginRoute'


class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {
        user: null
      },
      loading: true
    }
    this.setUserData = this.setUserData.bind(this)
  }

  setUserData(userDataInput) {
    this.setState({
      userData: userDataInput
    })
  }

  checkToken() {
    const authOptions = {
      method: 'GET',
      url: 'http://localhost:4000/authen/users/1125',
      headers: {
        Authorization: Cookies.get('__token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
    }
    return axios(authOptions)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error);
    })
  }

  componentWillMount() {
    if  (Cookies.get('__token')) {
      this.checkToken().then((userData) => {
        if  (userData.username) {
          this.setState({
            userData: {
              user: userData
            },
            loading: false
          })
        } else {
          this.setState({
            loading: false
          })
        }
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }

  render(){
    return (
      <Router>
        {
          !this.state.loading && (
          <div>
            <NavbarMenu userData={this.state.userData} setUserData={this.setUserData} />
            <div style={{ paddingTop: '50px' }}>
              <Route path="/home" component={Home} />
              <Route
                path="/login" render={
                  routeProps =>
                    <Login
                      {...routeProps} userData={this.state.userData} setUserData={this.setUserData}
                    />
                }
              />
              <CheckLoginRoute
                path="/playground" userData={this.state.userData} component={Playground}
              />
              <Redirect from="/" to="home" />
            </div>
          </div>
          )
        }
      </Router>
    )
  }
}

export default Main