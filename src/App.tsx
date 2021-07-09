import React, {useState} from 'react';
import CSS from 'csstype';

export default class App extends React.Component {

  ws:any
  state:any

  constructor(props) {
    super(props)
    this.state = {
      participants: [],
      message: '',
      network: '',
      nickname: ''
    }
  }

  componentDidMount() {

  }

  onConnect = (nickname) => {
    if(!this.ws) {
      this.ws = new WebSocket('ws://localhost:3000/')

      this.ws.addEventListener('open', (e) => {
        console.log(e)
        this.ws.send(JSON.stringify({action: 'join', nickname}))
        this.setState({
          nickname: nickname,
          network: 'connected'
        })

        this.ws.addEventListener('message', (message) => {
          let data = JSON.parse(message.data)

          if(data.action === 'join') {
            if(data.nickname !== nickname) {
              this.ws.send(JSON.stringify({action: 'inform', nickname}))
            }

            this.setState({
              participants: [data.nickname, ...this.state.participants]
            })

          } else if(data.action === 'inform') {
            if(data.nickname !== nickname) {
              this.setState({
                participants: [data.nickname, ...this.state.participants]
              })
            }

          } else if(data.action === 'someone-quit') {
            this.setState({participants: []})
            this.ws.send(JSON.stringify({action: 'join', nickname}))

          } else if(data.action === 'msg') {
            this.setState({
              message: `${this.state.message}</br>${data.nickname}: ${data.message}</br>`
            })

          } 
        })
      })
    }
  }

  onMessageSent = (message) => {
    let nickname = this.state.nickname
    this.ws.send(JSON.stringify({action: 'msg', nickname, message}))
  }

  render() {
    const Participants = (prop) => {
      const values = prop.values
      return (
        <ul>{
          values ? values.map((value, index) => <li key={index}>{value}</li>) : ''
        }
        </ul>
      )
    }

    const MessageViewer = (props) => {
      return (
        <div style={style.leftPanel.messageViewer}>
        {props.message}
        </div>
      )
    }

    const Nickname = (props) => {
      const [nickname, setNickname] = useState(props.nickname ? props.nickname : '')
      return (
          <div style={style.leftPanel.nickname}>
            <label>Nickname:</label>&nbsp;
            <input value={nickname} disabled={props.disabled}
                   onChange={(e) => setNickname(e.target.value)} 
                   placeholder="Give a name to chat..."/>&nbsp;
            <button disabled={props.disabled} onClick={() => props.onConnect(nickname)} >Connect</button>
          </div>
      )
    }

    const MessageSender = (props) => {
      const [message, setMessage] = useState('')
      return (
        <div style={style.leftPanel.messageSender}>
          <textarea style={style.leftPanel.textarea} disabled={props.disabled}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Say something here..."/>
          <button onClick={() => props.onMessageSent(message)} disabled={props.disabled}>Send</button>
        </div>
      )
    }

    return (
      <div style={style.app}>
        <h1 style={style.h1}>My React Playground</h1>
        <div style={style.box}>
          <div style={style.leftPanel.primary}>
            <MessageViewer message={this.state.message}/>
            <Nickname nickname={this.state.nickname} disabled={this.state.network === 'connected'} onConnect={this.onConnect}/>
            <MessageSender onMessageSent={this.onMessageSent} disabled={this.state.network !== 'connected'}/>
          </div>
          <div style={style.rightPanel}><Participants values={this.state.participants}/></div>
        </div>
      </div>
    );
  }
}

const style:any = {
  app: {
    //backgroundColor: 'red',
    textAlign: 'center'
  },
  box: {
    textAlign: 'left',
    margin: '300px',
    marginTop: '0px',
    marginBottom: '0px',
    backgroundColor: '#264653',
    height: '680px',
    display: 'flex',
    flexDirection: 'row'
  } as CSS.Properties,
  leftPanel: {
    primary: {
      padding: '5px',
      //backgroundColor: '',
      flex: 1,
      //height: '100%',
      display: 'flex',
      flexDirection: 'column'
    } as CSS.Properties,
    messageViewer: {
      flex: 1,
      //width: '100%',
      backgroundColor: 'white'
    } as CSS.Properties,
    nickname: {
      height: '30px',
      color: 'white',
      display: 'flex',
      alignItems: 'center'
    } as CSS.Properties,
    messageSender: {
      //width: '100%',
      height: '100px',
      //padding: '5px',
      marginTop: '5px',
      display: 'flex',
      flexDirection: 'row',
    } as CSS.Properties,
    textarea: {
      flex: 1,
      border: 0,
      marginRight: '2px'
    } as CSS.Properties
  },
  rightPanel: {
    //padding: '5px',
    width: '200px',
    height: '100%',
    color: 'white',
    backgroundColor: '#264653'
  } as CSS.Properties,
  h1: {
    color: 'black'
  } as CSS.Properties
}
