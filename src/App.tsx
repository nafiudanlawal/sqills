import './App.css'
import Child from './Child';
import { ThemeProvider } from './themes';

function App() {
  return (
    <ThemeProvider>
      <Child />
    </ThemeProvider>
  )
}

export default App
