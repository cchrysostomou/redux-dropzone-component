## Extension of the React-Dropzone-Component (with Dropzone.js) for React

This is an extension of the [react-dropzone-component](http://https://github.com/felixrieseberg/React-Dropzone-Component). The react-drozpone component allows users to "drag and drop" files into an upload area using [Dropzone.js](http://www.dropzonejs.com/).
This purpose of the redux-dropzone-component is to provide an added layer of functionality using ReactJS. It connects the dropzone into a global redux store, and allowing users to render components using any custom react component without have to convert the component to raw HTML as required in react-dropzone-component. In other words, Dropzone.js no longer controls the UI, but instead is only required for functionality and triggering event listeners. All information in the dropzone component is stored in the redux store to be accessed by other components.

Using this component allows users to easily render any UI they want around their dropzones. In one example below, we show how to use this to mimic the [JQuery upload component designed by dropzone.js](http://www.dropzonejs.com/bootstrap.html).

