import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { themr } from 'react-css-themr';
import { PROGRESS_BAR } from '../identifiers.js';
import prefixer from '../utils/prefixer.js';


class Icon extends Component{
  render(){
    // console.log(this.props.status)
    // translate(18,18), scale(1)
    // translate(6,6), sale(2)
    if (this.props.status === "added" || this.props.status === "queued")
      return (<g className={this.props.status}  key={3} transform="translate(42, 18) rotate(90)"><path fill="#000000" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></g>)
    else if (this.props.status === "uploading")
      return (<g className={this.props.status}  key={3} transform="translate(18, 18) scale(1)"><path fill="#000000" d="M18,18H6V6H18V18Z" /></g>)
    else if (this.props.status === "success")
      return (<g className={this.props.status} key={3} transform="translate(47,12) rotate(90) scale(1.5)"><path fill="#000000" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></g>)
    // else if (this.props.status === "success" && this.state.hover === true) icon=(<g transform="translate(42, 18) rotate(90)">    <path fill="#000000" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></g>)
    else
      return (<g className={'issue'} key={3} transform="translate(47,12) rotate(90) scale(1.5)"><path fill="#000000" d="M13,13H11V7H13M12,17.3A1.3,1.3 0 0,1 10.7,16A1.3,1.3 0 0,1 12,14.7A1.3,1.3 0 0,1 13.3,16A1.3,1.3 0 0,1 12,17.3M15.73,3H8.27L3,8.27V15.73L8.27,21H15.73L21,15.73V8.27L15.73,3Z" /></g>)
  }
}


class ProgressBar extends Component {
  static propTypes = {
    buffer: PropTypes.number,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    mode: PropTypes.oneOf(['determinate', 'indeterminate']),
    multicolor: PropTypes.bool,
    theme: PropTypes.shape({
      buffer: PropTypes.string,
      circle: PropTypes.string,
      circular: PropTypes.string,
      indeterminate: PropTypes.string,
      linear: PropTypes.string,
      multicolor: PropTypes.string,
      path: PropTypes.string,
      value: PropTypes.string
    }),
    type: PropTypes.oneOf(['linear', 'circular']),
    value: PropTypes.number
  };




  static defaultProps = {
    buffer: 0,
    className: '',
    max: 100,
    min: 0,
    mode: 'indeterminate',
    multicolor: false,
    type: 'linear',
    value: 0,
    rad: 20
  };

  constructor(props) {
      super(props);
      this.state = {
          hover: false
      }
      this.mouseOver = this.mouseOver.bind(this)
      this.mouseOut = this.mouseOut.bind(this)
    }

    mouseOver() {
        this.setState({hover: true});
    }

    mouseOut() {
        this.setState({hover: false});
    }

  calculateRatio (value) {
    if (value < this.props.min) return 0;
    if (value > this.props.max) return 1;
    return (value - this.props.min) / (this.props.max - this.props.min);
  }

  circularStyle () {
    if (this.props.mode !== 'indeterminate') {
      return {strokeDasharray: `${2 * Math.PI * this.props.rad * this.calculateRatio(this.props.value)}, ${2 * Math.PI * this.props.rad}`};
    }
  }

  linearStyle () {
    if (this.props.mode !== 'indeterminate') {
      return {
        buffer: prefixer({transform: `scaleX(${this.calculateRatio(this.props.buffer)})`}),
        value: prefixer({transform: `scaleX(${this.calculateRatio(this.props.value)})`})
      };
    } else {
      return {};
    }
  }

  renderCircular () {
    var icon
    var tooltipvalue

    let style = {cursor: 'pointer'}
    if (this.state.hover) style = Object.assign(style, {fill: 'red'})

    if (this.props.status === "added" || this.props.status === "queued") tooltipvalue='Upload'
    else if (this.props.status === "uploading") tooltipvalue='Cancel'
    else if (this.props.status === "success") tooltipvalue=''
    else tooltipvalue = ''


    return (
      <div style={style} onMouseOut={this.mouseOut} onMouseOver={this.mouseOver} title={tooltipvalue} >
        <svg style={{pointerEvents: 'none'}} className={this.props.theme.circle + ' ' + this.props.theme['progress-icon']} viewBox="0 0 60 60">
          <g>
            {this.props.status !== 'success' && <circle key={1} style={style} style={{strokeWidth: '1', stroke: 'black', fill: 'transparent'}} cx='30' cy='30' r={this.props.rad} />}
            {this.props.status !== 'success' && <circle key={2} style={style} className={this.props.theme.path} style={this.circularStyle()} cx='30' cy='30' r={this.props.rad} /> }
            <Icon status={this.props.status}/>
          </g>
        </svg>
      </div>
    );
  }

  renderLinear () {
    const {buffer, value} = this.linearStyle();
    return (
      <div>
        <span ref='buffer' data-ref='buffer' className={this.props.theme.buffer} style={buffer}/>
        <span ref='value' data-ref='value' className={this.props.theme.value} style={value}/>
      </div>
    );
  }

  render () {
    const { className, disabled, max, min, mode, multicolor, type, theme, value } = this.props;
    const _className = classnames(theme[type], {
      [theme[mode]]: mode,
      [theme.multicolor]: multicolor
    }, className);

    return (
      <div
        disabled={disabled}
        data-react-toolbox='progress-bar'
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        className={_className}
        onClick={this.props.onClick}
      >
        {type === 'circular' ? this.renderCircular() : this.renderLinear()}
      </div>
    );
  }
}

export default themr(PROGRESS_BAR)(ProgressBar);
export { ProgressBar };
