import { Provider } from 'react-redux'
import { store } from './store'
import { SettingsPanel } from './components'

function App() {
  return (
    <Provider store={store}>
      <SettingsPanel />
    </Provider>
  )
}

export default App
