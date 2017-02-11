import mongoose from'mongoose';
import userModel from'../models/User';
import changeModel from'../models/Change';
import projectModel from'../models/Project';
import taskModel from'../models/Task';
import filesModel from'../models/File';

/*eslint no-console: 0*/
export default function(config) {
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('Technical Services db opened');
  });
}
