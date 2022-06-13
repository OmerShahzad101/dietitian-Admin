const mongoose = require('mongoose');
const Contact = require('../../models/contact.model')
const { checkDuplicate } = require('../../../config/errors')


// API to get contacts list
exports.list = async (req, res, next) => {
    try {
        let { page, limit } = req.query

        const filters = {};

        if (req.query.name)
            filters.name = { $regex: new RegExp(req.query.name), $options: "si" };

        if (req.query.status) {
            filters.status = parseInt(req.query.status);
        }
        if (req.query.email)
            filters.email = { $regex: new RegExp(req.query.email), $options: "si" };

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const total = await Contact.countDocuments(filters)

        const contacts = await Contact.aggregate([
            { $match: filters },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $project: {
                    __v: 0, createdAt: 0, updatedAt: 0
                }
            }
        ])

        return res.send({
            success: true, message: 'Contacts fetched successfully',
            data: {
                contacts,
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

// API to edit contact status
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body;
        let newPayload = {
            status: payload.status
        }
        let updatedContact = await Contact.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: newPayload }, { new: true })
        return res.send({ success: true, message: 'Contact updated successfully', updatedContact })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Contact')
        else
            return next(error)
    }
}

exports.create = async (req, res, next) => {
    try {
        let payload = req.body;

        const contact = await Contact.create(payload)
        return res.send({ success: true,       message:    "Thanks for contacting us! We'll be in touch with you shortly.",
        contact })
    } catch (error) {
        return next(error)
    }
}

exports.getCount = async (req, res, next) => {
    try {
        const total = await Contact.countDocuments({});
        return res.send({ success: true, total })
    } catch (error) {
        return next(error)
    }
}

