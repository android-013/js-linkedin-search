function openLink (username) {
    const education = "Northern University of Business and Technology Khulna";
    const searchQuery = `${username} ${education} site:linkedin.com/in`;
    const url = `https://www.google.com/search?btnI=1&q=${encodeURIComponent(searchQuery)}`;

    // open in new tab
    window.open(url, "_blank");
}

const sheetUrl = "https://script.google.com/macros/s/AKfycbzq1Ivw9sOn7Gj8bC32uMb7xpdc26iUD1TB2OyDrlJQfv_KUhe4oSKpSivxER3wKQYW9g/exec";

var nameArr;
var currentIndex = 56;
var rowNumber = 0;

function getSheetData () {
    console.log("Fetching data from the sheet...");
    fetch(sheetUrl)
        .then(response => response.json())
        .then(data => {
            nameArr = data.data;
            console.log("Data fetched: ", nameArr[currentIndex]);
            showData(nameArr[currentIndex]);
        })
        .catch(error => console.error(error));
}

getSheetData();

function writeData (row, value) {
    console.log("Writing data to the sheet...");
    fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            row: row,
            value: value
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.result === "success") {
                console.log(data.msg);
                currentIndex++;
                showData(nameArr[currentIndex]);
            } else {
                confirm.error("Failed to change state");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function copyToClipboard (text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log("URL copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

function pasteFromClipboard () {
    navigator.clipboard.readText().then(text => {
        console.log("Pasted text: ", text);
    }).catch(err => {
        console.error("Failed to read clipboard: ", err);
    });
}

function showData (data) {
    const htmlData = `
        <div>${data.row}</div>
        <div>${data.value}</div>
        <div id="url">???</div>
    `
    rowNumber = data.row;
    document.getElementById("holder").innerHTML = htmlData;
    openLink(data.value);
}

function showNext () {
    currentIndex++;
    showData(nameArr[currentIndex]);
}

let lastClipbord = "";

window.addEventListener("focus", () => {
    navigator.clipboard.readText().then(text => {
        if (lastClipbord === text) {
            showNext();
        }
        else {
            document.getElementById("url").innerText = text;
            lastClipbord = text;
            writeData(rowNumber, text);
        }
    }).catch(err => {
        console.error("Failed to read clipboard: ", err);
    });
});