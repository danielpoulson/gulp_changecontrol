"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv'); //https://www.npmjs.com/package/mongoose-to-csv

const changeSchema = new Schema({
    Id: Number,
    CC_No: {type: String, required: '{PATH} is required!'},
    CC_Descpt: {type: String, required: '{PATH} is required!'},
    CC_Code: {type: String},
    CC_Multi: {type: String}, // Multiply products affected
    CC_ASS: {type: String}, // Associated deviation or change
    CC_Champ: {type: String, required: '{PATH} is required!'},
    CC_Comp: {type: String, required: '{PATH} is required!'},
    CC_Pry: {type: String, required: '{PATH} is required!'},
    CC_TDate: {type: Date, required: '{PATH} is required!'},
    CC_CDate: { type: Date },
    created: { type: Date, default: Date.now },
    CC_Stat: {type: Number, required: '{PATH} is required!'},
    CC_Curt: {type: String},
    CC_Prop: {type: String},
    CC_Rat: {type: String},
    CC_LOG: [{
        CC_Id : String,
        CC_ActBy : String,
        CC_ActDate: Date,
        CC_Action: String,
        CC_ActDept: String
    }],
    Linking   : [{type: Schema.Types.ObjectId, ref: 'Task' }]
});

changeSchema.plugin(mongooseToCsv, {
    headers: 'CCNo Description Owner TargetDate ClosedDate Company Status',
    constraints: {
        'CCNo': 'CC_No',
        'Description': 'CC_Descpt',
        'Owner': 'CC_Champ',
        'Company': 'CC_Comp',
        'Status': 'CC_Stat'
    },
    virtuals: {
        'TargetDate': function (doc) {
            const dateString = new Date(doc.CC_TDate);
            const day = dateString.getDay().toString();
            const mth = dateString.getMonth();
            const yr = dateString.getYear();
            let _date = (typeof doc.CC_TDate != 'undefined') ? ('0'+ day ).slice(-2) + '/' + ('0'+ mth ).slice(-2)  + '/' + ('0'+ yr ).slice(-2) : '';

            return _date;
        },

        'ClosedDate': function (doc) {
            const dateString = new Date(doc.CC_CDate);
            const day = dateString.getDay().toString();
            const mth = dateString.getMonth();
            const yr = dateString.getYear();
            let _date = (typeof doc.CC_CDate != 'undefined') ? ('0'+ day ).slice(-2) + '/' + ('0'+ mth ).slice(-2)  + '/' + ('0'+ yr ).slice(-2) : '';

            return _date;
        }
    }

});


const Change = mongoose.model('Change', changeSchema);
