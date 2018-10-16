import React from "react";
import "./Landing.css"
import { Link } from "react-router-dom"


const Landing = () => {

  return (
    <div className="Landing_container">
      <Link to="/game" className="Landing_button" >startgame</Link>


    </div>

  )
}



export default Landing
