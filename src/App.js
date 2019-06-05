import React from 'react';
import './App.css';
import Secrets from './components/Secrets.js'
import Login from "./components/Login"
import Logout from "./components/Logout"

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      currentUser: null,
      loginForm: {
        email: "",
        password: ""
      },
      secrets: []
    }
  }

  componentDidMount() {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("http://localhost:3001/get_current_user", {
        headers: {
          "Authorization": token
        }
      })
      .then(r => r.json())
      .then(resp => {
        if (resp.error) {
          alert(resp.error)
        } else {
          this.setState({
            currentUser: resp.user
          })
        }
      })
      .catch(console.log)
    }
  }

  handleLoginFormChange = event => {
    const { name, value } = event.target
    this.setState({
      loginForm: {
        ...this.state.loginForm,
        [name]: value
      }
    })
  }

  handleLoginFormSubmit = event => {
    event.preventDefault()
    // now I need to submit the info from the form to the back end
    // ... where I will authenticate the user, and if valid, send the user back
    // with that response, set my state, all is glorious with the world
    const userInfo = this.state.loginForm
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: userInfo
      })
    }
    fetch("http://localhost:3001/login", headers)
      .then(r => r.json())
      .then(resp => {
        if (resp.error) {
          // failure
          alert("invalid credentials")
        } else {
          // success
          this.setState({
            currentUser: resp.user,
            loginForm: {
              email: "",
              password: ""
            }
          })
          localStorage.setItem('token', resp.jwt)
        }
      })
      .catch(console.log)
  }

  logout = event => {
    event.preventDefault()
    localStorage.removeItem("token")
    this.setState({
      currentUser: null,
      secrets: []
    })
  }

  getSecrets = () => {
    const token = localStorage.getItem("token")
    fetch("http://localhost:3001/secrets", {
      headers: {
        "Authorization": token
      }
    })
      .then(r => r.json())
      .then(secrets => {
        if (secrets.error) {
          alert("Not authorized for those secrets")
        } else {
          // success
          this.setState({
            secrets
          })
        }
      })
      .catch(console.log)
  }

  render() {
    const { currentUser } = this.state
    return (
    <div className="App">
      <h2>{ currentUser ?
        `Logged in as ${currentUser.name}` :
        "Not logged in"
       }</h2>


      {
        this.state.currentUser ?
          <Logout logout={this.logout}/> :
          <Login
            handleLoginFormChange={this.handleLoginFormChange}
            handleLoginFormSubmit={this.handleLoginFormSubmit}
            email={this.state.loginForm.email}
            password={this.state.loginForm.password}
          />
      }
      <button onClick={this.getSecrets}>Show User's Secrets</button>
      <Secrets secrets={this.state.secrets}/>
    </div>
    )
  }
}

export default App;
