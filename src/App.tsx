import React, { Component } from 'react'; // let's also import Component
import './App.css';
import ShowCounter from './show-counter/ShowCounter'

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
type AppState = {
  counter: number,
  min: number | string,
  max: number | string,
  showLoader: boolean
}

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export default class App extends Component<{}, AppState> {
  time: number = 0;
  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  private _init() {
    this.setState({
      counter: 1,
      min: 1,
      max: 1000
    });
  }

  // Before the component mounts, we initialise our state
  componentWillMount() {
    this._init();
  }

  resetCounterMin(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!this.validStr(e.target.value) || Number(e.target.value) >= this.state.max) {
      return;
    }
    this.setState({
      min: Number(e.target.value),
    })
    this.saveCounter(Number(e.target.value));
  }

  resetCounterMax(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!this.validStr(e.target.value) || Number(e.target.value) <= this.state.min) {
      return;
    }
    this.setState({
      max: Number(e.target.value)
    })
  }

  validStr(str: string): boolean {
    return /^\d+$/.test(str);
  }

  minus() {
    if (this.state.counter === this.state.min) {
      return;
    }
    this.time = this.seconds();
    this.saveCounter(this.state.counter - 1);
  }

  seconds(): number {
    return new Date().getTime() / 1000;
  }

  plus() {
    this.time = this.seconds();
    if (this.state.counter === this.state.max) {
      return;
    }
    this.saveCounter(this.state.counter + 1);
  }

  setCounter(e: React.ChangeEvent<HTMLInputElement>): void {
    const num = Number(e.target.value);
    if (!this.validStr(e.target.value) || num < this.state.min || num > this.state.max) {
      return;
    }
    this.saveCounter(num);
  }

  updateCounterValue(): void {
    this.setState({
      showLoader: true
    });
    fetch('https://interview-8e4c5-default-rtdb.firebaseio.com/front-end.json', {
      method: 'PUT', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ counter1: this.state.counter })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          showLoader: false
        });
        console.log('Success:', data);
      })
      .catch((error) => {
        this.setState({
          showLoader: false
        });
        console.error('Error:', error);
      });
  }

  saveCounter(num: number): void {
    this.setState({
      counter: num
    }, () => {
      setTimeout(() => {
        if ((this.seconds() - this.time) >= 1) {
          this.updateCounterValue();
        }
      }, 1000);
    });

  }


  // render will know everything!
  render() {
    return (
      <div className="App">
        <div className="card">
          <h1>Counter App</h1>
          <div className="form-container">
            <div className="form">
              <label htmlFor="min">Min value</label>
              <input type="text" onChange={e => this.resetCounterMin(e)} placeholder="Min Value" value={this.state.min} />
              <label htmlFor="min">Max value</label>
              <input type="text" onChange={e => this.resetCounterMax(e)} placeholder="Max Value" value={this.state.max} />
            </div>
          </div>
          {
            this.state.showLoader === true ? 
              <div className="loader-container"><span className="loader"></span><span>&nbsp;&nbsp;Saving Counter value</span></div>
           : <div></div>
          }
          <div className="btn-container">
            <div className="btn-counter">
              <div className="minus" onClick={this.minus.bind(this)}>-</div>
              <div className="input-count">
                <input type="text" onChange={e => this.setCounter(e)} value={this.state.counter} />
              </div>
              <div className="plus" onClick={this.plus.bind(this)}>+</div>
            </div>
            <ShowCounter></ShowCounter>
          </div>
          <div>
          </div>
        </div>
      </div>
    );
  }
}
