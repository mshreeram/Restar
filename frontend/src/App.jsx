import './assets/styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import Header from './components/Header';

function App() {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<RestaurantList />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
