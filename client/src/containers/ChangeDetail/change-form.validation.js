export function changeFormIsValid(change) {
  let formIsValid = true;
  let errors = []; //Clears any previous errors
  let errorsObj = {}; //Clears any previous errors

  if (!change.CC_Descpt) {
    errors.push('Change Title - is required');
    errorsObj.CC_Descpt = true;
    formIsValid = false;
  } else if (change.CC_Descpt.length < 20) {
    errors.push('Change Title - Must more than 20 characters');
    errorsObj.CC_Descpt = true;
    formIsValid = false;
  }

  if (!change.CC_Code) {
    errors.push('Code / Item - This field is required');
    errorsObj.CC_Code = true;
    formIsValid = false;
  } else if (change.CC_Code.length < 3) {
    errors.push('Code / Item - Must be atleast 3 characters');
    errorsObj.CC_Code = true;
    formIsValid = false;
  }

  if (!change.CC_Champ) {
    errors.push('Champion - Please select a change champion');
    errorsObj.CC_Champ = true;
    formIsValid = false;
  }

  if (!change.CC_Comp) {
    errors.push('Company - This field is required');
    errorsObj.CC_Comp = true;
    formIsValid = false;
  } else if (change.CC_Comp.length < 3) {
    errors.push('Company - Must be atleast 3 characters');
    errorsObj.CC_Comp = true;
    formIsValid = false;
  }

  if (!change.CC_TDate) {
    errors.push('Target Date - A Target Date must be set');
    errorsObj.CC_TDate = true;
    formIsValid = false;
  } else if (change.CC_TDate === null) {
    errors.push('Target Date - A Target Date must be set');
    errorsObj.CC_TDate = true;
    formIsValid = false;
  }

  if (!change.CC_Pry) {
    errors.push('Priority - This field is required, please select A, B or C');
    errorsObj.CC_Pry = true;
    formIsValid = false;
  }

  return { formIsValid, errors, errorsObj };
}
