import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { Button, Header, Icon, Form, Checkbox } from 'semantic-ui-react';
import Modal from 'react-bootstrap/lib/Modal';


@connect(state => ({ user: state.auth.user }))
export default class TaggerInvite extends Component {
  static propTypes = {
    user: PropTypes.object,
    submitEmail: PropTypes.func,
    title: PropTypes.string,
    modalClose: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    console.log('TaggerInvite called ', props);
  }

  state = { modalOpen: true, formValue: '', owner: false, invuserrole: 'ANNOTATOR' };

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => { this.setState({ modalOpen: false }); this.props.modalClose(); }

  handleSubmit = () => {
    this.props.submitEmail(this.state.formValue, this.state.owner, this.state.invuserrole);
  }

  handleChange = (field, element) => {
    console.log(' handle change ', field, element);
    if (field === 'role') {
      /*if (this.state.owner) {
        this.setState({ owner: false});
      } else {
        this.setState({ owner: true});
      }*/

      // Set user's role
      if(typeof element == "string") {
        this.setState({ invuserrole: element});

        if (element == "OWNER") {
          this.setState({ owner: true});
        } else {
          this.setState({ owner: false});
        }
      }
    } else {
      this.setState({ formValue: element.target.value });
    }
  }

  render() {
    // const {time} = this.props;
    const submitDisabled = this.state.formValue.indexOf('@') > 0 ? false : true;
    return (

      <div>
        <Modal
          show={this.state.modalOpen}
          onHide={this.handleClose}
          container={this}
          style={{ marginTop: '50px'}}
        >
          <Modal.Header closeButton style={{ backgroundColor: '#373A3C', color: 'white' }}>
            <Modal.Title id="contained-modal-title" style={{ fontSize: '1.25rem' }}>
              Add Contributor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: '1.25rem' }}>
              Annotators can only annotate i.e. make HITs.
              <br />
              <br />
              Moderators can view, tag or update HIT tags.
              <br />
              <br />
              Admins have all permissions: modify or add data to the project, and add other contributors.
              <Form size="small" key="import">
                <Form.Field id="tags" onChange={this.handleChange.bind(this, 'tags')} label="Email" control="input" type="email" placeholder="Enter email id" />
                    <Form.Field>
                      <Checkbox 
                      // checked={this.state.owner} 
                      checked={this.state.invuserrole == "OWNER"}  
                      onChange={this.handleChange.bind(this, 'role', 'OWNER')} label="Admin" value="OWNER" />
                      <br />
                      <Checkbox 
                      // checked={!this.state.owner} 
                      checked={this.state.invuserrole == "CONTRIBUTOR"}  
                      onChange={this.handleChange.bind(this, 'role', 'CONTRIBUTOR')} label="Moderator" value="CONTRIBUTOR" />
                      <br />
                      <Checkbox 
                      // checked={!this.state.owner} 
                      checked={this.state.invuserrole == "ANNOTATOR"}  
                      onChange={this.handleChange.bind(this, 'role', 'ANNOTATOR')} label="Annotator" value="ANNOTATOR" />
                    </Form.Field>
              </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose} className="pull-left" style={{ fontSize: '1.25rem', marginTop: '-4rem', padding: '1rem' }}>Close</Button>
            <Button color="green" inverted type="submit" disabled={submitDisabled} onClick={this.handleSubmit} style={{ fontSize: '1.25rem', marginTop: '-4rem', padding: '1rem' }}>
                    <Icon name="checkmark" /> Send Invite
                  </Button>
          </Modal.Footer>
        </Modal>

        </div>
    );
  }
}
