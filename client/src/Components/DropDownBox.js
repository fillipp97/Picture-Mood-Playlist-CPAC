import { Component } from "react";
import React, { useState } from 'react';
import './DropDownBox.css'
import { CSSTransition } from 'react-transition-group';

import { ReactComponent as BellIcon } from './icons/bell.svg'
import { ReactComponent as MessengerIcon } from './icons/messenger.svg';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as CogIcon } from './icons/cog.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as BoltIcon } from './icons/bolt.svg';
import { ReactComponent as AudioIcon } from './icons/audio.svg';
import { ReactComponent as MusicIcon1 } from './icons/music1.svg';
import { ReactComponent as MusicIcon2 } from './icons/music2.svg';
import { ReactComponent as MusicIcon3 } from './icons/music3.svg';
import { ReactComponent as MusicIcon4 } from './icons/music4.svg';
import { ReactComponent as ColorIcon1 } from './icons/color1.svg';
import { ReactComponent as BackIcon1 } from './icons/back1.svg';
import { ReactComponent as BackIcon2 } from './icons/back2.svg';
import { ReactComponent as BackIcon3 } from './icons/back3.svg';
import { ReactComponent as YellowIcon1 } from './icons/yellow1.svg';
import { ReactComponent as YellowIcon2 } from './icons/yellow2.svg';
import { ReactComponent as BlueIcon } from './icons/blue.svg';
import { ReactComponent as RedIcon } from './icons/red.svg';
import { ReactComponent as GreenIcon } from './icons/green.svg';
import { ReactComponent as LogoutIcon3 } from './icons/logout3.svg';
import { ReactComponent as UserIcon1 } from './icons/user1.svg';
import { ReactComponent as UserIcon2 } from './icons/user2.svg';
import { ReactComponent as UserIcon4 } from './icons/user4.svg';
import { ReactComponent as UserIcon8 } from './icons/user8.svg';







class DropDownBox extends React.Component {
    render() {
       return (
          <Navbar>

            <NavItem icon={<ColorIcon1 />} >
               <DropDownMenuColor></DropDownMenuColor>
           </NavItem>
           
           <NavItem icon={<MusicIcon3 />} />
           
            <NavItem icon={<MusicIcon4 />}>
               <DropDownMenu></DropDownMenu>
            </NavItem>

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

  
function NavItem(props) {

    const [open, setOpen] = useState(false); 
                                      
    return (
      <li className="nav-item">                             
        <a href="#" className="icon-button" onClick = {() => setOpen(!open)}> 
          {props.icon}     
        </a>
        
        {open && props.children}
  
      </li>
    )
    
  }


function DropDownMenu() {

  const [activeMenu, setActiveMenu] = useState('main'); 
  const [menuHeight, setMenuHeight] = useState(null);
  
  // make function to calculate the height
  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropDownItem(props) {
    return (
      <a href="#" className="menu-item" onClick = {() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }
  
  return ( 
    <div className="dropdown" style={{ height: menuHeight }} >

      <CSSTransition in={activeMenu === 'main'}
      unmountOnExit
      timeout={500}
      classNames='menu-primary'
        onEnter={calcHeight}>
        
        <div className='menu'>
          
         <DropDownItem
            leftIcon = {<UserIcon2 />}
            // rightIcon={<ChevronIcon />}
            goToMenu="account">
            Account
          </DropDownItem>
          
         <DropDownItem
           leftIcon={<CogIcon />}
          //  rightIcon={<ChevronIcon />}
           goToMenu = "settings">
               Settings
          </DropDownItem>

          <DropDownItem leftIcon = {<LogoutIcon3 />}> Logout </DropDownItem>

        </div>

      </CSSTransition>

      <CSSTransition in={activeMenu === 'settings'}
      unmountOnExit
      timeout={500}
      classNames='menu-secondary'
      onEnter={calcHeight}>
        
        <div className='menu'>
          <DropDownItem goToMenu="main" leftIcon={<BackIcon1 />}>
            <h5>Menu</h5>
          </DropDownItem>
      
          <DropDownItem >Volume</DropDownItem>
          <DropDownItem >Languge</DropDownItem>
          <DropDownItem ></DropDownItem>

          <DropDownItem goToMenu="main" leftIcon={<BackIcon1 />}>
            <h5>Back</h5>
          </DropDownItem>
        </div>
        
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'account'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          
          <DropDownItem ></DropDownItem>
          <DropDownItem ></DropDownItem>
          <DropDownItem goToMenu="main" leftIcon={<BackIcon1 />}>
            <h5>back</h5>
          </DropDownItem>

        </div>
      </CSSTransition>
      
     </div>
  )
}

function DropDownMenuColor() {

  const [activeMenu, setActiveMenu] = useState('main'); 
  const [menuHeight, setMenuHeight] = useState(null);
  
  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropDownItem(props) {
    return (
      <a href="#" className="menu-item" onClick = {() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }
  
  return ( 
    <div className="dropdown" style={{ height: menuHeight }} >

      <CSSTransition in={activeMenu === 'main'}
      unmountOnExit
      timeout={500}
      classNames='menu-primary'
      onEnter={calcHeight}>
        
        <div className = 'menu'>

          <DropDownItem leftIcon={<RedIcon />}>Red</DropDownItem>
          <DropDownItem leftIcon={<YellowIcon1 />}>Yellow</DropDownItem>
          <DropDownItem leftIcon={<BlueIcon />}>Blue</DropDownItem>
          <DropDownItem leftIcon={<GreenIcon />}>Green</DropDownItem>
  
        </div>

      </CSSTransition>

      
      
     </div>
  )
}
  
export default DropDownBox
