import React, { PropTypes } from 'react';
import FormInput from '../../components/Common/form-text-input';
import TextArea from '../../components/Common/text-area';
import DateTimePicker from '../../components/Common/date-picker';
import SelectInput from '../../components/Common/select-input';
import Moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
momentLocalizer(Moment);

const ChangeForm = ({
  errors, change, status, users, onDateChange, onChange }) => {

  return(
    <form className="form form-horizontal" >
      <FormInput
        name="CC_Descpt"
        label="Change Title"
        value={change.CC_Descpt}
        onChange={onChange}
        placeholder="Enter the title of your change request (Required)"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-9"
        error={errors.CC_Descpt}/>

      <FormInput
        name="CC_Code"
        label="Code / Item"
        value={change.CC_Code}
        onChange={onChange}
        placeholder="Enter an item code (Required)"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-4"
        error={errors.CC_Code}/>

      <FormInput
        name="CC_Multi"
        label="Multiple Products?"
        value={change.CC_Multi}
        onChange={onChange}
        placeholder="Does this CC affect multiply products?"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-4"
        error={errors.CC_Multi}/>

      <FormInput
        name="CC_ASS"
        label="Associated"
        value={change.CC_ASS}
        onChange={onChange}
        placeholder="Associated CC or Dev?"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-4"
        error={errors.CC_ASS}/>

      <SelectInput
        name="CC_Champ"
        label="Champion"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-3"
        value={change.CC_Champ}
        defaultOption="Select Champion"
        options={users}
        onChange={onChange}
        error={errors.CC_Champ}/>

      <FormInput
        name="CC_Comp"
        label="Company"
        value={change.CC_Comp}
        onChange={onChange}
        placeholder="Company impacted (Required)"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-4"
        error={errors.CC_Comp}/>

      <DateTimePicker
        name="CC_TDate"
        label="Target Date"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-2"
        value={change.CC_TDate}
        onChange={onDateChange.bind(null, "CC_TDate")}
        error={errors.CC_TDate}/>

      <DateTimePicker
        name="CC_CDate"
        label="Complete Date"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-2"
        value={change.CC_CDate}
        onChange={onDateChange.bind(null, "CC_CDate")}
        error={errors.CC_CDate}/>

      <FormInput
        name="CC_Pry"
        label="Priority"
        value={change.CC_Pry}
        onChange={onChange}
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-1"
        error={errors.CC_Pry}/>

      <SelectInput
        name="CC_Stat"
        label="status"
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-3"
        value={change.CC_Stat}
        defaultOption="Select status"
        options={status}
        onChange={onChange}
        error={errors.CC_Stat}/>

      <TextArea
        name="CC_Curt"
        label="Current Situation"
        value={change.CC_Curt || ''}
        rows="5"
        onChange={onChange}
        error={errors.CC_Curt}
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-10" />

      <TextArea
        name="CC_Prop"
        label="Proposed Situation"
        value={change.CC_Prop || ''}
        rows="5"
        onChange={onChange}
        error={errors.CC_Prop}
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-10" />

      <TextArea
        name="CC_Rat"
        label="Justification and Rational"
        value={change.CC_Rat || ''}
        rows="5"
        onChange={onChange}
        error={errors.CC_Rat}
        labelstyle="col-sm-2 control-label"
        inputdiv="col-sm-10" />
    </form>
  );
};

ChangeForm.propTypes = {
    change: React.PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    status: PropTypes.array.isRequired,
    errors: PropTypes.object.isRequired
};

export default ChangeForm;
