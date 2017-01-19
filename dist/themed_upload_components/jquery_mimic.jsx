import React, {PropTypes} from 'react';
import { DropzoneReduxComponent as Dropzone } from '../components/redux-component-dropzone'  //  ./react-component-myversion'//'../../form-components/react-dropzone-component-modified/src/react-dropzone';
import { Button, IconButton } from 'react-toolbox/lib/button';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { connect } from 'react-redux'
import {Template} from './template'

var componentConfig = {}

var djsConfig = {
    autoProcessQueue: false,
    dictDefaultMessage: 'Drop files here or click button above to upload'
}

class BootstrapThemeUploader extends Template {
    render() {
        /* refer to "template" from parentClassName*/
        this.localComponent = Object.assign({}, componentConfig, this.props.componentConfig)
        this.localConfig = Object.assign({}, djsConfig, this.props.djsConfig)
        this.localConfig.clickable = '.' + this.parentClassName + ' .fileinput-button' // required to try and allow multiple dropzone elements in the same form

        let props = this.props

        return (
            <div className={this.parentClassName}>
                <div>
                    <Button icon='add_circle' className='fileinput-button' style={{backgroundColor: "#5cb85c", color: 'white', margin: 2}} label='Add files' raised />
                    <Button className="start" onClick={()=>(props.myDropzone.processQueue())} icon='file_upload' style={{backgroundColor: "#428bca", color: 'white', margin: 2}} label='Start uploading' raised />
                    <Button className="cancel" onClick={()=>{for(var i = 0; i < props.myDropzone.files.length; i++) props.myDropzone.cancelUpload(props.myDropzone.files[i]) }} icon='cancel' style={{backgroundColor: "#f0ad4e", color: 'white', margin: 2}} label='Cancel upload' raised />
                    <Button className="delete" onClick={()=>props.myDropzone.removeAllFiles(true)} icon='delete' style={{backgroundColor: "#d9534f", color: 'white', margin: 2}} label='Delete files' raised />
                </div>

                <Dropzone
                    config={this.localComponent}
                    djsConfig={this.localConfig}
                    name={props.name}
                />

            </div>
        )
    }
}

BootstrapThemeUploader.defaultProps = {
    djsConfig: {},
    componentConfig: {}
}

BootstrapThemeUploader.propTypes = {
    name: React.PropTypes.string.isRequired,
}

BootstrapThemeUploader = connect((state, props)=> {
    /* add the dropzone state to this widget sot hat we can provide functionality to buttons */
    if (!(state.dropzone.hasOwnProperty(props.name))){
        return {myDropzone: null}
    }
    return {myDropzone: state.dropzone[props.name].myDropzone}
})(BootstrapThemeUploader)

export {BootstrapThemeUploader}
