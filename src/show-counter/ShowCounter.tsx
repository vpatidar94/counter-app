import React, { Component } from 'react'; // let's also import Component
import './ShowCounter.css';

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
type ShowCounterState = {
  counter: number,
}

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export default class ShowCounter extends Component<{}, ShowCounterState> {

  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  private _init() {
    this.setState({
      counter: 0
    })
    fetch('https://interview-8e4c5-default-rtdb.firebaseio.com/front-end/counter1.json', {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          counter: data
        })
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Before the component mounts, we initialise our state
  componentWillMount() {
    this._init();
  }


  // render will know everything!
  render() {
    return (
      <div className="ShowCounter">
          <span>Counter Value : {this.state.counter}</span>
          {/* <div className="form-container">
            <div className="form">
              <label htmlFor="min">Min value</label>
              <input type="text" onChange={e => this.resetCounterMin(e)} placeholder="Min Value" value={this.state.min} />
              <label htmlFor="min">Max value</label>
              <input type="text" onChange={e => this.resetCounterMax(e)} placeholder="Max Value" value={this.state.max} />
            </div>
          </div> */}
          {/* <div className="btn-container">
            <div className="btn-counter">
              <div className="minus" onClick={this.minus.bind(this)}>-</div>
              <div className="input-count">
                <input type="text" onChange={e => this.setCounter(e)} value={this.state.counter} />
              </div>
              <div className="plus" onClick={this.plus.bind(this)}>+</div>
            </div>
          </div> */}
      </div>
    );
  }
}
