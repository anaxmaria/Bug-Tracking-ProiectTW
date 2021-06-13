import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import { Button, Checkbox } from '@material-ui/core';
import $ from 'jquery'

class Bug extends Component{

    constructor(){
        super();

        this.state={
            listIdBugs: []
        }

        this.myRef = React.createRef();
        this.refCheck = React.createRef();
        this.assignBug = this.assignBug.bind(this);
        this.salvareIdBug = this.salvareIdBug.bind(this);
        this.numeStatus = this.numeStatus.bind(this);
    }

    
    salvareIdBug(e){

        let newListIdBugs = JSON.parse(localStorage.getItem("ListIdBugs"))
        if(newListIdBugs == null){
            newListIdBugs = [];
        }

        if(e.target.checked){
            newListIdBugs.push(this.props.idBug)
        }
        else {
            for(let i=0; i<newListIdBugs.length; i++){
                if(newListIdBugs[i]===this.props.idBug){
                    newListIdBugs.splice(i, 1);
                }
            }
        }
       
        this.setState({
            listIdBugs: newListIdBugs
        });
    
        localStorage.setItem("ListIdBugs", JSON.stringify(newListIdBugs));
    }


    numeStatus(){
        if(this.props.status==1)
            return "unassigned"
        else if(this.props.status==2)
            return "inProgress"
            else if(this.props.status==3)
            return "finished"

    }

    render(){
        
        return (
            <tr>
                
                <td>{this.props.severity}</td>
                <td>{this.props.priority}</td>
                <td>{this.props.description}</td>
                <td>{this.props.commit}</td>
                <td>{this.numeStatus()}</td>
                <td>{this.props.assigned_user}</td>
                <td><Button id="btnAssignBug" ref={this.myRef} onClick={this.assignBug}>Assign bug</Button></td>
                <td><Checkbox ref={this.refCheck} onClick={this.salvareIdBug}></Checkbox></td>
            </tr>

        )
    }

    componentDidMount(){
        this.setVisibility();
    }

    componentDidUpdate(){
        this.setVisibility();
    }

    setVisibility(){
        //setam vizibilitatea butonului de assign
        if(this.props.status === "2" || this.props.status === "3"){
            this.myRef.current.style.visibility = "hidden"
        }
        //setam vizibilitatea checkboxului de commit
        if((""+this.props.userId) == localStorage.getItem("userId") && this.props.status == 2){
            this.refCheck.current.style.visibility = "visible"
        }
        else {this.refCheck.current.style.visibility = "hidden"}
    }

    assignBug(){
        
        //apeleaza api asignare bug
        let context = this;

        $.ajax({
            url: `http://localhost:8000/api/bugs/${context.props.idBug}/users/${localStorage.getItem("userId")}`, 
            method: "PUT",
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            async: false,
            success: function(response){
                context.myRef.current.style.visibility = "hidden"
                context.props.handler();
            }
        });
        
    }
    
}

export default withRouter(Bug);