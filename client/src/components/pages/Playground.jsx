import React , { Component } from 'react'
import io from 'socket.io-client'
const PIXI = require('pixi.js')
const bunnyImg = require('../../assets/bunny.jpg')
PIXI.utils.sayHello('start pixi')

console.log(PIXI)

class Playground extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      allMessage: [],
      msg: ''
    }
    console.log("inClass")
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
  
  componentDidMount() {
    const app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});

    // create a new Sprite from an image path
    const bunny = PIXI.Sprite.fromImage(bunnyImg)

    // center the sprite's anchor point
    bunny.anchor.set(0.5);

    // move the sprite to the center of the screen
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    app.stage.addChild(bunny);

    // Listen for animate update
    app.ticker.add(function(delta) {
        // just for fun, let's rotate mr rabbit a little
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        bunny.rotation += 0.1 * delta;
    });

    document.getElementById('playground').appendChild(app.view)
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
        <div id="playground" />
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
