const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const viewRoutes = require('./src/routes/view.route');
const apiRoutes = require('./src/routes/api.route');

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  next();
});

app.get('/', (req, res) => {
  res.render('layout', { page: 'login' });
});

// Rotas
app.use('/', viewRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('layout', { page: 'not-found' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
