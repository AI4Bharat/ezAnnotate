import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";
import {
  Segment,
  Icon,
  Header,
  Button
} from "semantic-ui-react";
import {
  getProjectStatsForUser,
} from "../../helpers/dthelper";
import Table from "react-bootstrap/lib/Table";
import DatePicker from "react-date-picker";
import { dateToLocalString } from "../../helpers/Utils";
import $ from 'jquery';

// FOR BAR CHART
// var React = require('react');
// var Component = React.Component;
var CanvasJSReact = require('../../canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
window.chartOptions = [];
window.chartByDate = "N";
// ----

export default class UserProfile extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);
    console.log("user profile props are", props);
    this.updateProjectStatsForUser=this.updateProjectStatsForUser.bind(this);
    this.updateProjectStatsOnDate=this.updateProjectStatsOnDate.bind(this);
    this.state = {
      loading: false,
      userProjectStats: null,
      userProjectStatsOnDate: null,
      date: null,
    }; 
    
    // FOR BAR CHART
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
    // ----
  }

  // FOR BAR CHART
  toggleDataSeries(e){
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else{
			e.dataSeries.visible = true;
		}
		this.chart.render();
  }
  // ----

  // Reset Chart
  resetChart = resetData => {
    console.log("resetData", resetData);
    window.chartByDate = "N";
    this.chartMaker(resetData);

    // Force re-render chart
    this.forceUpdate();
  }

  // FOR BAR CHART
  chartMaker = data => {
    console.log("chartMaker ", data);

    // Constructing data for chart to plot
    let showZero = true;
    if (data && data.length > 10) {
      showZero = false;
    }

    var chartData = {},
        curr_hitsDone = 0,
        curr_hitsDeleted = 0,
        curr_hitsSkipped = 0,
        curr_evaluationCorrect = 0,
        curr_evaluationInCorrect = 0;

    if (data && data.length) {
      chartData = {"hitsDone": {}, "hitsDeleted": {}, "hitsSkipped": {}, "evaluationCorrect": {}, "evaluationInCorrect": {}};

      for (let index = 0; index < data.length; index++) {
        if (data[index].hitsDone > 0 || showZero) {
          curr_hitsDone = data[index].hitsDone;
          curr_hitsDeleted = window.chartByDate == "Y" ? data[index].hitsDeletedByDate : data[index].hitsDeleted;
          curr_hitsSkipped = window.chartByDate == "Y" ? data[index].hitsSkippedByDate : data[index].hitsSkipped;
          curr_evaluationCorrect = window.chartByDate == "Y" ? data[index].evaluationCorrectByDate : data[index].evaluationCorrect;
          curr_evaluationInCorrect = window.chartByDate == "Y" ? data[index].evaluationInCorrectByDate : data[index].evaluationInCorrect;

          // Assign only if a project has some stat to show (i.e. non-zero entries)
          if(curr_hitsDone != 0 || curr_hitsDeleted != 0 || curr_hitsSkipped != 0 || curr_evaluationCorrect != 0 || curr_evaluationInCorrect != 0) {
            chartData["hitsDone"][data[index].projectDetails.id+"||"+data[index].projectDetails.name] = curr_hitsDone;
            chartData["hitsDeleted"][data[index].projectDetails.id+"||"+data[index].projectDetails.name] = curr_hitsDeleted;
            chartData["hitsSkipped"][data[index].projectDetails.id+"||"+data[index].projectDetails.name] = curr_hitsSkipped;
            chartData["evaluationCorrect"][data[index].projectDetails.id+"||"+data[index].projectDetails.name] = curr_evaluationCorrect;
            chartData["evaluationInCorrect"][data[index].projectDetails.id+"||"+data[index].projectDetails.name] = curr_evaluationInCorrect;
          }
        }
      }
    }
    
    console.log("chartDataLength ==> ", Object.keys(chartData), "chartData ==> ", chartData);

    if(chartData && Object.keys(chartData).length) {
      var plotData = [];

      Object.keys(chartData).forEach(function(key) { // hitsDone, hitsDeleted etc.
        console.log(key, chartData[key]);

        var currDp = [];

        Object.keys(chartData[key]).forEach(function(subkey) { // projects specific counts
          console.log(subkey, chartData[key][subkey]);
  
          let projArr = subkey.split("||");

          // datapoints
          currDp.push({ label: projArr[1], y: chartData[key][subkey] });
        });

        // push current plot
        var typeName = "";

        if(key == "hitsDone")
          typeName = "#HITs done";
        else if(key == "hitsDeleted")
          typeName = "#HITs deleted";
        else if(key == "hitsSkipped")
          typeName = "#HITs skipped";
        else if(key == "evaluationCorrect")
          typeName = "#HITs correctr";
        else if(key == "evaluationInCorrect")
          typeName = "#HITs incorrect";

        plotData.push({
          type: "stackedColumn",
          name: typeName,
          showInLegend: true,
          // yValueFormatString: "#,###k",
          dataPoints: currDp
        });
      });

      console.log("plotData", plotData);

      // Plot Graph
      window.chartOptions = {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Projects Stats",
          fontFamily: "verdana"
        },
        axisY: {
          title: "Performed Actions"
        },
        axisX: {
          title: "Projects",
          labelMaxWidth: 100,
			    labelWrap: true
        },
        toolTip: {
          shared: true,
          reversed: true
        },
        legend: {
          verticalAlign: "center",
          horizontalAlign: "right",
          reversed: true,
          cursor: "pointer",
          itemclick: this.toggleDataSeries
        },
        data: plotData
      }
    }
  }
  // ----

  state = {
    loading: false,
    userProjectStats: null,
    userProjectStatsOnDate: null,
    date: null,
    fullName: "Profile Details",
    userEmail: null
  };

  componentWillMount() {
    this.setInitialDate();
    getProjectStatsForUser(this.props.params.userId, this.updateProjectStatsForUser);
  }

  updateProjectStatsForUser(error, response) {
    response = response.body;
    this.setState({
      userProjectStats: response.projectStats,
      fullName: response.userDetails.firstName + ' ' + response.userDetails.secondName,
      userEmail: response.userDetails.email
    })
  }

  updateProjectStatsOnDate(error, response) {
    response = response.body;
    this.setState({userProjectStatsOnDate: response.projectStats, loading: false})
  }
  
  onChangeDate = date => {
    this.setState({date : date});
    window.chartByDate = "Y";
    getProjectStatsForUser(this.props.params.userId, this.updateProjectStatsOnDate, dateToLocalString(date));
  }

  setInitialDate() {
    const date = new Date();
    this.setState({date: date, loading:true});
    getProjectStatsForUser(this.props.params.userId, this.updateProjectStatsOnDate, dateToLocalString(date));
  };

  getProjectsData = data => {
    const arrs = [];
    console.log("getProjectsData ", data);
    let showZero = true;
    if (data && data.length > 10) {
      showZero = false;
    }
    for (let index = 0; index < data.length; index++) {
      if (data[index].hitsDone > 0 || showZero) {
        arrs.push(
          <tr key={index}>
            <td>{data[index].projectDetails.name}</td>
            <td>{data[index].avrTimeTakenInSec}</td>
            <td>{data[index].hitsDone}</td>
            <td>{data[index].hitsDeleted}</td>
            <td>{data[index].hitsSkipped}</td>
            <td>{data[index].evaluationCorrect}</td>
            <td>{data[index].evaluationInCorrect}</td>
          </tr>
        );
      }
    }
    return <tbody>{arrs}</tbody>;
  };

  getProjectsDataByDate = data => {
    const arrs = [];
    console.log("getProjectsDataByDate ", data);
    let showZero = true;
    if (data && data.length > 10) {
      showZero = false;
    }
    for (let index = 0; index < data.length; index++) {
      if (data[index].hitsDone > 0 || showZero) {
        arrs.push(
          <tr key={index}>
            <td>{data[index].projectDetails.name}</td>
            <td>{data[index].avrTimeTakenInSec}</td>
            <td>{data[index].hitsDone}</td>
            <td>{data[index].hitsDeletedByDate}</td>
            <td>{data[index].hitsSkippedByDate}</td>
            <td>{data[index].evaluationCorrectByDate}</td>
            <td>{data[index].evaluationInCorrectByDate}</td>
          </tr>
        );
      }
    }

    if(window.chartByDate == "Y")
      this.chartMaker(data);

    return <tbody>{arrs}</tbody>;
  };

  render(){
    return(
      <div>
        <Helmet title="My Profile" />
        <div className="text-center">
          <h2 style={{ paddingTop:"1em" }}> {this.state.fullName} </h2>
          { this.state.userEmail &&
          <p> {this.state.userEmail} </p>}
        </div>
        <br/>
        <br/>
        { this.state && 
          this.state.userProjectStats &&
          this.state.userProjectStats.length > 0 && (
            <div
              className="text-center"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <Segment.Group
                loading={this.state.loading}
                style={{ width: "60%" }}
                centered
              >
                <Header attached="top" block as="h4">
                  <Icon name="line chart" disabled />
                  <Header.Content>Projects Stats</Header.Content>
                </Header>
                <Table striped bordered condensed hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Time(s) / HIT</th>
                      <th>#HITs done</th>
                      <th>#HITs deleted</th>
                      <th>#HITs skipped</th>
                      <th>#HITs correct</th>
                      <th>#HITs incorrect</th>
                    </tr>
                  </thead>
                  {this.getProjectsData(this.state.userProjectStats)}
                </Table>
              </Segment.Group>
            </div>
          )}
        <br />
        <br />
            {(
            <div
              className="text-center"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <Segment.Group
                loading={this.state.loading}
                style={{ width: "60%" }}
                centered
              >
                <Header attached="top" block as="h4">
                  <Icon name="line chart" disabled />
                  <Header.Content> Projects Stats for date:
                      <DatePicker
                      onChange={this.onChangeDate}
                      value={this.state.date}
                      maxDate={new Date()}
                      />
                  </Header.Content>
                </Header>
                {this.state.userProjectStatsOnDate && this.state.userProjectStatsOnDate.length > 0 &&(
                <Table striped bordered condensed hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Time(s) / HIT</th>
                      <th>#HITs done</th>
                      <th>#HITs deleted</th>
                      <th>#HITs skipped</th>
                      <th>#HITs correct</th>
                      <th>#HITs incorrect</th>
                    </tr>
                  </thead>
                  {this.getProjectsDataByDate(this.state.userProjectStatsOnDate)}
                </Table>
                )}
              </Segment.Group>
            </div>
        )}
        <br/>
        <br/>
        {/* FOR BAR CHART */}
        {(
          <div className="text-center" style={{ display: "flex", justifyContent: "space-around" }}>
            <Segment.Group
                loading={this.state.loading}
                style={{ width: "60%" }}
                centered
            >
              {this.state.userProjectStats && this.state.userProjectStats.length > 0 &&(
                <div>
                  <Button as="a" primary size="mini" onClick={event => {
                    this.resetChart(this.state.userProjectStats);
                    event.preventDefault();
                  }} style={{ marginLeft: "59rem", marginTop: "1rem", marginBottom: "1rem" }}>
                    <Icon name="refresh" /> Reset Chart
                  </Button>
                
                  <CanvasJSChart options = {window.chartOptions} onRef={ref => this.chart = ref} />
                </div>
              )}
              {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </Segment.Group>
            {this.chartMaker(this.state.userProjectStats)}
          </div>
        )}
        {/* ---- */}
        <br />
        <br />
      </div>
    )
  }
}