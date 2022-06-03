import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3003;

// - landing page + meta data
app.get(`/`, (req, res) => {
  res.send(`
  <meta property="og:title" content="Musicbrainz Microservice API"/>
    <meta property="og:description" content="Get re-organised artist info via the ID" />
    <meta name="description" content="Get re-organised artist info via the ID" >
    <meta property="og:image" content="https://i.imgur.com/tOo7SgK.png" />
    <meta property="og:url" content="https://www.ayoadesanya.com" />
    <meta property="og:site_name" content="Musicbrainz Microservice API" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:type" content="website" />
    <meta name="twitter:image" content="https://i.imgur.com/tOo7SgK.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Musicbrainz Microservice API" />
    <meta
      name="twitter:description"
      content="Get re-organised artist info via the ID"
    />
    <meta name="twitter:site" content="@ayo__codes" />
    <meta name="twitter:creator" content="@ayo__codes" />

  <div style='padding: 2rem;'>
  <h1>Musicbrainz Service API</h1>
  <p>This API consumes and re-organizes data from the Musicbrainz API for ease of use in your application.</p>
  <h3 style='display:inline-block;'>Original Api Documentation:</h3>  
  <a href="https://musicbrainz.org/doc/MusicBrainz_API" target="_blank" rel="noopener">Musicbrainz API</a>
  <h4>How to use</h4> 
  <p>Copy and paste the test endpoints at the end of the url | i.e /cc197bad-dc9c-440d-a5b5-d52ba2e14234 | use any artist Id from the MusicBrainz API</p>
  <hr />
  <h2>Test Endpoints:</h2>
  <h3>Coldplay:</h3>
  <ul>
  <li><b>Id: </b> cc197bad-dc9c-440d-a5b5-d52ba2e14234</li>
  </ul>
  <h3>SnoopDogg:</h3>
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
    const response = await axios(
      `https://musicbrainz.org/ws/2/artist/${artistId}`
    );

    if (!response) {
      res.status(500).json({
        status: 'failed',
        message: 'No data, please contact the developer for assistance',
      });
    }

    // - transforming the consumed data into a better structure
    const artistInfo = {
      type: response.data.type,
      name: response.data.name,
      countryAbbr: response.data.country,
      country: response.data.area.name,
      city: response.data.begin_area.name,
      start: response.data['life-span'].begin,
      end: response.data['life-span'].end,
      isActive: response.data['life-span'].ended ? false : true,
    };

    res.json(artistInfo);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'failed',
      message: 'We couldn’t find an artist with this id',
    });
  }
});

app.get('*', (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Route does not exist',
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
