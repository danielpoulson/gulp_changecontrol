import React, { Component } from 'react';
import {Header} from '../Layout/header';

export default class App extends Component {
	state = {};

	render() {
		return (
			<div>
				<div className="app-hello-text">Daniel's Website Bitches</div>
				<div className="app-box">Hello Is it me your looking for?</div>
				<Header></Header>
			</div>
		);
	}
}
