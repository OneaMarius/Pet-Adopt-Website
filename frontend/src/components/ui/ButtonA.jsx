import React from 'react';
import mod from './Buttons.module.css';

function ButtonA(props) {
  return (
    <button onClick={props.onClick} className={`${mod.btn} ${props.className ? props.className : ''}`} type={props.type?props.type:'button'} style={props.style}>{props.children}</button>
  )
}

export default ButtonA