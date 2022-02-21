const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = new Schema({
   petOrderNr: { type: Number, required: true },
   petAge: { type: String, required: true },
   petHome: { type: String, required: true },
   petName: { type: String, required: true },
   petOwnerAddress: { type: String, required: true },
   petOwnerHome: { type: String, required: true },
   petOwnerId: { type: String, required: true },
   petOwnerName: { type: String, required: true },
   petPass: { type: String, required: true },
   petRace: { type: String, required: true },
   petType: { type: String, required: true },
   petVac: { type: String, required: true },
   petImage: { type: String, required: true },
   petAddedDate: { type: String, required: true },
   petWasAdopted: { type: Boolean, required: true },
   chatDB: { type: Array},
   followers: { type: Array},
});

module.exports = mongoose.model("Pet", petSchema);
