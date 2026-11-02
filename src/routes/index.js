const { Router } = require('express');
const { crearCrud } = require('../controllers/crud');
const media = require('../controllers/media.controller');

const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');

const router = Router();

// Registra las 5 rutas estándar (GET, GET/:id, POST, PUT/:id, DELETE/:id) de un recurso
const registrar = (ruta, c) => {
  router.get(ruta, c.listar);
  router.get(`${ruta}/:id`, c.obtener);
  router.post(ruta, c.crear);
  router.put(`${ruta}/:id`, c.actualizar);
  router.delete(`${ruta}/:id`, c.eliminar);
};

registrar(
  '/generos',
  crearCrud(Genero, 'Género', { camposEditables: ['nombre', 'estado', 'descripcion'], campoEnMedia: 'genero' })
);
registrar(
  '/directores',
  crearCrud(Director, 'Director', { camposEditables: ['nombres', 'estado'], campoEnMedia: 'director' })
);
registrar(
  '/productoras',
  crearCrud(Productora, 'Productora', {
    camposEditables: ['nombre', 'estado', 'slogan', 'descripcion'],
    campoEnMedia: 'productora',
  })
);
registrar('/tipos', crearCrud(Tipo, 'Tipo', { camposEditables: ['nombre', 'descripcion'], campoEnMedia: 'tipo' }));
registrar('/medias', media);

module.exports = router;
