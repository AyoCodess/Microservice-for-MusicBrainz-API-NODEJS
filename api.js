import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3003;
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// - landing page
app.get(`/`, (req, res) => {
  res.send(`
  <div style='padding: 2rem;'>
  <h1>Musicbrainz Service API</h1>
  <p>This API consumes and re-organizes data from the Musicbrainz API for ease of use in your application.</p>
  <h3 style='display:inline-block;'>Original Api Documentation:</h3>  
  <a href="https://musicbrainz.org/doc/MusicBrainz_API" target="_blank" rel="noopener">Musicbrainz API</a>
  <h4>How to use</h4> 
  <p>Copy and paste the test endpoints at the end of the url | i.e /cc197bad-dc9c-440d-a5b5-d52ba2e14234 | use any artist Id from the MusicBrainz API</p>
  <hr '/>
  <h2>Test Endpoints:</h2>
  <h3>Coldplay:</h3>
  <ul>
  <li><b>Id: </b> cc197bad-dc9c-440d-a5b5-d52ba2e14234</li>
  </ul>
  <h3>Snoopdogg:</h3>
  <ul>
  <li><b>Id: </b>f90e8b26-9e52-4669-a5c9-e28529c47894</li>

  </ul>
  <h3>Pink Floyd</h3>
  <ul>
  <li><b>Id: </b>83d91898-7763-47d7-b03b-b92132375c47</li>

  </ul>
  <hr />
  <span>Created by:</span>

  <a href="https://www.ayoadesanya.com/" target="_blank" rel="noopener">Ayo Adesanya</a>
  
  </div>`);
});

// - get any artist data via their id
app.get(`/:artistId`, async (req, res) => {
  const { artistId } = req.params;

  try {
    const data = await axios(`https://musicbrainz.org/ws/2/artist/${artistId}`);

    // - transforming the consumed data into a better structure
    const artistInfo = {
      type: data.data.type,
      name: data.data.name,
      countryAbbr: data.data.country,
      country: data.data.area.name,
      city: data.data.begin_area.name,
      start: data.data['life-span'].begin,
      end: data.data['life-span'].end,
      isActive: data.data['life-span'].ended ? false : true,
    };

    console.log(data.data);

    JSON.stringify(artistInfo);

    res.setHeader('Content-Type', 'application/json');
    res.send(artistInfo);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'failed',
      message: 'We couldn’t find an artist with this id',
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
