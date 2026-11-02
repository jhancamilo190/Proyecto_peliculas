const mongoose = require('mongoose');

const conectarDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/peliculas_db';
  await mongoose.connect(uri);
  console.log('Conectado a MongoDB');
};

module.exports = conectarDB;
