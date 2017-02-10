"use strict";
/*eslint no-console: 0*/
const Task = require('mongoose').model('Task');
const Change = require('mongoose').model('Change');
const fs = require('fs');
const files = require('../controllers/files');
const Users = require('../controllers/users');
const json2csv = require('json2csv');
const mailer = require('../config/mailer.js');
const moment = require('moment');
const utils = require('../config/utils');


exports.getTasks = function(req, res) {
    const status = req.params.status;

    Task
        .where('TKStat').lte(status)
        .where('SourceId').in([/^CC.*$/])
        .select({SourceId:1, TKName:1, TKTarg:1, TKStart:1, TKChamp:1, TKStat:1})
        .sort({TKTarg : 1})
        .exec(function(err, collection) {
        res.send(collection);
    });
};

exports.getProjectTaskList = function(req, res) {
    Task.find({SourceId:req.params.id}, function(err, collection) {
        res.send(collection);
    });
};

exports.updateTask = function(req, res) {
    const query = {_id: req.params.id};
    const newOwner = req.body.TKChampNew;
    req.body.TKChampNew = false;

    Task.findOneAndUpdate(query, req.body, function (err) {
        if (err) return handleError(err);
        res.send(200);

        if(newOwner){
          createEmail(req.body);
        }
    });
};


exports.deleteTask = function(req, res) {
    const taskId = req.params.id;
    let taskTitle = '';
    let SourceId = '';
    const user = req.user.fullname;

    Task.findOne({_id:taskId}).exec(function(err, task) {
        taskTitle = task.TKName;
        SourceId = task.SourceId;

        Task.remove({_id:taskId}, function (err) {
            if (err) return handleError(err);
            res.status(200).send(taskId);
        });

        write_to_log("DELETED TASK - " + "(" + SourceId + " - " + taskTitle + ") by " + user);
    });



};

exports.createTask = function(req, res, next) {
    Task.create(req.body, function(err, task) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Task');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }
        res.status(200).send(task);
        createEmail(req.body);
    });
};


function createEmail(body){
  const _targetDate = moment(body.TKTarg).format('DD/MM/YYYY');
  const emailType = "Change Control - Task";
  const emailActivity = '<b>Associated Change Control - </b><em>' + body.SourceId + '</em></br><b>Task to Complete: </b><i>'
   + body.TKName + '<b>  Date Due </b>' + _targetDate + '</i>';

  const p = Users.getUserEmail(body.TKChamp).exec();

  p.then(function(res){
    const _toEmail = res[0].email;
    mailer.sendMail(_toEmail, emailType, emailActivity);
  }).catch(function (err) {
    console.log(err);
  });

}

exports.getTaskById = function(req, res) {
    Task.findById(req.params.id).exec(function(err, task) {
        res.send(task);
    });
};

exports.getTaskCount = function(req,res){
    Task.count({SourceId:req.params.id}, function(err, taskCount){
        res.send(taskCount.toString());
    });
};

exports.getTasksCountByUser = function(user){
  return Task.count({$and: [{TKChamp:user}, {TKStat: {$lt:5}}]});
};

exports.getCountAll = function(){
  return Task.count({TKStat: {$lt:5}});
};

exports.dumpTasks = function(req, res) {
    const fileData = {};
    const newDate = new Date();
    const int = parseInt((Math.random()*1000000000),10);

    fileData.fsAddedAt = newDate;
    fileData.fsAddedBy = req.body.fsAddedBy;
    fileData.fsFileName = 'tasks' + int;
    fileData.fsFileExt = 'csv';
    fileData.fsSource = req.body.fsSource;
    fileData.fsFilePath = 'tasks' + int + '.csv';
    fileData.fsBooked = 0;

    files.addExportFile(fileData);

    const _search = !req.body.search ? "." : req.body.search;
    const regExSearch = new RegExp(_search + ".*", "i");
    const _status = 4;

    getChangesList(int);
    res.sendStatus(200);
};


function getChangesList(int) {
    const status = 4;
    const file = utils.uploaded + 'tasks' + int + '.csv';
    const fields = ['SourceId', '_name', 'TKName', 'TKTarg', 'TKStart', 'TKChamp', 'TKStat'];

    Change.find({CC_Stat: {$lt:status}})
        .select({ CC_No: 1, CC_Descpt: 1, _id:0 })
        .sort({CC_TDate:1})
        .exec(function(err, collection) {

            Task
                .where('TKStat').lte(4)
                .select({SourceId:1, TKName:1, TKTarg:1, TKStart:1, TKChamp:1, TKStat:1})
                .sort({TKTarg : 1})
                .exec(function(err, coll) {

                    const reformattedArray = coll.map(function(obj){

                        const TKName = obj.TKName;
                        const TKTarg = moment(obj.TKTarg).format("L");
                        const TKStart = moment(obj.TKStart).format("L");
                        const TKChamp = obj.TKChamp;
                        let TKStat = null;
                        const SourceId = obj.SourceId;

                        switch (obj.TKStat) {
                            case 1 :
                                TKStat = "Not Started (New)";
                                break;
                            case 2 :
                                TKStat = 'On Track';
                                break;
                            case 3 :
                                TKStat = 'In Concern';
                                break;
                            case 4 :
                                TKStat = 'Behind Schedule';
                                break;
                            case 5 :
                                TKStat = 'Completed';
                                break;
                            default :
                                TKStat = "Not Set";
                                break;
                        }

                        const _tasks = collection.find(change => change.CC_No === obj.SourceId);

                        if (typeof _tasks === 'object') {
                            const _name = _tasks.CC_Descpt;
                            return {TKName, _name, TKTarg, TKStart, TKChamp, TKStat, SourceId};
                        }


                    });

                    json2csv({ data: reformattedArray, fields: fields }, function(err, csv) {
                      if (err) console.log(err);
                      fs.writeFile(file, csv, function(err) {
                        if (err) throw err;
                        console.log('file saved');
                      });
                    });

            });
    });
}

function write_to_log (write_data) {
    const fs = require("fs");
    const path = '.././logs/logs.txt';
    const date = new Date();
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const dString = day + "/" + month + "/" + year;

    write_data = "\r\n" + dString + " - " + write_data;

    fs.appendFile(path, write_data, function(error) {
         if (error) {
           console.error("write error:  " + error.message);
         } else {
           console.log("Successful Write to " + path);
         }
    });
}

function handleError(err){
    console.log(err);
}
