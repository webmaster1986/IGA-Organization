import React, { Component } from 'react';
import Auth from './Auth';
import { Select } from 'antd';
import { PropagateLoader } from 'react-spinners';
import { Button, Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
const auth = new Auth();
const Option = Select.Option;

class Redirect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      connections : [],
      selectedVersion: '',
      loading: true,
    };
    if (localStorage.getItem('accessToken')) {
      auth.checkSession((data) => {
        if (data) {
          const connections = (data.idTokenPayload && data.idTokenPayload['https://login.dietechsoftware.com/app_metadata']
            && data.idTokenPayload['https://login.dietechsoftware.com/app_metadata'].connections) || [];
          if (connections.length === 1) {
            return this.setState({
              selectedVersion: connections[0].PKey_Connection,
              connections
            }, () => this.onRedirect());
          }
          this.setState({
            connections,
            loading: false,
          });
        } else {
          props.history.push('/login');
        }
      });
    } else {
      props.history.push('/login');
    }

  }

  onChange = (value) => {
    this.setState({
      selectedVersion: value,
    });
  }

  onRedirect = () => {
    const { selectedVersion, connections } = this.state;
    if (selectedVersion) {
      const item = connections.find(x=> x.PKey_Connection === selectedVersion);
      if (item) {
        localStorage.setItem('key_connection', selectedVersion);
        localStorage.setItem('SerialNumber', item.SerialNumber);

        window.location.href = '/' + item.Version;
      }
    }
  }

  logOut = () => {
    auth.logout();
  }


  render() {
    const {connections, loading, selectedVersion} = this.state;
    return (
      <div className="app flex-row align-items-center" style={{background: '#f2f2f2'}}>
        <Container>
          <Row className="justify-content-center">
            <Col xs="12" sm="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody className="text-center">
                    <h1 className="text-primary mb-1 font-weight-bold">Dietech</h1>
                    <p className="text-muted text-center">Please select which facility from Dietech you would like to launch</p>
                    <Row className="mt-2">
                      <Col xs="12">
                        {
                          loading ? <div className="loading">{' '}<PropagateLoader color={'#165d93'} /></div> :
                            <>
                              <Select
                                showSearch
                                optionFilterProp="children"
                                onChange={this.onChange}
                                placeholder="Select a Customer"
                                className="w-100"
                                filterOption={(input, option) =>
                                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {
                                  connections.map(item => {
                                    return <Option value={item.PKey_Connection}>{`${item.FacilityName} ${item.FacilityCityStateZip}`}</Option>
                                  })
                                }
                              </Select>
                              <div style={{marginTop: 20}}>
                                <Button color="primary" className="px-4 w-100" onClick={this.onRedirect}>Continue to App</Button>
                              </div>
                              <div style={{marginTop: 20}}>
                                <Button color="secondary" className="px-4 w-100" onClick={this.logOut}>Logout</Button>
                              </div>
                            </>
                        }
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Redirect;
