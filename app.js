function openLink (username) {
    const education = "Northern University of Business and Technology Khulna";
    const searchQuery = `${username} ${education} site:linkedin.com/in`;
    const url = `https://www.google.com/search?btnI=1&q=${encodeURIComponent(searchQuery)}`;

    // open in new tab
    window.open(url, "_blank");
}

const sheetUrl = "https://script.google.com/macros/s/AKfycbz9czR_K2usfhs_CCflzCH9mrR1i5jYqZEetDXtD0ewLPx1CGSSWh-0J7sGLpTuBPx_hw/exec";


var nameArr;
var currentIndex = 350;
var rowNumber = 0;
var urlArr = [];

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

//getSheetData();

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

writeData(350, "https://www.linkedin.com/in/user1");

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
            //showNext();
            addToArr(rowNumber, "");
        }
        else {
            document.getElementById("url").innerText = text;
            lastClipbord = text;
            //writeData(rowNumber, text);
            addToArr(rowNumber, text);
        }
    }).catch(err => {
        console.error("Failed to read clipboard: ", err);
    });
});

function addToArr(rowNumber, url) {
    urlArr.push({ row: rowNumber, url: url });

    if (urlArr.length == 5) {
        for (let i = 0; i < 5; i++) {
            //writeData(urlArr[i].row, urlArr[i].url);
            console.log(urlArr[i]);
        }
    }
    else {
        currentIndex++;
        showData(nameArr[currentIndex]);
    }
}

function writeDataArr () {
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

function writeBatchData(batchData) {
    console.log("Writing batch data to the sheet...");
    const formData = new URLSearchParams();

    batchData.forEach((data, index) => {
        formData.append(`row${index}`, data.row);       // row key
        formData.append(`value${index}`, data.url);   // value key
    });

    fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            body: formData,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            console.log("Batch update successful:", data.updated);
        } else {
            console.error("Batch update failed:", data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}

// Example batch data (20 rows)
const batchData = [
    { row: 405, url: "https://www.linkedin.com/in/user1" },
    { row: 406, url: "https://www.linkedin.com/in/user2" },
    { row: 407, url: "https://www.linkedin.com/in/user3" },
    { row: 408, url: "https://www.linkedin.com/in/user4" },
    { row: 409, url: "https://www.linkedin.com/in/user5" },
];

// Send batch data
//writeBatchData(batchData);
