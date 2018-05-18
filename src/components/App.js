/*global Mixcloud*/

import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import FeaturedMix from './FeaturedMix';
import Header from './Header';
import Home from './Home';
import Archive from './Archive';
import About from './About';

import mixesData from '../data/mixes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //whether a mix is currently playing
      playing: false,
      //id of the current mix
      currentMix: '',
      //this will be equal to out data file of mixes
      mixIds: mixesData,
      mix: null,
      mixes: []
    };
  }

  fetchMixes = async () => {
    const {mixIds} = this.state;

    mixIds.map(async id => {
      try {
        const response = await fetch(
          //we add the id onto the end of our URL as a dynamic segment
          `https://api.mixcloud.com${id}`
        );
        const data = await response.json();
        console.log(data);
        //put the mix into our state
        this.setState((prevState, props) => ({
          //here we add our data onto the end of all of
          //our previous state using the spread
          mixes: [...prevState.mixes, data]
        }));
      } catch (error) {
        console.log(error);
      }
    });
  };

  mountAudio = async () => {
    this.widget = Mixcloud.PlayerWidget(this.player);
    await this.widget.ready;
    //await this.widget.play();
    this.widget.events.pause.on(() =>
      this.setState({
        playing: false
      })
    );
    this.widget.events.play.on(() =>
      this.setState({
        playing: true
      })
    );
  };

  componentDidMount() {
    /*loads when component is mounted*/

    this.mountAudio();
    this.fetchMixes();
  }

  actions = {
    togglePlay: () => {
      this.widget.togglePlay();
    },

    playMix: mixName => {
      const {currentMix} = this.state;
      if (mixName === currentMix) {
        return this.widget.togglePlay();
      }
      //update the current mix in our state with mixname
      this.setState({
        currentMix: mixName
      });
      //load a new mix by its name then play it
      this.widget.load(mixName, true);
    }
  };

  render() {
    // this makes a variable from our first mix in the array
    //if the array is empty we assign it a default value of
    //an empty {} object

    const [firstMix = {}] = this.state.mixes;

    return (
      <Router>
        <div>
          <div className="flex-l justify-end">
            {/* Featured  ix*/}
            <FeaturedMix {...this.state} {...this.actions} {...firstMix} id={firstMix.key} />
            <div className="w-50-l relative z-1">
              <Header />
              {/*router*/}
              <Route exact path="/" render={() => <Home {...this.state} {...this.actions} />} />
              <Route path="/archive" render={() => <Archive {...this.state} {...this.actions} />} />
              <Route path="/about" render={() => <About {...this.state} />} />
            </div>
          </div>
          {/*audioplayer*/}
          <iframe
            width="100%"
            height="60"
            src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FBonobo%2Fbonobo-bbc-radio-1-essential-mix-april-2014%2F"
            frameBorder="0"
            className="player db fixed bottom-0 z-5"
            ref={player => (this.player = player)}
          />
        </div>
      </Router>
    );
  }
}

export default App;
