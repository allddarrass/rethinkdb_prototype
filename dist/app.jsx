(() => {

  //Setup Horizon connection
  const horizon = Horizon()

  class ChatApp extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        disabled: true,
        messages: []
      }

      this.save = this.save.bind(this)
    }

    uuid() {
      /*jshint bitwise:false */
      var i, random
      var uuid = ''

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-'
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
          .toString(16)
      }
      return uuid
    }

    componentDidMount() {
      // As soon as this component is mounted, enable the input
      this.setState({
        disabled: false,
      })

      // Initiate the changefeeds
      this.subscribe()
    }

    save(message) {
      //Save method for handling messages
      this.props.horizon.store({
        id: this.uuid(),
        text: message,
        authorId: this.props.authorId,
        datetime: new Date()
      }).subscribe()
    }

    subscribe() {
      this.props.horizon
        .order("datetime", "ascending")
        .watch()
        .subscribe(messages => {
            this.setState({ messages: messages })
        })
    }

    render() {
      return (
        <div>
          <ChatList messages={ this.state.messages }/>
          <ChatInput
            disabled={ this.props.disabled }
            onSave={ this.save }
            />
        </div>
      )
    }
  }

  ChatApp.defaultProps = (() => {

    const time = new Date().getMilliseconds()

    // Precache the avatar image so it immediately shows on input enter.
    const image = new Image()
    image.src = `http://api.adorable.io/avatars/50/${time}.png`

    return {
      horizon: horizon("react_messages"),
      avatarUrl: image.src,
      authorId: time
    }
  })()

  class ChatList extends React.Component {
    render() {
      console.log(this.props.messages)
      // Construct list of ChatMessages
      const messages = this.props.messages.map((message) => {
        return <ChatMessage message={ message } key={ message.id }/>
      }, this)

      // Return assembled ChatList of Messages
      return (
        <div className="row">
          <ul>
          { messages }
          </ul>
        </div>
      )
    }
  }

  class ChatInput extends React.Component {
    constructor(props) {
      super(props)

      // Initial state of the inputText is blank ""
      this.state = {
        inputText: ""
      }

      this.handleKeyDown = this.handleKeyDown.bind(this)
      this.handleChange = this.handleChange.bind(this)
    }

    handleKeyDown(event) {
      // Checking if enter key has been pressed to handle contents of
      //  input field value.
      if(event.keyCode === this.props.ENTER_KEY){
        const val = this.state.inputText.trim()

        if (val){
          // Save the value
          this.props.onSave(val)
          // Empty the input value
          this.setState({inputText: ""})
        }
      }
    }

    handleChange(event) {
      // Every time the value of the input field changes we update the state
      //  object to have the value of the input field.
      this.setState({
        inputText: event.target.value
      })
    }

    render() {
      return (
        <div id="input" className="row">
          <input
            className="u-full-width"
            value={ this.state.inputText }
            disabled={ this.props.disabled }
            onChange={ this.handleChange }
            onKeyDown={ this.handleKeyDown }
            autoFocus={ true }
            />
        </div>
      )
    }
  }

  ChatInput.defaultProps = {
    ENTER_KEY: 13
  }

  class ChatMessage extends React.Component {
    render() {
      return (
        <li className="message">
          <img height="50px" width="50px" src={ `http://api.adorable.io/avatars/50/${this.props.message.authorId}.png` }/>
          <span className="text">
            { this.props.message.text }
          </span>
        </li>
      )
    }
  }

  // Render ChatApp
  ReactDOM.render(
    <ChatApp />,
    document.getElementById('app')
  )
})()
