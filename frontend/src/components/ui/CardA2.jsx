import React from 'react'
import mod from './Cards.module.css'

function CardA(props) {
  return (
    <div className={`${mod.cardA2} ${props.className?props.className:''}`}>{props.children}</div>
  )
}

export default CardA