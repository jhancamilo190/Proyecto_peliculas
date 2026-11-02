const { Schema, model } = require('mongoose');

const tipoSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
    descripcion: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, versionKey: false }
);

module.exports = model('Tipo', tipoSchema);
