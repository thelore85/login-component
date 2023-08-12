import React, {Component} from 'react';
import './Register.css';


class Register extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
    }
  }

  onEmailInput = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  onPswInput = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  onNameInput = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  onSubmit = () => {
    // check if form is complete
    if(this.state.email && this.state.name && this.state.password){


      ////////////////////////////////////////////////////////
      //send register data to the server -> return user info -> upload app.js state
      fetch('http://localhost:9000/register',
      {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name
        })
      })
      .then(response => response.json())
      .then(user => {
        if(user.id){
          this.props.onRouteChange('home');
          this.props.loadUser(user);
        }
        else{console.log('error registration')}
      })
      

    //////////////////////////////////////////
    //send login input data -> return user info -> updata app.js state
    fetch('http://localhost:9000/session-post',
    {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        })
      })
    .then(session => console.log('session post: ', session[0]))


    //////////////////////////////////////
    //session get request -> update last session data and return it
    fetch('http://localhost:9000/session-update',
      {
      method: 'put',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        email: this.state.email, //check if session exist for this email
        last_login : new Date,
        img_search: this.props.img_search,
        entries: this.props.entries
        })
      })
    .then(response => response.json())
    .then(session => {
      if(session.email){
        this.props.loadSession(session)}
      else{console.log('session load: error')}
    })




    }
  }


  render(){
    return(
      <div id="signin">

        <div className="container h-100">
          <div className="d-flex justify-content-center h-100">
            <div className="user_card">

              <div className="d-flex justify-content-center">
                <div className="brand_logo_container">
                  <i className=" brand_logo fa-solid fa-robot"></i>
                </div>
              </div>

              <div className="d-flex justify-content-center form_container">
                <form>

                <div className="input-group mb-3">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-user"></i></span>
                    </div>
                    <input type="text" name="" className="form-control input_user" placeholder="Name" onChange={this.onNameInput}/>
                  </div>

                  <div className="input-group mb-3">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                    </div>
                    <input type="text" name="" className="form-control input_user" placeholder="email" onChange={this.onEmailInput}/>
                  </div>

                  <div className="input-group mb-2">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-key"></i></span>
                    </div>
                    <input type="password" name="" className="form-control input_pass" placeholder="password" onChange={this.onPswInput}/>
                  </div>

                  <div className="form-group"></div>

                  <div className="d-flex justify-content-center mt-3 login_container">
                    <button type="button" name="button" className="btn login_btn" onClick={this.onSubmit}>Register Now</button>
                </div>

                <div className="mt-4">
                <div className="d-flex justify-content-center links">
                  <span className="plain-text">Already an account?</span>
                  <a href="#" onClick={() => this.props.onRouteChange('signin')}className="ml-2">Log In Now</a>
                </div>
              </div>

                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Register;