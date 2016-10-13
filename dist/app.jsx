(() => {
  'use strict';

  //Setup Horizon connection
  const horizon = Horizon();

  class ChatApp extends React.Component {
    render () {
      return (
        <div>
          React
        </div>
      )
    }
  }

  // Render ChatApp
  ReactDOM.render(
    <ChatApp />,
    document.getElementById('app')
  )
})()
