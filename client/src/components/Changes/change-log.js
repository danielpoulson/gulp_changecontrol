import React, { PropTypes } from 'react';
import moment from 'moment';

const ChangeLog = (props) => {

  let logs = [];
  const _log = props.log.CC_LOG;
  const spanStyle = { color: 'blue' };
  const butGroup = { padding: 10 };
  const listStyleLi = {padding: 5};

  if (_log !== null && _log.length !== 0) {

      logs = _log.map((log) => <li style={listStyleLi} key={log._id}>
                        <span style={spanStyle} className="glyphicon glyphicon-edit"></span> Change Control : {log.CC_Action}
                        <small><em> ({moment(new Date(log.CC_ActDate)).format('DD/MM/YYYY')}) {log.CC_ActBy} </em></small></li>);

  }

  return (
    <div className={props.logTab}>
          <div className="row">
              <div style={butGroup} className="col-md-7 col-md-offset-5">
                  <button className="btn btn-info dp-margin-10-LR" onClick={props.onApprove}>Approval to Implement</button>
                  <button className="btn btn-success dp-margin-10-LR" onClick={props.onFinal}>Final and Complete</button>
                  <button className="btn btn-danger dp-margin-10-LR" onClick={props.onCancel}>Cancel / Withdrawn</button>
              </div>
          </div>
        <div className="panel panel-default panelStyle">
            <ul className="scrollable">{logs}</ul>
        </div>
      </div>

  );

};

ChangeLog.propTypes = {
  log: PropTypes.object,
  logTab: PropTypes.string,
  onApprove: PropTypes.func,
  onFinal: PropTypes.func,
  onCancel: PropTypes.func  
};

export default ChangeLog;
