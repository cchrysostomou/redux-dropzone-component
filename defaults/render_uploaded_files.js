import React, { Component, PropTypes } from 'react'
import * as lodash from 'lodash'
import {ProgressBar as UploadCircle} from '../components/react-toolbox-modified/upload_progress_button'  /* modified from react-toolbox*/

import progressTheme from '../themes/progress-bar-theme.scss'

import {Helpers} from '../components/helpers'

class DefaultFileView extends Component {
    constructor(props) {
        super(props);
    }

    render(){

        var clickAction
        if (this.props.fileData.status === 'added' || this.props.fileData.status === "queued") clickAction = this.props.onUpload
        else if (this.props.fileData.status === 'uploading') clickAction = this.props.onStop
        else clickAction = ()=>{}
        var errorMessage = this.props.fileData.error ? Helpers.getErrorMessage(this.props.fileData.error) : ''

        return (
            <div className={this.props.theme['file-row'] + ' ' + 'table'}>
                <div className={this.props.theme["file-flex-row"]}>
                    <div style={{flex: 0}}><span className="preview"><img /></span></div>
                    <div>
                        <p className="name">{this.props.fileData.name}</p>
                    </div>
                    <div>
                        <p className="size">
                            <strong>{Helpers.filesize(this.props.fileData.size)}</strong>
                        </p>
                    </div>
                    <div style={{flex: 0}}>
                        <UploadCircle onClick={clickAction} status={this.props.fileData.status} theme={progressTheme} type={this.props.method} mode='determinate' value={this.props.fileData.upload.progress} className={"progress-bar progress-bar-success"}/>
                    </div>
                    <div onClick={this.props.onDelete} title="Delete" style={{flex: 0}}>
                        <svg style={{width: 24, height: 24}} viewBox="0 0 24 24">
                            <path className={this.props.theme['delete-icon']} d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                    </div>
                </div>
                <div className={this.props.theme['error-msg']}>
                    <strong className={this.props.theme['error-txt']}>{errorMessage}</strong>
                </div>
            </div>
        )
    }
}

DefaultFileView.defaultProps = {
    method: 'circular',
}

export {DefaultFileView}
