import {Component,type ReactNode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './styles.css'
class ErrorBoundary extends Component<{children:ReactNode},{e:boolean}>{
  state={e:false}
  static getDerivedStateFromError(){return {e:true}}
  render(){return this.state.e?<p className="p-8">Oops, the cat knocked something over. Reload the page 🐾</p>:this.props.children}
}
createRoot(document.getElementById('root')!).render(<ErrorBoundary><App/></ErrorBoundary>)
