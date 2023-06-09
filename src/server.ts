import express from 'express';
import mongoose,  { ConnectOptions } from 'mongoose';

// Define the MongoDB connection URL
const mongoUrl = 'mongodb://127.0.0.1:27017/f1results';

const app = express();
const PORT = 3000;
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});