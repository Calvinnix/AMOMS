var User = React.createClass({
    getInitialState: function() {
        return {display: true,
                editing: false,
                username: this.props.user.username,
                password: '',
                roles: this.props.roles};
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
    handleEdit: function() {
        var self = this;
        self.setState({editing: true});
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
    updateEnabled: function(evt) {
        this.setState({
            enabled: evt.target.value
        });
    },
    render: function() {
        if (this.state.display == false) {
            return null;
        } else if (this.state.editing == true) {
            return (
                <div className="row row-striped">
                      <div className="col-md-2">
                        <input type="text" className="form-control" name="inputUsername" placeholder="Username" value={this.state.username} onChange={this.updateUsername}/>
                      </div>
                      <div className="col-md-4">
                        <input type="password" className="form-control" name="inputPassword" placeholder="New Password" value={this.state.password} onChange={this.updatePassword}/>
                      </div>
                      <div className="col-md-2">
                        <RoleSelect roles={this.state.roles} onChange={this.updateRole} />
                      </div>
                      <div className="col-md-2">
                        <EnabledSelect onChange={this.updateEnabled} />
                      </div>
                      <div className="col-md-1">
                        <button className="btn btn-warning" onClick={this.handleEdit}>
                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </button>
                      </div>
                      <div className="col-md-1">
                        <button className="btn btn-danger" onClick={this.handleDelete}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                      </div>
                </div>
            );
        } else {
            return (
                <div className="row row-striped">
                      <div className="col-md-2">{this.props.user.username}</div>
                      <div className="col-md-4">********</div>
                      <div className="col-md-2">{this.props.user.authorities[0].authority}</div>
                      <div className="col-md-2">{this.props.user.enabled ? 'Enabled' : 'Disabled'}</div>
                      <div className="col-md-1">
                        <button className="btn btn-warning" onClick={this.handleEdit}>
                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </button>
                      </div>
                      <div className="col-md-1">
                        <button className="btn btn-danger" onClick={this.handleDelete}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                      </div>
                </div>
            );
        }
    }
});



var UserTable = React.createClass({
    render: function() {
        var rows = [];
        var roles = this.props.roles;
        this.props.users.forEach(function(user) {
            rows.push(<User csrf_element={csrf_element} user={user} key={user.username} roles={roles} />);
        });
        return (
            <div className="container">
                {rows}
            </div>
        );
    }
});

var Role = React.createClass({
    render: function() {
        var roleName = this.props.role.name;
        if (roleName != null && roleName.length > 5) {
            /**
             * This formats the role name to look nice.
             * i.e. ROLE_ADMIN -> Admin
             */
            roleName = roleName.substring(5).toLowerCase();
            roleName = roleName.charAt(0).toUpperCase() + roleName.slice(1);
        } else {
            roleName = "INVALID";
        }
            return (
                <option value={this.props.role.name}>{roleName}</option>
            );
    }
});

var RoleSelect = React.createClass({
    render: function() {
        var roles = [];
        this.props.roles.forEach(function(role) {
            roles.push(<Role role={role} key={role.name} />);
        });
        return (
            <select className="form-control" name="selectRole" value={this.props.role} onChange={this.props.onChange}>
                {roles}
            </select>
        );
    }
});

var EnabledSelect = React.createClass({
    render: function() {
        return (
            <select className="form-control" name="selectEnabled" value={this.props.enabled} onChange={this.props.onChange}>
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
            </select>
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
    loadRolesFromServer: function () {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/roles"
        }).then(function (data) {
            self.setState({roles: data._embedded.roles});
        });
    },
    handleAddUser: function() {
        var self = this;

        /**
         * The value for this.state.role isn't being set because
         * onChange doesn't always fire. We can probably avoid
         * the below code by setting this value when we create
         * this.state.role.
         */
        if (this.state.role == '') {
            this.state.role = "ROLE_USER";
        }

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
                   enabled: this.state.enabled,
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
        return {users: [],
                roles: [],
                username: '',
                password: '',
                enabled: 'Enabled',
                role: ''};
    },
    componentDidMount: function () {
        this.loadUsersFromServer();
        this.loadRolesFromServer();
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
    updateEnabled: function(evt) {
        this.setState({
            enabled: evt.target.value
        });
    },

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row header-row">
                        <div className="col-md-2"><h5>Username</h5></div>
                          <div className="col-md-4"><h5>Password</h5></div>
                          <div className="col-md-2"><h5>Role</h5></div>
                          <div className="col-md-2"><h5>Enabled</h5></div>
                          <div className="col-md-2"></div>
                     </div>
                     <hr />
                    <div className="row">
                        <div className="col-md-2">
                            <input type="text" className="form-control" name="inputUsername" placeholder="Username" value={this.state.username} onChange={this.updateUsername}/>
                        </div>
                        <div className="col-md-4">
                            <input type="password" className="form-control" name="inputPassword" placeholder="Password" value={this.state.password} onChange={this.updatePassword}/>
                        </div>
                        <div className="col-md-2">
                            <RoleSelect roles={this.state.roles} onChange={this.updateRole} />
                        </div>
                        <div className="col-md-2">
                            <EnabledSelect onChange={this.updateEnabled} />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-success" onClick={this.handleAddUser}>Add User</button>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                      <input id="inputSearch" type="text" className="form-control" placeholder="Search" />
                    </div>
                    <hr />
                </div>
                <UserTable csrf_element={csrf_element} users={this.state.users} roles={this.state.roles} />
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