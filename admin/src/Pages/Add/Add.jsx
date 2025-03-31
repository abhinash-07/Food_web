import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({url}) => {
  //const URL = "http://localhost:4000";
  const [image, setimage] = useState(null);  // Use null initially for no image
  const [data, setdata] = useState({
    name: "",
    description: "",
    price: "",
    category: "salad"
  });
  
  const onchangehandler = (event) => {
    const { name, value } = event.target;
    setdata(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setimage(reader.result);  
      };                              
      reader.readAsDataURL(file); 
    }
  };

  const onsubmithandler = async (event) => {
    event.preventDefault();
    
    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("description", data.description);
    formdata.append("price", Number(data.price));
    formdata.append("category", data.category);
    
    // Retrieve the file input directly from the DOM
    const fileInput = document.getElementById("image");
    const file = fileInput.files[0];  // Get the file from the input
    if (file) {
      formdata.append("image", file); // Append the file object to the form data
    }

    try {
      const response = await axios.post(`${url}/api/food/add`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setdata({
          name: "",
          description: "",
          price: "",
          category: "salad",
        });
        setimage(null); // Reset the image preview
        toast.success(response.data.message);
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading food:", error);
    }
  };

  return (
    <div className='add'>
      <form className="flex-col" onSubmit={onsubmithandler}>
        <div className="add-img-upload flex-col">
          <p>upload image</p>
          <label htmlFor="image">
            <img 
              src={image || assets.upload_area}  // If no image, show placeholder
              alt="uploaded" 
              className="src" 
            />
          </label>
          <input 
            onChange={handleImageChange} 
            type="file" 
            id="image" 
            hidden 
            required 
          />
        </div>

        <div className="product-name flex-col">
          <p>Product name</p>
          <input 
            onChange={onchangehandler} 
            value={data.name} 
            name="name" 
            type="text" 
            placeholder="Product name" 
            required 
          />
        </div>

        <div className="product-description flex-col">
          <p>Product description</p>
          <textarea 
            onChange={onchangehandler} 
            value={data.description} 
            name="description" 
            cols="30" 
            rows="10" 
            placeholder="Product description" 
            required
          ></textarea>
        </div>

        <div className="product-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onchangehandler} name="category" id="">
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onchangehandler} 
              name="price" 
              value={data.price} 
              type="number" 
              placeholder="Product price" 
              required 
            />
          </div>
        </div>

        <button type="submit" className="add-btn">Add</button>
      </form>
    </div>
  );
};

export default Add;
