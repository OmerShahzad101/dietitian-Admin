const mongoose = require('mongoose');
const Settings = require('../../models/settings.model')

exports.edit = async (req, res, next) => {
    try {
        let payload = req.body;
        const findDocument = await Settings.find();
        console.log(`find document--->`, findDocument)
        if(findDocument.length>0){
            const updatedSettings = await Settings.updateOne({ $set: payload })
            return res.send({ success: true, message: 'settings updated successfully', updatedSettings })
        } else {
            let payload = req.body;
            const settings = new Settings(payload)
            await settings.save()
            return res.send({ success: true, message: 'settings created successfully', settings })
        }
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Settings')
        else
            return next(error)
    }
}
exports.get = async (req, res, next) => {
    try{
        const findDocument = await Settings.find();
        if(findDocument){
            return res.send({success: true, message: 'settings retrieved successfully', settingsDocument:findDocument})
        } else{
            return res.send({success: true, message: 'no settings found'})
        }
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Settings')
        else
          return next(error)
    }

}
