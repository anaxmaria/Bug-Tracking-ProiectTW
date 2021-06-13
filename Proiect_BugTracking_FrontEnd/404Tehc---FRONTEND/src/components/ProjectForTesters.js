import { Button, Checkbox } from '@material-ui/core';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import $ from 'jquery'

class ProjectForTesters extends Component{

    constructor(props){
        super(props);

        this.state={
            users: props.users
        }

        this.refCheck = React.createRef();
        this.refBtn = React.createRef();

        this.asignareTesterLaProiect = this.asignareTesterLaProiect.bind(this);
        this.checkboxChange = this.checkboxChange.bind(this)
    }

    asignareTesterLaProiect(){
        //se apeleasa api ul pentru asignare tester la proiect
        
        let context  = this;
        
        $.ajax({
            url: ` http://localhost:8000/api/project/${context.props.projectId}/users/${localStorage.getItem("userId")}`, 
            method: "POST",
            beforeSend: function name(xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem("token"))
            },
            async: false,
            success: function(response){
               let newUsers = [...context.state.users]
               newUsers.push(response)
               context.setState({
                   users: newUsers
               })
            }
        });

       
    }


    checkboxChange(e){
        const iduri = JSON.parse(localStorage.getItem("projectIds"));
       if(e.target.checked){
           iduri.push(this.props.projectId)
       }
       else {
        for(let i=0; i<iduri.length; i++){
            if(iduri[i]===this.props.projectId){
                iduri.splice(i, 1);
            }
        }
       }
       localStorage.setItem("projectIds", JSON.stringify(iduri))
       console.log(localStorage)
    }

    componentDidMount(){
       
        this.updateUserCheckBox();
    }



    updateUserCheckBox(){
        
        //la inceput toate checkbox urile sunt ascunse. 
        //se afiseaza doar daca dai pe "intra in proiect" sau daca testeru e deja in prj

        this.refCheck.current.style.visibility = "hidden"

        for(let i=0; i<this.state.users.length; i++){
            const idString = ""+this.state.users[i].id
            if(idString === localStorage.getItem("userId")){
                this.refCheck.current.style.visibility = "visible"
                this.refBtn.current.style.visibility = "hidden"
            }
        }     
    }

    componentDidUpdate(){
        //daca ceva e checked sa luam id-u proiectului si sa il trimitem 
        if(this.refCheck.current.checked){
            localStorage.setItem("idprj", this.props.projectId);
        }
        this.updateUserCheckBox();
       
    }

    render(){
        return (
            
              <tr>
                <td>{this.props.name}</td>
                <td>{this.props.repo}</td>
                <td>
                <div>
                <Button id="btnOk" ref={this.refBtn} variant={"contained"} onClick={this.asignareTesterLaProiect} >Ok</Button>
                </div>
                </td>
                <td>
                <Checkbox onChange={this.checkboxChange} ref={this.refCheck}></Checkbox>
                </td>
            </tr>
            
        )
    }

}
export default withRouter(ProjectForTesters);