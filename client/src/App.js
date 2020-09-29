import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Header from "./components/layout/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import About from "./components/pages/About";

class App extends Component {
  state = {
    date: [],
    temp: [],
    startdate: "",
    enddate: "",
    data: {
      labels: [],
      datasets: [
        {
          label: "Daily Average Minimum Temperature",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [],
        },
      ],
    },
  };

  //componentDidMount() {
  // this.callApi()
  //   .then((res) => {
  //     for (let index = 0; index < res.data.length; index++) {
  //       const element = res.data[index];
  //       date.push(element[0]);
  //       temp.push(parseFloat(element[1]));
  //     }
  //     this.setState({
  //       date: date,
  //       temp: temp,
  //     });
  //     console.log(date);
  //     console.log(temp);
  //   })
  //   .catch((err) => console.log(err));
  //}

  // callApi = async () => {
  //   const response = await fetch("/test/1981-01-01/1990-12-31");
  //   const body = await response.json();
  //   //console.log(body.data);
  //   if (response.status !== 200) throw Error(body.message);
  //   return body;
  // };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startdate: this.state.startdate,
        enddate: this.state.enddate,
      }),
    });
    const body = await response.json();
    let date = [];
    let temp = [];
    for (let index = 0; index < body.data.length; index++) {
      const element = body.data[index];
      date.push(element[0]);
      temp.push(parseFloat(element[1]));
    }
    this.setState({ startdate: "", enddate: "" });
    this.setState({
      date: date,
      temp: temp,
      data: {
        labels: date,
        datasets: [
          {
            label: "Daily Average Minimum Temperature",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: temp,
          },
        ],
      },
    });
    console.log(date);
    console.log(temp);
    //console.log(body.data);

    if (response.status !== 200) throw Error(body.message);
  };

  render() {
    return (
      <Router>
        <div className='App'>
          <Header />
          <Route
            exact
            path='/'
            render={(props) => (
              <React.Fragment>
                <h1 style={{ textAlign: "center" }}>
                  {" "}
                  Bar Graph showing Daily Average Minimum Temperature{" "}
                </h1>{" "}
                <br />
                <form onSubmit={this.onSubmit} style={{ display: "flex" }}>
                  <div className='form-group form'>
                    <label>Enter a start date (1981-1990) : </label>
                    <input
                      type='date'
                      id='startdate'
                      name='startdate'
                      min='1981-01-01'
                      max='1990-12-31'
                      style={{ flex: "10", padding: "5px" }}
                      value={this.state.startdate || ""}
                      onChange={this.onChange}
                    />{" "}
                    <label>Enter the end date (1981-190) : </label>
                    <input
                      type='date'
                      id='enddate'
                      name='enddate'
                      min='1981-01-01'
                      max='1990-12-31'
                      style={{ flex: "10", padding: "5px" }}
                      value={this.state.enddate || ""}
                      onChange={this.onChange}
                    />{" "}
                    <input
                      type='submit'
                      value='Submit'
                      className='btn btn-primary'
                      style={{ flex: "1" }}></input>
                  </div>
                </form>
                <div className='canvas' style={{ height: 400, width: 1000 }}>
                  <Bar
                    data={this.state.data}
                    width={50}
                    height={50}
                    options={{
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </React.Fragment>
            )}
          />

          <Route path='/about' component={About} />
        </div>
      </Router>
    );
  }
}

export default App;
