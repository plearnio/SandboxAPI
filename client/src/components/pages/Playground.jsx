import React , { Component } from 'react'
import io from 'socket.io-client'

class Playground extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      allMessage: [],
      msg: ''
    }
    this.socket = io('http://localhost:4444')
    this.socket.emit('hello', this.props.userData.user.username)
    this.socket.on('initial_msg', (Msg) => {
      this.setState({
        data: Msg
      })
    })
    this.socket.on('new_messege', (newMsg) => {
      this.setState({
        data: newMsg
      })
    })
    this.send = this.send.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  send() {
    this.socket.emit('messege', { name: this.props.userData.user.username, msg: this.state.msg })
    this.setState({
      msg: ''
    })
  }

  handleChange(e) {
    this.setState({
      msg: e.target.value
    })
  }

  render() {
    return (
      <div>
        <h3>Playground</h3>
        <div>
          {this.state.data.map(eachData => (
            <p>{eachData.name}: {eachData.msg}</p>
          ))}
        </div>
        <input type="text" value={this.state.msg} onChange={this.handleChange} /><button onClick={this.send}s>send</button>
      </div>
    )
  }
}

export default Playground
