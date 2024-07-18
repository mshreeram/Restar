import { useState, useEffect } from 'react';
import React from 'react';
import '../assets/styles/App.css';
import Restaurant from './Restaurant';
import RestaurantsShimmer from './RestaurantListShimmer';

function Restaurants() {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [resList, setResList] = useState([]);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); // Initial page number
    const [pageSize, setPageSize] = useState(10); // Number of items per page
    const [msg, setMsg] = useState('');
    const [filters, setFilters] = useState({
        minCost: '',
        maxCost: '',
        rating: '',
        countryCode: '',
        search: '',
    });
    const [tempFilters, setTempFilters] = useState({
        minCost: '',
        maxCost: '',
        rating: '',
        countryCode: '',
        search: '',
    });
    const [applyFilters, setApplyFilters] = useState(false);

    useEffect(() => {
        const getGeolocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        localStorage.setItem("lat", position.coords.latitude);
                        localStorage.setItem("lon", position.coords.longitude);
                    },
                    (err) => {
                        setError(err.message);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };
    
        getGeolocation();
    }, []);
    
    useEffect(() => {
        const getResList = async () => { 
            try {
                let url = `https://restar.onrender.com/restaurants?lat=${localStorage.getItem("lat")}&lon=${localStorage.getItem("lon")}&page=${pageNumber}&pageSize=${pageSize}`;
                
                if (filters.minCost || filters.maxCost || filters.rating || filters.countryCode) {
                    url += `&filter=true`;
                }

                if (filters.search) {
                    url += `&search=true&searchString=${filters.search}`;
                }

                if (filters.minCost) {
                    url += `&minCost=${filters.minCost}`;
                }
                if (filters.maxCost) {
                    url += `&maxCost=${filters.maxCost}`;
                }
                if (filters.rating) {
                    url += `&minRating=${filters.rating}`;
                }
                if (filters.countryCode) {
                    url += `&countryCode=${filters.countryCode}`;
                }
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setResList(data.restaurants);
                setMsg(data.msg);
                if (!data.restaurants.length) {
                    setMsg("You've explored all our restaurants!!!")
                }
            } catch (error) {
                setError(error.message);
            }
        };
    
        getResList();
    }, [location, pageNumber, pageSize, filters, msg]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setTempFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setApplyFilters(true);
        setPageNumber(1); // Reset to first page when filters change
    };

    const handleClearFilters = () => {
        const initialFilters = {
            minCost: '',
            maxCost: '',
            rating: '',
            countryCode: '',
            search: '',
        };
        setTempFilters(initialFilters);
        setFilters(initialFilters);
        setApplyFilters(true);
        setPageNumber(1); // Reset to first page when filters change
    };

    return (
        <div className="main-container">
            <div className='filters'>
                <label>
                    Search:
                    <input type="text" name="search" autoComplete='off' value={ tempFilters.search } onChange={ handleFilterChange } placeholder="Search by name or cuisine" />
                </label>
                <label>
                    Min Cost:
                    <input type="number" name="minCost" value={ tempFilters.minCost } onChange={ handleFilterChange } />
                </label>
                <label>
                    Max Cost:
                    <input type="number" name="maxCost" value={ tempFilters.maxCost } onChange={ handleFilterChange } />
                </label>
                <label>
                    Rating:
                    <select name="rating" value={ tempFilters.rating } onChange={ handleFilterChange }>
                        <option value="">Select</option>
                        <option value="3">3.0+ Stars</option>
                        <option value="3.5">3.5+ Stars</option>
                        <option value="4">4.0+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
                </label>
                <label>
                    Country:
                    <select name="countryCode" value={ tempFilters.countryCode } onChange={ handleFilterChange }>
                        <option value="">Select</option>
                        <option value="1">India</option>
                        <option value="14">Australia</option>
                        <option value="30">Brazil</option>
                        <option value="37">Canada</option>
                        <option value="94">Indonesia</option>
                        <option value="148">New Zealand</option>
                        <option value="162">Phillipines</option>
                        <option value="166">Qatar</option>
                        <option value="184">Singapore</option>
                        <option value="189">South Africa</option>
                        <option value="191">Sri Lanka</option>
                        <option value="208">Turkey</option>
                        <option value="214">UAE</option>
                        <option value="215">United Kingdom</option>
                        <option value="216">United States</option>

                    </select>
                </label>
                <div className="filter-buttons">
                    <button onClick={ handleApplyFilters }>Apply Filters</button>
                    <button onClick={ handleClearFilters }>Clear Filters</button>
                </div>
            </div>

            <div className='restaurants-container'>
                <div className='msg-container'><span className='msg'>{ msg }</span></div>
                {!resList.length ? (msg === "You've explored all our restaurants!!!"? <div></div> : <RestaurantsShimmer />) : (
                    <div className='restaurants'>
                        {/* Iterate through resList and pass each restaurant as props to Restaurant */}
                        {resList.map((restaurant) => (
                            <Restaurant key={ restaurant.restaurantId } restaurant={ restaurant } />
                        ))}
                    </div>
                )}
                <div className='paging'>
                    <button onClick={ () => setPageNumber(prevPage => prevPage - 1) } disabled={ pageNumber === 1 }>⏮  </button>
                    <span>Page {pageNumber}</span>
                    <button onClick={ () => setPageNumber(prevPage => prevPage + 1) } disabled={ msg === "You've explored all our restaurants!!!" }>  ⏭</button>
                </div>
            </div>
        </div>
    )
}

export default Restaurants;