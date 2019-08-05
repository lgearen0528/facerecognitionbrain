import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
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
      imageURL: "",
      box: {},
      route: "signin",
      isSignedIn: false
    };
  }

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    this.setState({ box });
  };

  onInputChange = e => {
    this.setState({ input: e.target.value });
  };

  onButtonSubmit = async () => {
    await this.setState(() => {
      return { imageURL: this.state.input };
    });
    try {
      const response = await app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        // URL
        this.state.imageURL
      );
      this.displayFaceBox(this.calculateFaceLocation(response));
    } catch (err) {
      console.error(err);
    }
    //https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80
  };

  onRouteChange = route => {
    let isSignedIn;
    if(route === 'signout'){
      isSignedIn = false;
    } else if (route === 'home'){
      isSignedIn = true;
    }
    this.setState({ route, isSignedIn });
  };

  render() {
    const {route, isSignedIn, box, imageURL } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              imageURL={imageURL}
              box={box}
            />
          </div>
        ) : route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
