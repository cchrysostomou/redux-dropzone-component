import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import * as actions from '../redux/actions'
import * as types from '../redux/action_types'

import {DefaultProgressBar} from '../defaults/render_progress_bar'

class Progress extends Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
    }

    render(){
        return (
            this.props.numUploading > 0 ?
            <div>
                <this.props.progress_ui progress={this.props.progress}/>
            </div>
            :
            null
        )
    }
}

Progress.defaultProps = {
    progress_ui: DefaultProgressBar,
}

Progress.propTypes = {
    name: React.PropTypes.string.isRequired,
}


/*Creating container */
const StateToProps = (state, props) => {
    if (!(state.dropzone.hasOwnProperty(props.name))){
        /* dropzone element has not been intialized yet */
        return {
            progress: 0,
            refreshed: 1,
            numUploading: 0
        }
    }

    let localDropzone = state.dropzone[props.name]
    let uploadStatus = localDropzone.files.map((f)=>(f.status))
    let mappedStatus = {
        'uploading': 0,
        'success': 0,
        'queued': 0,
        'other': 0
    }

    for (var i = 0; i< uploadStatus.length; i++){
        var s = uploadStatus[i]
        if (s in mappedStatus){
            mappedStatus[s] += 1
        }
        else{
            mappedStatus['other'] += 1
        }
    }

    return {
        progress: localDropzone.totalProgress,
        refreshed: localDropzone.forceRefresh,
        numUploading: mappedStatus['uploading'],

    }
}

const DispatchToProps = (dispatch) => {
    return {
    }
}
export const TotalUploadProgressBar = connect(StateToProps)(Progress)
