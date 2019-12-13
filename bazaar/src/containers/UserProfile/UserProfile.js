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


export default class UserProfile extends Component {
  static propTypes = {
    user: PropTypes.object,
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
  };

  componentWillMount(){
    this.setInitialDate();
    getProjectStatsForUser(this.updateProjectStatsForUser);
  }

  updateProjectStatsForUser(error,response){
    this.setState({userProjectStats: response.body})
  }

  updateProjectStatsOnDate(error,response){
    this.setState({userProjectStatsOnDate:response.body, loading: false})
  }
  
  onChangeDate = date => {
    this.setState({date : date});
    getProjectStatsForUser(this.updateProjectStatsOnDate, date.toLocaleDateString());
  }

  setInitialDate() {
    const date = new Date();
    this.setState({date: date, loading:true});
    getProjectStatsForUser(this.updateProjectStatsOnDate, date.toLocaleDateString());
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
            <td>{data[index].userDetails.name}</td>
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
          <h2 style={{ padding:"1em" }}> My Profile </h2>
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
                  <Header.Content>Stats for your Projects</Header.Content>
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
                  <Header.Content> Stats for Projects on selected Date
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
  