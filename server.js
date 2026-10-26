const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, 'public');
const indexPage = path.join(publicDirectory, 'index.html');

app.use(express.static(publicDirectory));

app.get('/', (_request, response) => {
  response.sendFile(indexPage);
});

app.listen(PORT, () => {
  console.log(`NEXUS disponível em http://localhost:${PORT}`);
});
