const express = require('express');
const http = require('http');
const path = require('path'); // Import the 'path' module
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/proxy', async (req, res) => {
    try {
        const pdfFileName = req.query.url; // PDF filename provided in the query parameter
        const pdfUrl = `http://localhost:3000/${pdfFileName}`; // Construct the URL dynamically
        const response = await fetchPdf(pdfUrl);
        res.set('Content-Type', 'application/pdf');
        res.send(response);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Error fetching PDF');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});

// Function to fetch PDF using http module
function fetchPdf(pdfUrl) {
    return new Promise((resolve, reject) => {
        http.get(pdfUrl, (response) => {
            let data = [];
            response.on('data', (chunk) => {
                data.push(chunk);
            });
            response.on('end', () => {
                resolve(Buffer.concat(data));
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}
