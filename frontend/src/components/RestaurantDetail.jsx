import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/styles/App.css';

function RestaurantDetail() {
    const [restaurant, setRestaurant] = useState({});
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const getResInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/restaurant/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data); 
                setRestaurant(data);
            } catch (error) {
                setError(error.message);
            }
        };

        getResInfo();
    }, [id]); 

    return (
        <div className='restaurant-detail'>
            { error && <div className='error-message'>{ error }</div> }
            <h1>{ restaurant.restaurantName }</h1>
            <div className='address'>{ restaurant.address }</div>
            <hr className='separator' />
            <div className='rating'>
                { restaurant.aggregateRating }
                <div className='rating-label'>Rating</div>
            </div>
            <div className='cost'>
                { restaurant.averageCostForTwo } { restaurant.currency } for Two
            </div>
            <div className='cuisines-full'>{ restaurant.cuisines }</div>
            <hr className='separator' />
            <div className='booking-status'>
                <label>Table Booking:</label>
                <div className={ `status ${ restaurant.hasTableBooking ? 'yes' : 'no' }` }>
                    { restaurant.hasTableBooking ? 'Yes' : 'No' }
                </div>
            </div>
            <div className='booking-status'>
                <label>Online Booking:</label>
                <div className={ `status ${ restaurant.hasOnlineBooking ? 'yes' : 'no' }` }>
                    { restaurant.hasOnlineBooking ? 'Yes' : 'No' }
                </div>
            </div>
            <div className='booking-status'>
                <label>Delivering Now:</label>
                <div className={ `status ${ restaurant.isDeliveringNow ? 'yes' : 'no' }` }>
                    { restaurant.isDeliveringNow ? 'Yes' : 'No' }
                </div>
            </div>
            <hr className='separator' />
            <div className='rating-text'>{ restaurant.ratingText }</div>
        </div>
    );
}

export default RestaurantDetail;