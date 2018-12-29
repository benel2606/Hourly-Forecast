var information = document.getElementById("info");
var population = document.getElementById("population");
var temptature = document.querySelectorAll("#temp");
var temptatureArr = [].slice.call(temptature);
var time = document.querySelectorAll("#time");
var timeArr = [].slice.call(time);
var details = document.querySelectorAll("#details");
var detailsArr = [].slice.call(details);
var icons = document.querySelectorAll("#icon");
var iconsArr = [].slice.call(icons);
var marker = {};
var content = document.querySelector(".visibility");
var alert = document.querySelector(".alert");

var mymap = L.map("map").setView([31.80144007, 34.643497], 13);
L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuZWwyNjA2IiwiYSI6ImNqcTV2Y2w2dDIyYW00M2p5Njh2d3A1dTkifQ.lD07r9FB4STDbL7s7z1Cmw", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: "your.mapbox.access.token"
    }
).addTo(mymap);

var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

function onMapClick(e) {

    var lat = (e.latlng.lat);
    var lng = (e.latlng.lng);

    getJSON("http://api.openweathermap.org/data/2.5/forecast?lat=" +
        e.latlng.lat +
        "&lon=" +
        e.latlng.lng +
        "&appid=4e477aae06d6beac5b59daaff026d21c&cnt=9&units=metric",
        function (err, data) {
            if (err !== null) {
                alert("Something went wrong: " + err);
            } else {
                console.log("You clicked the map at LAT: " + lat + " and LONG: " + lng);
                //Clear existing marker, 
                if (marker != undefined) {
                    mymap.removeLayer(marker);
                };
                //Add a marker to show where you clicked.
                marker = L.marker([lat, lng]).addTo(mymap);

                console.log(data.city.name)
                console.log(data.list[0].main.temp);
                information.innerHTML = "<strong>" + data.city.name + "</strong>" + ", " + data.city.country;
                population.innerHTML = "Population: " + data.city.population;
                temptatureArr.forEach(function (element, index) {
                    console.log(element);
                    console.log(Math.floor(data.list[index].main.temp) + "&#176");
                    element.innerHTML = Math.floor(data.list[index].main.temp) + "&#176";
                });
                time.forEach(function (element, index) {
                    console.log(element);
                    console.log(data.list[index].dt_txt);
                    let year = data.list[index].dt_txt.slice(0, 4);
                    let mon = data.list[index].dt_txt.slice(5, 7);
                    let day = data.list[index].dt_txt.slice(8, 10);
                    let time = data.list[index].dt_txt.slice(11, 20);
                    let dateAndTime = day + "/" + mon + "/" + year + "  " + time;
                    console.log(year);
                    console.log(mon);
                    console.log(day);
                    console.log(time);
                    element.innerHTML = dateAndTime;
                });
                detailsArr.forEach(function (element, index) {
                    console.log(element);
                    console.log(data.list[index].weather[0].description);
                    element.innerHTML = data.list[index].weather[0].description;
                });
                iconsArr.forEach(function (element, index) {
                    console.log(element);
                    console.log(data.list[index].weather[0].icon);
                    element.setAttribute("src", "http://openweathermap.org/img/w/" + data.list[index].weather[0].icon + ".png");
                });

            }
        }
    );
    content.style.visibility = "visible";
    alert.style.visibility = "visible";


}
mymap.on("click", onMapClick);