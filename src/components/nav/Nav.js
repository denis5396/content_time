import React, { useRef, useContext } from 'react'
import { UserContext } from '../../contexts/User'
import AppMode from '../appMode/AppMode'
import s from './nav.module.css'

const Nav = () => {
  const {user, setUser} = useContext(UserContext)
  const active = useRef(null);
  const news = useRef(null)
  const home = useRef(null)
  const search = useRef(null)
  const info = useRef(null)

  const changeActive = (nodeName) => {
    let count = 1;
    const txt = nodeName.textContent.toLowerCase()
    switch (txt) {
      case 'news':
        count = 1;
        active.current.style.transform = `translateX(${8.7 * count}rem)`
        break;
      case 'home':
        count = 0
        active.current.style.transform = `translateX(${9.1 * count}rem)`
        break;
      case 'search':
        count = 4
        active.current.style.transform = `translateX(${9.35 * count}rem)`
        break;
      case 'info':
        count = 5
        active.current.style.transform = `translateX(${9.2 * count}rem)`
        break;
    }
  }

  return (
    <>
      
      <nav id={s.nav}>
        <button><i class="fas fa-user-circle"></i></button>
        <div id={s.navBody}>
        <ul>
          <img src={require('../../assets/img/hiclipart.com.png')} id={s.logo} />
          <li onClick={() => changeActive(home.current)}>
            <a href="#" class={s.current} ref={home}>Home</a></li>
          <li onClick={() => changeActive(news.current)} ref={news}><a href="#">News</a></li>
          <li><a style={{ fontSize: '2rem' }}>Content Time</a></li>
          <li onClick={() => changeActive(search.current)}><a href="#" ref={search}>Search</a></li>
          <li onClick={() => changeActive(info.current)}><a href="#" ref={info}>Info</a></li>
        </ul>
        <div id={s.activeLine}>
          <div id={s.activeSlider} ref={active}></div>
        </div>
        {/* <AppMode /> */}
        </div>
      </nav>

    </>
  )
}

export default Nav