import React from 'react'
import { render } from "react-dom"
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { BootstrapThemeUploader } from './themed_upload_components/jquery_mimic'
import { SingleFileUploader } from './themed_upload_components/single_file'

import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { uploadReducer } from './redux/reducer'

var componentConfig = {
    iconFiletypes: ['.txt', '.jpeg'],
    showFiletypeIcon: true,
    postUrl: null
};

var djsConfig = {
    addRemoveLinks: false,
    maxFilesize: 10000, // MB
    parallelUploads: 4,
}

const rootReducer = combineReducers({
    dropzone: uploadReducer
})

/* creating redux store and sending to APP */
const logger = createLogger()
let store = createStore(
    rootReducer,  // global store to pass everywhere!
    applyMiddleware(thunk, logger)
)

class Example extends React.Component {
  render() {
    return (
        <Provider store={store}>
        <div>
            <div style={{paddingBottom: 100}}>
                <h3> This is an example of a single file upload widget </h3>
                <SingleFileUploader djsConfig={djsConfig} componentConfig={componentConfig} name='test1'/>
            </div>
            <hr/>
            <div>
                <h3> This example attempts to mimic the JqueryUI widget </h3>
                <BootstrapThemeUploader djsConfig={djsConfig} componentConfig={componentConfig} name='test2'/>
            </div>
        </div>
        </Provider>
    )
  }
}


render(<Example/>, document.getElementById('example'))
