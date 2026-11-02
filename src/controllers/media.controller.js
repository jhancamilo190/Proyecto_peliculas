const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const { manejarError, idValido } = require('./crud');

const CAMPOS = ['serial', 'titulo', 'sinopsis', 'url', 'imagen', 'anioEstreno', 'genero', 'director', 'productora', 'tipo'];

const POBLAR = [
  { path: 'genero', select: 'nombre estado' },
  { path: 'director', select: 'nombres estado' },
  { path: 'productora', select: 'nombre estado' },
  { path: 'tipo', select: 'nombre' },
];

const filtrar = (body) =>
  CAMPOS.reduce((acc, c) => {
    if (body[c] !== undefined) acc[c] = body[c];
    return acc;
  }, {});

// Verifica que genero, director, productora y tipo existan y que los
// tres primeros estén en estado "Activo". Devuelve un mensaje de error o null.
const validarReferencias = async (datos) => {
  const checks = [
    ['genero', Genero, 'El género'],
    ['director', Director, 'El director'],
    ['productora', Productora, 'La productora'],
    ['tipo', Tipo, 'El tipo'],
  ];

  for (const [campo, Modelo, etiqueta] of checks) {
    if (datos[campo] === undefined) continue;
    if (!idValido(datos[campo])) return `${etiqueta} tiene un ID inválido`;
    const doc = await Modelo.findById(datos[campo]);
    if (!doc) return `${etiqueta} indicado no existe`;
    if (doc.estado && doc.estado !== 'Activo') return `${etiqueta} indicado está Inactivo`;
  }
  return null;
};

exports.listar = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.tipo && idValido(req.query.tipo)) filtro.tipo = req.query.tipo;
    if (req.query.genero && idValido(req.query.genero)) filtro.genero = req.query.genero;
    const medias = await Media.find(filtro).populate(POBLAR).sort({ fechaCreacion: -1 });
    res.json(medias);
  } catch (err) {
    manejarError(res, err);
  }
};

exports.obtener = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    const media = await Media.findById(req.params.id).populate(POBLAR);
    if (!media) return res.status(404).json({ error: 'Media no encontrada' });
    res.json(media);
  } catch (err) {
    manejarError(res, err);
  }
};

exports.crear = async (req, res) => {
  try {
    const datos = filtrar(req.body);
    const errorRef = await validarReferencias(datos);
    if (errorRef) return res.status(400).json({ error: errorRef });

    const media = await Media.create(datos);
    const completa = await media.populate(POBLAR);
    res.status(201).json(completa);
  } catch (err) {
    manejarError(res, err);
  }
};

exports.actualizar = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    const datos = filtrar(req.body);
    const errorRef = await validarReferencias(datos);
    if (errorRef) return res.status(400).json({ error: errorRef });

    const media = await Media.findByIdAndUpdate(req.params.id, datos, {
      new: true,
      runValidators: true,
    }).populate(POBLAR);
    if (!media) return res.status(404).json({ error: 'Media no encontrada' });
    res.json(media);
  } catch (err) {
    manejarError(res, err);
  }
};

exports.eliminar = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ error: 'ID inválido' });
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media no encontrada' });
    res.json({ mensaje: 'Media eliminada correctamente', eliminado: media });
  } catch (err) {
    manejarError(res, err);
  }
};
