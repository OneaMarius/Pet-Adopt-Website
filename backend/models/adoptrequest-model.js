const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adoptRequestSchema = new Schema({

   adReqSender: { type: Object, required: true },
   adReqPet: { type: Object, required: true },
   adReqStatus: { type: String, required: true },
   adReqDate: { type: String, required: true },
   petName: { type: String, required: true },
   petAvatar: { type: String, required: true },
   petOwnerName: { type: String, required: true },
   petOwnerAvatar: { type: String, required: true },
   petOwnerContact: { type: Object, required: true },
   senderName: { type: String, required: true },
   senderAvatar: { type: String, required: true },
   senderHome: { type: String, required: true },
   senderLocation: { type: String, required: true },
   senderContact: { type: Object, required: true },

});

module.exports = mongoose.model("AdoptReqest", adoptRequestSchema);