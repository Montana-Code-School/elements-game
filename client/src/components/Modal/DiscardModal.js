import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from "@material-ui/core"

class DiscardModal extends Component {
  componentDidMount() {
    this.modalTarget = document.createElement('div')
    this.modalTarget.className = 'modal'
    document.body.appendChild(this.modalTarget)
    this._render()
  }

  ComponentWillUpdate() {
    this._render()

  }
  ComponentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.modalTarget)
    document.body.removeChild(this.modalTarget)

  }
  _render() {
    ReactDOM.render(
      <div>{this.props.children}</div>,
      this.modalTarget
    )
  }
  render () {
    const {message} = this.props
    return(
    <Modal>
      <h1>
        {message}
      </h1>
    </Modal>
  )}
}

export default DiscardModal
