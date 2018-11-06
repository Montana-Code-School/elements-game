<<<<<<< HEAD
import React, { Component } from "react";
import { Grid } from "@material-ui/core";

export default class CardCount extends Component {
	render() {
		return ( <Grid
			container={true}
			direction="row"
			justify="space-around"
			alignItems="center">
			<p>{this.props.cards.water}</p>
			<p>{this.props.cards.earth}</p>
			<p>{this.props.cards.light}</p>
			<p>{this.props.cards.shadow}</p>
			<p>{this.props.cards.fire}</p>
		</Grid> )
	}
=======
import React, {Component} from "react";

const countStyle = {
  textShadow: "2px 0 10px yellow, -2px 0 10px yellow",
  color: "white"
}

export default class CardCount extends Component {
  state = {
    showTransition: false
  }

  componentDidUpdate(props, state) {
    if (props.children !== this.props.children) {
      this.setState({showTransition: true}, this.setTransitionTime)
    }
  }

  setTransitionTime = () => {
    setTimeout(()=> {
      this.setState({showTransition: false})
    }, 3000)

  }

  render () {
    return (
      <p
        style={this.state.showTransition ? countStyle : null}>
        {this.props.children}
      </p>
    )
  }
>>>>>>> 6d4cd7304fb11471aeae19dbc32c75422ad7133a
}
