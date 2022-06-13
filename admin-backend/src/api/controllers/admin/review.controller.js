const mongoose = require('mongoose');
const User = require('../../models/users.model')
const Review = require('../../models/review.model')

// API to get review review
exports.list = async (req, res, next) => {
    try {
        let { page, limit, reviewBy, reviewTo, statusValue, score } = req.query;
        const filters = {};
        if (reviewBy) {
            filters['reviewByData.username'] = { $regex: reviewBy, $options: "gi" }
        }
        if (reviewTo) {
            filters['reviewToData.username'] = { $regex: reviewTo, $options: "gi" }
        }
        if (req.query.statusValue == '1') 
            filters.status = true;
        if (req.query.statusValue == '0') 
            filters.status = false;
        if (score)
            filters.score = +score;

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        // const total = await Review.countDocuments({});

        const totalReviews = await Review.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "reviewBy",
                    foreignField: "_id",
                    as: "reviewByData"
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewTo",
                    foreignField: "_id",
                    as: "reviewToData"
                },
            },
            {
                $project: {
                    "reviewByData": 1, "reviewToData": 1, score: 1, status: 1, comment: 1, createdAt: 1
                }
            },
            { $unwind: "$reviewByData" },
            { $unwind: "$reviewToData" },
            { $match: filters },
            { $count: 'total'}
        ])
        const reviews = await Review.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewBy",
                    foreignField: "_id",
                    as: "reviewByData"
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewTo",
                    foreignField: "_id",
                    as: "reviewToData"
                },
            },
            {
                $project: {
                    "reviewByData": 1, "reviewToData": 1, score: 1, status: 1, comment: 1, createdAt: 1
                }
            },
            { $unwind: "$reviewByData" },
            { $unwind: "$reviewToData" },
            { $match: filters },
            { $limit: limit },
        ])
        let total = totalReviews[0] ? totalReviews[0].total: '';
        return res.send({
            success: true, message: 'Reviews fetched successfully',
            data: {
                reviews,
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

// API to edit review
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body

        const review = await Review.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: payload }, { new: true })
        return res.send({ success: true, message: 'Review updated successfully', review })

    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Review')
        else
            return next(error)
    }
}

// API to delete review
exports.delete = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        if (reviewId) {
            const review = await Review.deleteOne({ _id: reviewId })
            if (review.deletedCount)
                return res.send({ success: true, message: 'Review deleted successfully', reviewId })
            else return res.status(400).send({ success: false, message: 'Review not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Review Id is required' })
    } catch (error) {
        return next(error)
    }
}

