import React from 'react'
import mod from './Cards.module.css'

function CardC(props) {
  return (
    <div className={`${mod.cardC} ${props.className?props.className:''}`}>{props.children}</div>
  )
}

export default CardC