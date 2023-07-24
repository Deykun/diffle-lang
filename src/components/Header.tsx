import { useState } from 'react'
import './Header.scss'

const Header = () => {
  const [count, setCount] = useState(0)

  return (
    <header className="header">
        <button>?</button>
        <h1>Diffle</h1>
        <button>rank</button>
    </header>
  )
}

export default Header;
