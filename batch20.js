function openLinks (usernames) {
    const education = "Northern University of Business and Technology Khulna";
    let searchQueries = usernames.map(username => `${username} ${education} site:linkedin.com/in`);
    
    searchQueries.forEach(query => {
        const url = `https://www.google.com/search?btnI=1&q=${encodeURIComponent(query)}`;
        window.open(url, "_blank");
    });
}

const sheetUrl = "https://script.google.com/macros/s/AKfycbz9czR_K2usfhs_CCflzCH9mrR1i5jYqZEetDXtD0ewLPx1CGSSWh-0J7sGLpTuBPx_hw/exec";

var nameArr = [];
var currentIndex = 0;
var rowNumbers = [];
let searchResults = [];  // Store pasted LinkedIn URLs
let pendingSearchUrls = [];  // Store expected search URLs

function openLinks(usernames) {
    const education = "Northern University of Business and Technology Khulna";
    let searchQueries = usernames.map(username => `${username} ${education} site:linkedin.com/in`);

    pendingSearchUrls = searchQueries.map(query => `https://www.google.com/search?btnI=1&q=${encodeURIComponent(query)}`);

    console.log("Batch of 20 names:", usernames);
    console.log("Batch of 20 search URLs:", pendingSearchUrls);

    pendingSearchUrls.forEach(url => {
        window.open(url, "_blank"); // Opens Google search results
    });
}

window.addEventListener("focus", () => {
    navigator.clipboard.readText().then(text => {
        if (!searchResults.includes(text)) {
            searchResults.push(text);
            console.log("Pasted Search Result URL:", text); // Log every result

            if (searchResults.length === 1) {
                console.log("First Search Result URL:", text); // Log the first result separately
            }
        }

        if (searchResults.length >= 20) {
            writeBatchData(); // Write to sheet when 20 results are gathered
        }
    }).catch(err => console.error("Failed to read clipboard: ", err));
});


function getSheetData () {
    console.log("Fetching data from the sheet...");
    fetch(sheetUrl)
        .then(response => response.json())
        .then(data => {
            nameArr = data.data;
            loadNextBatch();
        })
        .catch(error => console.error(error));
}

function loadNextBatch () {
    const batchSize = 20;
    if (currentIndex >= nameArr.length) {
        console.log("No more data to process.");
        return;
    }

    let batch = nameArr.slice(currentIndex, currentIndex + batchSize);
    rowNumbers = batch.map(entry => entry.row); // Store row numbers
    let usernames = batch.map(entry => entry.value);

    console.log("Batch of 20 names:", usernames); // Log 20 names to console

    openLinks(usernames); // Open 20 searches in new tabs

    currentIndex += batchSize; // Move to the next batch
}

function writeBatchData () {
    console.log("Writing batch data to the sheet...");
    if (searchResults.length === 0) {
        console.log("No data to write.");
        return;
    }

    let requestBody = new URLSearchParams();
    rowNumbers.forEach((row, index) => {
        requestBody.append(`row${index}`, row);
        requestBody.append(`value${index}`, searchResults[index] || "Not Found");
    });

    fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: requestBody,
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            console.log("Batch data written successfully!");
            searchResults = []; // Clear results for the next batch
            loadNextBatch(); // Load next batch
        } else {
            console.error("Failed to update sheet.");
        }
    })
    .catch(error => console.error("Error:", error));
}

getSheetData(); // Start fetching data
