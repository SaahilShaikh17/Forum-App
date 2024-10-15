//about.jsx
import React from 'react'
import './about.css'
export const About = () => {
  return (
    <div className='aboutPage'>
      <div className="aboutTitle">
        <h1>About Us</h1>
      </div>
      <div className='members'>
        <h1 className='aboutHeading'>Our Team</h1>
        <p>Saahil Shaikh</p>
        <p>Sachit Desai</p>
        <p>Sanjana Sharma</p>
        <p>Sehaj Saluja</p>
        <br />
      </div>
      <div className='firstPara'>
        <h1 className='aboutHeading'>How this site came to be</h1>
        <p>
          We're a team of four programmers who built this website as a college project using react. 
          Our common interest in football helped us conceptualize a website that could act as a one-stop shop for everything football.
        </p>
        <br />
      </div>
      <div className='futureScope'>
        <h1 className='aboutHeading'>How we plan to expand</h1>
        <p>
          Since our reach is restricted to the fans of the English Premier League, our first goal is to cover football leagues from across the globe.
          We plan to expand our chat room to a full fledged forum where users can create posts and discuss all things football. We also wish to add
          a live news feed so users can read the latest news directly on our website.
        </p>
      </div>
      <div></div>
    </div>
  )
}