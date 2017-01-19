
import {Template} from './template'
import { Button, IconButton } from 'react-toolbox/lib/button';
import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { connect } from 'react-redux'

import { DropzoneReduxComponent as Dropzone } from '../components/redux-component-dropzone'  //  ./react-component-myversion'//'../../form-components/react-dropzone-component-modified/src/react-dropzone';
import { TotalUploadProgressBar } from '../components/total-progress-component'  // be able to render a upload bar anywhere in form
import { UploadedFileRenderer } from '../components/uploaded-files-component'  // be able to render the uploaded files anywhere in form
import { FileView } from '../defaults/render_simple_file' // use a custom react element for rendering files

var componentConfig = {}

var djsConfig = {
    autoProcessQueue: true,
    dictDefaultMessage: ''
}

class SingleFileUploader extends Template {
    render() {
        /* refer to "template" from parentClassName*/
        this.localComponent = Object.assign({}, componentConfig, this.props.componentConfig)
        this.localConfig = Object.assign({}, djsConfig, this.props.djsConfig)
        this.localConfig.clickable = '.' + this.parentClassName + ' .fileinput-button' // required to try and allow multiple dropzone elements in the same form
        return (
            <div className={this.parentClassName}>
                <div style={{display: 'flex'}}>
                    <div style={{flex: 0}}>
                        <Button icon='add_circle' className='fileinput-button' style={{backgroundColor: "#5cb85c", color: 'white', margin: 2}} label='Upload File' raised />
                    </div>
                </div>
                <div>
                    <div style={{flex: 1}}>
                        <UploadedFileRenderer name={this.props.name} fileViewTemplate={FileView} key={1}/>
                        <TotalUploadProgressBar name={this.props.name} key={0}/>
                    </div>
                </div>

                <Dropzone
                    config={this.localComponent}
                    djsConfig={this.localConfig}
                    hidden={true}
                    name={this.props.name}
                />
            </div>
        )
    }
}

SingleFileUploader.defaultProps = {
    djsConfig: {},
    componentConfig: {}
}

SingleFileUploader = connect((state)=>({}))(SingleFileUploader)
export {SingleFileUploader}
