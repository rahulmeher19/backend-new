const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { modulesService } = require('../services');
const { apiResponse, genApiResponse } = require('./status.controller');
const Permission = require('../models/permission.model')
const Modules = require('../models/modules.model')


const getModules =  catchAsync(async (req, res) =>{
    const permission = await modulesService.getModulesById(req.params.id);
    console.log({query : req.query , params: req.params});
    // const modules = await Permission.find({modules_id: req.params.modules_id });
    const modules = await getAllModules() ;
    console.log(modules);

     if(!modules) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Module ID not found');
    }
    const message = 'Module Permission Details!';
    apiResponse.data ={permission};
    return res.status(httpStatus.OK).send(genApiResponse(200, true, null, {modules}, message));
  });


  async function getAllModules(){


    const ModulesArr =    await  Modules.find({})
    const output = await ModulesArr.map(async (_module) => {
      const moduleId = _module._id;
      const PermissonsArr = await Permission.find({modules_id: moduleId});
      return {_module , permission:PermissonsArr}
    })

    return Promise.all(output)






  }
  
  module.exports = {
    getModules
  };