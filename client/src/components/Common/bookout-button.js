import React from 'react';
import toastr from 'toastr';

export default class BookoutButton extends React.Component {
  constructor(props) {
    super(props);

    this.onBookout = this.onBookout.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  onBookout() {
      // TODO (3) MED If download does not complete donot delete from server.
    if (window.ActiveXObject || 'ActiveXObject' in window) {
      // Always true if browser is Internet Explorer
      toastr.error('This function does not work with internet explorer. Please contact your administrator', 'Error - Internet Explorer', { timeOut: 5000 });
    } else {

      // const _log = { CC_No: this.props.source, CC_Id: 4, CC_Action: `File booked out - ${this.props.fileLoad}`,
      //           CC_ActBy: this.props.user.fullname, CC_ActDate: new Date() };

      window.location.href = `/server/upload/${this.props.fileLoad}`;

      //this.props.createLog(_log);
      this.props.bookoutFile(this.props.fileId, this.props.user.fullname);

    }
  }

  deleteFile() {
    const _log = { CC_No: this.props.source, CC_Id: 4, CC_Action: `**** File Deleted **** - ${this.props.fileLoad}`,
            CC_ActDept: this.props.user.dept, CC_ActBy: this.props.user.fullname, CC_ActDate: new Date() };
    this.props.createLog(_log);
    this.props.deleteFile(this.props.fileId);
  }

  render() {

    let text = null;
    let action = {};
    let classButton = '';
    let classSpan = '';

    if (this.props.fsBooked > 0) {
      if (this.props.user.role === 'admin') {

        text = 'Delete';
        action = this.deleteFile;
        classButton = 'btn btn-danger btn-xs';
        classSpan = 'glyphicon glyphicon-trash';

      } else {

        text = 'Booked Out';
        classButton = 'btn btn-danger btn-xs';
        classSpan = 'glyphicon glyphicon-trash disabled';

      }

    } else {
      text = 'Book out';
      action = this.onBookout;
      classButton = 'btn btn-warning btn-xs';
      classSpan = 'glyphicon glyphicon-book';
    }
    return <button onClick={action} className={classButton}><span className={classSpan}></span> {text} </button>;
  }

}

BookoutButton.propTypes = {
  fsBooked: React.PropTypes.number,
  user: React.PropTypes.object,
  source: React.PropTypes.string,
  fileId: React.PropTypes.string,
  bookoutFile: React.PropTypes.func,
  fileLoad: React.PropTypes.string,
  createLog: React.PropTypes.func,
  deleteFile: React.PropTypes.func
};
