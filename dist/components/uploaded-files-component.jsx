import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import * as actions from '../redux/actions'
import * as types from '../redux/action_types'
import {DefaultFileView} from '../defaults/render_uploaded_files'
import theme from '../themes/uploaded-files-theme.scss'

var noPropagation = function(e) {
    if (!e) var e = window.event
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}

var DefaultFileComponent = DefaultFileView

class UploadedFileComponent extends Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.defaultActions = {
            onUpload: (f)=>(this.props.myDropzone.processFile(f)),
            onStop: (f)=>(this.props.myDropzone.cancelUpload(f)),
            onDelete: (f)=>(this.props.myDropzone.removeFile(f))
        }

        this.localTheme = Object.assign({}, theme, this.props.theme)
    }

    render(){
        //<div className="table table-striped files" style={{width: "100%"}} id='previews'>
        //</div>
        let customActions = Object.assign({}, this.defaultActions, this.props.actions)
        let {onUpload, onDelete, onStop, ...moreActions} = customActions
        let files = this.props.files.map((f,i)=>(
                <this.props.fileViewTemplate
                    key={i}
                    theme={this.localTheme} // pass down the theme provided from parent
                    onUpload={()=>onUpload(f)}
                    onDelete={()=>onDelete(f)}
                    onStop={()=>onStop(f)}
                    fileData={f}
                    {...moreActions}
                />
            )
        )

        return (
            <div
                onClick={(e)=>{e.stopPropagation()}}
            >
                {files}
            </div>
        )
    }
}

UploadedFileComponent.defaultProps = {
    fileViewTemplate: DefaultFileComponent,
    actions: {}
}

UploadedFileComponent.propTypes = {
    name: React.PropTypes.string.isRequired,
}


/*Creating container */
const StateToProps = (state, props) => {
    if (!(state.dropzone.hasOwnProperty(props.name))){
        /* dropzone element has not been intialized yet */
        return {
            myDropzone: null,
            files: [],
            progress: 0,
            refreshed: 1
        }
    }

    let localDropzone = state.dropzone[props.name]
    return {
        files: localDropzone.files,
        progress: localDropzone.totalProgress,
        refreshed: localDropzone.forceRefresh,
        myDropzone: localDropzone.myDropzone,
    }
}

const DispatchToProps = (dispatch) => {
    return {
    }
}

export const UploadedFileRenderer = connect(StateToProps)(UploadedFileComponent)
