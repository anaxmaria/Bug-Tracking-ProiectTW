import React, {Component} from 'react';
import Project from './Project';
import $ from 'jquery'

class Projects extends Component{

    constructor(){
        super();
        this.state={
            teamId: "",
            projects: [{
                name: "",
                repo: "",
                id: ""
            }]
        }
    }
    render(){
        return (<div>
            <table id="idTabelProjects">
                <thead>
                    <tr>
                        <td>Nume</td>
                        <td>Repo</td>
                        <td>Actiuni</td>
                    </tr>
                </thead>

                <tbody>
                {this.state.projects.map((project, index) => {
                    return <Project name={project.name} repo={project.repo} projectId = {project.id} key={index} ></Project>
                })} 
                </tbody>
            </table>
        </div>)
    }

    componentDidMount(){
        this.setState({
            teamId: localStorage.getItem("teamId")
        });
        this.fetch();
    }

    fetch(){

        let context = this;

        //luam toate proiectele cu team id-ul din state

         $.ajax({
            url: `http://localhost:8000/api/projects?teamId=${localStorage.getItem("teamId")}`, 
            method: "GET",
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            success: function(response){
                context.setState({
                    projects: response
                })
            }
        });
    }
}
export default Projects;