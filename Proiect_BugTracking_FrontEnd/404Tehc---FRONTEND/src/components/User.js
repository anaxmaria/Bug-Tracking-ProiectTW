import React, {Component} from 'react';

class User extends Component{

    render(){
        
        return (
            
            <tr>
                <td>{this.props.firstName}</td>
                <td>{this.props.lastName}</td>
                <td>{this.props.email}</td>
            </tr>

        )
    }
}

export default User;