const httpStatus = require('http-status');
const { Modules} = require('../models');


/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
 const getModulesById = async (id) => {
  return Modules.findById(id);
};

 const getModules = async (modules_id) =>{
    const permissionModules = await Modules.findOne({ _id: modules_id });
    console.log({permissionModules})
    return permissionModules;
  
  }


module.exports = {
  getModules,
  getModulesById,
};
