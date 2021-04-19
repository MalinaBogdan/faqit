import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { UseRoutes } from './routes';
import 'materialize-css'


function App() {
  const { token, login, logout, userId, like } = useAuth()
  const isAuthenticated = !!token
  const routes = UseRoutes(isAuthenticated)

  return (
      <AuthContext.Provider value = {{
        token, login, logout, userId, isAuthenticated, like
      }}>
        <Router>
          <div className="container">
            {routes}
          </div>
        </Router>
      </AuthContext.Provider>
  );
}

export default App
