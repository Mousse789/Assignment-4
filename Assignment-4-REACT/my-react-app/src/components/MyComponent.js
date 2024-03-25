import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [hasGroceryDelivery, setHasGroceryDelivery] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://localhost:8080/settings');
        console.log('Server response:', response.data);
        setHasGroceryDelivery(response.data.hasGroceryDelivery);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Grocery Delivery Status</h2>
      <p>Has Grocery Delivery: {hasGroceryDelivery ? 'True' : 'False'}</p>
    </div>
  );
};

export default MyComponent;
