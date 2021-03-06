import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {bindActionCreators} from 'redux';
// import { GoogleLogin } from 'react-google-login';
// import FontAwesome from 'react-fontawesome';
// import { Header } from 'semantic-ui-react';
import { push } from 'react-router-redux';
import { setCurrentProject, getProjectDetails } from 'redux/modules/dataturks';
import { getUidToken, editProject } from '../../helpers/dthelper';
import { Button, Form, Segment, Breadcrumb, Icon } from 'semantic-ui-react';
import { createEntitiesJson, getDefaultShortcuts, convertKeyToString, keyMap, VIDEO_BOUNDING_BOX, POS_TAGGING_GENERIC, POS_TAGGING, DOCUMENT_ANNOTATION, IMAGE_POLYGON_BOUNDING_BOX, IMAGE_CLASSIFICATION, IMAGE_POLYGON_BOUNDING_BOX_V2, TEXT_CLASSIFICATION, SENTENCE_PAIR_CLASSIFIER } from '../../helpers/Utils';

@connect(
  state => ({user: state.auth.user,
    currentPathOrg: state.dataturksReducer.currentPathOrg,
    currentPathProject: state.dataturksReducer.currentPathProject,
    projects: state.dataturksReducer.projects,
    projectDetails: state.dataturksReducer.projectDetails,
    currentProject: state.dataturksReducer.currentProject}),
      dispatch => bindActionCreators({ pushState: push, setCurrentProject, getProjectDetails}, dispatch))
