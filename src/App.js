import React, {Component} from "react";
import { Col } from "reactstrap";
import { Input, Divider, Button, message, Checkbox, Spin, Modal } from "antd"
import Logo from "./image/Ercot_Logo.png"
import {ApiService} from "./services/ApiService";
import "./App.scss";

class App extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      isDefault: true,
      newUser: {}
    }
  }

  onSubmit = async () => {
    const { newUser } = this.state
    newUser.locked = false
    newUser.department = "Accounting"
    newUser.userType = "employee"
    newUser.active = true
    newUser.displayName = `${newUser.firstname} ${newUser.lastName}`
    this.setState({
      isSaving: true
    })
    const data = await this._apiService.createUser(newUser)
    if (!data || data.error) {
      message.error('something is wrong! please try again');
      this.setState({
        isSaving: false
      })
    } else {
      Modal.success({
        content: 'Thanks You. You have been registered successfully. Please check your admin email address.',
        okText: 'Close'
      })
      this.setState({
        isSaving: false,
        newUser: {
          active: true
        },
        searchUser: ''
      })
    }
  }

  onChange = (event) => {
    const { name, value } = event.target
    const { newUser, isDefault } = this.state
    newUser[name] = value
    if(isDefault && name === "emails") {
      newUser.userName = value
    }
    this.setState({
      newUser
    })
  }

  onCheckChange = (event) => {
    const { checked } = event.target
    const { newUser } = this.state
    if(checked) {
      newUser.userName = newUser.emails
    }
    this.setState({
      isDefault: checked,
      newUser
    })
  }

  render() {
    const { newUser, isDefault, isSaving } = this.state
    const { organization, firstname, lastName, emails, userName } = newUser || {}
    return (
      <div className="bg-whitesmoke">
        <div className="wrapper wrapper--w680 header-background" style={{height: 110}}>
          <div className="header-design">
            <img src={Logo} alt="banner-img" className="img-fluid" style={{height: 80}}/>
            <h3 className="as-center"><b>Onboard New Market Participant Entity</b></h3>
          </div>
          <div style={{borderBottom: '10px solid #00acc8'}}/>
        </div>

        <div className="page-wrapper bg-whitesmoke p-t-50 p-b-100 font-robo">
          <div className="wrapper wrapper--w680">
            <div className="card card-1">
              <div className="org-form-header">
                Registration Form
              </div>
              <div className="card-body">
                <Col md={2} sm={12} xs={12}>
                  <h4>Organization Name</h4>
                </Col>
                <Col md={4} sm={12} xs={12}>
                  <Input
                    className="mt-10"
                    name="organization"
                    value={organization}
                    onChange={this.onChange}
                  />
                </Col>
                <Divider/>
                <h4>Admin Details</h4>
                <Col md={2} sm={12} xs={12}>
                  <span className="form-label">First Name</span>
                </Col>
                <Col md={4} sm={12} xs={12}>
                  <Input
                    className="mt-10"
                    name="firstname"
                    value={firstname}
                    onChange={this.onChange}
                  />
                </Col>
                <Col md={2} sm={12} xs={12} className="mt-10">
                  <span className="form-label">Last Name</span>
                </Col>
                <Col md={4} sm={12} xs={12}>
                  <Input
                    className="mt-10"
                    name="lastName"
                    value={lastName}
                    onChange={this.onChange}
                  />
                </Col>
                <Col md={2} sm={12} xs={12} className="mt-10">
                  <span className="form-label">Email</span>
                </Col>
                <Col md={4} sm={12} xs={12}>
                  <Input
                    className="mt-10"
                    name="emails"
                    value={emails}
                    onChange={this.onChange}
                  />
                </Col>
                <Col md={2} sm={12} xs={12} className="mt-10">
                  <span className="form-label">User Name</span> <div className="float-right"><span className="form-label">Same as Email</span> <Checkbox checked={isDefault} onChange={this.onCheckChange}/></div>
                </Col>
                <Col md={4} sm={12} xs={12}>
                  <Input
                    className="mt-10"
                    name="userName"
                    value={userName}
                    onChange={this.onChange}
                    disabled={isDefault}
                  />
                </Col>
                <Button
                  className="mt-20"
                  size="large"
                  style={{background: '#00acc8', color: 'white'}}
                  onClick={this.onSubmit}
                  disabled={!organization || !firstname || !lastName || !emails || !userName}
                >
                  {
                    isSaving ? <Spin className='color-white mr-10'/> : null
                  }
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
