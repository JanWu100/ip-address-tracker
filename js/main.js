"use strict";

let latitude = 40.678177;
let longitude = -73.94416;

const map = L.map("map", {
  center: [latitude, longitude],
  zoom: 16,
  zoomControl: false,
}).setActiveArea("activeArea", true, true);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

const myIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [46, 56],
  iconAnchor: [23, 55],
});

const marker = L.marker([latitude, longitude], { icon: myIcon }).addTo(map);

const invalidMessage = document.querySelector("h3");
const input = document.querySelector("input");
const button = document.querySelector("button");

const regexIpv4 =
  "(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
const regexIpv6 = "((([0-9a-fA-F]){1,4})\\:){7}([0-9a-fA-F]){1,4}";
const domain =
  "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})";
const searchIp = "ipAddress";
const searchDomain = "domain";

const clearInvalid = () => {
  input.classList.remove("invalid");
  invalidMessage.classList.remove("invalid-message");
  invalidMessage.textContent = "";
};

input.addEventListener("input", clearInvalid);

button.addEventListener("click", (e) => {
  e.preventDefault();
  if (input.value.match(regexIpv4) || input.value.match(regexIpv6)) {
    trackIp(searchIp, input.value);
  } else if (input.value.match(domain)) {
    trackIp(searchDomain, input.value);
  } else {
    input.classList.add("invalid");
    invalidMessage.classList.add("invalid-message");
    invalidMessage.textContent = "Invalid Domain or IP Address";
  }
  input.value = "";
});

const trackIp = async (type, addressToFind) => {
  const querryType = type;
  const querry = addressToFind;
  const API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_T8VsSFWwJLV0ok9N0OzlhH5Q0tBHm&${querryType}=${querry}`;

  const ip = document.querySelector(".output__item__ip");
  const location = document.querySelector(".output__item__location");
  const timezone = document.querySelector(".output__item__timezone");
  const isp = document.querySelector(".output__item__isp");

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      ip.textContent = data.ip;
      location.textContent = `
        ${data.location.city ? data.location.city : "n/a"},
        ${data.location.country ? data.location.country : " "} 
        ${data.location.postalCode ? data.location.postalCode : " "}`;

      timezone.textContent = data.location.timezone
        ? data.location.timezone
        : "n/a";
      isp.textContent = data.isp;
      latitude = data.location.lat;
      longitude = data.location.lng;
      moveMap(latitude, longitude);
    });
};

const moveMap = (lat, lng) => {
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], 16, { animation: true });
};
