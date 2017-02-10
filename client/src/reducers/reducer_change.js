import { GET_CHANGE, EDIT_CHANGE, CREATE_LOG } from '../actions/actions_changes';

const initialState = {
  CC_No: "New",
  CC_Descpt: "Change Control",
  CC_Champ: "",
  CC_Stat: 1,
  CC_LOG: []
};

export default function (state = initialState, action) {

  switch (action.type) {
    case GET_CHANGE:
    case EDIT_CHANGE: {
      const _change = action.payload.data || initialState;

      return _change;

    }

    case CREATE_LOG: {
      const _addLog = state.CC_LOG;
      const randomID = Math.random() * (1000000 - 0) + 0;
      const logObj = {
        _id: randomID,
        CC_ActBy: action.payload.CC_ActBy,
        CC_ActDate: action.payload.CC_ActDate,
        CC_Action: action.payload.CC_Action
      };

      _addLog.push(logObj);
      return {
        ...state,
        CC_LOG: _addLog
      };
    }

    default:
      return state;
  }
}
