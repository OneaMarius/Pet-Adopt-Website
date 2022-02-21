const HttpError = require("../models/http-error");
// const { v4: uuid } = require("uuid");
// const Product = require("../models/product-model");
const productNR = require("../models/product-number-model");
const Pet = require("../models/pet-model");
const User = require("../models/user-model");

const getAllPets = async (req, res, next) => {
   let PetList;
   try {
      PetList = await Pet.find();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   let UserList;
   try {
      UserList = await User.find();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   res.json({PetList:PetList.map((pet) => pet.toObject({ getters: true })),
             UserList:UserList.map((user) => user.toObject({ getters: true }))});
};

const getPetById = async (req, res, next) => {
   const prodID = req.params.pid;
   console.log(prodID);
   let product;
   try {
      product = await Pet.findById(prodID);
   } catch (error) {
      return next(new HttpError("Pet not found", 500));
   }

   if (!product) {
      const error = new HttpError(
         "Could not find a product with this id.",
         404
      );
      return next(error);
   }

   res.json(product.toObject({ getters: true }));
};

const addNewPet = async (req, res, next) => {
   const {
      petAge,
      petName,
      petRace,
      petType,
      petHome,
      petVac,
      petPass,
      petOwnerName,
      petOwnerId,
      petOwnerAddress,
      petOwnerHome,
   } = req.body;
   let ordNr;
   let orderNrArr = await productNR.find();
   if (orderNrArr.length !== 0) {
      orderNrArr[0].nr = orderNrArr[0].nr + 1;
      ordNr = orderNrArr[0].nr;
      await orderNrArr[0].save();
   } else {
      firstOrderNr = await new productNR({
         nr: 1,
      });
      ordNr = 1;
      await firstOrderNr.save();
   }

   const today = new Date();
   const petAddedDate =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
   const newPet = new Pet({
      petAge,
      petName,
      petRace,
      petType,
      petHome,
      petVac,
      petPass,
      petOwnerName,
      petOwnerId,
      petOwnerAddress,
      petOwnerHome,
      petImage: req.file.path,
      petOrderNr: ordNr,
      petAddedDate: petAddedDate,
      petWasAdopted: false,
      chatDB: [],
      followers: [],
   });
   
   try {
      await newPet.save();
   } catch (error) {
      return next(new HttpError("Something went wrong prod", 500));
   }
   console.log('new pet created: ',newPet.petName);
   res.status(201).json(newPet);
};

const updatePet = async (req, res, next) => {
   const prodID = req.params.pid;
   let myPet;
   try {
      myPet = await Pet.findById(prodID);
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }

   if (!myPet) {
      const error = new HttpError(
         "Could not find a myPet with this id.",
         404
      );
      return next(error);
   }

   const {petWasAdopted, chatDB} = req.body;
   console.log(petWasAdopted);
   if(chatDB[chatDB.length - 1] !== '') {
      myPet.chatDB = chatDB;
   };
   myPet.petWasAdopted = petWasAdopted;
   

   try {
      await myPet.save();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   res.status(200).json(myPet);
};

const updatePetFollowers = async (req, res, next) => {
   const { petID , userID } = req.body;
   let myPet;
   try {
      myPet = await Pet.findById(petID);
   } catch (error) {
      return next(new HttpError("Something went wrong on updatePetFollowers", 500));
   }

   if (!myPet) {
      const error = new HttpError(
         "Could not find a myPet with this id.",
         404
      );
      return next(error);
   }

   console.log(petID , userID);

   let followerExist = myPet.followers.find(follower => follower === userID);
   if (followerExist) {
      console.log('Follower exist: ',followerExist);
      const newFollowersArr = myPet.followers.filter(follower => follower !== followerExist);
      myPet.followers = [...newFollowersArr]
      console.log(myPet.followers);
   } else {
      console.log('Follower not found');
      myPet.followers.push(userID)
   }
   // myPet.followers = []   // for clearing followers

   try {
      await myPet.save();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   res.status(200).json(myPet);
};


module.exports = {
   getAllPets: getAllPets,
   getPetById: getPetById,
   addNewPet: addNewPet,
   updatePet: updatePet,
   updatePetFollowers: updatePetFollowers,
   
};
