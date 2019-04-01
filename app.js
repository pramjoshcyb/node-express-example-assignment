const express = require('express');
const bodyParser = require('body-parser');
// simplifies file paths
    // core module, so doesn't need to be npm installed
const path = require('path');

const app = express();

 // process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

/* BODY PARSER MIDDLEWARE */
// handle parsing json content
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/csp-report'}));
// handle parsing urlencoded content [extended explained here: https://www.npmjs.com/package/body-parser#extended]
app.use(bodyParser.urlencoded({extended: false}));

/* STATIC FOLDER MIDDLEWARE */
// set static path
    // `__dirname` is the directory in which the currently executing script resides
        // using this with path.join is safer than the option that doesn't
app.use(express.static(path.join(__dirname, 'public')));

let people = [
    {
        name: "Bob",
        age: 50,
    },
    {
        name: "Jane",
        age: 45,
    },
    {
        name: "T",
        age: 30,
    },
]

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/goodbye', (req, res) => {
    res.send('goodbye world');
});

app.get('/people', (req, res) => {
    res.header('Content-Security-Policy', "img-src \'self\'; report-uri /report")
    res.send("Some sample text!! <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flowchart_showing_Simple_and_Preflight_XHR.svg/768px-Flowchart_showing_Simple_and_Preflight_XHR.svg.png' alt='mixed'>" +


    "<img src='http://telstra.com.au/myimg.png'>");
});

let unique = 1;

function createLog(report) {
    let id = unique;
    unique++;

    const violatedDirective = report["violated-directive"];

    //id, date, severity

    let severity = 'unknown';
    if (violatedDirective == 'style-src') {
        severity = "moderate";
    } else if (violatedDirective == 'script-src') {
        severity = "high";
    }

    const newLog = {
        id:         id,
        severity:   severity,
        reportType: violatedDirective,
        timestamp:  Math.floor(new Date().getTime() / 1000)
    };

    return newLog;

}
// route
// handles post requests to any url
app.post('/*', (req, res) => {
    console.log(req.body);

    // handle the report in some way
    const report = req.body["csp-report"];

    createLog? sort of probably

    res.end();
    //res.send('hello world');
});

