const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv') ;
const Drawing = require('./models/Drawing') ;
const cors = require('cors')
dotenv.config(); 

const app = express();


app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  res.json({"message":"Server running successfully"});
})
app.post('/save-drawing', async (req, res) => {
  const { elements, appState } = req.body;

  try {
    const newDrawing = new Drawing({
    //   title: 'Untitled Drawing', 
      elements: elements,
      appState: appState
    });

    await newDrawing.save();
    res.status(200).json({ message: 'Drawing saved successfully!' });
  } catch (error) {
    console.error('Error saving drawing:', error);
    res.status(500).json({ message: 'Failed to save drawing.' });
  }
});

// 2. Get All Drawings
app.get('drawings', async (req, res) => {
    try {
      const drawings = await Drawing.find(); // Fetch all drawings
      res.status(200).json(drawings);
    } catch (error) {
      console.error('Error fetching drawings:', error);
      res.status(500).json({ message: 'Failed to retrieve drawings.' });
    }
  });
  
  // 3. Get a Single Drawing by ID
  app.get('/drawing/:id', async (req, res) => {
    try {
      const drawing = await Drawing.findById(req.params.id); // Fetch drawing by ID
      if (!drawing) {
        return res.status(404).json({ message: 'Drawing not found' });
      }
      res.status(200).json(drawing);
    } catch (error) {
      console.error('Error fetching drawing:', error);
      res.status(500).json({ message: 'Failed to retrieve drawing.' });
    }
  });
  

  app.put('/drawing/:id', async (req, res) => {
    const { elements, appState } = req.body;
  
    try {
      const updatedDrawing = await Drawing.findByIdAndUpdate(
        req.params.id, 
        { elements, appState }, 
        { new: true, runValidators: true } 
      );
  
      if (!updatedDrawing) {
        return res.status(404).json({ message: 'Drawing not found' });
      }
  
      res.status(200).json({ message: 'Drawing updated successfully', updatedDrawing });
    } catch (error) {
      console.error('Error updating drawing:', error);
      res.status(500).json({ message: 'Failed to update drawing.' });
    }
  });
  

  app.delete('/drawing/:id', async (req, res) => {
    try {
      const deletedDrawing = await Drawing.findByIdAndDelete(req.params.id); // Delete drawing by ID
  
      if (!deletedDrawing) {
        return res.status(404).json({ message: 'Drawing not found' });
      }
  
      res.status(200).json({ message: 'Drawing deleted successfully' });
    } catch (error) {
      console.error('Error deleting drawing:', error);
      res.status(500).json({ message: 'Failed to delete drawing.' });
    }
  });



// Connect to MongoDB and start the server
const dbUri = process.env.DATABASE_URL;

if (!dbUri) {
  console.error('MongoDB connection error: DATABASE_URL not defined');
  process.exit(1);
}

mongoose.connect(dbUri)
  .then(() => {
    app.listen(4000, () => console.log('Server started on port 4000'));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({
    origin: 'https://mern-drawing-test.vercel.app/'  
  }));