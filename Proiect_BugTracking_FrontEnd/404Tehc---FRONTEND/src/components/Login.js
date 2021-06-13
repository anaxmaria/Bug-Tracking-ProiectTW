import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import $ from 'jquery'

class Login extends Component {

    constructor() {
        super();

        this.state = {
            email: "",
            password: ""
        }
        this.login = this.login.bind(this);
        this.inputEmail = this.inputEmail.bind(this);
        this.inputPassword = this.inputPassword.bind(this);
    }

    inputEmail(e) {
        this.setState(prevState => ({
            ...prevState,
            email: e.target.value
        }));
    }

    inputPassword(e) {
        this.setState(prevState => ({
            ...prevState,
            password: e.target.value
        }));
    }

    login() {
        //apelare api de get users dupa team id

        let context = this;

        $.ajax({
            url: `http://localhost:8000/api/login`,
            data: {
                email: this.state.email,
                password: this.state.password
            },
            method: "POST",
            async: false,
            success: function (response) {
                const currentUserId = response.id;
                const currentUserToken = response.token;

                localStorage.setItem("token", response.token)
                localStorage.setItem("userId", "" + response.id);
                $.ajax({
                    url: "http://localhost:8000/api/teams",
                    method: "GET",
                    beforeSend: function name(xhr) {
                        xhr.setRequestHeader("Authorization", currentUserToken)
                    },
                    success: function (response) {


                        $.ajax({
                            url: `http://localhost:8000/api/users?teamId=${response[0].id}`,
                            method: "GET",
                            async: false,
                            beforeSend: function name(xhr) {
                                xhr.setRequestHeader("Authorization", currentUserToken)
                            },
                            success: function (response) {

                                let isTester = true;
                                for (let i = 0; i < response.length; i++) {
                                    if ("" + response[i].id == currentUserId) {
                                        isTester = false;
                                    }
                                }

                                localStorage.setItem("isTester", JSON.stringify(isTester));

                                if (isTester) {
                                    context.props.history.push("/testers");
                                }
                                else {
                                    context.props.history.push("/home");
                                }
                            }
                        });


                    }
                });



            },
            error: function () {
                alert("date invalide")
            }
        });


    }

    render() {

        return (
            <div>
                <h2 id="idLogIn">Log in</h2>
                <br></br>
                <div>
                    <input id="inputEmail" type="text" onChange={this.inputEmail} placeholder="Introduceti email-ul"></input>
                </div>
                <br></br>
                <div>
                    <input id="inputPassword" type="password" onChange={this.inputPassword} placeholder="Introduceti parola"></input>
                </div>
                <br></br>
                <br></br>
                <div>
                    <Button id="btnLogin" variant="contained" onClick={this.login}>Log in</Button>
                </div>

            </div>

        )
    }
}

export default Login;