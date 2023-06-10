import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { createObjectCsvWriter } from 'csv-writer';
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

// Create Schema
const raceResultSchema = new mongoose.Schema({
  name: String,
  date: String,
  winner: String,
  car: String,
  laps: Number,
  time: String
})

const RaceResult = mongoose.model('RaceResult', raceResultSchema)

// API crawl
interface RaceResult {
  name: string;
  date: string;
  winner: string;
  car: string;
  laps: number;
  time: string;
}

app.get('/crawl/:year', async (req, res) => {
  try {
    const year = req.params.year
    const response = await axios.get(`https://www.formula1.com/en/results.html/${year}/races.html`);
    const $ = cheerio.load(response.data);
    const csvWriter = createObjectCsvWriter({
      path: './output.csv',
      header: [
          {id: "name", title: "Grand Prix"},
          {id: "date", title: "Date"},
          {id: "winner", title: "Winner"},
          {id: "car", title: "Car"},
          {id: "laps", title: "Laps"},
          {id: "time", title: "Time"},
      ]
    })
    
    const raceResults: RaceResult[] = [];

    $('.resultsarchive-table > tbody > tr').each((_, table) => {
      const raceName = $(table).find('td:nth-child(2) > a').text().trim().replace(/\s*/g,"");
      const raceDate = $(table).find('td:nth-child(3)').text().trim();
      const raceWinner = $(table).find('td:nth-child(4) span:nth-child(-n+2)').text().trim();
      const raceCar = $(table).find('td:nth-child(5)').text().trim();
      const raceLaps = parseInt($(table).find('td:nth-child(6)').text().trim());
      const raceTime = $(table).find('td:nth-child(7)').text().trim();

      raceResults.push({ name: raceName, date: raceDate, winner: raceWinner, car: raceCar, laps: raceLaps, time: raceTime });
    });

    // Save data mongodb
    await RaceResult.insertMany(raceResults);
    csvWriter.writeRecords(raceResults).then(() => console.log("Written to file"))
    res.json({ message: 'Race results crawled and saved successfully!' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch race results' })
  }
})

// API results
app.get('/results', async (req, res) => {
  try {

    const { raceName, raceWinner, sortBy } = req.query;

    const query: any = {};
    if (raceName) {
      query.name = raceName;
    }
    if (raceWinner) {
      query.winner = raceWinner;
    }

    const sortOptions: any = {};
    if (sortBy === 'raceLaps') {
      sortOptions.laps = -1; //descending
    } else if (sortBy === 'raceTime') {
      sortOptions.time = 1; //ascending
    }

    const raceResults = await RaceResult.find(query).sort(sortOptions)
    res.json(raceResults);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch race results' })
  }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});