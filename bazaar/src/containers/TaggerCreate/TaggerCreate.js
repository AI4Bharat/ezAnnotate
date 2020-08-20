import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {bindActionCreators} from 'redux';
// import { GoogleLogin } from 'react-google-login';
// import FontAwesome from 'react-fontawesome';
// import { Header } from 'semantic-ui-react';
import { logEvent } from '../../helpers/dthelper';
import { Card, Label, Header } from 'semantic-ui-react';
import { push } from 'react-router-redux';
import { TEXT_SUMMARIZATION, VIDEO_BOUNDING_BOX, VIDEO_CLASSIFICATION, POS_TAGGING_GENERIC, DOCUMENT_ANNOTATION, IMAGE_POLYGON_BOUNDING_BOX_V2, POS_TAGGING, TEXT_CLASSIFICATION, TEXT_MODERATION, IMAGE_CLASSIFICATION, SENTENCE_TRANSLATION, SENTENCE_PAIR_CLASSIFIER } from '../../helpers/Utils';

@connect(
  state => ({user: state.auth.user}),
      dispatch => bindActionCreators({ pushState: push }, dispatch))
export default class TaggerCreate extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func
  }

  constructor(props) {
    console.log('props are ', props);
    super(props);
    this.createProject = this.createProject.bind(this);
  }


  state = {
    activeMenu: 'projects'
  };

  getImport = () => {
    return (
                    <Card.Group stackable centered itemsPerRow="2">

                      <div className="col-md-12 text-left sub-header">
                        {/* <Label color="teal" ribbon>Image Annotations</Label> */}
                        <div className="sub-header-lbl"><i className="fa fa-picture-o" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>Image Annotations</div>
                      </div>

                      <Card raised dimmed green centered onClick={this.createProject.bind(this, IMAGE_CLASSIFICATION)}className="card-main">
                        <Card.Header className="text-center card-header">
                          <h3> Image Classification</h3>
                        </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Image Classification
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Upload file with image urls and get your team to classify image.
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT" >Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <Card onClick={this.createProject.bind(this, 'IMAGE_BOUNDING_BOX_V2')} raised dimmed green centered className="card-main">
                        <Card.Header className="text-center card-header">
                          <h3> Image Bounding Box </h3>
                        </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Image Bounding Box
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Create rectangular bounding boxes around objects in Images.
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT" >Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <Card onClick={this.createProject.bind(this, IMAGE_POLYGON_BOUNDING_BOX_V2)} raised dimmed green centered className="card-main">
                        <Card.Header className="text-center card-header">
                          <h3> Image Segmentation</h3>
                        </Card.Header>
                        <Card.Content extra className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Bounding Box, Polygons etc.
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Create free-form polygons, points, lines in images.
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT" >Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      {/* <Card onClick={this.createProject.bind(this, IMAGE_POLYGON_BOUNDING_BOX)} raised dimmed green centered className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Image Polygon Bounding Box</h3>
                          </Card.Header>
                        <Card.Content extra className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Polygon bounding inside images.
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Get your team to create polygons, points inside the images
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT" size="small" >Create Dataset</Label>
                        </Card.Content>
                      </Card> */}

                      <div className="col-md-12 text-left sub-header">
                        {/* <Label color="teal" ribbon>Video Annotations</Label> */}
                        <div className="sub-header-lbl"><i className="fa fa-file-video-o" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>Video Annotations</div>
                      </div>

                      <Card raised dimmed green centered onClick={this.createProject.bind(this, VIDEO_CLASSIFICATION)}className="card-main">
                        <Card.Header className="text-center card-header">
                          <h3> Video Classification</h3>
                        </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Video Classification
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Upload file with video urls and get your team to classify videos.
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>


                      <Card raised dimmed green centered onClick={this.createProject.bind(this, VIDEO_BOUNDING_BOX)}className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Video Annotation</h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Video Annotation
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Object Tracking: Create rectangular bounding boxes around objects in video.
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <div className="col-md-12" style={{ height: '20px'}} />
                      <div className="col-md-12 text-left sub-header">
                        {/* <Label color="teal" ribbon>Text Annotations</Label> */}
                        <div className="sub-header-lbl"><i className="fa fa-text-width" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>Text Annotations</div>
                      </div>

                      <Card raised green onClick={this.createProject.bind(this, DOCUMENT_ANNOTATION)} centered className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Document Annotation </h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Document Processing, NLP
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Full-length document NER annotation. Annotate individual files (PDF, DOC, Text) one-by-one
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <Card raised blue centered onClick={this.createProject.bind(this, POS_TAGGING_GENERIC)} className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> NER Tagging </h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              NLP, Text Processing, Large Sentences
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Line-by-line NER annotation. Upload a CSV file and do NER on each row.
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>
                      <Card raised blue centered onClick={this.createProject.bind(this, POS_TAGGING)} className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> PoS Tagging for Small Sentences</h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              NLP, Text Processing, Search Queries and Logs
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Optimized for small sentences. Annotate words in a sentence.
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <Card raised blue centered onClick={this.createProject.bind(this, TEXT_SUMMARIZATION)} className="card-main">
                        <Card.Header className="text-center card-header">
                          <h3> Text Summarization </h3>
                        </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              NLP, Text Processing
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Upload file with text and invite people to write summaries
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>


                      <Card raised blue centered onClick={this.createProject.bind(this, TEXT_CLASSIFICATION)} className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Text Classification </h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              NLP, Text Processing, IR
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Create project with entities and text, get your team to classify them
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>


                      <Card raised blue centered onClick={this.createProject.bind(this, TEXT_MODERATION)} className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Text Moderation </h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              Text Processing, User Generated Content
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Get your team to moderate the user generated text
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <Card raised blue centered onClick={this.createProject.bind(this, SENTENCE_PAIR_CLASSIFIER)} className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Text Pair Classifier </h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              NLP, Text Processing, IR
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Create project with (mutually-exclusive) classes and text, get your team to classify them!
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <Card raised blue centered onClick={this.createProject.bind(this, SENTENCE_TRANSLATION)} className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Sentence Translation </h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Meta className="marginTop">
                            <span className="date">
                              NLP, Text Processing
                            </span>
                          </Card.Meta>
                          <Card.Description>
                              Upload sentences and invite people to write translations
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra className="card-content-footer">
                            <Label color="green" primary name="posT">Create Dataset</Label>
                        </Card.Content>
                      </Card>

                      <div className="col-md-12" style={{ height: '20px'}} />


                      {/* <div className="col-md-12 text-left sub-header"> */}
                        {/* <Label color="teal" ribbon>Custom Annotations</Label> */}
                        {/* <div className="sub-header-lbl">Custom Annotations</div>
                      </div> */}

                      {/* <Card disabled green raised dimmed green centered className="card-main">
                          <Card.Header className="text-center card-header">
                            <h3> Email us for Custom Annotations</h3>
                          </Card.Header>
                        <Card.Content extra onClick={this.createProject} className="card-content-body">
                          <Card.Description>
                              If there is any annotation use-case which is not covered in the list,
                              please drop us an email at <a>contact@dataturks.com</a>
                              &nbsp;
                          </Card.Description>
                        </Card.Content>
                      </Card> */}

                    </Card.Group>

      );
  }

  createProject(type) {
    logEvent('buttons', 'Project Create', type);
    if (type === 'IMAGE_BOUNDING_BOX_V2') {
      this.props.pushState({pathname: '/projects/import', query: {type: IMAGE_POLYGON_BOUNDING_BOX_V2, shape: 'rectangle'}});
    } else {
      this.props.pushState({pathname: '/projects/import', query: {type}});
    }
  }

  handleSubmit = (response) => {
    console.log('response', response, this.props.login);
    if (response && response.profileObj) {
      this.props.login(response.profileObj.name, response.profileObj.imageUrl);
    }
  }

  render() {
    const styles = require('./TaggerCreate.scss');
    console.log('state is ', this.state);
    return (
      <div>
        <div id="back-img-dflt"></div>
        <Helmet title="Create Project" />
        {
          <div className="text-center">
            <h1 style={{ backgroundColor: '#EEEEEE', width: '98%', marginLeft: '1rem', marginBottom: '2rem', padding: '0.5em 1rem 2rem', fontSize: '2.5rem' }}> <i className="fa fa-database" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>Create Dataset</h1>
            {/* <p>How to create a dataset?<a href="https://dataturks.com/help/help.php" target="_blank"> See Demo Videos </a> </p> */}
            <div className={styles.card + ' text-center'} style={{ paddingLeft: '5%', paddingRight: '5%' }}>
              {this.getImport()}
            </div>
            <br />
            <br />
          </div>
        }

        <style>{"\
          .sub-header{\
            background-color: #EEEEEE;\
            background: linear-gradient(-90deg,#f9b115 0%,#f6960b 100%)!important;\
            border-color: #f6960b!important;\
            margin-bottom: 1.75rem;\
          }\
          .sub-header-lbl{\
            font-size: 1.75rem;\
            padding: 1.5rem;\
            font-weight: bold;\
            color: black;\
          }\
          .card-main{\
            width: 45% !important;\
          }\
          .card-header{\
            height: 25%;\
            padding: 2%;\
            color: white;\
            background: linear-gradient(-90deg,#6b6b6b 0%,#373a3c 100%)!important;\
          }\
          .card-header h3{\
            font-size: 1.5rem;\
            font-weight: bold;\
          }\
          .card-content-body{\
            font-size: 1.25rem !important;\
            line-height: 2.5rem;\
            font-weight: bold;\
          }\
          .card-content-body div.marginTop{\
            color: #1678C2 !important;\
          }\
          .card-content-footer{\
          }\
          .card-content-footer div.label{\
            font-size: 1.25rem;\
            margin-top: -4rem;\
            padding: 1rem;\
            margin-top: 0.5%;\
          }\
        "}</style>
      </div>

    );
  }
}
