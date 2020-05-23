  require('./config/config')
  const express = require('express')
  const mongoose = require('mongoose');
  const path = require('path')
  const app = express()
  const bodyParser = require('body-parser')

  // Body parser middlewares
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Configuración global de rutas
  app.use(require('./routes/index'))

  //Habilitar la carpeta public
  app.use(express.static(path.resolve(__dirname, '../public')))

  mongoose.set('useCreateIndex', true);
  mongoose.connect(process.env.URLDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
  }, (err, res) => {
      if (err) throw err

      console.log('DB mongoose running');
  })

  app.listen(process.env.PORT, () => {
      console.log(`Listen on port: ${process.env.PORT}`);
  })