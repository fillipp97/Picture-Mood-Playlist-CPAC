import { Component } from "react";
import React, { useState } from 'react';
import './DropDownBox.css'

import { ReactComponent as BellIcon } from './icons/bell.svg'
import { ReactComponent as MessengerIcon } from './icons/messenger.svg';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as CogIcon } from './icons/cog.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import { ReactComponent as BoltIcon } from './icons/bolt.svg';
import { ReactComponent as AudioIcon } from './icons/audio.svg';
import { ReactComponent as PlayerIcon } from './icons/ipod-player.svg';
import { ReactComponent as MusicIcon1 } from './icons/music1.svg';
import { ReactComponent as MusicIcon2 } from './icons/music2.svg';
import { ReactComponent as MusicIcon3 } from './icons/music3.svg';
import { ReactComponent as MusicIcon4 } from './icons/music4.svg';

class DropDownBox extends React.Component {
    render() {
       return (
          <Navbar>
            <NavItem icon={<PlusIcon />} />
            <NavItem icon={<BellIcon />} />
            <NavItem icon={<CaretIcon />} />
            <NavItem icon={<CogIcon />} />
            <NavItem icon={<ChevronIcon />} />
            <NavItem icon={<BoltIcon />} />
            <NavItem icon={<ArrowIcon />} />
            <NavItem icon={<PlayerIcon />} />     
            <NavItem icon={<MusicIcon1 />} />
            <NavItem icon={<MusicIcon2 />} />
            <NavItem icon={<MusicIcon3 />} />
            <NavItem icon={<MusicIcon4 />} />

          </Navbar> 
        );
    
    }
}

class Navbar extends React.Component {
    render() {
      return (
        <nav className="navbar">
          <ul className="navbar-nav">{this.props.children}</ul>
        </nav>
      );
      }
}


  
class NavItem extends React.Component {
    render() {
      return (
        <li className="nav-item">
          <a href="#" className="icon-button">
            {this.props.icon}     
          </a>    
        </li>
      )
      
      }
  }
  
export default DropDownBox