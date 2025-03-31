import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (e, orderId) => {
   const response = await axios.post(url + "/api/order/status", {
    orderId,
    status: e.target.value
   })
    if(response.data.success){
     await fetchOrders();
    }


  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) =>
                  idx === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address.firstname} {order.address.lastname}
                <p className="order -item-address">
                   <p>{order.address.street+","}</p>
                    <p>{order.address.city+"," +order.address.state +"," + order.address.zipcode}</p>

                </p>
                <p>Items:{order.items.length}</p>
                <p>Amount: ${order.amount}</p>
              </p>
            </div>

            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>

              <option value="Food is Preparing"> Food is preparing</option>
              <option value="Out for delivery ">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
