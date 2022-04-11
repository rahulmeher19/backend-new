const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { apiResponse, genApiResponse } = require('./status.controller');
const User  = require('../models/user.model');
const Log = require('../models/log.model');
const PermissionRole = require('../models/permissionRoles.model')
const Permission = require('../models/permission.model')
const Modules = require('../models/modules.model')

// const logSearch =  catchAsync(async (req, res) =>{
//   const log = await Log.find(req.params.id);
//   return ('print logs', log);
  

// });
const logSearch = catchAsync(async (req, res, next) => {
  // static data
const data = [
  {
    "action":"create user",
    "category":"user",
    "createdBy":"Abdul Bari",
    "updatedBy":"Admin",
    "category_id":"Rahul",
    "createAt":"2022-04-08 12:12:12",
    "updatedAt":"2022-04-08 12:12:12"
  },
  {
    "action":"update user",
    "category":"user",
    "createdBy":"Arpit Mathur",
    "updatedBy":"User",
    "category_id":"Rishabh",
    "createAt":"2022-04-08 13:12:32",
    "updatedAt":"2022-04-08 13:12:32"
  },
  {
    "action":"update user",
    "category":"user",
    "createdBy":"John Miller",
    "updatedBy":"User",
    "category_id":"Rahul",
    "createAt":"2022-04-07 16:09:19",
    "updatedAt":"2022-04-07 16:09:19"
  },
  {
    "action":"update user",
    "category":"user",
    "createdBy":"Abdul Bari",
    "updatedBy":"Admin",
    "category_id":"Amita",
    "createAt":"2022-04-07 19:12:37",
    "updatedAt":"2022-04-07 19:12:37"
  },
  {
    "action":"update user",
    "category":"user",
    "createdBy":"Rahul Meher",
    "updatedBy":"User",
    "category_id":"Arpit",
    "createAt":"2022-04-06 17:12:33",
    "updatedAt":"2022-04-06 17:12:33"
  },
  {
    "action":"create user",
    "category":"user",
    "createdBy":"Gautam Gupta",
    "updatedBy":"User",
    "category_id":"Rahul",
    "createAt":"2022-12-04 12:12:12",
    "updatedAt":"2022-12-04 12:12:12"
  },
  {
    "action":"update user",
    "category":"user",
    "createdBy":"Abdul Bari",
    "updatedBy":"User",
    "category_id":"Gautam",
    "createAt":"2022-12-04 12:12:12",
    "updatedAt":"2022-12-04 12:12:12"
  },
  {
    "action":"create user",
    "category":"user",
    "createdBy":"Abdul Bari",
    "updatedBy":"Admin",
    "category_id":"Rishabh",
    "createAt":"2022-12-04 12:12:12",
    "updatedAt":"2022-12-04 12:12:12"
  },
  {
    "action":"update user",
    "category":"user",
    "createdBy":"Abdul Bari",
    "updatedBy":"Admin",
    "category_id":"Rahul",
    "createAt":"2022-12-04 12:12:12",
    "updatedAt":"2022-12-04 12:12:12"
  },
  {
    "action":"create user",
    "category":"user",
    "createdBy":"Ashish Mishra",
    "updatedBy":"User",
    "category_id":"Arpit",
    "createAt":"2022-12-04 12:12:12",
    "updatedAt":"2022-12-04 12:12:12"
  }
];

let pagination = {
  currentPage: 1,
  lastPage: 5,
}
const message = 'Log is Updated Sucessfully!';
return res.status(httpStatus.OK).send(genApiResponse(200, true, null, data , message, pagination));

});
  module.exports = {
    logSearch
  };
