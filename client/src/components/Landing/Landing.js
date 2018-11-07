import React, {Component} from "react";
import "./Landing.css";
import {Link} from "react-router-dom";

//Landing page Component, contains path to main /game page.
class Landing extends Component {
  render() {
    return (
      <div className="landingContainer" id="landingPage">
        <div className="container">
          <h1 className="landingHeader">ELEMENTS</h1>
          <Link to="/game" className="landingButton">START</Link>
          <a
            href="https://docs.google.com/document/d/1HHIA1LgYNFDwX3jqK-7cGXw943NPmsdY-GeA4rEfUAA/edit?usp=sharing"
            className="rulesButton">RULES</a>
        </div>
      </div>
    )
  }
}
export default Landing
