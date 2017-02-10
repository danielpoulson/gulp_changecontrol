// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
/* global styles for app */

import { getAllTasks } from '../../actions/actions_tasks';
import { setUser } from '../../actions/actions_main';
import { getUsers } from '../../actions/actions_users';


/* application components */
import Header from '../../layouts/Header';
import { Footer } from '../../layouts/Footer';

export class App extends Component {

  componentWillMount() {
    const authorised:any = sessionStorage.getItem('authorised');    
    this.props.getAllTasks();
    this.props.getUsers();
    if (authorised === 'true') {
      this.props.setUser();
    }
  }

  render() {
    return (
      <div className="container">
        <div className="">
          <Header />
        </div>
        <div className="">
            {this.props.children}
        </div>
        <div className="">
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.any,
  getAllTasks: React.PropTypes.func,
  getUsers: React.PropTypes.func,
  setUser: React.PropTypes.func
};

export default connect(null, { getAllTasks, setUser, getUsers })(App);
