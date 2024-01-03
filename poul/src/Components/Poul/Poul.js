// Poul.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Poul.css';

const Poul = () => {
    const [productionData, setProductionData] = useState([]);
    const [formData, setFormData] = useState({
        productionNumber: '',
        numberOfHens: '' ,
        eggsLaid: '',
        quantityOfMeatSold: '',
        feedConsumption: '',
        waterConsumption: '',
        mortalityRate: '',
        vaccinationDate: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [axiosError, setAxiosError] = useState(null);

    useEffect(() => {
        fetchProductionData();
    }, []);

    const fetchProductionData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/poultry');
            setProductionData(response.data);
            setAxiosError(null); // Clear error if successful
        } catch (error) {
            console.error('Error fetching production data:', error);
            setAxiosError('Error fetching production data. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing production data
                await axios.put(`http://localhost:3000/poultry/${editingId}`, formData);
            } else {
                // Add new production data
                await axios.post('http://localhost:3000/poultry', formData);
            }
            // Refresh production data after successful submission
            fetchProductionData();
            setFormData({
                productionNumber: '',
                numberOfHens: '',
                eggsLaid: '',
                quantityOfMeatSold: '',
                feedConsumption: '',
                waterConsumption: '',
                mortalityRate: '',
                vaccinationDate: ''
            });
            setEditingId(null);
        } catch (error) {
            console.error('Error submitting data:', error);
            setAxiosError('Error submitting data. Please try again.');
        }
    };

    const handleEdit = (id) => {
        const editingData = productionData.find((data) => data._id === id);

        if (editingData) {
            setFormData(editingData);
            setEditingId(id);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/poultry/${id}`);
            fetchProductionData(); // Refresh data after deletion
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    return (
        <div>

            {axiosError && <p className="error-message">{axiosError}</p>}


            <form onSubmit={handleSubmit}>
                <h2 >Poultry Production Form</h2>
                <label className='labelclass'>
                    Production Number:
                    <input
                        type="number"
                        name="productionNumber"
                        value={formData.productionNumber}
                        onChange={handleInputChange}
                    />
                </label>
                <label className='labelclass'>
                    Number of Hens:
                    <input
                        type="number"
                        name="numberOfHens"
                        value={formData.numberOfHens}
                        onChange={handleInputChange}
                    />
                </label >
                <label className='labelclass'>
                    Eggs Laid:
                    <input
                        type="number"
                        name="eggsLaid"
                        value={formData.eggsLaid}
                        onChange={handleInputChange}
                    />
                </label>
                <label className='labelclass'>
                    Quantity of Meat Sold:
                    <input
                        type="number"
                        name="quantityOfMeatSold"
                        value={formData.quantityOfMeatSold}
                        onChange={handleInputChange}
                    />
                </label>
                <label className='labelclass'>
                    Feed Consumption (kg):
                    <input
                        type="number"
                        name="feedConsumption"
                        value={formData.feedConsumption}
                        onChange={handleInputChange}
                    />
                </label>
                <label className='labelclass'>
                    Water Consumption (litres):
                    <input
                        type="number"
                        name="waterConsumption"
                        value={formData.waterConsumption}
                        onChange={handleInputChange}
                    />
                </label>
                <label className='labelclass'>
                    Mortality Rate (%):
                    <input
                        type="number"
                        name="mortalityRate"
                        value={formData.mortalityRate}
                        onChange={handleInputChange}
                    />
                </label>
                <label className='labelclass'>
                    Vaccination Date:
                    <input
                        type="date"
                        name="vaccinationDate"
                        value={formData.vaccinationDate}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
            </form>

            <h2>Poultry Production Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>Production Number</th>
                        <th>Number of Hens</th>
                        <th>Eggs Laid</th>
                        <th>Quantity of Meat Sold</th>
                        <th>Feed Consumption (kg)</th>
                        <th>Water Consumption (litres)</th>
                        <th>Mortality Rate (%)</th>
                        <th>Vaccination Date</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {productionData.map((data) => (
                        <tr key={data._id}>
                            <td>{data.productionNumber}</td>
                            <td>{data.numberOfHens}</td>
                            <td>{data.eggsLaid}</td>
                            <td>{data.quantityOfMeatSold}</td>
                            <td>{data.feedConsumption}</td>
                            <td>{data.waterConsumption}</td>
                            <td>{data.mortalityRate}</td>
                            <td>{data.vaccinationDate}</td>
                            <td>
                                <button onClick={() => handleEdit(data._id)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(data._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Poul;
