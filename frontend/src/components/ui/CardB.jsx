import React from 'react'
import mod from './Cards.module.css'

function CardB(props) {
  return (
    <div className={`${mod.cardB} ${props.className?props.className:''}`} style={props.style}>{props.children}</div>
  )
}

export default CardB