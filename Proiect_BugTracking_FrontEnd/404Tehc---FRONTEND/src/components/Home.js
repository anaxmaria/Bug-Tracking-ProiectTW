import React, { Component } from 'react';
import { Button, Typography, ButtonGroup } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import PhotoIcon from '@material-ui/icons/Photo'
import { withRouter } from 'react-router-dom'
import User from "./User"
import $ from 'jquery'

class Home extends Component {

    constructor() {
        super();
        const props = this.props;

        this.state = {
            users: [{
                firstName: "",
                lastName: "",
                email: "",
                userId: ""
            }],
            team: {
                name: "",
                id: ""
            },
            repo: "",
            projectName: ""
        }
        this.creareProiect = this.creareProiect.bind(this);
        this.inputProiectNume = this.inputProiectNume.bind(this);
        this.inputProiectRepo = this.inputProiectRepo.bind(this);
        this.goToProjectList = this.goToProjectList.bind(this);

    }

    fetch() {

        let context = this;
        let team = this.state.team;

        //apelam api-ul pentru info de echipa si setam numele echipei

        $.ajax({
            url: "http://localhost:8000/api/teams",
            method: "GET",
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            success: function (response) {
                context.setState({
                    team: response[0]
                })
                team = response[0];

                localStorage.setItem("teamId", "" + team.id);

                //apelam api-ul de lista de useri si setam this.state.users
                $.ajax({
                    url: `http://localhost:8000/api/users?teamId=${team.id}`,
                    method: "GET",
                    beforeSend: function name(xhr) {
                        xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
                    },
                    success: function (response) {
                        context.setState({
                            users: response
                        })
                    }
                });

            }
        });


    }

    componentDidMount() {
        this.fetch();
    }

    creareProiect() {
        //apelam api-ul de creare proiect (vom adauga by default toti userii din lista noastra)

        let context = this;

        $.ajax({
            url: `http://localhost:8000/api/teams/${this.state.team.id}/projects/`,
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            data: {
                repo: this.state.repo,
                name: this.state.projectName,
                userIds: this.state.users.map((user) => {
                    return "" + user.id
                })
            },
            method: "POST",
            success: function (response) {
                alert("Proiect creat")
            }

        });




        console.log(this.state.projectName);
    }

    inputProiectNume(e) {
        this.setState(prevState => ({
            ...prevState,
            projectName: e.target.value
        }));
    }

    inputProiectRepo(e) {
        this.setState(prevState => ({
            ...prevState,
            repo: e.target.value
        }));
    }

    goToProjectList() {
        this.props.history.push("/projects");
    }

    render() {
        const props = this.props;
        return (<div id="divHome">

            <div id="divEchipa">
                <Typography id="idNumeEchipa" variant="h6">Echipa {this.state.team.name}</Typography>
                <br></br>
                <Button id="btnListaProiecte" variant="contained" onClick={this.goToProjectList}>Lista proiecte</Button>

                <div id="divTeamMates">
                    <table id="tabelTeammates">
                        <thead id="theadTeamMates">
                            <tr>
                                <td>Nume</td>
                                <td>Prenume</td>
                                <td>Email</td>
                            </tr>
                        </thead>
                        <tbody id="tbodyTeamMates">
                            {this.state.users.map((user, index) => {
                                return <User lastName={user.lastName} firstName={user.firstName} email={user.email} key={index} ></User>
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
            <br></br><br></br>


            <div id="divCreareProiect">
                <h2 id="idCreareProiect">Creare proiect</h2>


                <input id="inputRepo" type="text" placeholder="repo" onChange={this.inputProiectRepo}></input>
                <br></br>
                <input id="inputProiect" type="text" placeholder="nume proiect" onChange={this.inputProiectNume}></input>
                <br></br>
                <br></br>
                <Button id="btnAdaugaProiect" variant="contained" onClick={this.creareProiect}>Adauga proiect</Button>
            </div>
        </div>
        )
    }
}

export default withRouter(Home);