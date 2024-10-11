'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDetailPage = ({ params }) => {
  const { id } = params; // Dynamic id from the route
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/customer/${id}`);
        setCustomer(response.data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]); // Adding 'id' as dependency

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Customer Details</h1>
      <p><strong>Name:</strong> {customer.name}</p>
      <p><strong>Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
      <p><strong>Interests:</strong> {customer.interests}</p>
    </div>
  );
};

export default CustomerDetailPage;
