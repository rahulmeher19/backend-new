const loggerSchema = require('../models/log.model')
const logger = (data) => {
    loggerSchema.create(data).then(res => {
         console.log('log added');
    }).catch(err => {

    })
}
module.exports = logger