const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const busy_hours = require('busy-hours');
// Setting up the public directory
app.use(express.static('client'));

app.listen(port, () => console.log(`listening on port ${port}!`));