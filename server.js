// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';


console.log('Test')

const showsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_shows');
const showsResponseJSON = await showsResponse.json();

const showResponse = await fetch('https://fdnd-agency.directus.app/items/mh_show');
const showResponseJSON = await showResponse.json();

const usersResponse = await fetch('https://fdnd-agency.directus.app/items/mh_users');
const usersResponseJSON = await usersResponse.json();

const radiostationsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_radiostations');
const radiostationsResponseJSON = await radiostationsResponse.json();

const chatsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_chats');
const chatsResponseJSON = await chatsResponse.json();

// Maak multi demsionele array aan met id van station en de naam
const radiostations = radiostationsResponseJSON.data.map(station => ({
  id: station.id,
  name: station.name
}));

// console.log(showsResponseJSON);
// console.log(showResponseJSON);
// console.log(usersResponseJSON);
// console.log(radiostationsResponseJSON);
// console.log(chatsResponseJSON);

// console.log(radiostations);


const thisWeekshows = [];

const daysResponse = await fetch('https://fdnd-agency.directus.app/items/mh_day?fields=*,shows.mh_shows_id.show');
const daysResponseJSON = await daysResponse.json();
const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
daysResponseJSON.data.forEach(day => {
  const genDate = new Date(day.date);
  const dayofWeekJSON = genDate.getDay();
  const shows = day.shows;
  const showIDs = [];
  shows.forEach(show => { 
    const show_id = show.mh_shows_id.show;
    showIDs.push(show_id);
  });
  thisWeekshows.push({
    day: dayofWeekJSON,
    dayName: dayNames[dayofWeekJSON],
    shows: showIDs
  });
});
// console.log(thisWeekshows);
// console.log("dit waren alle shows gesoorteerd op dag");



// DAGEN VAN DEZE WEEK voor sticky dates
const thisWeek = [];

// Chat GPT-3
function getDatesOfCurrentWeek(refDate = new Date()) {
  const startOfWeek = new Date(refDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const datesOfWeek = [];
  for (let i = 0; i < 8; i++) { // Loop through 8 days to include next Monday
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    datesOfWeek.push(date);
  }

  return datesOfWeek;
}

const datesOfCurrentWeek = getDatesOfCurrentWeek();
datesOfCurrentWeek.forEach(date => {
  const dateString = date.toISOString().split('T')[0];
  thisWeek.push({
    day: dateString.split('-')[2],
    dayOfWeek: date.getDay()
  });
});

// End of Chat GPT code




// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
   response.render('index.liquid', {radiostations: radiostationsResponseJSON.data})
})

// Als je linkt naar station/1 (veronica bvb)
app.get('/station/:id', async function (request, response) {
  const stationArr = radiostations.find(function(stationName) {
    return stationName.id == request.params.id;
  });

  const ShowsforStationUL = "https://fdnd-agency.directus.app/items/mh_show";
  const showsforStationFilterPart = "?filter={\"radiostation\":\"" + request.params.id + "\"}";

  const showsforStation = await fetch(ShowsforStationUL + showsforStationFilterPart);
  const showsforStationJSON = await showsforStation.json();

  console.log("Fetched shows for station:", showsforStationJSON.data);

  console.log("thisWeekshows before processing:", thisWeekshows);

  const updatedWeekShowsforStation = thisWeekshows.map(day => {
    const updatedShows = day.shows
      .filter(show => show !== undefined && show !== null) // Filter out null values before mapping
      .map(show => {
        
        console.log("Processing show ID: " + show);
        const showObj = showsforStationJSON.data.find(s => s.id == show);
        return showObj;
      })
      .filter(show => show !== undefined && show !== null);// Hiermee map je als het door de array heen, en filter je de nulls eruit.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    return { ...day, shows: updatedShows };
  });

  console.log("Updated week shows for station:", updatedWeekShowsforStation);

  response.render('station.liquid', {
    showsforStation: showsforStationJSON.data,
    stationNameGenerated: stationArr,
    thisWeek: thisWeek,
    thisWeekShows: updatedWeekShowsforStation
  });
});
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
// Het feit dat ik een updated array moest maken met de spread operator heb ik van Chat. Ik snap wel dat het de day object pakt en de shows array updated met de juiste shows, maar had dit niet zelf bedacht. Ik snap nog niet helemaal hoe het werkt.


// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
