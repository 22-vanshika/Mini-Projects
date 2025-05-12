const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const filesDir = path.join(__dirname, 'files'); // ./files folder ka path

// 1. GET /files - return list of files
app.get('/files', (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    if (err) return res.status(500).send('Server error');
    res.json(files); // file names in JSON array
  });
});

// 2. GET /file/:filename - return file content
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(filesDir, filename);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.send(data); // file content
  });
});

// 3. 404 for all other routes
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
