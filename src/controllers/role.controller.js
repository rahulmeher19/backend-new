const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');
const { apiResponse, genApiResponse } = require('./status.controller');
const RoleModel = require('../models/role.model');
const PermissionRole = require('../models/permissionRoles.model')
const Permission = require('../models/permission.model')
const Modules = require('../models/modules.model')
const logger = require('../utils/logger')
const Role  = require('../models/role.model');



const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  const message = 'Role is Successfully Created!';
  apiResponse.data = { role };
  apiResponse.message = { message };
  console.log(apiResponse);
  return res.status(httpStatus.CREATED).send(genApiResponse(200, true, null, { role }, message));
});

const getAllRole = catchAsync(async (req, res) => {
  let paginationType = null;
  if (!!req.query) {
    paginationType = !!req.query.paginationType ? req.query.paginationType : paginationType
  }

  let isPagination = true
  if (paginationType == "all") {
    isPagination = false;
  }
  const filter = pick(req.query, ['roleName', 'roleTitle']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  let responseData = null;
  let pagination = null;

  const result = await roleService.queryRoles(filter, options, isPagination);
  const message = 'All Role Detail!';

  responseData = result;

  if (result.results) {
    responseData = result.results;
    pagination = {
      currentPage: result.page,
      lastPage: result.totalPages,
    }
  }

  return res.status(httpStatus.OK).send(genApiResponse(200,
    true, null, responseData, message, pagination));
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  const message = 'Role Details!';
  apiResponse.data = { role };
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, { role }, message));
});


const getPermissions = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.id);
  const roles = await PermissionRole.find({ role_id: req.params.id }).lean();
  var tmpPer = [];
  for (let i = 0; i < roles.length; i++) {
    let permissionArr = await Permission.find({
      _id: roles[i].permission_id
    }).lean();
    for (let j = 0; j < permissionArr.length; j++) {
      let modules = await Modules.find({
        _id: permissionArr[j].modules_id
      });
      permissionArr[i].modules = modules;
    }
    tmpPer.push(
      permissionArr[i]
    );
  }
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role ID not found');
  }
  const message = 'Role Permission Details!';
  apiResponse.data = { role };
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, { permissions :tmpPer }, message));
});


const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRoleById(req.params.id, req.body)
  .then(role => {
    if (!role)
      throw new Error('Target user does not exist. Failed to update.')
    const { name } = req.body
    if (name) role.name = name
    if (role.save()) {
      const data = {
        action: 'update-role',
        category: 'roles',
        createdBy: req.params.id,
        message: `Updated role ${req.body.roleName}`,
      }
      console.log(req.role)
      logger(data);
    } else {
      console.log("this is the wrong")
    }
  })

  const message = 'Role is Updated Sucessfully!';
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, { role }, message));
});

const deleteRole = catchAsync(async (req, res) => {
  const role = await roleService.deleteRoleById(req.params.id);
  apiResponse.data = { role };
  return res.status(httpStatus.OK).send(genApiResponse(200, true, null, { role }, { message: 'Role is Deleted Successfully!' }));
});

const searchFilter = catchAsync(async (req, res) => {
  Role.find({$or : [{ roleName: new RegExp(req.query.search, 'i') },
   {$or : [{ roleTitle: new RegExp(req.query.search, 'i') }, 
   {$or : [{ description: new RegExp(req.query.search, 'i') }, 
  ]}]}]},
  function (err, data) {
    if (err){
        console.log(err);
    }
    else{
        console.log("Second function call : ", data);
    }
    const message = 'Search Role Successfully!!';
    // apiResponse.data = { data };
    apiResponse.message = { message };
    return res.status(httpStatus.CREATED).send(genApiResponse(200, true, null, data , message));
  });
});

module.exports = {
  createRole,
  getAllRole,
  getRole,
  updateRole,
  deleteRole,
  getPermissions,
  searchFilter
};
