import React, { PropTypes } from 'react';
import SelectInput from '../../components/Common/select-input';

const UserSelect = (props) => {

  return (
    <div className="cc-user-select-fnStyle">
      <SelectInput
        name="user"
        label="Fullname"
        labelstyle="col-sm-2 control-label cc-user-select-labStyle"
        inputdiv="col-sm-4"
        value={props.user}
        defaultOption="Select User"
        options={props.users}
        onChange={props.onChange}/>

      <button className="btn btn-info dp-margin-10-LR" onClick={props.newUser}>
        New User
      </button>

    </div>
  );
};

UserSelect.propTypes = {
  users: PropTypes.array,
  onChange: PropTypes.func,
  newUser: PropTypes.func.isRequired
};

export default UserSelect;
