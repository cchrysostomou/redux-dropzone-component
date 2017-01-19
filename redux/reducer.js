import update from 'immutability-helper'
import * as types from "./action_types.js"
import merge from 'deepmerge'
import * as lodash from 'lodash'
import { combineReducers } from 'redux'

let globalId = 0

let defaultState = {}

let defaultDropzone = {
    files: [],  // stores all files currently added to element
    totalProgress: 0,
    sending: false,
    myDropzone: null,  // this will store the dropzone variable created by dropzone.js
    forceRefresh: 1
}

export const uploadReducer = (state=Object.assign({}, defaultState), action) => {
    switch(action.type){
        case types.INITIALIZE:
            let isNewName = Object.keys(state).indexOf(action.name) === -1
            if (!isNewName)
                console.error('ERROR: the provided dropzone name, ' + action.name + ', is not unique/already exists!')
            let newDropzone = update(defaultDropzone, {myDropzone: {$set: action.dropzone}})
            return update(state, {$merge: {[action.name]: newDropzone}})
        case types.UPDATE_EVENTS:
            if (!state[action.name].myDropzone)
                console.warn('WARNING: YOU NEED TO INITIALIZE A DROPZONE ELEMENT BEFORE UPDATING EVENTS SEE TYPES.INITIALIZE')
            if (state[action.name].myDropzone && action.hasOwnProperty('eventHandlers') && action.eventHandlers) UpdateEvents(state[action.name].myDropzone, action.eventHandlers)
            // we arent actualy modifying the state in this action, we are just adding listeners to the dropzone object
            return update(state, {[action.name]: {forceRefresh: {$set: -1*state[action.name].forceRefresh}}})
        case types.DELETE_FILE:
            // dropzone reports that a file was deleted..remove it from state
            var newFiles = lodash.filter(state[action.name].files, (f)=>{return !(f.name === action.file.name && f.size === action.file.size)})
            return update(state, {[action.name]: {files: {$set: newFiles}}})
        case types.UPDATE_TOTAL_PROGRESS:
            return update(state, {[action.name]: {totalProgress: {$set: action.progress}}})
        case types.ADD_FILE:
            // dropzone reports that a file was added
            // update the file that was added to dropzone element to global state
            return update(state, {[action.name]: {files: {$push: [action.file]}}})
        case types.RECORD_ERROR:
            let files_to_search = action.files instanceof Array ? action.files : [action.files]
            var newFiles = [...state[action.name].files]
            var found
            for (var i = 0; i < files_to_search.length; i++){
                found = lodash.find(newFiles, {name: files_to_search[i].name, size: files_to_search[i].size})
                if (found){
                    found.error = action.message
                }
                else{
                    console.warn('HUH?? FILE NOT FOUND!!!')
                    console.log(files_to_search[i])
                    console.log(newFiles)
                }
            }
            return update(state, {[action.name]: {files: {$set: newFiles}}})
        case types.UPDATE_OPTIONS:
            let options = Object.assign({}, state[action.name].myDropzone.options, action.djsConfigObj, action.postUrlConfigObj)
            let dropzone = state[action.name].myDropzone
            dropzone.options = options
            return update(state, {[action.name]: {myDropzone: {$set: dropzone}, forceRefresh: {$set: -1*state[action.name].forceRefresh}}})
        case types.REFRESH:
            return update(state, {[action.name]: {forceRefresh: {$set: -1*state[action.name].forceRefresh}}})
        default:
            return state
    }
}

const storeUploadReducer = combineReducers({
    dropzone: uploadReducer
})

export {storeUploadReducer}

