import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class RechartLineChart extends Component {
    render() {
        return (
            <LineChart width={600} height={300} data={this.props.lineData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="date"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="5 5"/>
                <Tooltip/>
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#F14354" strokeWidth={4} activeDot={{r: 8}}/>
            </LineChart>
        );
    }
}

export default connect( state => ({ lineData: state.main.lineData }))(RechartLineChart);