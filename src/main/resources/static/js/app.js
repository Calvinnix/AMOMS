var Employee = React.createClass({
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
            url: self.props.employee._links.self.href,
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
                    <td>{this.props.employee.username}</td>
                    <td>{this.props.employee.password}</td>
                    <td>{this.props.employee.authorities[0].authority}</td>
                    <td>
                        <button className="btn btn-danger" onClick={this.handleDelete}>✕</button>
                    </td>
                </tr>
            );
        }
    }
});


var EmployeeTable = React.createClass({
    render: function() {
        var rows = [];
        this.props.employees.forEach(function(employee) {
            rows.push(<Employee csrf_element={csrf_element} employee={employee} key={employee.username} />);
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

var App = React.createClass({

    loadEmployeesFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/employees"
        }).then(function (data) {
            self.setState({employees: data._embedded.employees});
        });
    },
    getInitialState: function() {
        return {employees: []};
    },
    componentDidMount: function () {
        this.loadEmployeesFromServer();
    },

    render() {
        return (<EmployeeTable csrf_element={csrf_element} employees={this.state.employees} />);
    }
});

if (document.getElementById('root') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<App csrf_element="{{csrf_element}}"/>, document.getElementById('root'));
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