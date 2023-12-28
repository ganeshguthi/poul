const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection setup (replace 'your_db_name' with your database name)
mongoose.connect('mongodb://localhost:27017/Hens', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Poultry production data schema and model
const poultrySchema = new mongoose.Schema({
  productionNumber: Number,
  numberOfHens: Number,
  eggsLaid: Number,
  quantityOfMeatSold: Number,
  feedConsumption: Number,
  waterConsumption: Number,
  mortalityRate: Number,
  vaccinationDate: Date, // Changed to Date type
});

const Poultry = mongoose.model('Poultry', poultrySchema);

// Routes

// GET all poultry data
app.get('/poultry', async (req, res) => {
  try {
    const productionData = await Poultry.find();
    res.json(productionData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to add new poultry data
app.post('/poultry', async (req, res) => {
  try {
    const {
      productionNumber,
      numberOfHens,
      eggsLaid,
      quantityOfMeatSold,
      feedConsumption,
      waterConsumption,
      mortalityRate,
      vaccinationDate
    } = req.body;

    // Create a new Poultry instance with the received data
    const newPoultryData = new Poultry({
      productionNumber,
      numberOfHens,
      eggsLaid,
      quantityOfMeatSold,
      feedConsumption,
      waterConsumption,
      mortalityRate,
      vaccinationDate: new Date(vaccinationDate) // Convert to Date object
    });

    const createdData = await newPoultryData.save(); // Save the new data

    res.status(201).json(createdData);
  } catch (error) {
    res.status(500).json({ message: 'Error adding new poultry data', error: error.message });
  }
});

// PUT route to update existing poultry data by ID
app.put('/poultry/:id', async (req, res) => {
  try {
    const poultryId = req.params.id;
    const updatedData = req.body;

    const existingData = await Poultry.findByIdAndUpdate(poultryId, updatedData, { new: true });

    if (!existingData) {
      return res.status(404).json({ message: 'Poultry data not found' });
    }

    res.json(existingData);
  } catch (error) {
     res.status(500).json({ message: 'Error updating poultry data', error: error.message });
  }
});

// DELETE route to delete a poultry document by ID
app.delete('/poultry/:id', async (req, res) => {
  try {
    const poultryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(poultryId)) {
      return res.status(400).json({ message: 'Invalid Poultry ID' });
    }

    const deletedData = await Poultry.findByIdAndDelete(poultryId);

    if (!deletedData) {
      return res.status(404).json({ message: 'Poultry data not found' });
    }

    res.json({ message: 'Poultry data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error: error.message });
  }
});

// Other routes and configurations can be added here...

// Start server
const PORT = 3000; // You can change the port number if needed
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
