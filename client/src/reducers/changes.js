import { GET_CHANGES, ADD_CHANGE, EDIT_CHANGE, LOAD_PAGE_CHANGES } from '../actions/actions_changes';
import { pagedList, removeByIndex, searchData } from '../utils/data-functions';

const initialState = {
  alldata: [],
  paged: [],
  columns: ['CC_No', 'CC_Descpt', 'CC_Champ']
};

export default function (state, action) {
  let alldata = [];
  let _data = {};
  let per_page = 10;
  let page = 1;
  let offset = 0;
  let paged = [];
  let searchText = '';
  let currIds = [];
  let index = [];


  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {

    case ADD_CHANGE:
      _data = action.payload.data;
      alldata = [
        ...state.alldata,
        _data
      ];
      paged = pagedList(alldata);
      return {
        ...state,
        alldata,
        paged
      };

    case EDIT_CHANGE:
      _data = action.payload;
      currIds = state.alldata.map(c => c._id);
      index = currIds.indexOf(_data._id);
      alldata = [
        ...state.alldata.slice(0, index),
        // Copy the object before mutating
        Object.assign({}, _data),
        ...state.alldata.slice(index + 1)
      ];
      paged = pagedList(alldata);
      return {
        paged,
        alldata
      };

      case 'DELETE_CHANGE': {
        const _id = action.payload;
        alldata = removeByIndex(state.alldata, _id);
        paged = pagedList(alldata);

        return {
          ...state,
          alldata,
          paged
        };
      }

    case GET_CHANGES:
      alldata = action.payload.data;
      paged = pagedList(alldata);

      return {
        searchText: null,
        page,
        per_page,
        total: alldata.length,
        total_pages: Math.ceil(alldata.length / per_page),
        paged,
        alldata
      };

    case LOAD_PAGE_CHANGES: {
      const column = action.data.column || state.sorted;
      per_page = action.data.numPage || 15;
      page = action.data.page_num || 1;
      offset = (page - 1) * per_page;
      searchText = action.data.search;
      const searcheddata = searchData(state.alldata, searchText, column, initialState.columns);
      paged = pagedList(searcheddata, page);

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
