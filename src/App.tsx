import { useState } from 'react'
import './App.scss'

import Header from './components/Header'
import Keyboard from './components/Keyboard'
import Words from './components/Words'

const App = () => {
  return (
    <div className="wrapper">
      <Header />
      <main>
        <Words />
        <Keyboard />
      </main>
    </div>
  )
};

export default App;
