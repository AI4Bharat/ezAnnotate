import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {bindActionCreators} from 'redux';
// import { GoogleLogin } from 'react-google-login';
// import FontAwesome from 'react-fontawesome';
// import { Header } from 'semantic-ui-react';
import { getProjectDetails } from 'redux/modules/dataturks';
import { Button, Segment, Breadcrumb, Icon, List, Image, Label } from 'semantic-ui-react';
import { push } from 'react-router-redux';
import Modal from 'react-bootstrap/lib/Modal';
import { removeContributor, logEvent, getUidToken } from '../../helpers/dthelper';

@connect(
  state => ({user: state.auth.user, projects: state.dataturksReducer.projects,
            currentProject: state.dataturksReducer.currentProject, projectDetails: state.dataturksReducer.projectDetails}),
      dispatch => bindActionCreators({ pushState: push, getProjectDetails }, dispatch))
export default class TaggerContributors extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func,
    projects: PropTypes.array,
    params: PropTypes.object,
    orgName: PropTypes.string,
    projectName: PropTypes.string,
    getProjectDetails: PropTypes.func,
    projectDetails: PropTypes.object,
    currentProject: PropTypes.string
  }

  constructor(props) {
    console.log('props are ', props);
    super(props);
    this.contributorDeleted = this.contributorDeleted.bind(this);
    this.state = {
      loading: false,
      showDeleteConfirmation: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.projectDetails !== nextProps.projectDetails) {
      this.setState({ loading: false });
    }
  }

  getItems(contributors) {
    console.log('projectDetails ', contributors);
    const items = [];
    for (let index = 0; index < contributors.length; index++) {
      items.push(
        <List.Item style={{ display: 'flex', flexDirection: 'row', width: '100%', border: '1px solid', padding: '1%' }}>
          <List.Content style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <div style={{ width: '10%', padding: '0.75%' }}>
              { contributors[index].userDetails.profilePic != null && <Image className="pull-center" avatar src={contributors[index].userDetails.profilePic} /> }
              { contributors[index].userDetails.profilePic == null && <i className="fa fa-user pull-center" aria-hidden="true"></i> }
            </div>

            <div style={{ width: '20%' }}>
              { contributors[index].role === 'OWNER' && <Label className="pull-center brk-content" style={{ fontSize: '1.25rem', padding: '5%' }} color="orange">Admin</Label> }
              { contributors[index].role == 'CONTRIBUTOR' && <Label className="pull-center brk-content" style={{ fontSize: '1.25rem', padding: '5%' }} color="green">Moderator</Label> }
              { contributors[index].role == 'ANNOTATOR' && <Label className="pull-center brk-content" style={{ fontSize: '1.25rem', padding: '5%' }} color="grey">Annotator</Label> }
            </div>
            
            <List.Header className="pull-left brk-content" style={{ width: '25%' }}>{contributors[index].userDetails.firstName}</List.Header>
            
            <div className="pull-left brk-content" style={{ width: '35%' }}>{contributors[index].userDetails.email}</div>
            
            <div style={{ width: '10%' }}>
              {contributors[index].userDetails.email && contributors[index].role !== 'OWNER' &&
                <Button icon size="big" onClick={() => this.setState({ showDeleteConfirmation: true, selectedContributor: contributors[index].userDetails.email})} color="red" className="pull-right">
                  <Icon name="remove" />
                </Button>
              }

              {contributors[index].userDetails.email && contributors[index].role === 'OWNER' &&
                <Button disabled icon size="big" color="grey" className="pull-right">
                  <i className="fa fa-ban" aria-hidden="true"></i>
                </Button>
              }
            </div>
          </List.Content>
        </List.Item>
        );
    }
    return (
      <List divided relaxed style={{ width: '100%' }}>
        {items}
      </List>
      );
  }

  contributorDeleted(error, response) {
    console.log('invite sent ', error, response);
    if (!error) {
      logEvent('buttons', 'Contributor Removed');
      this.setState({ showDeleteConfirmation: false });
      this.props.getProjectDetails(this.props.currentProject, getUidToken());
      this.setState({ loading: true});
    } else {
      logEvent('buttons', 'Contributor remove failed');
      this.setState({ error: true, errorMessage: error, showDeleteConfirmation: false });
      alert(error);
      this.setState({ loading: false });
    }
  }

  deleteContributor() {
    console.log('selectedContributor ', this.state.selectedContributor);
    removeContributor(this.props.currentProject, this.state.selectedContributor, this.contributorDeleted);
    this.setState({ loading: true, showDeleteConfirmation: false });
  }

  render() {
    console.log('contributor state is ', this.state, this.props);
    return (
      <div style={{ background: 'white'}} className="text-center">
        <div id="back-img-dflt"></div>
          <Helmet title="Contributor List" />
            {this.state.showDeleteConfirmation &&
              <div>
                  <Modal.Dialog>
                    <Modal.Header style={{ backgroundColor: '#373A3C', color: 'white' }}>
                      <Modal.Title style={{ fontSize: '1.5rem' }}>Remove Contributor</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ fontSize: '1.5rem', padding: '3%', lineHeight: '2.5rem' }}>
                      Are you sure you want to remove this contributor from project ?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={() => {this.setState({showDeleteConfirmation: false});}} style={{ fontSize: '1.25rem', padding: '1rem' }}>Close</Button>
                      <Button negative onClick={() => {this.deleteContributor().bind(this);}} style={{ fontSize: '1.25rem', padding: '1rem' }}>Remove</Button>
                    </Modal.Footer>
                  </Modal.Dialog>
                </div>
            }
              <div style={{ padding: '1%' }}>
                <Segment basic size="large" loading={this.state.loading} style={{ backgroundColor: '#EEEEEE' }}>
                  <Button color="green" className="pull-left" onClick={() => this.props.pushState('/projects/' + this.props.params.orgName + '/' + this.props.params.projectName)} style={{ fontSize: '1.25rem', padding: '1.5rem' }}><Icon name="arrow left" />Project</Button>

                  <div className="text-right">
                    <Breadcrumb size="big" style={{ padding: '1.5rem', backgroundColor: '#16AB39' }}>
                      <Breadcrumb.Section link onClick={ () => this.props.pushState('/projects/')} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}><i className="fa fa-user-o" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>{this.props.params.orgName}</Breadcrumb.Section>
                      <Breadcrumb.Divider style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }} />
                      <Breadcrumb.Section link onClick={ () => this.props.pushState('/projects/' + this.props.params.orgName + '/' + this.props.params.projectName)} style={{ fontSize: '1.5rem', overflowWrap: 'break-word !important', fontWeight: 'bold', color: 'white' }}>
                        {this.props.params.projectName}
                      </Breadcrumb.Section>
                    </Breadcrumb>
                  </div>
                </Segment>
                
                <h3 style={{ backgroundColor: '#EEEEEE', marginBottom: '2rem', padding: '0.5em 1rem 2rem', fontSize: '2.5rem' }}> 
                  <i className="fa fa-users" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>Configure keyboard shortcuts</h3>

                <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#EEEEEE', padding: '3%', fontSize: '1.5rem' }}>
                  {this.getItems(this.props.projectDetails.contributorDetails)}
                </div>
              </div>

        <style>{"\
          .brk-content{\
            overflow-wrap: break-word !important;\
          }\
        "}</style>
      </div>

    );
  }
}
