require('dotenv').config();

const mongoose = require('mongoose');

const app = require('./app');
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});
app.listen(PORT, () => console.log(`🌐 Listening on port ${PORT}`));
