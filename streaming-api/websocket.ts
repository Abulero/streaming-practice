const webSocket = require("ws");
const http = require("http");
const server = new webSocket.Server({ port: "8080" });
const dogFactsEndpoint = "https://dog-api.kinduff.com/api/facts";
const chunkDelayMs = 100;

interface DogFact {
    facts: string[];
}

let dogFact: string;
let timer: NodeJS.Timeout;

function getNextDogFactChunk(): string {
    let indexOfFirstSpace = dogFact.indexOf(" ");
    let nextChunk = dogFact.substring(0, indexOfFirstSpace);

    if (nextChunk == "") {
        nextChunk = dogFact;
        dogFact = "";

        clearInterval(timer);

        return nextChunk + "[DONE]";
    }

    dogFact = dogFact.substring(indexOfFirstSpace + 1, dogFact.length);

    return nextChunk + " ";;
}

function startDogFactStream(socket) {
    fetch(dogFactsEndpoint)
    .then((response) => response.json())
    .then((body) => {
        dogFact = body.facts[0];

        console.log("Dog fact received: " + dogFact);

        timer = setInterval(() => {
            let chunk = getNextDogFactChunk();
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

server.on("connection", socket => {
    socket.on("message", message => {
        if (message == "Start") {
            startDogFactStream(socket);
        } else if (message == "Stop") {
            stopDogFactStream();
        }
    })
});

console.log("Websocket initialized");