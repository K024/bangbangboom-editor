import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import "./i18n"
import App from './App'
import * as serviceWorker from './serviceWorker'
import { userMessage } from './Common/Components/GlobalSnackbar'
import i18n from './i18n'
import { scope } from './MappingScope/scope'

window.addEventListener("error", ev => {
  gtag('event', 'exception', {
    'description': ev.error,
    'fatal': true
  })
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate() {
    userMessage(i18n.t("An update is available. Please close ALL tabs of this site or press Ctrl + F5 reload."), "info")
    scope.update = true
  }
})
