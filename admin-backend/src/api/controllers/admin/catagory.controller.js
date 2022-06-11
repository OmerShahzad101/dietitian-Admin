const mongoose = require('mongoose');
const { checkDuplicate } = require('../../../config/errors')
const CMS = require('../../models/cms.model')

// API to create cms 
exports.create = async (req, res, next) => {
    try {
        let payload = req.body;
        console.log('bodyyyyy',req.body);
        const cms = new CMS(payload)
        await cms.save()

        return res.send({ success: true, message: 'CMS created successfully', cms })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'CMS')
        else
            return next(error)
    }
}

// API to edit cms
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body;

        payload.slug = payload.name.toString().toLowerCase()
              .replace(/\s+/g, '-')           // Replace spaces with -
              .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
              .replace(/\-\-+/g, '-')         // Replace multiple - with single -
              .replace(/^-+/, '')             // Trim - from start of text
              .replace(/-+$/, '');            // Trim - from end of text
        
        const cms = await CMS.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: payload }, { new: true })
        return res.send({ success: true, message: 'CMS updated successfully', cms })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'CMS')
        else
            return next(error)
    }
}

// API to delete cms
exports.delete = async (req, res, next) => {
    try {
        const { cmsId } = req.params
        if (cmsId) {
            const cms = await CMS.deleteOne({ _id: cmsId })
            if (cms.deletedCount)
                return res.send({ success: true, message: 'CMS deleted successfully', cmsId })
            else return res.status(400).send({ success: false, message: 'CMS not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'CMS Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get an cms
exports.get = async (req, res, next) => {
    try {
        const { cmsId } = req.params
        if (cmsId) {
            const cms = await CMS.findOne({ _id: mongoose.Types.ObjectId(cmsId) }, { __v: 0, createdAt: 0, updatedAt: 0 }).lean(true)

            if (cms)
                return res.json({ success: true, message: 'CMS retrieved successfully', cms })
            else return res.status(400).send({ success: false, message: 'CMS not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'CMS Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get cms list
exports.list = async (req, res, next) => {
    try {
        let { page, limit } = req.query;

        const filters = {};
        if (req.query.name)
            filters.name = { $regex: new RegExp(req.query.name), $options: "si" };
        if (req.query.statusValue == '1') 
            filters.status = true;
        if (req.query.statusValue == '0') 
            filters.status = false;    

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        // const total = await CMS.countDocuments({})

        const totalCms = await CMS.aggregate([
            {
                $project: {
                    _id: 1, name: 1, content:1, createdAt: 1, status: 1, slug:1
                }
            },
            { $match: filters },
            { $count: 'total' }
        ])

        const cmsList = await CMS.aggregate([
            
            {$match : filters},
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            {
                $project: {
                    _id: 1, name: 1, content:1, createdAt: 1, status: 1, slug:1
                }
            },
            { $limit: limit },
        ])

        let total = totalCms[0] ? totalCms[0].total : '';

        return res.send({
            success: true, message: `CMS's fetched successfully`,
            data: {
                cmsList,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })
    } catch (error) {
        return next(error)
    }
}