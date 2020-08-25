import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {bindActionCreators} from 'redux';
import { setCurrentProject } from 'redux/modules/dataturks';
// import { GoogleLogin } from 'react-google-login';
// import FontAwesome from 'react-fontawesome';
// import { Header } from 'semantic-ui-react';
import { Segment, Statistic, Header, Button, Icon, Breadcrumb } from 'semantic-ui-react';
import { push, goBack } from 'react-router-redux';
import { fetchStats, getUidToken } from '../../helpers/dthelper';
import { POS_TAGGING, VIDEO_BOUNDING_BOX, VIDEO_CLASSIFICATION, DOCUMENT_ANNOTATION, IMAGE_POLYGON_BOUNDING_BOX_V2, TEXT_CLASSIFICATION, POS_TAGGING_GENERIC, IMAGE_BOUNDING_BOX, IMAGE_POLYGON_BOUNDING_BOX, IMAGE_CLASSIFICATION, TEXT_SUMMARIZATION, TEXT_MODERATION, SENTENCE_TRANSLATION, SENTENCE_PAIR_CLASSIFIER } from '../../helpers/Utils';
import { BarChart, Bar, Tooltip, YAxis, XAxis, Legend } from 'recharts';
import Table from 'react-bootstrap/lib/Table';

const statsLabel = { textTransform: 'initial', fontWeight: '300' };

@connect(
  state => ({user: state.auth.user, currentProject: state.dataturksReducer.currentProject, projectDetails: state.dataturksReducer.projectDetails}),
      dispatch => bindActionCreators({ pushState: push, goBack, setCurrentProject }, dispatch))
