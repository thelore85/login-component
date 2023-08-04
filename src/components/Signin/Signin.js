
import React, { Component } from 'react';
import './Signin.css';

class Signin extends Component {

  constructor(props){
    super(props);
    this.state = {
      signInEmail : '',
      signInPsw : '',
    }
  }
  
  onEmailChange = (event) => {
    this.setState({
      signInEmail : event.target.value,
    })
  }

  onPswChange = (event) => {
    this.setState({
      signInPsw : event.target.value,
    })
  }

  onSubmitSignin = () => {
    fetch('http://localhost:9000/signin',
    {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPsw
       })
      })
    .then(response => response.json())
    .then(data => {
      if(data === 'success'){
        this.props.onRouteChange('home')}
      else{console.log('error log in')}
    })
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
                      <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                    </div>
                    <input id="signInUser" type="text" name="" className="form-control input_user" placeholder="email" onChange={this.onEmailChange}/>
                  </div>
  
                  <div className="input-group mb-2">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-key"></i></span>
                    </div>
                    <input id="signiInPassword" type="password" name="" className="form-control input_pass" placeholder="password" onChange={this.onPswChange}/>
                  </div>
  
                  <div className="d-flex justify-content-center mt-3 login_container">
                      <button type="button" name="button" className="btn login_btn" onClick={this.onSubmitSignin}>Login</button>
                  </div>
  
                </form>
              </div>
          
              <div className="mt-4">

                <div className="d-flex justify-content-center links">
                  <span className="plain-text">No Account?</span>
                  <a href="#" onClick={() => this.props.onRouteChange('register')} className="ml-2">Register Now</a>
                </div>

              </div>
  
            </div>
          </div>
        </div>
  
      </div>
    );


  }
}

export default Signin;