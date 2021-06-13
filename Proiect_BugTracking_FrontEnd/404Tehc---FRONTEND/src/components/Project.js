import { Button } from '@material-ui/core';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import $ from 'jquery'

class Project extends Component{

    constructor(){
        super();

        this.state={
            isDeleted: false
        }

        this.veziBuguri = this.veziBuguri.bind(this);
        this.stergeProiect = this.stergeProiect.bind(this);
    }

    render(){

        if(this.state.isDeleted){
            return ""
        }
        else
        return (
              <tr>
                <td>{this.props.name}</td>
                <td>{this.props.repo}</td>
                <td>
                    <div>
                    <Button id="btnVeziBugs" onClick={this.veziBuguri} >Vezi buguri</Button>
                    <br></br>
                    <Button id="btnStergeProiect" onClick={this.stergeProiect} >Sterge proiect</Button>
                    </div>
                </td>
            </tr>
            
        )
    }


    stergeProiect(){
        //apelare api de stergere proiect

        let context = this;

        $.ajax({
            url: `http://localhost:8000/api/project/${context.props.projectId}`, 
            method: "DELETE",
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            success: function(response){
                context.setState({
                    isDeleted: true
                })
            }
        });
       
    }

    veziBuguri(){
        localStorage.setItem("projectId", this.props.projectId)
        this.props.history.push("/bugs");
    }
}
export default withRouter(Project);