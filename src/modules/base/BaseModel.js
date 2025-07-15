const mongoose =require('mongoose');

// Define common fields
const baseModel ={
    _id:{ type: mongoose.Schema.Types.ObjectId, auto: true },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now},
    createdBY: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user'}
};

// A utility function to extend schemas with base fields

const extendSchema = (schemaDefinition) =>{
    return new mongoose.Schema({
        ...baseModel,
        ...schemaDefinition
    },
    {
        timestamps: true,
    }
);
}

module.exports = extendSchema;