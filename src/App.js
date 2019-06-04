import React from 'react';
import './App.css';
import Login from "./components/Login"

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      currentUser: null,
      loginForm: {
        email: "",
        password: ""
      }
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
      .then(userJSON => {
        if (userJSON.error) {
          // failure
          alert("invalid credentials")
        } else {
          // success
          this.setState({
            currentUser: userJSON.user
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

      <Login
        handleLoginFormChange={this.handleLoginFormChange}
        handleLoginFormSubmit={this.handleLoginFormSubmit}
        email={this.state.loginForm.email}
        password={this.state.loginForm.password}
      />
    </div>
    )
  }
}

export default App;
