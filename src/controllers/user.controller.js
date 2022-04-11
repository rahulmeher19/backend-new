const mongoose = require('mongoose');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { apiResponse, genApiResponse } = require('./status.controller');
const RoleModel = require('../models/role.model');
const PermissionRole = require('../models/permissionRoles.model');
const Permission = require('../models/permission.model');
const Modules = require('../models/modules.model');
const logger = require('../utils/logger');
// const logged_in  = require('../controllers/auth.controller');
const myauth = require('../middlewares/auth');
const User = require('../models/user.model');
const Log = require('../models/log.model');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body).then((user) => {
    if (!user) throw new Error('Target user does not exist. Failed to create.');
    const { name } = req.body;
    if (name) user.name = name;
    if (user.save()) {
      const data = {
        action: 'create-user',
        category: 'users',
        createdBy: req.body.id,
        message: `Create ${req.body.firstName} Successfully!`,
      };
      console.log(req.user);
      logger(data);
    } else {
      console.log('this is the wrong');
    }
  });
  const message = 'User is Successfully Created!';
  apiResponse.data = { user };
  apiResponse.message = { message };
  return res.status(httpStatus.CREATED).send(genApiResponse(200, true, null, { user }, message));
});

const getAllUser = catchAsync(async (req, res) => {
  let paginationType = null;
  if (req.query) {
    paginationType = req.query.paginationType ? req.query.paginationType : paginationType;
  }

  let isPagination = true;
  if (paginationType == 'all') {
    isPagination = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = pick(req.query, ['email', 'first_name', 'last_name', 'phone_number']);

  let responseData = null;
  let pagination = null;

  const result = await userService.queryUsers(filter, options, isPagination);
  const message = 'All User Detail!';

  responseData = result;

  if (result.results) {
    responseData = result.results;
    pagination = {
      currentPage: result.page,
      lastPage: result.totalPages,
    };
  }
  console.log('users', req.user);
  // logger({
  //   action: 'read-user',
  //   category: 'users',
  //   createdBy: '',
  //   message: `Read user`,
  // });
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, responseData, message, pagination));
});

// get User permissions
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  const permission = await RoleModel.findOne({ _id: user.role_id }, { permissions: 1 });
  const data = { permission: permission.permissions };
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const message = 'User Details!';
  apiResponse.data = { user };
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, { data }, message));
});

const getPermissions = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  const roles = await PermissionRole.find({ role_id: user.role_id }).lean();

  const tmpPer = [];
  for (let i = 0; i < roles.length; i++) {
    const permissionArr = await Permission.find({
      _id: roles[i].permission_id,
    }).lean();
    for (let j = 0; j < permissionArr.length; j++) {
      const modules = await Modules.find({
        _id: permissionArr[j].modules_id,
      });
      permissionArr[i].modules = modules;
    }
    tmpPer.push(permissionArr[i]);
  }
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role ID not found');
  }
  const message = 'Role Permission Details!';
  apiResponse.data = { user };
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, { permissions: tmpPer }, message));
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserById(req.params.id, req.body).then((user) => {
    if (!user) throw new Error('Target user does not exist. Failed to update.');
    const { name } = req.body;
    if (name) user.name = name;
    if (user.save()) {
      const data = {
        action: 'update-user',
        category: 'users',
        createdBy: user.first_name,
        user_id: user.user_id,
        createdAt: req.params.id,
        actionOn: `Updated user ${req.body.firstName}`,
      };
      console.log(req.user);
      logger(data);
    } else {
      console.log('this is the wrong');
    }
  });
  const message = 'User is Updated Sucessfully!';
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, { user }, message));
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUserById(req.params.id);
  apiResponse.data = { user };
  return res
    .status(httpStatus.OK)
    .send(genApiResponse(200, true, null, { user }, { message: 'User is Deleted Successfully!' }));
});

const searchFilter = catchAsync(async (req, res) => {
  User.find(
    {
      $or: [
        { first_name: new RegExp(req.query.search, 'i') },
        {
          $or: [
            { last_name: new RegExp(req.query.search, 'i') },
            { $or: [{ email: new RegExp(req.query.search, 'i') }, { password: new RegExp(req.query.search, 'i') }] },
          ],
        },
      ],
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Second function call : ', data);
      }
      // const message = 'Serach User Details';
      // apiResponse.data = { users };
      // apiResponse.message = { message };

      // console.log('<><>',docs);
      // return res.send(docs);
      const message = 'Search User Successfully!!';
      // apiResponse.data = { data };
      apiResponse.message = { message };
      return res.status(httpStatus.CREATED).send(genApiResponse(200, true, null, data, message));
    }
  );
  // return res.status(httpStatus.OK).send((200,users));
});

module.exports = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  getPermissions,
  searchFilter,
};
