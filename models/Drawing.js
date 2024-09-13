const mongoose = require('mongoose')

// Excalidraw Data Schema
const excalidrawSchema = new mongoose.Schema({
  elements: { type: Array, required: true },
  appState: { type: Object, required: true },
});

// Main Drawing Schema
const drawingSchema = new mongoose.Schema({
  // title: { type: String, required: true },
  // excalidrawData: excalidrawSchema,
  elements: { type: Array, required: true },
  appState: { type: Object, required: false },
  // createdAt: { type: Date, default: Date.now },
});

const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;