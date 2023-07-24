import { useState } from 'react'
import './App.scss'

import Header from './components/Header'

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="wrapper">
      <Header />
      <main>
        <div>
          <p>
            POLAND
          </p>
          <p>
            ADMIRE
          </p>
          <p>
            Ready
          </p>
        </div>
        <div>
          [Keyboard]
        </div>
      </main>
    </div>
  )
};

export default App;
