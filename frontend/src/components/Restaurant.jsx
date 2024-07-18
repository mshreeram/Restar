import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/App.css';

function Restaurant({ restaurant }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/restaurant/${ restaurant.restaurantId }`);
    };

    if (!restaurant || restaurant.length === 0) {
        return <div>No restaurants available</div>;
    }

    const textColor = (restaurant.ratingColor.includes("Green")) ? 'White' : 'Black';
    return (
        <div className='res-card' onClick={ handleClick }>
            {/* <img className='res-image' src='https://b.zmtcdn.com/data/pictures/6/19928936/1623001c6530188630e0ec9912bf1061_o2_featured_v2.jpg?output-format=webp' alt={restaurant.restaurantName} /> */}
            <div className='info'>
                <div className='name-rating'>
                    <div className='restaurantName'>{ restaurant.restaurantName }</div>
                    <div className='aggregateRating' style={ { backgroundColor: `${ restaurant.ratingColor.replace(/ /g,'') }`, color: textColor } }>{ restaurant.aggregateRating }</div>
                </div>
                <div className='cost-Two'>
                    <div className='cuisines'>{ restaurant.cuisines }</div>
                    <div className='averageCostForTwo'>₹{ restaurant.averageCostForTwo } for Two</div>
                </div>
                <div className='place-dist'>
                    <div className='locality'>{ restaurant.locality }</div>
                    <div className='distance'>{ restaurant.distance } km</div>
                </div>
            </div>
        </div>
    );
}

export default Restaurant;
