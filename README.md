# Programmaoverzicht Mediahuis

## Beschrijving
Voor deze sprint heb ik een show-overzichtpagina gemaakt per radiostation van Mediahuis. Het overzicht is dus te filteren op dag en zender.
De website is hier te bekijken:

https://server-side-rendering-server-side-website-g630.onrender.com/


### Responsive

Ik heb mijn Website responsive gemaakt

Hieronder is elke breakpoint te zien:

Mobiel: (320 t/m 680px)
Home:

![Screenshot (248)-portrait](https://github.com/user-attachments/assets/efc9425a-fbfb-437d-a3cc-7c62da2c04fa)

Radiopagina:


![Screenshot (249)-portrait](https://github.com/user-attachments/assets/c6083139-444c-4530-b760-55f8d2f73c41)

Tablet: (681 t/m 1200px)

Home

![Screenshot (251)-landscape](https://github.com/user-attachments/assets/0baeb86f-2bef-4cc6-a250-19c14d270f85)


Radiopagina

![Screenshot (250)-landscape](https://github.com/user-attachments/assets/ff4de801-a537-4eb1-a555-fac363ec4cb3)

Desktop:

Home:


![Screenshot (253)-front](https://github.com/user-attachments/assets/4deb22b3-d13a-478d-b271-43a7e2d61a1d)

Radiopagina:

![Screenshot (252)-front](https://github.com/user-attachments/assets/1012199d-3a94-43bf-8fd4-9f4bff1fbf62)

Ik heb eerst het ontwerp utigebouwd in enkel HTML, en daarna d.m.v. een one-column layout te bouwen de mobiele versie afgerond. Als laatste heb ik de desktopversie gebouwd.

## Ontwerpkeuzens

Ik heb in het ontwerp voor de desktopversie een ontwerpwijziging doorgevoerd. Ik wilde het radiooverzicht horizontaal plaatsen, zodat ik hier later meerdere radiostations onder elkaar neer kon zetten.

Oude situatie (Desktop):

![Screenshot (254)](https://github.com/user-attachments/assets/b1657792-c38c-4ea5-b533-45054a2520f7)


Mijn ontwerp (Desktop):

![Screenshot (255)](https://github.com/user-attachments/assets/9787415d-0d50-4f24-b8c3-409224eaca0f)



 Inspiratie heb ik van het programmaoverzicht van Ziggo GO:

 ![Screenshot (256)](https://github.com/user-attachments/assets/942aef0d-ce6a-4421-aba9-1c0255c194d1)



## Kenmerken

### NodeJS
Met Node kan je server-side applicaties bouwen met JavaScript. In dit project wordt Node.js gebruikt om een webserver te draaien die de applicatie bedient.

### Express
Express is een framework voor Node.js dat functies biedt voor het bouwen van sites. In dit project wordt Express gebruikt om routes te definiëren en HTTP-verzoeken(post en get) af te handelen.

### Liquid
Liquid is een template engine voor JavaScript en Ruby. Het wordt gebruikt om HTML te genereren met dynamische data. In dit project wordt Liquid gebruikt om de HTML-pagina's te renderen met data die wordt opgehaald van de whois FDND API.

### Projectstructuur
Het project heeft de volgende structuur:
- server.js: Dit is het hoofdbestand van de server. Hier worden de Express-applicatie en routes gedefinieerd.
- views: Bevat de Liquid templates voor de HTML-pagina's.
- public: Bevat de statische bestanden zoals CSS, JavaScript en afbeeldingen.

### Routes
De routes worden gedefinieerd in server.js. Hier zijn enkele belangrijke routes:

- `GET /`: De hoofdpagina van Mediahuis
- `GET /station/:name{/programmering}{/:dayname}`: Haalt de radioprogrammas van een radiostation op. Het meegeven van een dag is optioneel.
De naam van het radiostation is encrypted in de url. Zoals Radio%20Veronica.
Een link kan dan zijn:
/station/Radio%20Veronica/programmering/Woensdag

### Data ophalen en posten
De data wordt opgehaald van de Directus API met behulp van `fetch`. Bijvoorbeeld, in de route `GET /` wordt de lijst van alle shwos voor het huidige radiostation opgehaald
[https://github.com/halie404/connect-your-tribe-team-squad-page/blob/b9e69e0349ecfe795a16168affb88a333e4560f6/server.js#L12-L19](https://github.com/DivaniNL/server-side-rendering-server-side-website/blob/4d1b0923a39db5777dbb72cf61ae62acdcd83563/server.js#L135-L136)

### HTML renderen met data
De HTML wordt gerenderd met Liquid templates. Bijvoorbeeld, in de route `GET /` wordt de homepagina geladen met de volgende code
[https://github.com/halie404/connect-your-tribe-team-squad-page/blob/b9e69e0349ecfe795a16168affb88a333e4560f6/server.js#L22-L39](https://github.com/DivaniNL/server-side-rendering-server-side-website/blob/4d1b0923a39db5777dbb72cf61ae62acdcd83563/server.js#L60-L62)

De Liquid template index.liquid gebruikt de data om dynamisch HTML te genereren:
[
https://github.com/halie404/connect-your-tribe-team-squad-page/blob/b9e69e0349ecfe795a16168affb88a333e4560f6/views/student.liquid#L22-L25](https://github.com/DivaniNL/server-side-rendering-server-side-website/blob/4d1b0923a39db5777dbb72cf61ae62acdcd83563/views/index.liquid#L4-L22)

## Installatie

Om dit project lokaal te installeren en te draaien, volg je de onderstaande stappen:

### Vereisten
- Node.js (versie 14 of hoger)
- npm (Node Package Manager, wordt meestal samen met Node.js geïnstalleerd)
- GitHub Desktop (niet per se nodig, maar werkt fijn)

### Stappen

1. **Clone de repository**
    - Ga naar de repository: [https://github.com/DivaniNL/server-side-rendering-server-side-website](https://github.com/DivaniNL/server-side-rendering-server-side-website)
    - Klik op Code (groene knop) -> Open with GitHub Desktop
    - Klik op Clone
    - Selecteer "For my own purposes"

2. **Open het project in je codeeditor**

3. **Installeer de afhankelijkheden**
   - Gebruik npm om de benodigde pakketten te installeren door het volgende commando in de terminal uit te voeren:
   ```bash
   npm install
   ```

4. **Start de ontwikkelserver**
   - Start de server met het volgende commando:
   ```bash
   npm start
   ```

5. **Open de applicatie in je browser**
   - De server draait nu op `http://localhost:8000`. Open deze URL in je webbrowser om de applicatie te bekijken.

Volg deze stappen om de ontwikkelomgeving in te richten en aan de repository te kunnen werken. Als je vragen hebt of tegen problemen aanloopt, neem contact op met de projectbeheerder (Dylan).



