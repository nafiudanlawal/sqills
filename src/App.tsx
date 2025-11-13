import './App.css'
import ThemeProvider from './themes/ThemeProvider'
import Child from './Child';

function App() {
  return (
    <ThemeProvider>
      <Child />
    </ThemeProvider>
  )
}

export default App