export default class TaggerKeyBind extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func,
    params: PropTypes.object,
    orgName: PropTypes.string,
    projectName: PropTypes.string,
    setCurrentProject: PropTypes.func,
    currentProject: PropTypes.string,
    getProjectDetails: PropTypes.func,
    projectDetails: PropTypes.object,
    currentPathProject: PropTypes.string,
    currentPathOrg: PropTypes.string
  }

  constructor(props) {
    console.log('TaggerKeyBind props are ', props);
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.clearShortcut = this.clearShortcut.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.projectEditedCallback = this.projectEditedCallback.bind(this);
    const { fields, shortcuts } = this.getFieldsShortcuts(this.props.projectDetails);
    this.state = {
      loading: false,
      fields,
      shortcuts,
      error: undefined,
      projectEdited: false
    };
  }

  componentDidMount() {
    console.log('Did mount TaggerVisualize() ', this.state.projectDetails, this.state.hits);
    if ((this.props.params.orgName && this.props.params.projectName &&
      (!this.props.projectDetails || (this.props.projectDetails.name !== this.props.params.projectName || this.props.projectDetails.orgName !== this.props.params.orgName))) ||
    !this.props.currentProject) {
      this.props.setCurrentProject({orgName: this.props.params.orgName, projectName: this.props.params.projectName}, getUidToken());
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('next props in TaggerOveriew', this.props, nextProps);
    if (nextProps.currentProject && (this.props.currentProject !== nextProps.currentProject || !this.props.projectDetails)) {
      this.props.getProjectDetails(nextProps.currentProject, getUidToken());
      this.setState({ loading: true});
    }
    if ((!this.props.projectDetails && nextProps.projectDetails) ||
        (this.props.projectDetails && nextProps.projectDetails && this.props.projectDetails.id !== nextProps.projectDetails.id)) {
      const { fields, shortcuts } = this.getFieldsShortcuts(nextProps.projectDetails);
      this.setState({
        loading: false,
        fields,
        shortcuts
      });
    }
    if (this.props.projectDetails && nextProps.projectDetails && this.props.projectDetails.id === nextProps.projectDetails.id) {
      console.log('refresh project');
      const { fields, shortcuts } = this.getFieldsShortcuts(nextProps.projectDetails);
      this.setState({
        loading: false,
        fields,
        shortcuts
      });
    }
  }

  getFieldsShortcuts(projectdetails) {
    if (!projectdetails) return { fields: {}, shortcuts: {} };
    const { taskRules, task_type } = projectdetails;
    let fields = {};
    let shortcuts = getDefaultShortcuts(task_type);
    console.log('default shortcuts', shortcuts);
    const ruleJson = JSON.parse(taskRules);
    if (task_type === IMAGE_CLASSIFICATION || task_type === TEXT_CLASSIFICATION || task_type === SENTENCE_PAIR_CLASSIFIER || task_type === POS_TAGGING || task_type === IMAGE_POLYGON_BOUNDING_BOX || task_type === IMAGE_POLYGON_BOUNDING_BOX_V2 ) {
      if ('tags' in ruleJson) {
        fields = createEntitiesJson(taskRules).entities;
        shortcuts = getDefaultShortcuts(task_type, fields);
      }
    }
    if ('shortcuts' in ruleJson) {
      shortcuts = ruleJson.shortcuts;
    }
    return { fields, shortcuts };
  }

  getValue(element) {
    if (element in this.state.shortcuts) {
      return convertKeyToString(this.state.shortcuts[element]);
    }
    return '';
  }

  getEntityInputs(entities) {
    console.log('entities', entities);
    const arrs = [];
    for (let index = 0; index < entities.length; index ++) {
      arrs.push(
        <div>
        <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, entities[index])} />} inline style={{width: '25%'}} value={this.getValue(entities[index])} size="small" id={entities[index]} type="text" label={entities[index]} placeholder="Press the keys" />
        <br />
        </div>);
    }
    return arrs;
  }

  handleKeyPress(event) {
    event.preventDefault();
    console.log('handleKeyPress is', event.target.id, event.key, event.ctrlKey, event.which, event.keyCode);
    const field = event.target.id;
    const shortcuts = this.state.shortcuts;
    let current = {qualifier: '', key: ''};
    if (field in shortcuts) {
      current = shortcuts[field];
    }
    if (event.altKey) {
      current.qualifier = 'alt';
    } else if (event.ctrlKey) {
      current.qualifier = 'ctrl';
    } else if (event.metaKey) {
      current.qualifier = 'meta';
    }
    if (event.keyCode in keyMap) {
      current.key = keyMap[event.keyCode];
    } else if ((event.keyCode > 47 && event.keyCode < 58) || (event.keyCode > 64 && event.keyCode < 91)) {
      console.log('notfound in map', event.key);
      current.key = event.key;
    }
    // if (event.key === 'Meta' || event.key === 'Control' || event.key === 'Alt') {
    //   current.qualifier = event.key;
    // } else {
    //   current.key = event.key;
    // }
    shortcuts[field] = current;
    this.setState({shortcuts});
  }

  projectEditedCallback(error, response) {
    console.log(' project edit callback ', error, response);
    if (!error) {
      this.setState({ loading: false, projectEdited: true});
      this.props.getProjectDetails(this.props.currentProject, getUidToken());
    } else {
      const error1 = response.body.message;
      this.setState({ loading: false, projectEdited: false, error: error1});
    }
  }

  handleSubmit = () => {
    const shortcuts = this.state.shortcuts;
    const keySet = new Set();
    const finalShortcuts = {};
    for (const key of Object.keys(shortcuts)) {
      if (key in getDefaultShortcuts(this.props.projectDetails.task_type, this.state.fields) || (this.state.fields && this.state.fields.includes(key))) {
        const value = shortcuts[key];
        if (key.length > 0 && (value.qualifier.length > 0 || value.key.length > 0)) {
          finalShortcuts[key] = value;
          const setKey = value.qualifier + ' ' + value.key;
          if (keySet.has(setKey)) {
            this.setState({ error: 'Duplicate key shortcut' + setKey});
            return;
          }
          keySet.add(setKey);
        }
      }
    }
    const { taskRules } = this.props.projectDetails;
    const rulesJson = JSON.parse(taskRules);
    rulesJson.shortcuts = finalShortcuts;
    console.log('response', JSON.stringify(rulesJson));
    editProject(this.props.currentProject, { rules: JSON.stringify(rulesJson) }, this.projectEditedCallback);
    this.setState({ loading: true, error: undefined });
  }

  clearShortcut(field, id) {
    console.log('clearShortcut', field, id);
    const shortcuts = this.state.shortcuts;
    shortcuts[field] = {qualifier: '', key: ''};
    this.setState({ shortcuts });
  }


  render() {
    console.log('TaggerKeyBind state is ', this.state, this.props);
    const inputWidth = { width: '84%', border: '1px solid' };
    return (
      <div className="text-center taggerPages">
        <div id="back-img-dflt"></div>
          <Helmet title="DataTurks: Add keyboard shortcuts" />
              <div className="text-center marginTop">
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
                  <i className="fa fa-keyboard-o" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>Configure keyboard shortcuts
                  <p style={{ marginTop: '0.5rem' }}>Click on box and press keys to configure keyboard shortcuts</p></h3>

                      <Form onSubmit={event => { event.preventDefault(); }} size="big" key="import1" onKeyDown={this.handleKeyPress} loading={this.state.loading} style={{ background: '#EEEEEE', padding: '2%' }}>
                        <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'next')} />} inline style={inputWidth} value={this.getValue('next')} id="next" size="big" color="teal" compact label="Next" placeholder="Press the keys" type="text" />
                        
                        <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'previous')} />} inline style={inputWidth} value={this.getValue('previous')} size="big" id="previous" type="text" label="Previous" placeholder="Press the keys" />
                        
                        <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'skip')} />} inline style={inputWidth} value={this.getValue('skip')} size="big" id="skip" type="text" label="Skip" placeholder="Press the keys" />
                        
                        <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'moveToDone')} />} inline style={inputWidth} value={this.getValue('moveToDone')} size="big" id="moveToDone" type="text" label="Mark as Done" placeholder="Press the keys" />

                        {this.props.projectDetails && (this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX || this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2) &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'undo')} />} inline style={inputWidth} value={this.getValue('undo')} size="big" id="undo" type="text" label="Undo" placeholder="Press the keys" />}
                        {this.props.projectDetails && (this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX || this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2) &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'clearAll')} />} inline style={inputWidth} value={this.getValue('clearAll')} size="big" id="clearAll" type="text" label="Clear All" placeholder="Press the keys" />}
                        {this.props.projectDetails && (this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX || this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2) &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'tool')} />} inline style={inputWidth} value={this.getValue('tool')} size="big" id="tool" type="text" label="Toggle Tool" placeholder="Press the keys" />}
                        {this.props.projectDetails && (this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX || this.props.projectDetails.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2) &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'delete')} />} inline style={inputWidth} value={this.getValue('delete')} size="big" id="delete" type="text" label="Delete Annotation" placeholder="Press the keys" />}


                        <br />
                          {this.props.projectDetails && this.props.projectDetails.task_type === POS_TAGGING &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'left')} />} inline style={inputWidth} value={this.getValue('left')} size="big" id="left" type="text" label="Previous Word" placeholder="Press the keys" />}
                          {this.props.projectDetails && this.props.projectDetails.task_type === POS_TAGGING &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'right')} />} inline style={inputWidth} value={this.getValue('right')} size="big" id="right" type="text" label="Next Word" placeholder="Press the keys" />}
                        <br />

                        <br />
                          {this.props.projectDetails && this.props.projectDetails.task_type === VIDEO_BOUNDING_BOX &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'forward')} />} inline style={inputWidth} value={this.getValue('forward')} size="big" id="forward" type="text" label="One Frame Forward" placeholder="Press the keys" />}
                          {this.props.projectDetails && this.props.projectDetails.task_type === VIDEO_BOUNDING_BOX &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'backward')} />} inline style={inputWidth} value={this.getValue('backward')} size="big" id="backward" type="text" label="One Frame Backward" placeholder="Press the keys" />}
                          {this.props.projectDetails && this.props.projectDetails.task_type === VIDEO_BOUNDING_BOX &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'fast_forward')} />} inline style={inputWidth} value={this.getValue('fast_forward')} size="big" id="fast_forward" type="text" label="10 Frame Forward" placeholder="Press the keys" />}
                          {this.props.projectDetails && this.props.projectDetails.task_type === VIDEO_BOUNDING_BOX &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'fast_backward')} />} inline style={inputWidth} value={this.getValue('fast_backward')} size="big" id="fast_backward" type="text" label="10 Frame Backward" placeholder="Press the keys" />}
                        <br />


                        <br />
                          {this.props.projectDetails && ( this.props.projectDetails.task_type === DOCUMENT_ANNOTATION || this.props.projectDetails.task_type === POS_TAGGING_GENERIC) &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'save')} />} inline style={inputWidth} value={this.getValue('save')} size="big" id="save" type="text" label="Save" placeholder="Press the keys" />}
                        <br />
                          {this.props.projectDetails && (this.props.projectDetails.task_type === DOCUMENT_ANNOTATION || this.props.projectDetails.task_type === POS_TAGGING_GENERIC) &&
                          <Form.Input icon={<Icon name="close" link onClick={this.clearShortcut.bind(this, 'close')} />} inline style={inputWidth} value={this.getValue('close')} size="big" id="close" type="text" label="Close" placeholder="Press the keys" />}


                        {this.props.projectDetails && this.state.fields && this.getEntityInputs(this.state.fields)}


                        <Button primary onClick={this.handleSubmit} style={{ fontSize: '1.25rem', padding: '1.5rem' }}>Save</Button>
                        <Button onClick={() => {this.props.pushState('/projects/' + this.props.params.orgName + '/' + this.props.params.projectName);}} style={{ fontSize: '1.25rem', padding: '1.5rem' }}>Cancel</Button>
                        <p className={{color: '#ff0000'}} disabled={!this.state.error}>
                                      {this.state.error}
                        </p>
                        {this.state.projectEdited && <p disabled={!this.state.error}>
                                      Configuration Saved
                        </p>}
                      </Form>
              </div>

        <style>{"\
          div.field{\
            padding: 1%;\
          }\
          div.field label{\
            font-size: 1.5rem !important;\
            padding-bottom: 1%;\
            float: left;\
            width: 12% !important;\
          }\
        "}</style>
      </div>

    );
  }
}
