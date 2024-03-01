var webSocket = require("ws");
var http = require("http");
var server = new webSocket.Server({ port: "8080" });
var dogFactsEndpoint = "https://dog-api.kinduff.com/api/facts";
var chunkDelayMs = 100;
var dogFact;
var timer;
function getNextDogFactChunk() {
    var indexOfFirstSpace = dogFact.indexOf(" ");
    var nextChunk = dogFact.substring(0, indexOfFirstSpace);
    if (nextChunk == "") {
        nextChunk = dogFact;
        dogFact = "";
        clearInterval(timer);
        return nextChunk + "[DONE]";
    }
    dogFact = dogFact.substring(indexOfFirstSpace + 1, dogFact.length);
    return nextChunk + " ";
    ;
}
function startDogFactStream(socket) {
    fetch(dogFactsEndpoint)
        .then(function (response) { return response.json(); })
        .then(function (body) {
        dogFact = body.facts[0];
        console.log("Dog fact received: " + dogFact);
        timer = setInterval(function () {
            var chunk = getNextDogFactChunk();
            console.log("Sending chunk: " + chunk);
            socket.send(chunk);
        }, chunkDelayMs);
    });
}
function stopDogFactStream() {
    dogFact = "";
    clearInterval(timer);
}
console.log("Initializing websocket");
server.on("connection", function (socket) {
    socket.on("message", function (message) {
        if (message == "Start") {
            startDogFactStream(socket);
        }
        else if (message == "Stop") {
            stopDogFactStream();
        }
    });
});
console.log("Websocket initialized");
