const mongoose = require('mongoose');

// Traduce errores de Mongoose/MongoDB a respuestas HTTP claras
const manejarError = (res, err) => {
  if (err.name === 'ValidationError') {
    const detalles = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Datos inválidos', detalles });
  }
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({ error: `Ya existe un registro con el mismo valor en: ${campo}` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Valor inválido para el campo ${err.path}` });
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
};

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Fabrica de controladores CRUD.
 * @param {Model} Modelo        Modelo de Mongoose
 * @param {string} nombre       Nombre legible del recurso (para mensajes)
 * @param {object} opciones     { camposEditables: [...], campoEnMedia: 'genero' }
 *                              campoEnMedia evita borrar registros usados por alguna Media.
 */
const crearCrud = (Modelo, nombre, { camposEditables, campoEnMedia } = {}) => {
  const filtrar = (body) => {
    if (!camposEditables) return body;
    return camposEditables.reduce((acc, campo) => {
      if (body[campo] !== undefined) acc[campo] = body[campo];
      return acc;
    }, {});
  };

  return {
    listar: async (req, res) => {
      try {
        const filtro = {};
        if (req.query.estado) filtro.estado = req.query.estado;
        const items = await Modelo.find(filtro).sort({ fechaCreacion: -1 });
        res.json(items);
      } catch (err) {
        manejarError(res, err);
      }
    },

    obtener: async (req, res) => {
      try {
        if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
        const item = await Modelo.findById(req.params.id);
        if (!item) return res.status(404).json({ error: `${nombre} no encontrado` });
        res.json(item);
      } catch (err) {
        manejarError(res, err);
      }
    },

    crear: async (req, res) => {
      try {
        const item = await Modelo.create(filtrar(req.body));
        res.status(201).json(item);
      } catch (err) {
        manejarError(res, err);
      }
    },

    actualizar: async (req, res) => {
      try {
        if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
        const item = await Modelo.findByIdAndUpdate(req.params.id, filtrar(req.body), {
          new: true,
          runValidators: true,
        });
        if (!item) return res.status(404).json({ error: `${nombre} no encontrado` });
        res.json(item);
      } catch (err) {
        manejarError(res, err);
      }
    },

    eliminar: async (req, res) => {
      try {
        if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });

        if (campoEnMedia) {
          const Media = require('../models/Media');
          const enUso = await Media.exists({ [campoEnMedia]: req.params.id });
          if (enUso) {
            return res
              .status(409)
              .json({ error: `No se puede eliminar: ${nombre} está asociado a una o más medias` });
          }
        }

        const item = await Modelo.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: `${nombre} no encontrado` });
        res.json({ mensaje: `${nombre} eliminado correctamente`, eliminado: item });
      } catch (err) {
        manejarError(res, err);
      }
    },
  };
};

module.exports = { crearCrud, manejarError, idValido };
