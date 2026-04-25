import { RouterProvider } from 'react-router-dom'
import { route } from './Router'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (

    <AuthProvider>
      <CartProvider>
        <RouterProvider router={route} />
      </CartProvider>
    </AuthProvider>


  )
}

export default App
