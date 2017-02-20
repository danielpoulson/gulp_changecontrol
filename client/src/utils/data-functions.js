import _ from 'lodash';
const per_page = 15;
const init_page = 1;

export function pagedList(data, page) {
  const _page = page || init_page;
  const offset = (_page - 1) * per_page;
  return data.slice(offset, offset + per_page);
}

export function searchData(data, searchText, sortColumn, columns) {
    const reg1 = new RegExp(`${searchText}.*`, 'i');

  function search(item) {

    if (item[columns[0]].match(reg1) || item[columns[1]].match(reg1) || item[columns[2]].match(reg1)) {
      return true;
    }
    return false;
  }

  if (searchText === null) {
    return _.sortBy(data, sortColumn);
  }

  let _sortColumn = '';
  _sortColumn = sortColumn || columns[0];
  const newList = _.chain(data).filter(search).sortBy(_sortColumn).value();
  return newList;
}

function removeByIndex(data, index) {
  return data.filter((item) => item._id !== index);
}