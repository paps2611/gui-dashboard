const mongoose = require('mongoose');

const nodeStatusSchema = new mongoose.Schema({
  nodeName: { type: String, required: true },
  nodeType: { type: String, required: true },
  status: { type: String, required: true },
  cpu: { type: Number, required: true },
  memory: { type: Number, required: true },
  disk: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NodeStatus', nodeStatusSchema, 'nodestatusdb');