const AdoptReqest = require("../models/adoptrequest-model");
const User = require("../models/user-model");
const HttpError = require("../models/http-error");

async function CreateAdoptRequest(req, res, next) {
   const { sender, pet } = req.body;
   //  find sender
   let reqSenderUser;
   try {
      reqSenderUser = await User.findById(sender._id);
   } catch (error) {
      return next(
         new HttpError(
            "Something went wrong at finding user in create adopt req",
            500
         )
      );
   }
   if (!reqSenderUser) {
      const error = new HttpError(
         "Could not find a user with this id in adopt req.",
         404
      );
      return next(error);
   }
   //  update sender adopt req for selected pet
   reqSenderUser.adoptReqSent.push(pet.id);
   try {
      await reqSenderUser.save();
   } catch (error) {
      const err = new HttpError(
         "Update Sender Adopt req failed, pls try again",
         500
      );
      return next(err);
   }
   //find receiver
   let petOwner;
   try {
      petOwner = await User.findById(pet.petOwnerId);
   } catch (error) {
      return next(
         new HttpError(
            "Something went wrong at finding user in create adopt req",
            500
         )
      );
   }
   if (!petOwner) {
      const error = new HttpError(
         "Could not find a user with this id in adopt req.",
         404
      );
      return next(error);
   }

   // set adopt req time

   const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
   ];
   const today = new Date();
   const reqDate = `${today.getDate()}-${months[today.getMonth()]}-${today.getFullYear()} at ${today.getHours()}:${today.getMinutes()}`;
   // add new adopt request
   const newAdReq = new AdoptReqest({
      adReqSender: reqSenderUser,
      adReqPet: pet,
      petName: pet.petName,
      petAvatar: pet.petImage,
      petOwnerName: pet.petOwnerName,
      petOwnerAvatar: petOwner.avatar,
      petOwnerContact: { email: petOwner.email, tel: petOwner.tel },
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderHome: sender.resedinta,
      senderLocation: sender.oras + ", " + sender.judet,
      senderContact: { email: sender.email, tel: sender.tel },
      adReqStatus: "Waiting",
      adReqDate: reqDate,
   });

   try {
      await newAdReq.save();
   } catch (error) {
      const err = new HttpError("Adopt req failed, pls try again", 500);
      return next(err);
   }

   console.log("new adoption req created: ", newAdReq);
   console.log("new adoption req created: ", reqSenderUser);
   res.status(200).json(newAdReq.toObject({ getters: true }));
}

async function GetAllAdoptRequests(req, res, next) {
   let adoptReqList;
   try {
      adoptReqList = await AdoptReqest.find();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   if (adoptReqList.length === 0) {
      return next(new HttpError("No users found in database", 404));
   }
   res.json({
      adoptReqList: adoptReqList.map((adoptReq) =>
         adoptReq.toObject({ getters: true })
      ),
   });
}

const UpdateStatusAdoptRequest = async (req, res, next) => {
   const { reqID, reqStatus } = req.body;
   let myReq;
   try {
      myReq = await AdoptReqest.findById(reqID);
   } catch (error) {
      return next(
         new HttpError("Something went wrong on update adopt req status", 500)
      );
   }

   if (!myReq) {
      const error = new HttpError(
         "Could not find a request with this id.",
         404
      );
      return next(error);
   }

   myReq.adReqStatus = reqStatus;
   console.log(reqID, reqStatus);

   try {
      await myReq.save();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   res.status(200).json(myReq);
};

const DeleteAdoptRequest = async (req, res, next) => {
   const { adoptReqId } = req.body;
   let adoptReq;
   console.log('req recieved',req.body , adoptReqId);
   try {
      adoptReq = await AdoptReqest.findById(adoptReqId);
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   if (!adoptReq) {
      const error = new HttpError("Could not find adopt request.", 404);
      return next(error);
   }
   try {
      await adoptReq.remove();
   } catch (err) {
      return next(new HttpError("Something went wrong", 500));
   }
   res.status(200).json({ message: `Adopt request ${adoptReqId} deleted` });
};

module.exports = {
   CreateAdoptRequest,
   GetAllAdoptRequests,
   UpdateStatusAdoptRequest,
   DeleteAdoptRequest,
};
