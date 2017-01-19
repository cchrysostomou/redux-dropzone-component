import React, { Component, PropTypes } from 'react'
import * as lodash from 'lodash'
import ReactDOM from 'react-dom'
import { Helpers } from './helpers'
import * as actions from '../redux/actions'
import { connect } from 'react-redux'
var Dropzone, DropzoneComponent;
import { UploadedFileRenderer } from './uploaded-files-component'
import { TotalUploadProgressBar } from './total-progress-component'

import theme from '../themes/theme.scss'

var IconComponent = React.createClass({
    render: function () {
        let className = "filepicker-file-icon"
        if (typeof this.props.styles['filepicker-file-icon'] !== 'undefined') className = this.props.styles['filepicker-file-icon']
        return (
            <div data-filetype={this.props.filetype} className={className} />
        );
    }
});


class DropzoneReactComponent extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Configuration of Dropzone.js. Defaults are
     * overriden by the 'djsConfig' property
     * For a full list of possible configurations,
     * please consult
     * http://www.dropzonejs.com/#configuration
     */
    getDjsConfig () {
        var options,
            defaults = {
                url: this.props.config.postUrl ? this.props.config.postUrl : null
            };

        if (this.props.djsConfig) {
            options = Helpers.extend(true, {}, defaults, this.getDefaultHandlers(), this.props.djsConfig);
        } else {
            options = defaults;
        }

        if (this.props.config.makeDropzoneClickable && this.props.showFileViewInComponent){
            console.warn('Warning: we have not figured out how to stop propagation of dropzone clickable event after adding files. Therfore, the following props cannot both be true: config.makeDropzoneClickable and showFileViewInComponent. We are forcing config.makeDropzoneClickable to be False')
            this.props.config.makeDropzoneClickable = false
        }

        if (this.props.config.makeDropzoneClickable){
            let filepickerclassname = this.localTheme['filepicker'] || 'filepicker'
            if (options.clickable && options.clickable !== filepickerclassname)
                options.clickable += ',.' + filepickerclassname
            else
                options.clickable = filepickerclassname
        }

        return options;
    }

    /**
     * React 'componentDidMount' method
     * Sets up dropzone.js with the component.
     */
    componentDidMount() {
        if (!this.props.myDropzone) {
            this.initializeDropzone()
        }
    }

    getDefaultHandlers(){
        /* overwrite the default functions provided by dropzone */
        return {
            addedfile: (file) => {this.props.dispatch(actions.file_was_added(this.props.name, file))},
            removedfile: (file) => {this.props.dispatch(actions.file_was_removed(this.props.name, file))},
            error: (file, message, xhr) => {this.props.dispatch(actions.error_was_reported(this.props.name, file, message))},
            errormultiple: (sentFiles, message, xhr) => {this.props.dispatch(actions.error_was_reported(this.props.name, sentFiles, message))},
            //sending: (file, xhr, formData)=> {if(this.props.sending === false) return this.props.dispatch(actions.recordSending())},
            //sendingmultiple: (files, xhr, formData)=> {if(this.props.sending === false) return this.props.dispatch(actions.recordSending())},
            complete: (file, progress) => {this.props.dispatch(actions.refresh(this.props.name))},
            totaluploadprogress: (totalUploadProgress, totalBytes, totalBytesSent) => {this.props.dispatch(actions.updateProgress(this.props.name, totalUploadProgress, totalBytes, totalBytesSent))},
            queuecomplete: () => {return this.props.dispatch(actions.refresh(this.props.name))}
            //queuecomplete: () => {if(this.props.sending === true) this.props.dispatch(actions.stopRecordSending())},
        }
    }

    UpdateEvents(eventHandlers){
        if (!eventHandlers)
            return
        /* UPDATE event handlers to dropzone object, this will not change the state, just the underlying dropzone object */
        for (var eventHandler in eventHandlers) {
            if (eventHandlers.hasOwnProperty(eventHandler) && eventHandlers[eventHandler]) {
                // Check if there's an array of event handlers
                if (Object.prototype.toString.call(eventHandlers[eventHandler]) === '[object Array]') {
                    for (var i = 0; i < eventHandlers[eventHandler].length; i = i + 1) {
                        // Check if it's an init handler
                        if (eventHandler === 'init') {
                            eventHandlers[eventHandler][i](this.props.myDropzone);
                        } else {
                            this.props.myDropzone.on(eventHandler, eventHandlers[eventHandler][i]);
                        }
                    }
                } else {
                    if (eventHandler === 'init') {
                        eventHandlers[eventHandler](this.props.myDropzone);
                    } else {
                        this.props.myDropzone.on(eventHandler, eventHandlers[eventHandler]);
                    }
                }
            }
        }
    }

    initializeDropzone(){
        var options = this.getDjsConfig();
        Dropzone = Dropzone || require('dropzone');
        Dropzone.autoDiscover = false;
        if (!this.props.config.postUrl && !this.props.eventHandlers.drop) {
            console.info('Neither postUrl nor a "drop" eventHandler specified, the React-Dropzone component might misbehave.');
        }

        var dropzoneNode = this.props.config.dropzoneSelector || ReactDOM.findDOMNode(this);

        let dropzone = new Dropzone(dropzoneNode, options);

        let userProvidedEvents = this.props.eventHandlers

        if(userProvidedEvents) this.UpdateEvents(userProvidedEvents)

        if (!this.props.myDropzone) this.props.dispatch(actions.initialize(this.props.name, dropzone))
    }

    /**
     * React 'componentWillUnmount'
     * Removes dropzone.js (and all its globals) if the component is being unmounted
     */
    componentWillUnmount() {
        if (this.props.myDropzone) {
            var files = this.props.myDropzone.getActiveFiles();

            if (files.length > 0) {
                // Well, seems like we still have stuff uploading.
                // This is dirty, but let's keep trying to get rid
                // of the dropzone until we're done here.
                this.queueDestroy = true;

                var destroyInterval = window.setInterval(() => {
                    if (this.queueDestroy = false) {
                        return window.clearInterval(destroyInterval);
                    }

                    if (this.props.myDropzone.getActiveFiles().length === 0) {
                        this.props.myDropzone = this.destroy(this.props.myDropzone);
                        return window.clearInterval(destroyInterval);
                    }
                }, 500);
            } else {
                //this.dropzone = this.destroy(this.dropzone);
                this.props.myDropzone.destroy()//  dispatch(actions.destroy())
            }
        }
    }


    /**
     * React 'componentDidUpdate'
     * If the Dropzone hasn't been created, create it
     */
    componentDidUpdate() {
        this.queueDestroy = false;
        if (!this.props.myDropzone) {
            this.initializeDropzone()
        }
    }

    /**
     * React 'componentWillUpdate'
     * Update Dropzone options each time the component updates.
     */
    componentWillUpdate(nextProps, nextState) {
        var djsConfigObj, postUrlConfigObj;
        if (this.props.djsConfig === nextProps.djsConfig && this.props.config.postUrl === nextProps.config.postUrl ) return
        if (!this.props.myDropzone) return

        djsConfigObj = this.props.djsConfig ? this.props.djsConfig : {}
        try {
            postUrlConfigObj = this.props.config.postUrl ? {url: this.props.config.postUrl} : {};
        } catch (err) {
            postUrlConfigObj = {};
        }

        this.props.dispatch(actions.update_options(this.props.name, djsConfigObj, postUrlConfigObj))
    }

    componentWillMount() {
        this.localTheme = Object.assign({}, theme, this.props.theme)
    }


    /*renderProgressBar(){
        if (this.state.sending)
            return (<this.props.totalProgressComponent key={0} progress={this.state.totalProgress} />)
        else
            return null
    }*/

    /**
     * React 'render'
     */
    render() {
        var icons = [],
            files = this.props.files,
            config = this.props.config,

        className = this.props.includeDefaultDropzoneFilePickerTheme ? 'filepicker dropzone' : ''  // to work with default styles defined by dropzone.js
        if(this.localTheme['filepicker'])
            className += ' ' + this.localTheme['filepicker']
        if(this.localTheme['dropzone'])
            className += ' ' + this.localTheme['dropzone']


        var defaultMessage = null
        if (this.props.djsConfig.dictDefaultMessage !== false && (!files || files.length < 1))
            defaultMessage = <div key={5} className={this.localTheme['default-msg']}>{this.props.djsConfig.dictDefaultMessage || "Drop files here to upload"}</div>

        if (config.showFiletypeIcon && config.iconFiletypes && (!files || files.length < 1)) {
            for (var i = 0; i < this.props.config.iconFiletypes.length; i = i + 1) {
                // show icons if no files are loaded
                icons.push(<IconComponent styles={{...this.localTheme}} filetype={this.props.config.iconFiletypes[i]} key={"icon-component" + i}/>);
            }
        }

        let childrenElements = [
            this.props.showProgressBarInComponent ? <TotalUploadProgressBar name={this.props.name} theme={this.localTheme} key={0}/> : null,
            <div key={'icon_parent_1'} style={{textAlign: "center"}}>{icons}</div>,
            this.props.children,
            this.props.showFileViewInComponent ? <UploadedFileRenderer name={this.props.name} theme={this.localTheme} key={2}/> : null,  // if true, then we will render files added to this component using uplaodedfilerenderer
            defaultMessage
        ]

        return (
            (!this.props.config.postUrl && this.props.action) ?
                <div style={this.props.hidden ? {display: 'none'} : undefined } className={this.localTheme['react-dropzone-parent']}>
                    <form action={this.props.action} className={className}>
                        {childrenElements}
                    </form>
                </div>
            :
                <div style={this.props.hidden ? {display: 'none'} : undefined } className={this.localTheme['react-dropzone-parent']}>
                        <div className={className}>
                           {childrenElements}
                    </div>
                </div>
        )
    }

}

DropzoneReactComponent.propTypes = {
    name: React.PropTypes.string.isRequired,
}

DropzoneReactComponent.defaultProps = {
  hidden: false,
  config: {},
  eventHandlers: {},
  theme: {},
  includeDefaultDropzoneFilePickerTheme: true,
  showFileViewInComponent: true,
  showProgressBarInComponent: true,
  actions: {}
}

/*Creating container */
const StateToProps = (state, props) => {
    let dropzoneStateKey = props.dropzoneStateKey || 'dropzone'

    if (!(state[dropzoneStateKey].hasOwnProperty(props.name))){
        /* dropzone element has not been intialized yet */
        return {
            myDropzone: null,
            status: {},
            numSuccess: 0,
            files: [],
            progress: 0,
            refreshed: 1
        }
    }

    let localDropzone = state[dropzoneStateKey][props.name]
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
        myDropzone: localDropzone.myDropzone,
        status: uploadStatus,
        numSuccess: mappedStatus['success'],
        files: localDropzone.files,
        progress: localDropzone.totalProgress,
        refreshed: state.dropzone.forceRefresh
    }
}

const DispatchToProps = (dispatch) => {
    return {
    }
}

export const DropzoneReduxComponent = connect(StateToProps)(DropzoneReactComponent)
