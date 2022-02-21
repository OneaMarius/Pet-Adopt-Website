const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user-model");
const bcrypt = require('bcryptjs')

function dataValidation(req) {
   const valid_errors = validationResult(req);
   let errorsLog = "";
   valid_errors.errors.forEach((error) => {
      errorsLog += error.param + ", ";
   });
   if (!valid_errors.isEmpty()) {
      return (error = new HttpError(
         `This fields(${errorsLog.slice(0, -2)}) are invalid`,
         422
      ));
   }
}

async function signup(req, res, next) {
   // if(dataValidation(req)) {
   //     error = dataValidation(req)
   //     return next(error)
   // }

   const { name, email, password, oras, judet, resedinta, tel } = req.body;
   if (password.length < 6) {
      return next(new HttpError("Password to short", 401));
   }
   let AuthUserList;
   try {
      AuthUserList = await User.find();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   const emailExist = AuthUserList.find((u) => u.email === email);
   if (emailExist) {
      return next(new HttpError("Email already exist", 401));
   }
   
   let hashPassword;
   try {
      hashPassword = await bcrypt.hash(password, 12) 
   } catch (error) {
      return next(new HttpError("Could not create user, please try again", 500));
   }
   

   const newUser = new User({
      name,
      email,
      password:hashPassword,
      oras,
      judet,
      resedinta,
      tel,
      avatar: req.file.path,
      donated: [],
      follow: [],
      adoptReqSent: [],
      adoptReqClosed: [],
   });
   try {
      await newUser.save();
   } catch (error) {
      const err = new HttpError("User signup failed, pls try again", 500);
      return next(err);
   }
   console.log('new user created: ',newUser.name);
   res.status(200).json({ login: true, user: newUser });
}

async function login(req, res, next) {
   if (dataValidation(req)) {
      error = dataValidation(req);
      return next(error);
   }

   const { email, password } = req.body;
   let AuthUserList;
   try {
      AuthUserList = await User.find();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   if (AuthUserList.length === 0) {
      return next(new HttpError("Empty Database", 404));
   }
   const user = AuthUserList.find((u) => u.email === email);
   if (!user) {
      return next(new HttpError("Wrong email", 401));
   }
   let validPassword = false;
   validPassword = await bcrypt.compare(password, user.password);

   if (!validPassword) {
      return next(new HttpError("Wrong password", 401));
   }
   res.status(200).json({ login: true, user: user });
}

async function getAuthUsers(req, res, next) {
   let AuthUserList;
   try {
      AuthUserList = await User.find();
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   if (AuthUserList.length === 0) {
      return next(new HttpError("No users found in database", 404));
   }
   res.json({
      AuthUserList: AuthUserList.map((user) =>
         user.toObject({ getters: true })
      ),
   });
}

// const getUserById = async (req, res, next) => {
//    const userID = req.params.uid;
//    let user;
//    try {
//       user = await User.findById(userID);
//    } catch (error) {
//       return next(new HttpError("Something went wrong", 500));
//    }
//    if (!user) {
//       const error = new HttpError("Could not find a user with this id.", 404);
//       return next(error);
//    }
//    res.json(user.toObject({ getters: true }));
// };

// const updateUser = async (req, res, next) => {
//    if (dataValidation(req)) {
//       error = dataValidation(req);
//       return next(error);
//    }

//    const userID = req.params.uid;
//    let user;
//    try {
//       user = await User.findById(userID);
//    } catch (error) {
//       return next(new HttpError("Something went wrong", 500));
//    }
//    if (!user) {
//       const error = new HttpError("Could not find a user with this id.", 404);
//       return next(error);
//    }
//    const { name, age, password } = req.body;
//    user.name = name;
//    user.age = age;
//    user.password = password;
//    try {
//       await user.save();
//    } catch (err) {
//       return next(new HttpError("Something went wrong", 500));
//    }
//    res.status(200).json(user.toObject({ getters: true }));
// };

const updateUserDonatedPet = async (req, res, next) => {
   const { userID, donatedPetId } = req.body;
   let user;
   try {
      user = await User.findById(userID);
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   if (!user) {
      const error = new HttpError("Could not find a user with this id.", 404);
      return next(error);
   }

   user.donated.push(donatedPetId);

   try {
      await user.save();
   } catch (err) {
      return next(new HttpError("Something went wrong on user.save", 500));
   }
   res.status(200).json(user);
};

const updateUserAdoptReqClosed = async (req, res, next) => {
   const { userID , adoptReqId} = req.body;
   console.log(req.body);
   let user;
   try {
      user = await User.findById(userID);
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   if (!user) {
      const error = new HttpError("Could not find a user with this id.", 404);
      return next(error);
   }

   user.adoptReqClosed.push(adoptReqId);

   console.log(user.adoptReqClosed);
   try {
      await user.save();
   } catch (err) {
      return next(new HttpError("Something went wrong on user.save ", 500));
   }
   res.status(200).json({user});
};

const updateUserFollow = async (req, res, next) => {
   const { petID , userID } = req.body;
   let user;
   try {
      user = await User.findById(userID);
   } catch (error) {
      return next(new HttpError("Something went wrong", 500));
   }
   if (!user) {
      const error = new HttpError("Could not find a user with this id.", 404);
      return next(error);
   }
   
   let checkFollow;
   let followedPet = user.follow.find(fPet => fPet === petID);
   if (followedPet) {
      console.log('followedPet exist: ',followedPet);
      const newFollowArr = user.follow.filter(fPet => fPet !== followedPet);
      user.follow = [...newFollowArr]
      checkFollow = false;
      console.log(user.follow);
   } else {
      console.log('followedPet not found');
      user.follow.push(petID);
      checkFollow = true;
   }
   // user.follow = [];  // for clearing follow

   try {
      await user.save();
   } catch (err) {
      return next(new HttpError("Something went wrong on user.save", 500));
   }
   res.status(200).json({user:user,checkFollow:checkFollow});
};


// const deleteUser = async (req, res, next) => {
//    const userID = req.params.uid;
//    let user;
//    try {
//       user = await User.findById(userID);
//    } catch (error) {
//       return next(new HttpError("Something went wrong", 500));
//    }
//    if (!user) {
//       const error = new HttpError("Could not find a user with this id.", 404);
//       return next(error);
//    }
//    try {
//       await user.remove();
//    } catch (err) {
//       return next(new HttpError("Something went wrong", 500));
//    }
//    res.status(200).json({ message: `User ${userID} deleted` });
// };

module.exports = {
   login,
   signup,
   getAuthUsers,
   // getUserById,
   // updateUser,
   // deleteUser,
   updateUserDonatedPet,
   updateUserFollow,
   updateUserAdoptReqClosed,
};
