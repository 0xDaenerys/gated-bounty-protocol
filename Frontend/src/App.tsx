import './App.css'
import { WalletProvider } from './components'
import { AppProvider } from './contexts/AppContext';
import { Interface } from './Interface';

function App() {
  return (
    <WalletProvider>
      <AppProvider>
        <Interface />
      </AppProvider>
    </WalletProvider>
  )
}

export default App
