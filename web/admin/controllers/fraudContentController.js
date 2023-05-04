import mongoose from "mongoose";
import FraudContent from "../models/fraudContentModel.js";
import errors from "../utils/errors.js";


//create spam
export const createSpam = async (req, res, next) => {
    try {
        console.log('req.body', req.body)
        const { content, status } = req.body;
        if (!content) {
            return res.status(400).json(errors.MANDATORY_FIELDS);
        }
        const SpamData = await FraudContent.create({
            content,
            status,
        });

        return res.status(201).json({
            success: true,
            SpamData: SpamData,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(errors.SERVER_ERROR);
    }
};

// get spam

export const getSpam = async (req, res) => {
    try {
        const spam = await FraudContent.find({}).sort({createdAt:-1});
        return res.status(200).json({
            success: true,
            spam: spam,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(errors.SERVER_ERROR);
    }
};

// update spam 
export const updateSpam = async (req, res, next) => {
    try {
        const { id, status, content } = req.body;
        console.log("req.body", req.body);
        const spam = await FraudContent.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            {
                $set: {
                    content, status
                },
            },
            {
                new: true,
            }
        );
        console.log("spam", spam);
        res.status(200).json({
            success: true,
            spam,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(errors.SERVER_ERROR);
    }
};

// delete spam 
export const deleteSpam = async (req, res, next) => {
    try {
        console.log("req.user.id", req.params)
        const spamId = mongoose.Types.ObjectId(req.params);
        const spam = await FraudContent.findByIdAndDelete({ _id: spamId });
console.log("spam",spam)
        res.status(201).json({
            success: true,
            message: "Delete successfully",
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(errors.SERVER_ERROR);
    }
};