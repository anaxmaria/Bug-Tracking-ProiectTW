import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import ProjectForTesters from './ProjectForTesters';
import $ from 'jquery'

class ProjectsForTesters extends Component {

    constructor() {
        super();

        this.state = {
            projects: [{
                name: "",
                repo: "",
                id: "",

                users: [
                    { id: "", name: "" }
                ]
            }],
            listIdProjects: [
                { id: "" }
            ],
            severity: "",
            description: "",
            priority: ""

        }

        this.adaugaBugLaProiect = this.adaugaBugLaProiect.bind(this);
        this.inputBugPriority = this.inputBugPriority.bind(this);
        this.inputBugDescription = this.inputBugDescription.bind(this);
        this.inputBugSeverity = this.inputBugSeverity.bind(this);

    }

    fetch() {

        let context = this;

        //luam toate proiectele
        $.ajax({
            url: "http://localhost:8000/api/projects",
            method: "GET",
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            async: false,
            success: function (response) {
                let customProjects = [...response];
                for (let i = 0; i < customProjects.length; i++){
                    //luam toti userii pt proiectul nostru
                    $.ajax({
                        url: `http://localhost:8000/api/users?projectId=${customProjects[i].id}`,
                        method: "GET",
                        beforeSend: function name(xhr) {
                            xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
                        },
                        async: false,
                        success: function (response) {
                            customProjects[i].users = response;
                        }
                    });


                }

                context.setState({
                    projects: customProjects
                })

            }
        });

    }


    componentDidMount() {

        this.fetch();
        localStorage.setItem("projectIds", JSON.stringify([]))
    }




    inputBugSeverity(e) {
        this.setState(prevState => ({
            ...prevState,
            severity: e.target.value
        }));
    }

    inputBugPriority(e) {
        this.setState(prevState => ({
            ...prevState,
            priority: e.target.value
        }));
    }

    inputBugDescription(e) {
        this.setState(prevState => ({
            ...prevState,
            description: e.target.value
        }));
    }



    adaugaBugLaProiect() {

        let context = this;

        if (localStorage.getItem("projectIds") !== null) {

            for (let i = 0; i < this.state.projects.length; i++) {
                //verificam daca proiectul e bifat
                if (JSON.parse(localStorage.getItem("projectIds")).includes(this.state.projects[i].id)) {
                    //api pentru creare bug pentru id-ul asta

                    $.ajax({
                        url: `http://localhost:8000/api/projects/${this.state.projects[i].id}/bugs`,
                        data: {     severity: this.state.severity,
                                    priority: this.state.priority,
                                    description: this.state.description},
                        method: "POST",
                        beforeSend: function name(xhr) {
                            xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
                        },
                        success: function (response) {
                            alert("Bug a fost adaugat cu succes!");
                        }, 
                        error: function (response) {
                            alert("Date bug invalide!");
                        }
                    })

                }
            }
        }
        else{
            alert("Selectati cel putin un proiect!");
        }
    }

    render() {
        return (<div>
            <h2 id="idListaProiecte">Lista proiecte</h2>
            <table id="idTableProjectsForTesters">
                <thead>
                    <tr>
                        <td>Nume</td>
                        <td>Repo</td>
                        <td>Intra in proiect</td>
                        <td>Adauga bug</td>
                    </tr>
                </thead>

                <tbody>
                    {this.state.projects.map((project, index) => {
                        return <ProjectForTesters users={project.users} name={project.name} repo={project.repo} projectId={project.id} key={index}
                        ></ProjectForTesters>
                    })}

                </tbody>
            </table>

            <br></br><br></br><br></br>
            <label id="idAddProject">Adauga bug la proiect</label> <br></br>

            <div style={{margin:"20px"}}>
            <div>
                <input id="inputSeverity" type="text" placeholder="severity" onChange={this.inputBugSeverity}></input>
            </div>

            <div>
                <input id="inputPriority" type="text" placeholder="priority" onChange={this.inputBugPriority}></input>
            </div>

            <div>
                <input id="inputDescription" type="text" placeholder="description" onChange={this.inputBugDescription}></input>
            </div>
            </div>

            <div>
                <Button id="btnAdaugaBug" style={{margin:"20px"}} variant={"contained"} onClick={this.adaugaBugLaProiect}>Adauga bug</Button>
            </div>
        </div>)
    }
}

export default ProjectsForTesters;