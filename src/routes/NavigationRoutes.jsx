import React from 'react'
import { BrowserRouter as Router,Routes,Route,Link } from 'react-router-dom'
import HomePage from '../pages/home/HomePage'
import AnimeDetails from '../pages/details/AnimeDetails'
import PageNotFound from '../pages/pageNotFound/PageNotFound'

const NavigationRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/anime-details/:id' element={<AnimeDetails/>} />
            <Route path='*' element={<PageNotFound/>} />
        </Routes>
    </Router>
  )
}

export default NavigationRoutes