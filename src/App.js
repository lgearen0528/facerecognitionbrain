import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Clarifai from "clarifai";
import "./App.css";

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API
});

const particlesOptions = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: true,
        value_area: 100
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: ""
    };
  }

  onInputChange = e => {
    this.setState({ input: e.target.value });
  };

  onButtonSubmit = async () => {
    await this.setState(state => {
      return { imageURL: this.state.input };
    });
    try {
      const response = await app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        // URL
        this.state.imageURL
      );
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    } catch (err) {
      console.error(err);
    }
//https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80
    // .then(function(response) {
    // // do something with response
    // console.log();
    // },
    // function(err) {// there was an error;
    //   throw new Error(err)
    // }
    // );
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />

        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageURL={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
