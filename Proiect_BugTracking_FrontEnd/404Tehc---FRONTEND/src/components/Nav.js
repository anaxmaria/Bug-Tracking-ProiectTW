import React, {Component} from 'react';
import {AppBar, Toolbar, Button, Typography} from '@material-ui/core'
import {withRouter} from 'react-router-dom'
class Nav extends Component{

    render(){
        const props = this.props;
        console.log(props);
        return (
            <React.Fragment>
                <AppBar id="nav" style={{position: "relative"}}>
                    <Toolbar>
                        <Typography variant="h6">
                            <Button id="btnLogout" style={{color: "white"}}
                                    onClick={()=> {
                                        props.history.push("/")
                                        localStorage.setItem("token", "")
                                        localStorage.setItem("userId", "")
                                    }}
                            >
                                Logout
                            </Button>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}

export default withRouter(Nav);