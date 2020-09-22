const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
require('./passport')(passport);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(res => {
  app.listen(port);
  console.log(`Server on port ${port}`);
  console.log('Connected to DB');
}).catch(err => console.log(err));

app.use('/users', require('./routes/users'));
app.use('/recipes', require('./routes/recipes'));