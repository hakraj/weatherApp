//getting started
const express = require("express");
const https = require("https");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


// Weather
app.get("/", (req, res) => {
    // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;    // const clientIp = requestip.getClientIp(req);
    // const geo = geoipLite.lookup(clientIp)
    // console.log(geo);

    res.sendFile(__dirname + "/weather.html");
});

app.post('/api/weather', (req, res) => {
    const geolocation = req.body;
    console.log(geolocation);

    
    const lat = geolocation.lat;
    const long = geolocation.long;
    const apiKey = "032bca0d39936405b7bb1246f52a0e02";
    const units = "metric";


    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + apiKey + "&units=" + units;

    https.get(url, (response) => {
        console.log(response.statusCode);

        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const cityName = weatherData.name;

            const dateTime =  new Date(weatherData.dt * 1000);
            const dateTimeHr = (dateTime.toDateString()).slice(0,3) + "," + (dateTime.toDateString()).slice(3, (dateTime.toDateString()).length);

            const icon =  weatherData.weather[0].icon;
            const imgUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            const description = weatherData.weather[0].description

            const temp = weatherData.main.temp;

            const feelsLike = weatherData.main.feels_like;

            const humidity = weatherData.main.humidity;

            const wind = weatherData.wind.speed;

            const visibility = weatherData.visibility;
            

            const userWeather = {
                cityName,
                dateTimeHr,
                imgUrl,
                description,
                temp,
                feelsLike,
                humidity,
                wind,
                visibility
            };

            console.log(userWeather)

            res.send(userWeather);


        });

    });

    
});


app.post('/api/forecast', (req, res) => {
    const geolocation = req.body;
    console.log(geolocation);

    const lat = geolocation.lat;
    const long = geolocation.long;
    const apiKey = "032bca0d39936405b7bb1246f52a0e02";
    const units = "metric";

    const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=" + apiKey + "&units=" + units;

    https.get(forecastUrl, (response) => {
        console.log(response.statusCode);

        response.on("data", (data) => {
            const forecastData = JSON.parse(data);

            const day1 = forecastData.list[7];
            const day2 = forecastData.list[15];
            const day3 = forecastData.list[23];
            const day4 = forecastData.list[31];
            const day5 = forecastData.list[39];

            function getDate (day) {
                const dateTime =  new Date(day * 1000);
                const dateTimeHr = dateTime.toDateString();
                const dateHr = dateTimeHr.slice(0,3) + dateTimeHr.slice(7,10)
                
                return dateHr;
            }

            userForecast = [
                {
                    time: getDate(day1.dt),
                    iconUrl: "https://openweathermap.org/img/wn/" + day1.weather[0].icon + "@2x.png",
                    temp: day1.main.temp
                },
                {
                    time: getDate(day2.dt),
                    iconUrl: "https://openweathermap.org/img/wn/" + day2.weather[0].icon + "@2x.png",
                    temp: day2.main.temp
                },
                {
                    time: getDate(day3.dt),
                    iconUrl: "https://openweathermap.org/img/wn/" + day3.weather[0].icon + "@2x.png",
                    temp: day3.main.temp
                },
                {
                    time: getDate(day4.dt),
                    iconUrl: "https://openweathermap.org/img/wn/" + day4.weather[0].icon + "@2x.png",
                    temp: day4.main.temp
                },
                {
                    time: getDate(day5.dt),
                    iconUrl: "https://openweathermap.org/img/wn/" + day5.weather[0].icon + "@2x.png",
                    temp: day5.main.temp
                },
            ];


            console.log(userForecast)

            res.send(userForecast)

        });



    });


});








app.set("trust proxy", true);

app.listen(3000, () => {
    console.log("hak_raj, Roger that!");
});