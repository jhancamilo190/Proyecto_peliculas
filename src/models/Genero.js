const { Schema, model } = require('mongoose');

const generoSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], unique: true, trim: true },
    estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    descripcion: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, versionKey: false }
);

module.exports = model('Genero', generoSchema);
