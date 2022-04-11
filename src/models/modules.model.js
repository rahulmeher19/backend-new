const mongoose = require('mongoose');

const modulesSchema = new mongoose.Schema(
    [
        {
            name: {
                type: String,
            }
        }
    ]
)

const Modules = mongoose.model('Modules', modulesSchema);

async function addModulesRelationCollection() {
    ["Users", "Roles"].forEach((_module) => {
        const newModules = new Modules({
            name: _module
        })
        newModules.save()
    })

}
// addModulesRelationCollection()
module.exports = Modules;