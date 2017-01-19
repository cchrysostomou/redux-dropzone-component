import * as types from './action_types.js'


export function updateProgress(name, totalUploadProgress, totalBytes, totalBytesSent){
    return {type: types.UPDATE_TOTAL_PROGRESS, name: name, progress: totalUploadProgress}
}

export function initialize(name, dropzone){  //, eventHandlers={}, userEvents={}){
    return {type: types.INITIALIZE, name: name, dropzone: dropzone} //eventHandlers: eventHandlers, , moreEvents: userEvents}
}

export function updateEventHandlers(name, eventHandlers){
    return {type: types.UPDATE_EVENTS, name: name, eventHandlers: eventHandlers}
}

export function refresh(name){
    return {type: types.REFRESH, name: name}
}

export function file_was_added(name, file){

    return {name: name, type: types.ADD_FILE, file: file}
}


export function file_was_removed(name, file){
    return {name: name, type: types.DELETE_FILE, file: file}
}

export function error_was_reported(name, file, message){
    return {name: name, type: types.RECORD_ERROR, files: file, message: message}
}

export function update_options(name, djsConfigObj, url){
    return {name: name, type: types.UPDATE_OPTIONS, djsConfigObj: djsConfigObj, postUrlConfigObj: url}
}
