import React, { Component, PropTypes } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar';
import theme from '../themes/progress-bar-theme.scss'

class DefaultProgressBar extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
        <div className="progress progress-striped active" role="progressbar">
            <ProgressBar theme={theme} type='linear' mode='determinate' value={this.props.progress} className={"progress-bar progress-bar-success " + theme.striped}/>
        </div>
        )
    }
}

DefaultProgressBar = DefaultProgressBar

export {DefaultProgressBar}
