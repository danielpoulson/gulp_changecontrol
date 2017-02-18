import { ADD_TASK, EDIT_TASK, DELETE_TASK, GET_TASKS, LOAD_PAGE_TASKS, GET_PROJECT_TASKS } from '../actions/actions_tasks';
import _ from 'lodash';

const initialState = {
  alldata: [],
  paged: [],
  ctTotal: 0,
  //List of the current tasks for selected change
  ctlist: [],
  per_page: 15,
  page: 1
};

function pagedList(data) {
  const offset = (initialState.page - 1) * initialState.per_page;
  return data.slice(offset, offset + initialState.per_page);
}

function searchIndex(data, index) {
  return data.filter((item) => item._id !== index);
}

function searchData(data, searchText, sortColumn) {
  function search(item) {
    const reg1 = new RegExp(`${searchText}.*`, 'i');

    if (item.SourceId.match(reg1) || item.TKChamp.match(reg1) || item.TKName.match(reg1)) {
      return true;
    }
    return false;
  }

  if (searchText === null) {
    return _.sortBy(data, sortColumn);
  }

  let _sortColumn = '';
  _sortColumn = sortColumn || 'TKTarg';
  const newList = _.chain(data).filter(search).sortBy(_sortColumn).value();
  return newList;
}

export default function (state = initialState, action) {
  let alldata = [];
  let _data = {};
  let per_page = 15;
  let page = 1;
  let offset = 0;
  let paged = [];
  let searchText = '';
  let ctTotal = 0;
  let ctlist = [];

  switch (action.type) {
    case ADD_TASK:
      _data = action.payload.data;
      alldata = [
        ...state.alldata,
        _data
      ];
      ctlist = [
        ...state.ctlist,
        _data
      ];
      ctTotal = ctlist.length;

      return {
        ...state,
        alldata,
        ctlist,
        ctTotal
      };

    case EDIT_TASK: {
      _data = action.payload;

      const index = state.alldata.findIndex(item => item._id === _data._id);
      const ctIndex = state.ctlist.findIndex(item => item._id === _data._id);

      if (index === -1) {
        alldata = [
          ...state.alldata,
          _data
        ];
      } else {
        alldata = [
          ...state.alldata.slice(0, index),
          // Copy the object before mutating
          Object.assign({}, _data),
          ...state.alldata.slice(index + 1)
        ];
      }



      ctlist = [
        ...state.ctlist.slice(0, ctIndex),
        // Copy the object before mutating
        Object.assign({}, _data),
        ...state.ctlist.slice(ctIndex + 1)
      ];

      paged = pagedList(alldata);

      return {
        ...state,
        alldata,
        ctlist,
        paged
      };
    }

    case DELETE_TASK: {
      const _id = action.payload;
      alldata = searchIndex(state.alldata, _id);
      ctlist = searchIndex(state.ctlist, _id);
      ctTotal = ctlist.length;
      return {
        ...state,
        alldata,
        ctlist,
        ctTotal
      };
    }

    case GET_PROJECT_TASKS:
      ctlist = action.payload.data;
      ctTotal = ctlist.length;

      return {
        ...state,
        ctlist,
        ctTotal
      };

    case GET_TASKS:
    //Loads on start up and get all the active tasks.
    //Loads one page of active task from alldata
    // this.props.loadPage(page_num, this.state.numPage, search);
      alldata = action.payload.data;
      paged = pagedList(alldata);

      return {
        ...state,
        page,
        per_page,
        total: alldata.length,
        total_pages: Math.ceil(alldata.length / per_page),
        paged,
        alldata
      };

    case LOAD_PAGE_TASKS: {
      const column = action.data.column || state.sorted;
      per_page = action.data.numPage || 15;
      page = action.data.page_num || 1;
      offset = (page - 1) * per_page;
      searchText = action.data.search;
      const searcheddata = searchData(state.alldata, searchText, column);
      paged = searcheddata.slice(offset, offset + per_page);

      return {
        ...state,
        sorted: column,
        searchText,
        page,
        per_page,
        total: searcheddata.length,
        total_pages: Math.ceil(alldata.length / per_page),
        paged
      };
    }
    default:
      return state;
  }
}
