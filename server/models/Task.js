const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv'); //https://www.npmjs.com/package/mongoose-to-csv
const dateFunc = require('../config/date-function');

const taskSchema = new Schema({
    ID: Number,
    TKName: {type: String, required: '{PATH} is required!'},
    TKStart: {type: Date, required: '{PATH} is required!'},
    TKTarg: {type: Date, required: '{PATH} is required!'},
    TKChamp: {type: String, required: '{PATH} is required!'},
    TKStat: {type: Number, required: '{PATH} is required!'},
    SourceId: {type: String, required: '{PATH} is required!'},
    TKComment: String,
    TKChampNew: {type: Boolean, default: false}
});

taskSchema.plugin(mongooseToCsv, {
    headers: 'Source Task Owner StartDate TargetDate Status',
    constraints: {
        'Source': 'SourceId',
        'Owner': 'TKChamp',
        'Status': 'TKStat'
    },
    virtuals: {
        'Task': function (doc) {
            const descpt = doc.TKName.replace(/,/g, "");
            return descpt;
        },
        'TargetDate': function (doc) {
            const _date = (typeof doc.TKTarg != 'undefined') ? dateFunc.dpFormatDate(doc.TKTarg) : '';
            return _date;
        },

        'ClosedDate': function (doc) {
            const _date = (typeof doc.TKStart != 'undefined') ? dateFunc.dpFormatDate(doc.TKStart) : '';
            return _date;
        }
    }

});

const Task = mongoose.model('Task', taskSchema);
