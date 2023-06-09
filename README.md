# web-crawler
- This is a web crawler application built using TypeScript. It is designed to crawl and extract race results from the Formula 1 website (https://www.formula1.com). The crawled data is then stored in a MongoDB database.
- Because project is a test and to save time, i don't do it in a module way or split the files into folders.

## Features
- Crawls the Formula 1 website to extract race results.
- Stores the extracted race results in a MongoDB database and CSV.
- Provides a REST API for searching and retrieving the race results based on various conditions.
- Supports search filters, allows sorting the race results.
- I have a specific branch git for specific feature.
- Branch develop to dev and main to production.
## How to run

## 1. Clone the repository:
```
git clone https://github.com/giahuydang1/web-crawler.git
```
## 2. Install the dependencies:
```
cd web-crawler
npm install
```
## 3. Start the application:
```
npm run dev
```

## Usage
- You need to have a MongoDB, MongoDB Compass database set up and running for storing the race results.
- I suggest download extension JSON viewer to browser to get beautiful JSON.
- Use the following endpoints to interact with the web crawler and retrieve race results:
    - I set up a PORT 3000 for URL: http://localhost:3000
    - `GET /crawl/{year}`: Crawls the Formula 1 website for race results of the specified year and stores them in the database, you can get a output.csv in folder source.
    - `GET /results`: Retrieves all race results from the database.
    - `GET /results?raceName={raceName}`, 
        `/results?raceWinner={raceWinner}`, 
        `/results?raceName={raceName}&sortBy={sortBy}`, 
        `/results?raceWinner={raceWinner}&sortBy={sortBy}`:
        => Retrieves race results from the database based on the provided search conditions and sorting options.
    - Query Params:
        - `raceName`: Filters race results by the specified race name.
        - `raceWinner`: Filters race results by the specified race winner.
        - `sortBy`: Specifies the field to sort the results by (raceLaps, raceTime).