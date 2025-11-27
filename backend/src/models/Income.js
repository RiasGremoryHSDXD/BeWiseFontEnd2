import mongoose from "mongoose";
import ToTitleCase from "../helper/toTitleCase.js";


const IncomeSchema = new mongoose.Schema
({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    incomeName: {
        type: String,
        required: true,
        trim: true,
        set: ToTitleCase
    },

    incomeCategory: {
        type: String,
        required: true,
        trim: true,
        enum: ["Work", "Investment", "Savings", "Side Hustle", "Other"],
    },

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    expectedPayOut: {
        type: Date,
        required: true,
    },

    frequency:{
        type: String,
        required: true,
        enum: ['OneTime', 'Monthly'],
    },
},
    {
        timestamps: true
    }
)

const Income = mongoose.model('Income', IncomeSchema)

export default Income;