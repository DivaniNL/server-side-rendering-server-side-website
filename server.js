// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';
import fs from 'fs';

console.log('Test')

const showsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_shows');
const showsResponseJSON = await showsResponse.json();

const showResponse = await fetch('https://fdnd-agency.directus.app/items/mh_show');
const showResponseJSON = await showResponse.json();

const usersResponse = await fetch('https://fdnd-agency.directus.app/items/mh_users');
const usersResponseJSON = await usersResponse.json();

const radiostationsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_radiostations?sort=id');
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

// https://www.npmjs.com/package/path-to-regexp#optional - Optional parameters
app.get('/:name{/programmering}{/:dayname}', async function (request, response) {

  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  
  const thisWeekshows = [];
  let daysResponse;
  let dayID;
  if(request.params.dayname == undefined){
    daysResponse = await fetch('https://fdnd-agency.directus.app/items/mh_day?fields=*,shows.mh_shows_id.show');
  }
  else{
    dayID = dayNames.findIndex(day => day === request.params.dayname);
    console.log(dayID);
    daysResponse = await fetch('https://fdnd-agency.directus.app/items/mh_day?fields=*,shows.mh_shows_id.show&filter={"sort":"'+ dayID +'"}');
  }
  const daysResponseJSON = await daysResponse.json();
  
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
  
  const now = new Date()
  let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 5)
  // DAGEN VAN DEZE WEEK voor sticky dates
  const thisWeek = [];
  
  // Chat GPT-3
  function getDatesOfCurrentWeek(refDate = new Date()) {
  
    const datesOfWeek = [];
    for (let i = 0; i < 8; i++) { // Loop through 8 days to include next Monday
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      console.log(date);
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




  const stationArr = request.params.name;
  const stationURL = radiostations.find(station => station.name === stationArr);
  let stationID = stationURL.id;
  const ShowsforStationUL = "https://fdnd-agency.directus.app/items/mh_shows?fields=*.*.*.*";
  const showsforStationFilterPart = "&filter={\"show\":{\"radiostation\":{\"id\":\"" + stationID + "\"}}}&limit=-1";


  const showsforStation = await fetch(ShowsforStationUL + showsforStationFilterPart);
  const showsforStationJSON = await showsforStation.json();
  const nestedShows = [];

  showsforStationJSON.data.forEach(function(show) {
  
    nestedShows.push({
      ...show.show,
      from: show.from,
      until: show.until,
    });
  });
  nestedShows.sort((a, b) => new Date(a.from) - new Date(b.from));

  const updatedWeekShowsforStation = thisWeekshows.map(day => {
    const updatedShows = day.shows
      .filter(show => show !== undefined && show !== null) // Filter out null values before mapping
      .map(show => {
        
        // console.log("Processing show ID: " + show);
        let dayShowID = show;
        const showObj = nestedShows.find(s => s.id == dayShowID);
        return showObj;
      })
      .filter(show => show !== undefined && show !== null);// Hiermee map je als het door de array heen, en filter je de nulls eruit.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
      updatedShows.sort((a, b) => a.from.localeCompare(b.from));
    return { ...day, shows: updatedShows };
  });
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  // Het feit dat ik een updated array moest maken met de spread operator heb ik van Chat. Ik snap wel dat het de day object pakt en de shows array updated met de juiste shows, maar had dit niet zelf bedacht. Ik snap nog niet helemaal hoe het werkt.


  // console.log("Updated week shows for station:", updatedWeekShowsforStation[1]);

  // Write the updatedWeekShowsforStation data to test.json
  fs.writeFile('test.json', JSON.stringify(updatedWeekShowsforStation, null, 2), (err) => {
    if (err) {
      console.error('Error writing to test.json:', err);
    } else {
      console.log('Successfully wrote to test.json');
    }
  });
  let today;
  let todayName;
  if (request.params.dayname == undefined) {
    today = parseInt(thisWeekshows[0].day);  // Parse the day from thisWeekshows
    todayName = dayNames[today];
  } else {
    today = dayID;  // Parse the dayid from the request params
    
  }
  
  response.render('station.liquid', {
    showsforStation: showsforStationJSON.data,
    stationNameGenerated: stationArr,
    stationNameGeneratedEncoded: encodeURIComponent(stationArr),
    thisWeek: thisWeek,
    dayNames: dayNames,
    thisWeekShows: updatedWeekShowsforStation,
    radiostations: radiostationsResponseJSON.data,
    thisstation: stationID,
    today: today,
    todayName: request.params.dayname
  });
});


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
