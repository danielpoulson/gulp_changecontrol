import React, { Component, PropTypes as t } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import {userPassIsValid} from './user-form.validation';

import { savePass } from '../../actions/actions_users';

class UserPass extends Component {

	static contextTypes = {
		router: t.object.isRequired
	};

	state = {
		passwords: {
			password: '',
			password2: ''
		},
		errors: []
	};

	onCancel = (e) => {
		e.preventDefault();
		this.context.router.push('/home');
	};

	onChange = (e) => {
		const passwords = this.state.passwords;
		const _name = e.target.name; 
		passwords[_name] = e.target.value; 

		this.setState({passwords: passwords});
	};

	onSave = (e) => {
		e.preventDefault();
		const passwords = this.state.passwords;

		if (passwords.password === passwords.password2) {
			let validation = userPassIsValid(passwords.password);
			this.setState({errors: validation.errors});

			if(!validation.formIsValid) {
				return;
			}	

			toastr.success('Yeah Baby... You password has been changed', 'User Account', { timeOut: 1000 });
			this.props.savePass(this.props.id, passwords.password);
			this.context.router.push('/home');
		} else {
			toastr.error('Nooooooo... These passwords did not match ... try again.', 'User Account', { timeOut: 2000 });
		}
	};

	render() {

		let wrapperClass = 'form-group';
		let alertClass = 'col-sm-9 col-md-offset-3';

		if (this.state.errors.length > 0) {
			wrapperClass += ' has-error';
			alertClass += ' alert alert-danger';
		}

		return (
			<div className="col-sm-12">
				<h2>Change password</h2>
				<form className="form form-horizontal" autocomplete="off">

					<ul className={alertClass}>{this.state.errors}</ul>

					<div className={wrapperClass}>
						<label htmlFor="password" className="col-sm-3 control-label">Password</label>
						<div className="col-sm-3">
							<input 
								type="password" 
								name="password"  
								className="form-control" 
								onChange={this.onChange} 
								value={this.state.password}/>
						</div>
					</div>

					<div className={wrapperClass}>
						<label htmlFor="password2" className="col-sm-3 control-label">Re-enter Password</label>
						<div className="col-sm-3">
							<input type="password" name="password2"  className="form-control" onChange={this.onChange} value={this.state.password}/>
						</div>
					</div>

					<div className="col-sm-9 col-md-offset-3">
						<button type="submit" className="btn btn-success pull-left" onClick={this.onSave}>Save</button>
						<button className="btn btn-info dp-margin-10-LR" onClick={this.onCancel}>Cancel</button>
					</div>
				</form>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		id: state.main.user.id
	};
}

export default connect(mapStateToProps,
{ savePass })(UserPass);
