import React, {PropTypes} from 'react';

var componentConfig = {}
var djsConfig = {}

class Template extends React.Component {
    constructor(props) {
        super(props);
        this.randomHash = Math.random().toString(36).substring(7);  // protects from making multiple dropzone 'clickable' buttons
    }

    componentWillMount() {
        this.parentClassName = this.props.name + '-' + this.randomHash
    }
}

Template.propTypes = {
    name: PropTypes.string.isRequired
}

export {Template}
