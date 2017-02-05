## Extension of the React-Dropzone-Component (with Dropzone.js) for React

This is an extension of the [react-dropzone-component](http://https://github.com/felixrieseberg/React-Dropzone-Component). The react-drozpone component allows users to "drag and drop" files into an upload area using [Dropzone.js](http://www.dropzonejs.com/).
This purpose of the redux-dropzone-component is to provide an added layer of functionality using ReactJS. It connects the dropzone into a global redux store, and allowing users to render components using any custom react component without have to convert the component to raw HTML as required in react-dropzone-component. In other words, Dropzone.js no longer controls the UI, but instead is only required for functionality and triggering event listeners. All information in the dropzone component is stored in the redux store to be accessed by other components.

Using this component allows users to easily render any UI they want around their dropzones. In one example below, we show how to use this to mimic the [bootstrap-like upload component designed by dropzone.js](http://www.dropzonejs.com/bootstrap.html).

## Detailed Description
This describes the design of the component and what features can be modified by users. This repository also provides users with simple "drop-in" components that should work out of the box (See examples below).

### React Components 
There are three essential pieces that make up the redux-dropzone-component:

1. `<DropzoneReduxComponent/>` (required) - This is the most important component responsible for initializing a dropzone object and must always be used to create a dropzone state. 
2. `<UploadedFileComponent/>` - This component can be seen as a template for rendering dropped objects stored in the dropzone state. It is optional, can be placed anywhere in an APP, and can use any custom component designed by user.
3. `<TotalUploadProgressBar/>` - This component can be seen as a template for rendering the total progress of the upload state. Similarly to uploaded-files-component, it is optional , can be placed anywhere, and can use any custom component designed by the user, but usually a progress bar makes the most sense.

#### DropzoneReduxComponent:

The `<DropzoneReduxComponent/>` is responsible for linking dropzone.js to the redux store. As dropzone objects are intialized and files are uploaded via dropzone.js, dispatches are passed to store the information in the global state. By default the redux dropzone component provides three UI layers:

1. A "box" component for dropping in and accepting files (this of course can be overwridden via the config object in props where you change the dropzoneSelector in props.config
2. A default comonent for rendering all added files inside this component (can be turned off via props.showFileViewInComponent)
3. A default component for rendering a progress bar for showing current progress in dropzone (can be turned off via props.showProgressBarInComponent)

**Properties**

| Name              | Type                  | Default     | Description|
|:-----|:-----|:-----|:-----|
| `name` (Required)         | `String`             |      | This is a string value that is used to differentiate multiple dropzone components in the same app. For example if you have three areas in the webpage for dropping objects, then each component will have a unique name to identify how to access the dropped files in each individual component from the redux store. This is also very useful for connecting multiple components outside of redux-dropzone-component (i.e. render individual files in some other area in a webpage. See examples below)|
| `dropzoneStateKey`          | `String`             | `dropzone`     | This tells the component where to find the "dropzone" object in the redux store. It is used during the StateToProps function. If it cannot find this object in the store then it will not work correctly. By default the statekey is dropzone unless changed by the user during createStore|
| `hidden`          | `Boolean`             | `false`     | Indicates whether an actual "drop-files-here" component should be rendered (i.e. whether the default dropzone box shows up in the webpage). It makes sense to hide the component when you just want to attach a dropzone state (i.e. keep track of added files) for files uploaded via a button but not allow users to drop in files.|
| `config`          | `Object`             | `{}`     | This object defines all of the configuration settings that are used by [react-dropzone-component](http://https://github.com/felixrieseberg/React-Dropzone-Component)|
| `djsConfig`          | `Object`             | `{}`     | This object defines all of the configuration settings that will be passed to [Dropzone.js](http://www.dropzonejs.com/#configuration)|
| `eventHandlers`          | `Object`             | `{}`     | This object allows users to attach their own functions two events triggered by dropzone.js. It again gets passed to [Dropzone.js](http://www.dropzonejs.com/#events)|
| `theme`          | `Object`             | `{}`     | Allows custom styling of objects|
| `includeDefaultDropzoneFilePickerTheme`          | `Boolean`             | `true`     | Indicates whether we should pass-in 'filepicker' and 'dropzone' classname so that the styles can match those provided by Dropzone.js |
| `showFileViewInComponent`          | `Boolean`             | `true`     | Indicates whether we should render 'dropped files' inside this component. Set this to false if you want to render files somewhere else in the App. |
| `showProgressBarInComponent`          | `Boolean`             | `true`     | Indicates whether we should render a total progress bar inside this component. Set this to false if you want to render a progress bar elsewhere or do not want one to appear. |
| `deleteFileUrl` | `String` |  | A url string that can be called for performing a Fetch request to delete the current file of interest from a server via an id prop. This is only necessary if you are uploading files to a server via url config.

#### UploadedFileComponent

The component `<UploadedFileComponent/>` is used to render all files dropped into a dropzone object linked by the props name (When creating a `<DropzoneReduxComponent/>` the user defines a name to uniquely identify this object in the global state). If defined then this component acts simple as a wrapper which loops through all files in a dropzone object and passes information from each file as props into a custom render component defined by the user. 

**Properties**


| Name              | Type                  | Default     | Description|
|:-----|:-----|:-----|:-----|
| `name` (Required)         | `String`             |      | This is a string value that is used to link files to render with files added to a dropzone object|
| `fileViewTemplate` (Required)         | `React Component`             | <DefaultFileView/> defined in defaults folder     | This is the component that will be used to render each individual file. **Important: If a user is defining their own custom component, then they should expect the [following props](#passing-properties-into-custom-component) to be passed into their component** |
| `actions` | `object` | {} | Users can override the default actions , onUpload, onDelete, and onStop via this props. They can also add in any other custom action they want to be passed into their custom component render-er |

##### Passing properties into custom component #####

The following properties will be passed via the `<UploadedFileComponent/>` wrapper to the user provided template

| Name              | Type                  | Source     | Description|
|:-----|:-----|:-----|:-----|
| `theme` | `object` | uploaded-files-theme from themes folder | an object defining the stylesheet |
| `fileData` | `object` | file object provided by dropzone.js | an object containing all information about the file => {name: name of file, size: size of file, status: whether it is uploading or not [added|queued|uploading], error: any errors passed from dropzone, upload: {progress: current upload progress}} |
| `onUpload` | `function` | default function or provided by user | an action/function that accepts a single dropzone file object and decides what action to take if uploading. |
| `onDelete` | `function` | default function or provided by user |  an action/function that accepts a single dropzone file object and decides what action to take if deleting the file |
| `onStop` | `function` |  default function or provided by user | an action/function that accepts a single dropzone file object and decides what action to take if user stops upload. (6) any other actions passed in by user via props.actions |

#### TotalUploadProgressBar

The component `<TotalUploadProgressBar/>` is used to provide a UI illustrating the total progress of the upload state (have  all files within a dropzone object completed processing).  If defined then this component acts simple as a wrapper which passes in the current progress state. 

**Properties**

| Name              | Type                  | Default     | Description|
|:-----|:-----|:-----|:-----|
| `name` (Required)         | `String`             |      | This is a string value that is used to link files to render with files added to a dropzone object|
| `progress_ui` (Required)         | `React Component`             | <DefaultProgressBar/> defined in defaults folder     | This is the component that will be used to render a UI for illustrating the total progress (i.e. a progress bar). **Important If a user is defining their own custom component, then the [following props](#passing-properties-into-progress-custom-component) will be passed into their component** |

##### Passing properties into progress custom component #####

The following properties will be passed via the `<TotalUploadProgressBar/>` wrapper to the user provided template

| Name              | Type                  | Source     | Description|
|:-----|:-----|:-----|:-----|
| `progress` | `Number` | passed in from global store | A percentage representing the status of all processing files |


### Redux Store Structure
