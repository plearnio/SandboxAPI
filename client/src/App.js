import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import testReactRouter from './testReactRouter'
const Welcome = ({user, onSignOut})=> {
  // This is a dumb "stateless" component
  return (
    <div>
      Welcome <strong>{user.username}</strong>!
      <a href="javascript:;" onClick={onSignOut}>Sign out</a>
    </div>
  )
}

class LoginForm extends React.Component {
  
  // Using a class based component here because we're accessing DOM refs
 
  handleSignIn(e) {
    e.preventDefault()
    let username = this.refs.username.value
    let password = this.refs.password.value
    this.props.onSignIn(username, password)
  }
  
  render() {
    return (
      <form onSubmit={this.handleSignIn.bind(this)}>
        <h3>Sign in</h3>
        <input type="text" ref="username" placeholder="enter you username" />
        <input type="password" ref="password" placeholder="enter password" />
        <input type="submit" value="Login" />
      </form>
    )
  }

}


class App extends React.Component {
  
  constructor(props) {
    super(props)
    // the initial application state
    this.state = {
      user: null,
      __token: null
    }
    this.signIn = this.signIn.bind(this)
    this.checkToken = this.checkToken.bind(this)
  }
  
  // App "actions" (functions that modify state)
  signIn(username, password) {
    // This is where you would call Firebase, an API etc...
    // calling setState will re-render the entire app (efficiently!)
    const authOptions = {
      method: 'POST',
      url: 'http://localhost:4000/authen/login',
      data: {
        username: username,
        password: password
      }
    };
    const userData = axios(authOptions)
    .then(function (response) {
      return response
    })
    .catch(function (error) {
      console.log(error);
    });

    userData.then((res) => {
      console.log(res)
      if(res.data !== 'wrong user or password') {
        Cookies.set('token', res.data.__token);
        //res.cookie('rememberme', 'yes', { maxAge: 900000, httpOnly: false});
        this.setState({
          user: res.data.user,
          __token: res.data.__token
        })
      }
    })
  }
  
  signOut() {
    // clear out user from state
    this.setState({
      user: null,
      __token: null
    })
  }

  checkToken() {
    const authOptions = {
      method: 'GET',
      url: 'http://localhost:4000/authen/',
      headers: {
          'Authorization': this.state.__token,
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
    };
    axios(authOptions)
    .then(function (response) {
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  
  render() {
    // Here we pass relevant state to our child components
    // as props. Note that functions are passed using `bind` to
    // make sure we keep our scope to App
    return (
      <div>
        
        {/* <h1 onClick={this.checkToken}>My cool App</h1>
        { 
          (this.state.user) ? 
            <Welcome 
             user={this.state.user} 
             onSignOut={this.signOut.bind(this)} 
            />
          :
            <LoginForm 
             onSignIn={this.signIn.bind(this)} 
            />
        } */}
        <testReactRouter/>
      </div>
    )
    
  }
  
}

export default App
