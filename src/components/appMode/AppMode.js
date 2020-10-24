import React from 'react'
import s from './AppMode.module.css'

const AppMode = () => {
  return (
    <div id={s.radial}>
      <div id={s.blueLayer}>
        <div id={s.modeBg}>
          <div id={s.fullCircle}>
            <div id={s.halfCircle}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppMode