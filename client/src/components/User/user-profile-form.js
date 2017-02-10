import React, { PropTypes } from 'react';
import TextInputTask from '../../components/Common/form-text-input';
import SelectInput from '../../components/Common/select-input';

const UserProfileForm = ({ errors, user, deleteUser, onChange, onCancel, onSave, roleSelect, newUser}) => {

  return (
    <div className="col-sm-12">
      <form className="form form-horizontal">

        <TextInputTask
        name="username"
        label="Username"
        value={user.username}
        onChange={onChange}
        placeholder="Enter Username (Required)"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-3"
        error={errors.username}
        />

        <TextInputTask
        name="fullname"
        label="Fullname"
        value={user.fullname}
        onChange={onChange}
        placeholder="Enter Users Fullname (Required)"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-3"
        error={errors.fullname}
        />

        <TextInputTask
        name="email"
        label="Email"
        value={user.email}
        onChange={onChange}
        placeholder="Enter Users email (Required)"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-3"
        error={errors.email}
        />

        <SelectInput
        name="role"
        label="Role"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-3"
        value={user.role}
        defaultOption="Select Role"
        options={roleSelect}
        onChange={onChange}
        error={errors.role}/>

        <TextInputTask
        name="password"
        label="Password"
        value={user.password}
        onChange={onChange}
        placeholder="***************"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-3"
        error={errors.password}
        />

        <div className="col-sm-9 col-md-offset-2">
          <button type="submit" className="btn btn-success pull-left" onClick={onSave}>
          Save
          </button>
          {/* //TODO: (3) LOW This button should be hidden when editing or return to the home screen */}
          <button className="btn btn-info dp-margin-10-LR" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger dp-margin-10-LR" disabled={newUser} onClick={deleteUser}>
            Delete
          </button>
        </div>
        </form>
    </div>
  );
};

UserProfileForm.propTypes = {
  errors: PropTypes.object,
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  deleteUser: PropTypes.func.isRequired,
  newUser: PropTypes.bool,
  roleSelect: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};

export default UserProfileForm;
