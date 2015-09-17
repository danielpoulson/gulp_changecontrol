var React = require('react');
var reqwest = require('reqwest');

var APP = 
	React.createClass({
		getInitialState:function(){
			return {data:[ 5, 10, 15, 20, 25, 46, 36, 24, 36 ]}
		},
		componentWillMount:function(){
//			reqwest({
//				url: 'http://filltext.com/?rows=5&val={randomNumber}',
//				type: 'jsonp',
//				success:function(resp){
//					this.setState({data:resp})
//					this.renderChart(this.state.data)	
//				}.bind(this)
//			})
		},
		renderChart:function(dataset){
            console.log(d3);
			d3.select('#chart').selectAll('div')
		    .data(dataset)
		    .enter()
		    .append('div')
		    .attr('class', 'bar')
		    .style('height', function (d) {
		      return d.val * 5 + 'px';
		    });
		},
		render:function(){
            var dataset = this.state.data;
			return (
                <div>
                    <h1>Hello</h1>
                    <button onClick={this.renderChart(dataset)}>Render</button>
                    <div id="chart"></div>
                </div>
            )
		}
	});
React.render(
	<APP />,
	document.getElementById('app'))