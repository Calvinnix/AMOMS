var User = React.createClass({
    getInitialState: function() {
        return {display: true};
    },
    handleDelete() {
        var self = this;
        if (csrf_element !== null) {
          $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
             jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
          });
        }
        $.ajax({
            url: self.props.user._links.self.href,
            type: 'DELETE',
            success: function(result) {
                self.setState({display: false});
            },
            error: function(xhr, ajaxOptions, thrownError) {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.error("Not Authorized");
            }
        });
    },
    render: function() {
        if (this.state.display == false) {
            return null;
        } else {
            return (
                <tr>
                    <td>{this.props.user.username}</td>
                    <td>{this.props.user.password}</td>
                    <td>{this.props.user.authorities[0].authority}</td>
                    <td>
                        <button className="btn btn-danger" onClick={this.handleDelete}>✕</button>
                    </td>
                </tr>
            );
        }
    }
});


var UserTable = React.createClass({
    render: function() {
        var rows = [];
        this.props.users.forEach(function(user) {
            rows.push(<User csrf_element={csrf_element} user={user} key={user.username} />);
        });
        return (
            <div className="container">
            <table className="table table-striped">
            <thead>
            <tr>
            <th>Username</th><th>Password</th><th>Role</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
            </table>
            </div>
        );
    }
});

var AllUsers = React.createClass({

    loadUsersFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/users"
        }).then(function (data) {
            self.setState({users: data._embedded.users});
        });
    },
    handleAddUser: function() {
        var self = this;
        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/admin/addUser",
            type: "POST",
            data: {username: this.state.username,
                   password: this.state.password,
                   role: this.state.role},
            success: function() {
                self.loadUsersFromServer();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.error("Not Authorized");
            }
        });
    },
    getInitialState: function() {
        return {users: []};
    },
    componentDidMount: function () {
        this.loadUsersFromServer();
    },

    updateUsername: function(evt) {
        this.setState({
            username: evt.target.value
        });
    },

    updatePassword: function(evt) {
        this.setState({
            password: evt.target.value
        });
    },

    updateRole: function(evt) {
        this.setState({
            role: evt.target.value
        });
    },

    render() {
        return (
            <div>
                <div className="container">
                    <h1>Add New User</h1>
                    <div>
                        <div className="form-group">
                            <label for="inputUsername">Username</label>
                            <input type="text" className="form-control" name="inputUsername"
                                   placeholder="Username" value={this.state.username} onChange={this.updateUsername}/>
                        </div>
                        <div className="form-group">
                            <label for="inputPassword">Password</label>
                            <input type="password" className="form-control" name="inputPassword"
                                   placeholder="Password" value={this.state.password} onChange={this.updatePassword}/>
                        </div>
                        <div className="form-group">
                            <label for="selectRole">Role</label>
                            <select className="form-control" name="selectRole" value={this.state.role} onChange={this.updateRole}>
                                <option selected value="ROLE_USER">User</option>
                                <option value="ROLE_ADMIN">Admin</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={this.handleAddUser}>Submit</button>
                    </div>
                </div>
                <UserTable csrf_element={csrf_element} users={this.state.users} />
            </div>
        );
    }
});

if (document.getElementById('allUsers') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<AllUsers csrf_element="{{csrf_element}}"/>, document.getElementById('allUsers'));
}


/*TODO:ctn Eventually will want to convert this code (as well as the login/signup page) to utilize REACT */
/*TODO:ctn some code is repeated... This should be cleaned up */

$("#btnLogin").click(function(e) {
  validateLoginForm($(this), e);
});

$("#btnSignup").click(function(e) {
  validateSignupForm($(this), e);
});

function validateLoginForm(element, e) {
    var username = $("#inputUsername");
    var password = $("#inputPassword");
    var errorMessage = "";

    element.siblings("div.errorDiv").each(function() {
      $(this).remove();
    });

    var usernameErrorMessage = returnUsernameErrorMessage(username);
    if ( usernameErrorMessage.length !== 0 ) {
      errorMessage += usernameErrorMessage;
      username.addClass("invalid");
      username.removeClass("valid");
    } else {
      username.addClass("valid");
      username.removeClass("invalid");
    }

    var passwordErrorMessage = returnPasswordErrorMessage(password);
    if ( passwordErrorMessage.length !== 0 ) {
      errorMessage += passwordErrorMessage;
      password.addClass("invalid");
      password.removeClass("valid");
    } else {
      password.addClass("valid");
      password.removeClass("invalid");
    }

    if (errorMessage.length !== 0) {
      e.preventDefault();
      element.parent().prepend('<div class="errorDiv"><div class="alert alert-danger">'+errorMessage+'</div></div>');
    }
}

function validateSignupForm(element, e) {
    var username = $("#inputUsername");
    var password = $("#inputPassword");
    var confirmPassword = $("#inputConfirmPassword")
    var errorMessage = "";

    element.siblings("div.errorDiv").each(function() {
      $(this).remove();
    });

    var usernameErrorMessage = returnUsernameErrorMessage(username);
    if ( usernameErrorMessage.length !== 0 ) {
      errorMessage += usernameErrorMessage;
      username.addClass("invalid");
      username.removeClass("valid");
    } else {
      username.addClass("valid");
      username.removeClass("invalid");
    }

    var passwordErrorMessage = returnPasswordErrorMessage(password);
    if ( passwordErrorMessage.length !== 0 ) {
      errorMessage += passwordErrorMessage;
      password.addClass("invalid");
      password.removeClass("valid");
    } else {
      password.addClass("valid");
      password.removeClass("invalid");
    }

    var confirmPasswordErrorMessage = returnConfirmPasswordErrorMessage(password, confirmPassword);
    if ( confirmPasswordErrorMessage.length !== 0 ) {
      errorMessage += confirmPasswordErrorMessage;
      confirmPassword.addClass("invalid");
      confirmPassword.removeClass("valid");
    } else {
      confirmPassword.addClass("valid");
      confirmPassword.removeClass("invalid");
    }

    if (errorMessage.length !== 0) {
      e.preventDefault();
      element.parent().prepend('<div class="errorDiv"><div class="alert alert-danger">'+errorMessage+'</div></div>');
    }
}



function returnUsernameErrorMessage(username) {
  var errorMessage = "";
  if (username.val().length < 4) {
    errorMessage += "Username must be 4 or more characters.\n";
  }
  if (username.val().length > 20) {
    errorMessage += "Username must be less than 20 characters.\n";
  }
  return errorMessage;
}

function returnPasswordErrorMessage(password) {
    var errorMessage = "";
    if (password.val().length < 8) {
      errorMessage += "Password must be 8 or more characters.\n";
    }
    if (password.val().length > 32) {
      errorMessage += "Password must be less than 32 characters.\n";
    }
  return errorMessage;
}

function returnConfirmPasswordErrorMessage(password, confirmPassword) {
  var errorMessage = "";
  if (password.val() !== confirmPassword.val()) {
    errorMessage += "The confirmation password does not match.\n";
  }
  return errorMessage;
}