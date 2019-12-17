import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";
import {
  Segment,
  Icon,
  Header,
} from "semantic-ui-react";
import {
  getProjectStatsForUser,
} from "../../helpers/dthelper";
import Table from "react-bootstrap/lib/Table";
import DatePicker from "react-date-picker";
import { dateToLocalString } from "../../helpers/Utils";

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
    
  }

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
          </tr>
        );
      }
    }
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
                    </tr>
                  </thead>
                  {this.getProjectsData(this.state.userProjectStatsOnDate)}
                </Table>
                )}
              </Segment.Group>
            </div>
        )}
      </div>
    )
  }
}
  