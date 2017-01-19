import React, { Component, PropTypes } from 'react'
import {Helpers} from '../components/helpers'


class FileView extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        var errorMessage = this.props.fileData.error ? Helpers.getErrorMessage(this.props.fileData.error) : ''
        return (
            <div className={this.props.theme['file-row']}>
                <div className={this.props.theme["file-flex-row"]}>
                    <div>
                        <p className="name">{this.props.fileData.name}</p>
                    </div>
                    <div>
                        <p className="size">
                            {Helpers.filesize(this.props.fileData.size)}
                        </p>
                    </div>
                    {this.props.fileData.status === 'success' &&
                        <div style={{flex: 0}}>
                            <svg style={{width:24, height:24, stroke: 'green'}} viewBox="0 0 24 24">
                                <path fill="#000000" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                            </svg>
                        </div>
                    }
                    {this.props.fileData.status === 'success' &&
                        <div onClick={this.props.onDelete} title="Delete" style={{flex: 0}}>
                            <svg style={{width: 24, height: 24}} viewBox="0 0 24 24">
                                <path className={this.props.theme['delete-icon']} d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </svg>
                        </div>
                    }
                </div>
                <div className={this.props.theme['error-msg']}>
                    <strong className={this.props.theme['error-txt']}>{errorMessage}</strong>
                </div>
            </div>
        )
    }
}

export {FileView}