export default class TaggerVisualize extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func,
    currentProject: PropTypes.string,
    projectDetails: PropTypes.object,
    goBack: PropTypes.func,
    params: PropTypes.object,
    orgName: PropTypes.string,
    projectName: PropTypes.string,
    setCurrentProject: PropTypes.func
  }

  constructor(props) {
    console.log('props are ', props);
    super(props);
    this.projectDetailsFetched = this.projectDetailsFetched.bind(this);
  }

  state = {
    projectStats: undefined,
    loading: false,
    taskType: undefined,
    projectDetails: undefined
  };

  componentWillMount() {
    console.log('TaggerVisualize() componentWillMount');
  }

  componentDidMount() {
    console.log('Did mount TaggerVisualize() ', this.state.projectDetails, this.state.hits);
    if ((this.props.params.orgName && this.props.params.projectName &&
      (!this.props.projectDetails || (this.props.projectDetails.name !== this.props.params.projectName || this.props.projectDetails.orgName !== this.props.params.orgName))) ||
    !this.props.currentProject) {
      this.props.setCurrentProject({orgName: this.props.params.orgName, projectName: this.props.params.projectName}, getUidToken());
    }
    if (this.props.currentProject && !this.state.projectStats) {
      this.loadProjectDetails(this.props.currentProject);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('next props in TaggerVisualize', nextProps);
    if (this.props.currentProject !== nextProps.currentProject) {
      this.loadProjectDetails(nextProps.currentProject);
    }
  }

  getLabelsCountChart(inData) {
    console.log('inData', inData);
    const dataArray = [];
    if (inData) {
      Object.keys(inData).forEach(function(tag) {
        const data = {};
        const tagValue = inData[tag];
        if (tagValue.label) {
          data.name = tagValue.label;
        } else {
          data.name = tag;
        }
        // data.name = tagValue.label;
        data.Count = tagValue.count;
        dataArray.push(data);
      });
    }
    // const width = 100 * dataArray.length;
    console.log('data is ', inData, dataArray);
    return (
                              <div className="marginTop">
                                <div>
                                <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
                                  <Tooltip />
                                  <Legend />
                                  <XAxis type="number" />
                                  <YAxis dataKey="name" type="category" />
                                  <Bar dataKey="Count" stackId="a" fill="#8884d8" />
                                </BarChart>
                                </div>
                              </div>

                              );
  }

  getDocLabelsChart(inData) {
    const dataArray = [];
    if (inData) {
      Object.keys(inData).forEach(function(tag) {
        const data = {};
        const tagValue = inData[tag];
        data.name = tag;
        data.Count = tagValue.count;
        dataArray.push(data);
      });
    }
    // const width = 100 * dataArray.length;
    console.log('data is ', inData, dataArray);
    return (
                              <div className="marginTop">
                                <div>
                                <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
                                  <Tooltip />
                                  <Legend />
                                  <XAxis type="number"/>
                                  <YAxis dataKey="name" type="category"/>
                                  <Bar dataKey="Count" stackId="a" fill="#8884d8" />
                                </BarChart>
                                </div>
                              </div>

                              );
  }

  getLabelsChart(inData) {
    const dataArray = [];
    if (inData) {
      Object.keys(inData).forEach(function(tag) {
        const data = {};
        const tagValue = inData[tag];
        data.name = tag;
        data['Total Words'] = tagValue.count;
        data['Unique Words'] = tagValue.numUniqWords;
        data['Word Frequency'] = (tagValue.count / tagValue.numUniqWords).toPrecision(2);
        dataArray.push(data);
      });
    }
    // const width = 100 * dataArray.length;
    console.log('data is ', inData, dataArray);
    return (
                              <div className="marginTop">
                                <div>
                                <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
                                  <Tooltip />
                                  <Legend />
                                  <XAxis type="number" />
                                  <YAxis type="category" dataKey="name" />
                                  <Bar dataKey="Total Words" stackId="a" fill="#8884d8" />
                                  <Bar dataKey="Unique Words" stackId="a" fill="#82ca9d" />
                                </BarChart>
                                </div>
                                <br />
                                <br />
                                <div>
                                <BarChart layout="vertical" width={1000} height={500} data={dataArray}>
                                  <Tooltip />
                                  <XAxis type="number" />
                                  <YAxis type="catehory" dataKey="name" type="category" />
                                  <Legend />
                                  <Bar dataKey="Word Frequency" stackId="c" fill="#ffc658" />
                                </BarChart>
                                </div>

                              </div>

                              );
  }

  getWordsChart(inData) {
    console.log('data is ', inData);
    const renderArr = [];
    for (let index = 0; index < inData.length; index ++) {
      renderArr.push(
      <tr>
      <td>{inData[index].phrase}</td>
      <td>{inData[index].count}</td>
      </tr>);
    }
    return (
      <Table striped bordered condensed hover responsive>
          <thead style={{ backgroundColor: '#373A3C', color: 'white', fontSize: '1.5rem' }}>
          <tr>
            <th style={{ textAlign: 'center' }}>Word</th>
            <th style={{ textAlign: 'center' }}>Count</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '1.2rem' }}>
          {renderArr}
        </tbody>
      </Table>
    );
  }

  loadProjectDetails(pid, cache) {
    // TODO_REPLACE
    this.setState({loading: true, projectDetails: this.props.projectDetails });
    if (pid) {
      fetchStats(pid, this.projectDetailsFetched, cache);
    } else {
      fetchStats(this.props.currentProject, this.projectDetailsFetched, cache);
    }
  }

  projectDetailsFetched(error, response) {
    console.log(' project details fetched ', error, response);
    if (!error) {
      let projectStats = {};
      let taskType = undefined;
      if (response.body.details.task_type === POS_TAGGING) {
        projectStats = response.body.posTaggingStats;
        taskType = response.body.details.task_type;
      } else if (response.body.details.task_type === TEXT_SUMMARIZATION || response.body.details.task_type === TEXT_MODERATION || response.body.details.task_type === SENTENCE_TRANSLATION) {
        projectStats = response.body.textSummarizationStats;
        taskType = response.body.details.task_type;
      } else if (response.body.details.task_type === TEXT_CLASSIFICATION || response.body.details.task_type === SENTENCE_PAIR_CLASSIFIER) {
        projectStats = response.body.textClassificationStats;
        taskType = response.body.details.task_type;
      } else if (response.body.details.task_type === IMAGE_CLASSIFICATION) {
        projectStats = response.body.imageClassificationStats;
        taskType = IMAGE_CLASSIFICATION;
      } else if (response.body.details.task_type === VIDEO_CLASSIFICATION) {
        projectStats = response.body.videoClassificationStats;
        taskType = VIDEO_CLASSIFICATION;
      } else if (response.body.details.task_type === IMAGE_BOUNDING_BOX) {
        projectStats = response.body.imageBoundingBoxStats;
        taskType = IMAGE_BOUNDING_BOX;
      } else if (response.body.details.task_type === IMAGE_POLYGON_BOUNDING_BOX || response.body.details.task_type === IMAGE_POLYGON_BOUNDING_BOX_V2) {
        projectStats = response.body.imageBoundingBoxStats;
        taskType = response.body.details.task_type;
      } else if (response.body.details.task_type === DOCUMENT_ANNOTATION) {
        projectStats = response.body.documentTaggingStats;
        taskType = DOCUMENT_ANNOTATION;
      } else if (response.body.details.task_type === POS_TAGGING_GENERIC) {
        projectStats = response.body.documentTaggingStats;
        taskType = POS_TAGGING_GENERIC;
      } else if (response.body.details.task_type === VIDEO_BOUNDING_BOX) {
        projectStats = response.body.videoBoundingBoxStats;
        taskType = VIDEO_BOUNDING_BOX;
      }
      this.setState({ projectStats, taskType, loading: false });
    }
  }


  handleSubmit = (response) => {
    console.log('response', response, this.props.login);

    if (response && response.profileObj) {
      this.props.login(response.profileObj.name, response.profileObj.imageUrl);
    }
  }


  render() {
    console.log('visualize state is ', this.state, this.props);
    const { projectStats, taskType } = this.state;
    const { projectDetails } = this.props;
    let pageTitle = 'Visualize';
    let pageDescription = 'Just upload your data, invite your team members and start tagging. The best way to tag training/evaluation data for your machine learning projects.';
    if (projectDetails) {
      pageTitle = projectDetails.name + ' ' + pageTitle;
      if (projectDetails.shortDescription) {
        pageDescription = projectDetails.shortDescription;
      }
      if (projectDetails.subtitle) {
        pageTitle = projectDetails.subtitle + ' ' + pageTitle;
      }
    }

    return (
      <div className="taggerPages">
        <div id="back-img-dflt"></div>
          <Helmet title={pageTitle}>
            <meta property="og:title" content={pageTitle} />
            <meta name="description" content={pageDescription} />
            <meta property="og:description" content={pageDescription} />
          </Helmet>
                      {
                          <div>
                      {
                          <div>
                            <Segment basic size="large" loading={this.state.loading} style={{ backgroundColor: '#EEEEEE', width: '104%' }}>
                              <Button className="pull-left" onClick={() => this.props.pushState('/projects/' + this.props.params.orgName + '/' + this.props.params.projectName)} compact positive style={{ fontSize: '1.25rem', padding: '1rem' }}><Icon name="arrow left" />Project</Button>

                              <div className="text-center" style={{ width: '70%', marginLeft: '21.75%' }}>
                                <Breadcrumb size="big" style={{ fontSize: '1.45rem', padding: '1rem', marginLeft: '-6rem', width: '80%', fontWeight: 'bold', backgroundColor: '#EEEEEE' }}>
                                  <Breadcrumb.Section link onClick={ () => this.props.pushState('/projects/') }>
                                    <i className="fa fa-user-o" aria-hidden="true" style={{ marginRight: '0.5rem' }}></i>
                                    {this.props.params.orgName}
                                  </Breadcrumb.Section>
                                  <Breadcrumb.Divider />
                                  <Breadcrumb.Section link onClick={ () => this.props.pushState('/projects/' + this.props.params.orgName + '/' + this.props.params.projectName)} style={{ overflowWrap: 'break-word !important' }}>
                                    {this.props.params.projectName}
                                  </Breadcrumb.Section>
                                </Breadcrumb>
                              </div>

                              <div className="text-right">
                                  <Button size="tiny" positive className="pull-right" onClick={() => this.loadProjectDetails(this.props.currentProject, false)} compact style={{ fontSize: '1.25rem', padding: '1rem', marginTop: '-3.5rem', marginLeft: '1rem' }}><Icon name="refresh" />Refresh</Button>
                              </div>
                            </Segment>
                          </div>
                      }
                      <br />

                            { projectStats && taskType !== DOCUMENT_ANNOTATION && taskType !== VIDEO_CLASSIFICATION && taskType !== POS_TAGGING_GENERIC && taskType !== IMAGE_CLASSIFICATION && taskType !== IMAGE_BOUNDING_BOX && taskType !== IMAGE_POLYGON_BOUNDING_BOX && taskType !== VIDEO_BOUNDING_BOX && taskType !== IMAGE_POLYGON_BOUNDING_BOX_V2 &&
                            <div className="text-center col-md-12">
                            <Segment basic vertical textAlign="center" loading={this.state.loading}>
                              <Header as="h2" style={{ fontSize: '2.5rem' }}>Project Insights</Header>
                            <div>
                            <br />
                            <br />

    

                              <Statistic.Group size="mini" widths="three">
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">{projectStats.totalUniqWords}</Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Unique Words</Statistic.Label>
                                </Statistic>
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">{(projectStats.totalWords / projectStats.totalUniqWords).toPrecision(2)}</Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Word Frequency</Statistic.Label>
                                </Statistic>
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">
                                    {projectStats.totalWords}
                                  </Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Total Words</Statistic.Label>
                                </Statistic>
                              </Statistic.Group>
                            </div>
                            <br />
                            <br />
                            <div className="marginTopExtra col-md-12">
                            <div className="col-md-6">
                              { projectStats.leastFrequentWords && projectStats.leastFrequentWords.length > 0 &&
                              <div className="marginTop">
                                <h4 style={{ fontSize: '2rem' }}> Least frequent words </h4>
                                {this.getWordsChart(projectStats.leastFrequentWords)}
                              </div>
                              }
                            </div>
                            <div className="col-md-6">
                              {projectStats.mostFrequentWords && projectStats.mostFrequentWords.length > 0 &&
                              <div className="marginTop">
                                <h4 style={{ fontSize: '2rem' }}> Most frequent words </h4>
                                {this.getWordsChart(projectStats.mostFrequentWords)}
                              </div>
                              }
                            </div>
                            </div>
                            </Segment>
                           </div>
                          }
                      <br />


                            { projectStats && (taskType === POS_TAGGING) &&
                            <div className="text-center col-md-12">
                            <Segment basic vertical textAlign="center" loading={this.state.loading}>
                              <Header as="h2" style={{ fontSize: '2.5rem' }}>Insights from completed HITs</Header>
                            <div>
                            <br />
                            <br />
                              <Statistic.Group size="mini" widths="three">
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">{projectStats.totalUniqWordsWithLabels}</Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Unique Words</Statistic.Label>
                                </Statistic>
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">{(projectStats.totalWordsWithLabels / projectStats.totalUniqWordsWithLabels).toPrecision(2)}</Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Word Frequency</Statistic.Label>
                                </Statistic>
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">
                                    {projectStats.totalWordsWithLabels}
                                  </Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Total Words</Statistic.Label>
                                </Statistic>
                              </Statistic.Group>
                            </div>
                            </Segment>
                           </div>
                          }
                          { (projectStats && taskType === TEXT_SUMMARIZATION || taskType === TEXT_MODERATION || taskType === SENTENCE_TRANSLATION ) &&
                            <div className="text-center col-md-12">
                            <Segment basic vertical textAlign="center" loading={this.state.loading}>
                              <Header as="h2" style={{ fontSize: '2.5rem' }}>Insights from completed HITs</Header>
                            <div>
                            <br />
                            <br />
                              <Statistic.Group size="mini" widths="two">
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">{projectStats.avrWordsInHits}</Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Average Words in HITs</Statistic.Label>
                                </Statistic>
                                <Statistic className="stat-main">
                                  <Statistic.Value className="stat-val">
                                    {projectStats.avrWordsInHitResults}
                                  </Statistic.Value>
                                  <Statistic.Label className="stat-lbl" style={statsLabel}>Average Words in HIT Results</Statistic.Label>
                                </Statistic>
                              </Statistic.Group>
                            </div>
                            </Segment>
                           </div>
                          }

                            { projectStats && ( taskType === POS_TAGGING) &&
                            <div className="text-center col-md-12">
                              <Segment basic vertical textAlign="center" loading={this.state.loading}>
                            <div>
                              {this.getLabelsChart(projectStats.perLabelStat)}
                            </div>
                            </Segment>
                           </div>
                          }

                          { projectStats && (taskType === TEXT_CLASSIFICATION || taskType === SENTENCE_PAIR_CLASSIFIER) &&
                            <div className="text-center col-md-12">
                              <Segment basic vertical textAlign="center" loading={this.state.loading}>
                            <div>
                              {this.getLabelsCountChart(projectStats.labelCounts)}
                            </div>
                            </Segment>
                           </div>
                          }
                          { projectStats && (taskType === IMAGE_CLASSIFICATION  || taskType === VIDEO_CLASSIFICATION || taskType === IMAGE_BOUNDING_BOX  || taskType === VIDEO_BOUNDING_BOX || taskType === IMAGE_POLYGON_BOUNDING_BOX || taskType === IMAGE_POLYGON_BOUNDING_BOX_V2) &&
                            <div className="text-center col-md-12">
                              <Segment basic vertical textAlign="center" loading={this.state.loading}>
                            <div>
                              {this.getLabelsCountChart(projectStats.laeblStats)}
                            </div>
                            </Segment>
                           </div>
                          }
                        { projectStats && (taskType === DOCUMENT_ANNOTATION || taskType === POS_TAGGING_GENERIC) &&
                            <div className="text-center col-md-12">
                              <Segment basic vertical textAlign="center" loading={this.state.loading}>
                            <div>
                              {this.getDocLabelsChart(projectStats.perLabelStat)}
                            </div>
                            </Segment>
                           </div>
                          }

                           { projectStats && ( taskType === TEXT_SUMMARIZATION || taskType === TEXT_MODERATION || taskType === SENTENCE_TRANSLATION ) &&
                            <div className="text-center col-md-12">
                              <Segment basic vertical textAlign="center" loading={this.state.loading}>
                              <div className="marginTop" style={{ paddingLeft: '6%', paddingRight: '6%' }}>
                                <h4 style={{ fontSize: '2rem' }}> Most frequent Excluded Words </h4>
                                {this.getWordsChart(projectStats.mostFrequentExcludedWords)}
                              </div>
                            </Segment>
                           </div>
                          }
                    </div>
              }

        <style>{"\
          .stat-main{\
            background: linear-gradient(45deg,#f9b115 0%,#f6960b 100%) !important;\
            border-color: #f6960b !important;\
            padding: 1rem !important;\
            padding: 2rem !important;\
            width: 33% !important;\
          }\
          .stat-val{\
            color: white !important;\
            font-weight: bold !important;\
            // font-size: 3rem !important;\
          }\
          .stat-lbl{\
            text-transform: initial;\
            font-weight: bold !important;\
            font-size: 1.5rem !important;\
            margin-top: 0.5rem !important;\
            white-space: pre-wrap;\
          }\
          .ui.mini.statistics .statistic>.value {\
            font-size: 3rem!important;\
          }\
        "}</style>

      </div>

    );
  }
}
