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

  // onEmailInput
  onEmailInput = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  //onPswInput
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

  ///onSubmit
  onSubmit = () => {

    console.log('submit click')
    console.log('state', this.state)
 
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
    .then(data => {
      if(data){this.props.onRouteChange('home')}
      else{console.log('error registration')}
    })



    //> IF resp. OK => rute user to "home" 

    // onRouteChange('home')

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
                      <span className="input-group-text"><i class="fa-solid fa-envelope"></i></span>
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
                  <a href="#" onClick={() => onRouteChange('signin')}className="ml-2">Log In Now</a>
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