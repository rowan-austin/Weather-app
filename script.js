//Exectcute the code on window load.
window.addEventListener('load', ()=> {
    //Declaring our variables to use later in our code.
    let long;
    let lat;  
    let body = document.querySelector('body');
    let citySearch = document.querySelector('.city-search');
    let searchButton = document.querySelector('.search-button');
    let temperature= document.querySelector('.temperature');
    let weatherDescription = document.querySelector('.weather-description');
    let weatherLocation = document.querySelector('.location');
    let windSpeed = document.querySelector('.wind-speed');
    let feelsLike = document.querySelector('.feels-like');
    let currHumidity = document.querySelector('.humidity');
    let weathericon = document.querySelector('#icon');

    //Create a popup to ask user to share location, if they accept execute the code inside this statement.
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            //Gettin the latitude and logitude from the users location to use in our api fetch.
            long = position.coords.longitude;
            lat = position.coords.latitude;
            //Fetch the data from Open weather map api.
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=c3d5c044f3d4e0650e99df20990439a1&units=metric`;
            //Calling our fetch function using ther api variable created above.
            fetchApi(api);
        });
    }

    //This api variable and function call is needed incase the user declines location, there is currently no way to check if they decline.
    const api = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=c3d5c044f3d4e0650e99df20990439a1&units=metric';
    fetchApi(api);

    //This is the function where we will call the api and get the correct values returned.
    function fetchApi(api) {
        fetch(api)
            .then(response=>{
                //Return a json containing the data provided by our weather api.
                return response.json();
            })
            .then(data =>{
                //Set the data as variables that wont chage, {} have been used with const to declare multiple vars on 1 line.s
                const {main, icon} = data.weather[0];
                const {speed} = data.wind;
                const {feels_like, humidity, temp} = data.main;
                const location = data.name;
                //Here we create a date using the unix time and timezone given to us so we can check if its night time.
                date = new Date(data.dt * 1000 + (data.timezone*1000));
                //Put the returned variables into our HTML elements to display to the user.
                temperature.textContent = temp;
                weatherDescription.textContent = main;
                weatherLocation.textContent = location;
                windSpeed.textContent = speed;
                feelsLike.textContent = feels_like;
                currHumidity.textContent = humidity;
                //Calling the color and icon function each time we send an api request to ensure they update with the information.
                tempColor(temperature.textContent,date);
                getIcon(icon);
        });
    }

    //Add a listener to the search button to run this code upon the user clicking.
    searchButton.addEventListener('click', function(){
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citySearch.value}&appid=c3d5c044f3d4e0650e99df20990439a1&units=metric`)
            .then(response=>{
                return response.json();
            })
            .then(data =>{
                const {main, icon} = data.weather[0];
                const {speed} = data.wind;
                const {feels_like, humidity, temp} = data.main;
                const location = data.name;

                date = new Date(data.dt * 1000 + (data.timezone*1000));
                temperature.textContent = temp;
                weatherDescription.textContent = main;
                weatherLocation.textContent = location;
                windSpeed.textContent = speed;
                feelsLike.textContent = feels_like;
                currHumidity.textContent = humidity;
                tempColor(temperature.textContent, date);
                getIcon(icon);
            })
            //Adding a catch incase the user inputs an invalid string, this will create a popup to notify the user and ask them to enter a valid city.
            .catch(() => {
                alert("Please search for a valid city");
            });
    });
    //Adding a listener to check if the user hits the enter button when typing a city, this will click the search buttton which will run the code above. I have done this to avoid repeating code.
    citySearch.addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
            searchButton.click();
        }
    });

    //This function will check the temperature returened and add a class to the body to change the background color.
    function tempColor() {
        if ( temperature.textContent >= 10 && temperature.textContent <= 20) {
            body.className = '';
            body.classList.add('medium');
        }
        else if ( temperature.textContent > 20) {
            body.className = '';
            body.classList.add('hot');
        }
        else {
            body.className = '';
        }
        //Here we check to see if its night time, if so we add a class to the body to allow us to change the background color.
        if (date.getHours() >= 19 || date.getHours() <= 7 ) {
            body.className = '';
            body.classList.add('night');
        }
    }

    //Within this function we run a check to see what icon code is given back to us from the api.
    function getIcon(icon) {
        let skycons = new Skycons({color: "black"});
        if (icon === "01d") {
            //Once we have found the right icon we set it in the HTML to change the icon as the weather changes.
            skycons.set("icon", "clear-day");
            //Here I am setting an alt text attribute on the icon element for accessibility.
            weathericon.setAttribute("alt","clear");
        } else if (icon === "01n") {
            skycons.set("icon", "clear-night");
            weathericon.setAttribute("alt","clear");
        } else if (icon === "02d") {
            skycons.set("icon", "partly-cloudy-day");
            weathericon.setAttribute("alt","cloudy");
        } else if (icon === "02n") {
            skycons.set("icon", "partly-cloudy-night");
            weathericon.setAttribute("alt","cloudy");
        } else if (icon === "03d" || icon === "03n" || icon === "04d" || icon === "04n") {
            skycons.set("icon", "cloudy");
            weathericon.setAttribute("alt","cloudy");
        } else if (icon === "09d" || icon === "09n") {
            skycons.set("icon", "rain");
            weathericon.setAttribute("alt","rain");
        } else if (icon === "10d" || icon === "10n" || icon === "11d" || icon === "11n") {
            skycons.set("icon", "sleet");
            weathericon.setAttribute("alt","sleet");
        } else if (icon === "13d" || icon === "13n") {
            skycons.set("icon", "snow");
            weathericon.setAttribute("alt","snow");
        } else {
            skycons.set("icon", "fog");
            weathericon.setAttribute("alt","fog");
        };
        //Running out icon animation.
        skycons.play();
    }
});