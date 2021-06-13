import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import Bug from "./Bug"
import $ from 'jquery'

class Bugs extends Component {


    constructor() {
        super();

        this.state = {
            bugs: [
                {
                    repo: "",
                    severity: "",
                    priority: "",
                    description: "",
                    commit: "",
                    status: "",
                    assigned_user: "",
                    userId: "",
                    id: ""

                }
            ],
            users: [{
                id: "",
                firstName: "",
                lastName: ""
            }],
            commitMessageInput: ""
        }

        this.rezolvareBug = this.rezolvareBug.bind(this);
        this.inputCommit = this.inputCommit.bind(this);
        this.handler = this.handler.bind(this)
    }


    componentDidMount() {
        this.fetch();
    }



    fetch() {

        let context = this;
        //luam lista de useri filtrata dupa team id (team id e in local Storage)

        $.ajax({
            url: `http://localhost:8000/api/users?teamId=${localStorage.getItem("teamId")}`,
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

        //pt fiecare proiect afisam bug-urile
        $.ajax({
            url: `http://localhost:8000/api/bugs?projectId=${localStorage.getItem("projectId")}`,
            method: "GET",
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            success: function (response) {
                context.setState({
                    bugs: response
                })
            }
        });

    }

    rezolvareBug() {

        let context = this;
        //apeleaza api de rezolvare bug
        const listIdBugs = JSON.parse(localStorage.getItem("ListIdBugs"));
        console.log(listIdBugs)

        for (let i = 0; i < listIdBugs.length; i++) {
            $.ajax({
                url: `http://localhost:8000/api/bugs/${listIdBugs[i]}/resolve`,
                data: { commit: context.state.commitMessageInput },
                method: "PUT",
                beforeSend: function name(xhr) {
                    xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
                },
                success: function (response) {
                    context.fetch()
                    localStorage.setItem("ListIdBugs", JSON.stringify([]));
                }
            });

        }



    }
    //pt fiecare bug luam userul asignat
    getAssginedUserById(userId) {
        for (let i = 0; i < this.state.users.length; i++) {
            if (this.state.users[i].id === userId) {
                return this.state.users[i].firstName + " " + this.state.users[i].lastName;
            }
        }
    }

    inputCommit(e) {
        this.setState(prevState => ({
            ...prevState,
            commitMessageInput: e.target.value
        }));
    }

    handler() {
        this.fetch();
    }

    render() {

        return (<div>
            <h2 id="h2ListOfBugs">List of bugs</h2>
            <table id="idTabelBugs">
                <thead>
                    <tr>

                        <td>Severity</td>
                        <td>Priority</td>
                        <td>Description</td>
                        <td>Commit</td>
                        <td>Status</td>
                        <td>Assigned user</td>
                        <td>Actions</td>
                        <td>Commit to</td>
                    </tr>
                </thead>

                <tbody>
                    {this.state.bugs.map((bug, index) => {
                        return <Bug userId={bug.userId} idBug={bug.id} repo={bug.repo} severity={bug.severity} priority={bug.priority}
                            description={bug.description} commit={bug.commit} status={bug.status}
                            assigned_user={this.getAssginedUserById(bug.userId)} key={index} handler={this.handler} ></Bug>
                    })}
                </tbody>
            </table>
            <br></br><br></br><br></br>
            <div>
                <div>
                    <label for="commit">Commit message</label> <br></br>
                    <input id="idInputCommit" type="text" placeholder="Commit message" onChange={this.inputCommit}></input>
                </div>
                <br></br>
                <div>
                    <Button id="btnRezolvareBug" variant="contained" onClick={this.rezolvareBug}>Rezolvare bug</Button>
                </div>

            </div>
        </div>)
    }
}

export default Bugs;