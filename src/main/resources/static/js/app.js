/**
The class acts as the handler for the User objects.

Methods:

*GetInitialState
*loadUsersFromServer
*handleDelete
*handleEdit
*handleEditChange
*handleEditCancel
*updateUsername
*updatePassword
*updateRole
*updateEnabled
*render

*/
var User = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
        roles:        React.PropTypes.array.isRequired,
        user:         React.PropTypes.object.isRequired,
        csrf_element: React.PropTypes.object.isRequired
    },
    /**
        This sets the initial state of the User class. As well as defines initial state variables
    */
    getInitialState: function() {
        return {
            users: [],
            display: true,
            editing: false,
            username: this.props.user.username,
            password: '',
            enabled: this.props.user.enabled,
            role: this.props.user.authorities[0].authority
        };
    },
    /**
        This makes an AJAX call to load users.
        This is primarily used for reloading users when an add/delete has occurred
    */
    loadUsersFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/users"
        }).then(function (data) {
            self.setState({users: data._embedded.users});
        });
    },
    /**
        This handles whenever a user tries to delete an entry
    */
    handleDelete() {
        var self = this;

        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */
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
    /**
        This flags the form to let it know that it is being edited
    */
    handleEdit: function() {
        var self = this;
        self.setState({editing: true});
    },
    /**
        This posts the changes made to the user
    */
    handleEditChange: function() {
        var self = this;

        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/admin/editUser",
            type: "POST",
            data: {username: this.state.username,
                   password: this.state.password,
                   enabled: this.state.enabled,
                   role: this.state.role},
            success: function() {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully Edited User!");
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
        self.setState({editing: false});
    },
    /**
        This cancels the editing of a user.
        Removes the edit flag.
    */
    handleEditCancel: function() {
        var self = this;
        self.setState({editing: false});
    },
    /**
        This updates the username as it is being updated in the UI
    */
    updateUsername: function(evt) {
        this.setState({
            username: evt.target.value
        });
    },
    /**
        This updates the password as it is being updated in the UI
    */
    updatePassword: function(evt) {
        this.setState({
            password: evt.target.value
        });
    },
    /**
        This updates the role as it is being updated in the UI
    */
    updateRole: function(evt) {
        this.setState({
            role: evt.target.value
        });
    },
    /**
        This updates the enabled property as it is being updated in the UI

        You will notice this one has a little more logic than the other
        update methods. This is because I was only able to pull back a string
        "true" or "false" from the select control. This was causing an issue with
        React not rendering the changes automatically.
    */
    updateEnabled: function(evt) {
        if (evt.target.value === 'true') {
            this.setState({
                enabled: true
            });
        } else {
            this.setState({
                enabled: false
            });
        }
    },
    /**
        Renders the HTML
    */
    render: function() {
        if (this.state.display == false) {
            return null;
        } else if (this.state.editing == true) {
            /**
                This HTML provides input fields for the specified user to be edited.
            */
            return (
                <tr>
                  <td className="col-md-2">{this.state.username}</td>
                  <td className="col-md-4">
                    <input type="password" className="form-control" name="inputPassword" placeholder="New Password" value={this.state.password} onChange={this.updatePassword}/>
                  </td>
                  <td className="col-md-2">
                    <RoleSelect roles={this.props.roles} role={this.state.role} onChange={this.updateRole} />
                  </td>
                  <td className="col-md-2">
                    <EnabledSelect onChange={this.updateEnabled} enabled={this.state.enabled} />
                  </td>
                  <td className="col-md-1">
                    <button className="btn btn-success" onClick={this.handleEditChange}>
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                    </button>
                  </td>
                  <td className="col-md-1">
                    <button className="btn btn-danger" onClick={this.handleEditCancel}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                  </td>
                </tr>
            );
        } else {
            /**
                This HTML provides fields to show user data.
            */
            return (
                <tr>
                      <td className="col-md-2">{this.props.user.username}</td>
                      <td className="col-md-4">********</td>
                      <td className="col-md-2">{this.state.role}</td>
                      <td className="col-md-2">{this.state.enabled ? 'Enabled' : 'Disabled'}</td>
                      <td className="col-md-1">
                        <button className="btn btn-warning" onClick={this.handleEdit}>
                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </button>
                      </td>
                      <td className="col-md-1">
                        <button className="btn btn-danger" onClick={this.handleDelete}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                      </td>
                </tr>
            );
        }
    }
});


/**
    This class acts as the handler for UserTable objects.
    Essentially this class helps order all of the user objects together.

    Methods:

    *render
*/
var UserTable = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
            roles: React.PropTypes.array.isRequired,
            users: React.PropTypes.array.isRequired
    },
    /**
        Renders the HTML
    */
    render: function() {
        var self = this;
        var rows = [];
        this.props.users.forEach(function(user) {
            rows.push(<User csrf_element={csrf_element} user={user} key={user.username} roles={self.props.roles} />);
        });
        return (
            <div className="panel panel-default">
              <div className="panel-body">
                <input id="inputSearch" type="text" className="form-control" placeholder="Search" />
              </div>
              <table className="table">
                <thead className="panel-heading">
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Enabled</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
              </table>
            </div>
        );
    }
});

/**
    This class handles the roles to be displayed in the select control
*/
var Role = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
            role: React.PropTypes.object
    },
    render: function() {
        var roleName         = this.props.role.name;
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


/**
    This class acts as the handler for the select element that will display the roles
*/
var RoleSelect = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
                role: React.PropTypes.string
    },
    render: function() {
        var roles = [];
        this.props.roles.forEach(function(role) {
            roles.push(<Role role={role} key={role.name}/>);
        });
        return (
            <select className="form-control" name="selectRole" value={this.props.role} onChange={this.props.onChange}>
                {roles}
            </select>
        );
    }
});

/**
    This class acts as the handler for the select element that will display the enabled property
*/
var EnabledSelect = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
        role: React.PropTypes.bool
    },
    render: function() {
        return (
            <select className="form-control" name="selectEnabled" value={this.props.enabled} onChange={this.props.onChange}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
            </select>
        );
    }
});

/**
    This class is used for displaying all of the users neatly on the page

    Methods:

    *getInitialState
    *componentDidMount
    *loadUsersFromServer
    *loadRolesFromServer
    *handleAddUser
    *updateUsername
    *updatePassword
    *updateRole
    *updateEnabled
    *render

*/
var AllUsers = React.createClass({
    /**
        This method loads the initial state variables
    */
    getInitialState: function() {
        return {users: [],
                roles: [],
                username: '',
                password: '',
                enabled: true,
                role: ''};
    },
    /**
        This method fires when the component has mounted
    */
    componentDidMount: function () {
        this.loadUsersFromServer();
        this.loadRolesFromServer();
    },
    /**
        This method loads the users from the server
    */
    loadUsersFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/users"
        }).then(function (data) {
            self.setState({users: data._embedded.users});
        });
    },
    /**
        This method loads the different roles from the server.
    */
    loadRolesFromServer: function () {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/roles"
        }).then(function (data) {
            self.setState({roles: data._embedded.roles});
        });
    },
    /**
        This method handles the adding of a user. (via AJAX)
    */
    handleAddUser: function() {
        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

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
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully Added User!");
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
    /**
        This method updates the username as it is being updated in the UI
    */
    updateUsername: function(evt) {
        this.setState({
            username: evt.target.value
        });
    },
    /**
        This method updates the password as it is being updated in the UI
    */
    updatePassword: function(evt) {
        this.setState({
            password: evt.target.value
        });
    },
    /**
        This method updates the role as it is being updated in the UI
    */
    updateRole: function(evt) {
        this.setState({
            role: evt.target.value
        });
    },
    /**
        This method updates the enabled as it is being updated in the UI
    */
    updateEnabled: function(evt) {
        this.setState({
            enabled: evt.target.value
        });
    },
    /**
        This method renders the HTML
    */
    render() {
        return (
            <div>
                <div className="container">
                    <div className="well well-lg">
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
                                <button className="btn btn-primary" onClick={this.handleAddUser}>Add User</button>
                            </div>
                        </div>
                    </div>
                    <UserTable csrf_element={csrf_element} users={this.state.users} roles={this.state.roles} />
                </div>
            </div>
        );
    }
});

/**
    This is where the main React component, 'AllUsers' in this case, is being rendered.
*/
if (document.getElementById('allUsers') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<AllUsers csrf_element="{{csrf_element}}"/>, document.getElementById('allUsers'));
}

var Patient = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
        patient:         React.PropTypes.object.isRequired,
        csrf_element: React.PropTypes.object.isRequired
    },
    /**
        This sets the initial state of the User class. As well as defines initial state variables
    */
    getInitialState: function() {
        return {
            patients: [],
            users: [],
            display: true,
            editing: false,
            firstName: this.props.patient.firstName,
            originalFirstName: this.props.patient.firstName,
            middleName: this.props.patient.middleName,
            originalMiddleName: this.props.patient.middleName,
            lastName: this.props.patient.lastName,
            originalLastName: this.props.patient.lastName,
            gender: this.props.patient.gender,
            originalGender: this.props.patient.gender,
            dob: this.props.patient.dob,
            originalDob: this.props.patient.dob,
            address: this.props.patient.address,
            originalAddress: this.props.patient.address,
            city: this.props.patient.city,
            originalCity: this.props.patient.city,
            state: this.props.patient.state,
            originalState: this.props.patient.state,
            zipCode: this.props.patient.zipCode,
            originalZipCode: this.props.patient.zipCode,
            maritalStatus: this.props.patient.maritalStatus,
            originalMaritalStatus: this.props.patient.maritalStatus,
            numberOfChildren: this.props.patient.numOfChildren,
            originalNumberOfChildren: this.props.patient.numOfChildren,
            phoneNumber: this.props.patient.phoneNumber,
            originalPhoneNumber: this.props.patient.phoneNumber,
            emailAddress: this.props.patient.emailAddress,
            originalEmailAddress: this.props.patient.emailAddress,
            practitionerName: this.props.patient.practitionerName,
            originalPractitionerName: this.props.patient.practitionerName
        };
    },
    componentDidMount: function () {
        this.loadUsersFromServer();
    },
    loadPatientsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/patients"
        }).then(function (data) {
            self.setState({patients: data._embedded.patients});
        });
    },
    loadUsersFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/users"
        }).then(function (data) {
            self.setState({users: data._embedded.users});
        });
    },
    updateFirstName: function(evt) {
        this.setState({
            firstName: evt.target.value
        });
    },
    updateMiddleName: function(evt) {
        this.setState({
            middleName: evt.target.value
        });
    },
    updateLastName: function(evt) {
        this.setState({
            lastName: evt.target.value
        });
    },
    updateGender: function(evt) {
        this.setState({
            gender: evt.target.value
        });
    },
    updateDOB: function(evt) {
        this.setState({
            dob: evt.target.value
        });
    },
    updateAddress: function(evt) {
        this.setState({
            address: evt.target.value
        });
    },
    updateCity: function(evt) {
        this.setState({
            city: evt.target.value
        });
    },
    updateState: function(evt) {
        this.setState({
            state: evt.target.value
        });
    },
    updateZipCode: function(evt) {
        this.setState({
            zipCode: evt.target.value
        });
    },
    updateMaritalStatus: function(evt) {
        this.setState({
            maritalStatus: evt.target.value
        });
    },
    updateNumberOfChildren: function(evt) {
        this.setState({
            numberOfChildren: evt.target.value
        });
    },
    updatePhoneNumber: function(evt) {
        this.setState({
            phoneNumber: evt.target.value
        });
    },
    updateEmailAddress: function(evt) {
        this.setState({
            emailAddress: evt.target.value
        });
    },
    updatePractitionerName: function(evt) {
        this.setState({
            practitionerName: evt.target.value
        });
    },
    /**
        This handles whenever a user tries to delete an entry
    */
    handleDelete: function() {
        var self = this;

        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */
        if (csrf_element !== null) {
          $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
             jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
          });
        }
        $.ajax({
            url: self.props.patient._links.self.href,
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

    handleEditConfirm: function() {

        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/patients/editPatient",
            type: "POST",
            data: {
                  id: this.props.patient.publicId,
                  firstName: this.state.firstName,
                  middleName: this.state.middleName,
                  lastName: this.state.lastName,
                  gender: this.state.gender,
                  dob: this.state.dob,
                  address: this.state.address,
                  city: this.state.city,
                  state: this.state.state,
                  zipCode: this.state.zipCode,
                  maritalStatus: this.state.maritalStatus,
                  numberOfChildren: this.state.numberOfChildren,
                  phoneNumber: this.state.phoneNumber,
                  emailAddress: this.state.emailAddress,
                  practitionerName: this.state.practitionerName,
            },
            success: function() {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                self.props.loadPatientsFromServer();
                toastr.success("Successfully Edited Patient!");
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
    handleEditCancel: function() {
        var self = this;
        this.setState({
            firstName: self.state.originalFirstName,
            middleName: self.state.originalMiddleName,
            lastName: self.state.originalLastName,
            gender: self.state.originalGender,
            dob: self.state.originalDob,
            address: self.state.originalAddress,
            city: self.state.originalCity,
            state: self.state.originalState,
            zipCode: self.state.originalZipCode,
            maritalStatus: self.state.originalMaritalStatus,
            numberOfChildren: self.state.originalNumberOfChildren,
            phoneNumber: self.state.originalPhoneNumber,
            emailAddress: self.state.originalEmailAddress,
            practitionerName: self.state.originalPractitionerName
        });
    },
    /**
        Renders the HTML
    */
    render: function() {
        //construct unique ids to use for the modal windows.
        var modalId = "myModal" + this.props.patient.publicId;
        var modalIdDataTarget = "#" + modalId;
        var modalLabelId = "myModalLabel" + this.props.patient.publicId;

        if (this.state.display == false) {
            return null;
        } else {
            /**
                This HTML provides fields to show user data.
            */
            return (
                <tr>
                  <td className="col-md-2">{this.props.patient.firstName} {this.props.patient.middleName} {this.props.patient.lastName}</td>
                  <td className="col-md-2">{this.props.patient.dob}</td>
                  <td className="col-md-3">{this.props.patient.address} {this.props.patient.city}, {this.props.patient.state} {this.props.patient.zipCode} </td>
                  <td className="col-md-2">{this.props.patient.phoneNumber}</td>
                  <td className="col-md-1">{this.props.patient.practitionerName}</td>
                  <td className="col-md-1">
                    <button type="button" className="btn btn-default" data-toggle="modal" data-target={modalIdDataTarget}>View</button>
                    <div className="modal fade" id={modalId} tabindex="-1" role="dialog" aria-labelledby={modalLabelId}>
                      <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id={modalLabelId}>
                                Patient #{this.props.patient.publicId}
                            </h4>
                          </div>
                          <div className="modal-body">
                            <div className="row">
                                 <div className="col-md-4">
                                     <label>First Name:</label>
                                     <input type="text" className="form-control" name="inputFirstName" placeholder="First Name" value={this.state.firstName} onChange={this.updateFirstName} />
                                 </div>
                                 <div className="col-md-4">
                                     <label>Middle Name:</label>
                                     <input type="text" className="form-control" name="inputMiddleName" placeholder="Middle Name" value={this.state.middleName} onChange={this.updateMiddleName} />
                                 </div>
                                 <div className="col-md-4">
                                     <label>Last Name:</label>
                                     <input type="text" className="form-control" name="inputLastName" placeholder="Last Name" value={this.state.lastName} onChange={this.updateLastName} />
                                 </div>
                             </div>
                             <hr />
                             <div className="row">
                                 <div className="col-md-3">
                                     <label>Gender:</label>
                                     <select className="form-control" name="selectGender" value={this.state.gender} onChange={this.updateGender} >
                                         <option></option>
                                         <option value="true">Male</option>
                                         <option value="false">Female</option>
                                     </select>
                                 </div>
                                 <div className="col-md-3">
                                     <label>Date of Birth:</label>
                                     <input type="text" className="form-control" value={this.state.dob} onBlur={this.updateDOB} onChange={this.updateDOB}/>
                                 </div>
                                 <div className="col-md-3">
                                     <label>Marital Status:</label>
                                     <select className="form-control" name="selectMaritalStatus" value={this.state.maritalStatus} onChange={this.updateMaritalStatus} >
                                         <option></option>
                                         <option value="Single">Single</option>
                                         <option value="Married">Married</option>
                                         <option value="Divorced">Divorced</option>
                                         <option value="Widowed">Widowed</option>
                                     </select>
                                 </div>
                                 <div className="col-md-3">
                                     <label>Number of Children:</label>
                                     <input type="number" className="form-control" name="inputNumberOfChildren" placeholder="Number of Children" min="0" max="1000" value={this.state.numberOfChildren} onChange={this.updateNumberOfChildren} />
                                 </div>
                             </div>
                             <hr />
                             <div className="row">
                                 <div className="col-md-5">
                                     <label>Address:</label>
                                     <input type="text" className="form-control" name="inputAddress" placeholder="Address" value={this.state.address} onChange={this.updateAddress} />
                                 </div>
                                 <div className="col-md-3">
                                     <label>City:</label>
                                     <input type="text" className="form-control" name="inputCity" placeholder="City" value={this.state.city} onChange={this.updateCity} />
                                 </div>
                                 <div className="col-md-2">
                                     <label>State:</label>
                                     <SelectState value={this.state.state} onChange={this.updateState} />
                                 </div>
                                 <div className="col-md-2">
                                     <label>Zip Code:</label>
                                     <input type="number" className="form-control" name="inputZipCode" placeholder="Zip Code" value={this.state.zipCode} onChange={this.updateZipCode} />
                                 </div>
                             </div>
                             <hr />
                             <div className="row">
                                 <div className="col-md-4">
                                     <label>Phone Number:</label>
                                     <input type="number" className="form-control" name="inputPhoneNumber" placeholder="Phone Number" value={this.state.phoneNumber} onChange={this.updatePhoneNumber} />
                                 </div>
                                 <div className="col-md-4">
                                     <label>Email Address:</label>
                                     <input type="email" className="form-control" name="inputEmailAddress" placeholder="Email Address" value={this.state.emailAddress} onChange={this.updateEmailAddress} />
                                 </div>
                                 <div className="col-md-4">
                                     <label>Practitioner:</label>
                                     <PractitionerSelect users={this.state.users} value={this.state.practitionerName} onChange={this.updatePractitionerName} />
                                 </div>
                             </div>
                             <hr />
                             <div className="row">
                                <div className="col-md-1">
                                    <button type="button" className="btn btn-primary" onClick={this.handleEditConfirm}>Save</button>
                                </div>
                                <div className="col-md-2">
                                    <button type="button" className="btn btn-danger" onClick={this.handleEditCancel}>Discard Changes</button>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="col-md-1">
                    <button className="btn btn-danger" onClick={this.handleDelete}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                  </td>
                </tr>


            );
        }
    }

});

var PatientTable = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
            patients: React.PropTypes.array.isRequired
    },
    /**
        Renders the HTML
    */
    render: function() {
        var self = this;
        var rows = [];
        var index = 0;
        this.props.patients.forEach(function(patient) {
            index++;
            rows.push(<Patient csrf_element={csrf_element} patient={patient} key={index} loadPatientsFromServer={self.props.loadPatientsFromServer} />);
        });
        return (
            <div className="panel panel-default">
              <div className="panel-body">
                <input id="inputSearch" type="text" className="form-control" placeholder="Search" />
              </div>
              <table className="table">
                <thead className="panel-heading">
                    <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Address</th>
                        <th>Phone Number</th>
                        <th>Practitioner</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
              </table>
            </div>
        );
    }
});

var SelectState = React.createClass({
    render: function() {
        return (
            <select className="form-control" value={this.props.value} onChange={this.props.onChange}>
                	<option></option>
                	<option value="AL">Alabama</option>
                	<option value="AK">Alaska</option>
                	<option value="AZ">Arizona</option>
                	<option value="AR">Arkansas</option>
                	<option value="CA">California</option>
                	<option value="CO">Colorado</option>
                	<option value="CT">Connecticut</option>
                	<option value="DE">Delaware</option>
                	<option value="DC">District Of Columbia</option>
                	<option value="FL">Florida</option>
                	<option value="GA">Georgia</option>
                	<option value="HI">Hawaii</option>
                	<option value="ID">Idaho</option>
                	<option value="IL">Illinois</option>
                	<option value="IN">Indiana</option>
                	<option value="IA">Iowa</option>
                	<option value="KS">Kansas</option>
                	<option value="KY">Kentucky</option>
                	<option value="LA">Louisiana</option>
                	<option value="ME">Maine</option>
                	<option value="MD">Maryland</option>
                	<option value="MA">Massachusetts</option>
                	<option value="MI">Michigan</option>
                	<option value="MN">Minnesota</option>
                	<option value="MS">Mississippi</option>
                	<option value="MO">Missouri</option>
                	<option value="MT">Montana</option>
                	<option value="NE">Nebraska</option>
                	<option value="NV">Nevada</option>
                	<option value="NH">New Hampshire</option>
                	<option value="NJ">New Jersey</option>
                	<option value="NM">New Mexico</option>
                	<option value="NY">New York</option>
                	<option value="NC">North Carolina</option>
                	<option value="ND">North Dakota</option>
                	<option value="OH">Ohio</option>
                	<option value="OK">Oklahoma</option>
                	<option value="OR">Oregon</option>
                	<option value="PA">Pennsylvania</option>
                	<option value="RI">Rhode Island</option>
                	<option value="SC">South Carolina</option>
                	<option value="SD">South Dakota</option>
                	<option value="TN">Tennessee</option>
                	<option value="TX">Texas</option>
                	<option value="UT">Utah</option>
                	<option value="VT">Vermont</option>
                	<option value="VA">Virginia</option>
                	<option value="WA">Washington</option>
                	<option value="WV">West Virginia</option>
                	<option value="WI">Wisconsin</option>
                	<option value="WY">Wyoming</option>
            </select>
            );
    }
});

var Practitioner = React.createClass({
    render: function() {
        return (
            <option value={this.props.user.username}>{this.props.user.username}</option>
        );
    }
});

var PractitionerSelect = React.createClass({

    propTypes: {
                practitionerName: React.PropTypes.string
    },
    render: function() {
        var practitioners = [];
        var index = 0;
        //Adding blank default to ensure selected value will get set
        practitioners.push(<option key={index}></option>);
        this.props.users.forEach(function(user) {
            //only add practitioners
            index ++;
            if (user.authorities[0].authority === "ROLE_PRACTITIONER") {
                practitioners.push(<Practitioner user={user} key={index}/>);
            }
        });
        return (
            <select className="form-control" name="selectRole" value={this.props.value} onChange={this.props.onChange}>
                {practitioners}
            </select>
        );
    }

});

var AllPatients = React.createClass({
    /**
        This method loads the initial state variables
    */

    getInitialState: function() {
        return {
                  users: [],
                  patients: [],
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  gender: '',
                  dob: '',
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  maritalStatus: '',
                  numberOfChildren: '',
                  phoneNumber: '',
                  emailAddress: '',
                  practitionerName: ''
                };
    },
    /**
        This method fires when the component has mounted
    */
    componentDidMount: function () {
        this.loadPatientsFromServer();
        this.loadUsersFromServer();
    },
    /**
        This method loads the patients from the server
    */
    loadPatientsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/patients"
        }).then(function (data) {
            self.setState({patients: data._embedded.patients});
        });
    },
    loadUsersFromServer: function() {
            var self = this;
            $.ajax({
                url: "http://localhost:8080/api/users"
            }).then(function (data) {
                self.setState({users: data._embedded.users});
            });
        },
    /**
        This method handles the adding of a user. (via AJAX)
    */
    handleAddPatient: function() {
        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/patients/addPatient",
            type: "POST",
            data: {
                  firstName: this.state.firstName,
                  middleName: this.state.middleName,
                  lastName: this.state.lastName,
                  gender: this.state.gender,
                  dob: this.state.dob,
                  address: this.state.address,
                  city: this.state.city,
                  state: this.state.state,
                  zipCode: this.state.zipCode,
                  maritalStatus: this.state.maritalStatus,
                  numberOfChildren: this.state.numberOfChildren,
                  phoneNumber: this.state.phoneNumber,
                  emailAddress: this.state.emailAddress,
                  practitionerName: this.state.practitionerName

            },
            success: function() {
                self.loadPatientsFromServer();
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully Added Patient!");
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
    /**
        This method renders the HTML
    */

    updateFirstName: function(evt) {
        this.setState({
            firstName: evt.target.value
        });
    },
    updateMiddleName: function(evt) {
        this.setState({
            middleName: evt.target.value
        });
    },
    updateLastName: function(evt) {
        this.setState({
            lastName: evt.target.value
        });
    },
    updateGender: function(evt) {
        this.setState({
            gender: evt.target.value
        });
    },
    updateDOB: function(evt) {
        this.setState({
            dob: evt.target.value
        });
    },
    updateAddress: function(evt) {
        this.setState({
            address: evt.target.value
        });
    },
    updateCity: function(evt) {
        this.setState({
            city: evt.target.value
        });
    },
    updateState: function(evt) {
        this.setState({
            state: evt.target.value
        });
    },
    updateZipCode: function(evt) {
        this.setState({
            zipCode: evt.target.value
        });
    },
    updateMaritalStatus: function(evt) {
        this.setState({
            maritalStatus: evt.target.value
        });
    },
    updateNumberOfChildren: function(evt) {
        this.setState({
            numberOfChildren: evt.target.value
        });
    },
    updatePhoneNumber: function(evt) {
        this.setState({
            phoneNumber: evt.target.value
        });
    },
    updateEmailAddress: function(evt) {
        this.setState({
            emailAddress: evt.target.value
        });
    },
    updatePractitionerName: function(evt) {
        this.setState({
            practitionerName: evt.target.value
        });
    },
    render() {
        return (
            <div>
                <div className="container">
                    <div className="well well-lg">
                        <div className="row">
                            <div className="col-md-4">
                                <label>First Name:</label>
                                <input type="text" className="form-control" name="inputFirstName" placeholder="First Name" value={this.state.firstName} onChange={this.updateFirstName} />
                            </div>
                            <div className="col-md-4">
                                <label>Middle Name:</label>
                                <input type="text" className="form-control" name="inputMiddleName" placeholder="Middle Name" value={this.state.middleName} onChange={this.updateMiddleName} />
                            </div>
                            <div className="col-md-4">
                                <label>Last Name:</label>
                                <input type="text" className="form-control" name="inputLastName" placeholder="Last Name" value={this.state.lastName} onChange={this.updateLastName} />
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-3">
                                <label>Gender:</label>
                                <select className="form-control" name="selectGender" value={this.state.gender} onChange={this.updateGender} >
                                    <option></option>
                                    <option value="true">Male</option>
                                    <option value="false">Female</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label>Date of Birth:</label>
                                <input type="text" className="form-control" name="inputDOB" id="datepicker" value={this.state.dob} onBlur={this.updateDOB}/>
                            </div>
                            <div className="col-md-3">
                                <label>Marital Status:</label>
                                <select className="form-control" name="selectMaritalStatus" value={this.state.maritalStatus} onChange={this.updateMaritalStatus} >
                                    <option></option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label>Number of Children:</label>
                                <input type="number" className="form-control" name="inputNumberOfChildren" placeholder="Number of Children" min="0" max="1000" value={this.state.numberOfChildren} onChange={this.updateNumberOfChildren} />
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-5">
                                <label>Address:</label>
                                <input type="text" className="form-control" name="inputAddress" placeholder="Address" value={this.state.address} onChange={this.updateAddress} />
                            </div>
                            <div className="col-md-3">
                                <label>City:</label>
                                <input type="text" className="form-control" name="inputCity" placeholder="City" value={this.state.city} onChange={this.updateCity} />
                            </div>
                            <div className="col-md-2">
                                <label>State:</label>
                                <SelectState name="selectState" value={this.state.state} onChange={this.updateState} />
                            </div>
                            <div className="col-md-2">
                                <label>Zip Code:</label>
                                <input type="number" className="form-control" name="inputZipCode" placeholder="Zip Code" value={this.state.zipCode} onChange={this.updateZipCode} />
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-3">
                                <label>Phone Number:</label>
                                <input type="number" className="form-control" name="inputPhoneNumber" placeholder="Phone Number" value={this.state.phoneNumber} onChange={this.updatePhoneNumber} />
                            </div>
                            <div className="col-md-3">
                                <label>Email Address:</label>
                                <input type="email" className="form-control" name="inputEmailAddress" placeholder="Email Address" value={this.state.emailAddress} onChange={this.updateEmailAddress} />
                            </div>
                            <div className="col-md-3">
                                <label>Practitioner:</label>
                                <PractitionerSelect users={this.state.users} value={this.state.practitionerName} onChange={this.updatePractitionerName} />
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-primary center-block" id="btnAddPatient" onClick={this.handleAddPatient}>Add Patient</button>
                            </div>
                        </div>
                    </div>
                    <PatientTable patients={this.state.patients} csrf_element={csrf_element} loadPatientsFromServer={this.loadPatientsFromServer} />
                </div>
            </div>
        );
    }
});

<div id="patientModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Test</h2>
        </div>
    </div>
</div>

if (document.getElementById('allPatients') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<AllPatients csrf_element="{{csrf_element}}"/>, document.getElementById('allPatients'));
}

var PatientOption = React.createClass({
    render: function() {
        return (
            <option value={this.props.patient.publicId}>
                {this.props.patient.firstName} {this.props.patient.middleName} {this.props.patient.lastName} ({this.props.patient.phoneNumber}) - {this.props.patient.address} {this.props.patient.city}, {this.props.patient.state} {this.props.patient.zipCode}
            </option>
        );
    }
});

var PatientSelect = React.createClass({

    render: function() {
        var patients = [];
        var index = 0;
        //Adding blank default to ensure selected value will get set
        patients.push(<option key={index}></option>);
        this.props.patients.forEach(function(patient) {
            index ++;
            patients.push(<PatientOption patient={patient} key={index}/>);
        });
        return (
            <select className="form-control" value={this.props.value} onChange={this.props.onChange}>
                {patients}
            </select>
        );
    }

});

var AddAppointment = React.createClass({
    getInitialState: function() {
        return {
                  users: [],
                  patients: [],
                  practitioners: [],
                  appointments: [],
                  patientId: -1,
                  practitionerName: '',
                  startTime: '',
                  endTime: '',
                  date: '',
                  reasonForVisit: ''
        };
    },
    componentDidMount: function () {
        this.loadPatientsFromServer();
        this.loadUsersFromServer();
        this.loadAppointmentsFromServer();

        var self = this;

        var initialLocaleCode = 'en';

        $('#appointmentCalendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaWeek,agendaDay'
            },
            height: 300,
            timezone: 'America/New_York',
            defaultView: 'agendaWeek',
            allDaySlot: false,
            weekends: false,
            nowIndicator: true,
            slotDuration: "00:15:00",
            locale: initialLocaleCode,
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectHelper: true,
            select: function(start, end) {

                var eventFound = $("#appointmentCalendar").fullCalendar('clientEvents', 1);

                if (eventFound.length === 0) {
                    //The below condition acts as a workaround to how tz is automatically
                    //picking up the EST timezone but for some reason 'start' is being
                    //set as 'gmt'. I also had to subtract 5 hours from moment() to account
                    //for the correct current time
                    if(start.isBefore(moment().tz("gmt").add(-5, "hours"))) {
                        alert("Error: You can't select a date in the past");
                        $('#appointmentCalendar').fullCalendar('unselect');
                        return false;
                    }
                    self.setState({
                        date: start.format("MM-DD-YYYY"),
                        startTime: start.format("HH:mm"),
                        endTime: end.format("HH:mm")
                    });

                    var title = "";
                    var eventData = {
                            id: 1,
                            title: title,
                            start: start,
                            end: end,
                            startEditable: true,
                            durationEditable: true
                        };
                    $('#appointmentCalendar').fullCalendar('renderEvent', eventData, true); // stick? = true

                } else {
                    alert("Error! You have already added entered an appointment date");
                }
                $('#appointmentCalendar').fullCalendar('unselect');

            },
            eventDrop: function(event) {
                if (event.id === 1) {
                    self.setState({
                        date: event.start.format("MM-DD-YYYY"),
                        startTime: event.start.format("HH:mm"),
                        endTime: event.end.format("HH:mm")
                    });
                }
            },
            eventResize: function(event) {
                if (event.id === 1) {
                    self.setState({
                        date: event.start.format("MM-DD-YYYY"),
                        startTime: event.start.format("HH:mm"),
                        endTime: event.end.format("HH:mm")
                    });
                }
            },
            minTime: "06:00:00",
            maxTime: "18:00:00",
            editable: true,
            eventLimit: false, // allow "more" link when too many events
            eventOverlap: false,
            selectOverlap: false,
            eventStartEditable: false,
            eventDurationEditable: false

        });

    },
    /**
        This method loads the patients from the server
    */
    loadPatientsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/patients"
        }).then(function (data) {
            self.setState({patients: data._embedded.patients});
        });
    },
    loadUsersFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/users"
        }).then(function (data) {
            self.setState({users: data._embedded.users});
        });
    },
    loadAppointmentsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/appointments"
        }).then(function (data) {
            self.setState({appointments: data._embedded.appointments});
        });
    },
    updatePractitionerName: function(evt) {

        if ((typeof evt) === "string") {
            var value = evt;
        } else {
            var value = evt.target.value;
        }

        this.setState({
            practitionerName: value
        });
        var events = [];

        //Clears the calendar so results aren't compounded
        $('#appointmentCalendar').fullCalendar( 'removeEvents', function(event) {
            return true;
        });

        var index = 1;
        this.state.appointments.forEach(function(appointment) {

          if (appointment.practitionerName === value) {
            var dateFormat = "MM-DD-YYYY HH:mm";
            var start = moment((appointment.date + " " + appointment.startTime), dateFormat);
            var end   = moment((appointment.date + " " + appointment.endTime), dateFormat);
            index++;

            var eventData = {
                id: index,
                title: appointment.patientName,
                start: start,
                end: end,
                color: '#F08080'
            };
            $('#appointmentCalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
          }
        });

    },
    updatePatientId: function(evt) {

        if (evt.target.value !== "") {
            this.setState({
                patientId: evt.target.value
            });
            this.updatePractitionerName(this.state.patients[evt.target.value-1].practitionerName); //Subtract 1 from index because it isn't 0 based
        } else {
            this.setState({
                patientId: -1
            });
            this.updatePractitionerName(this.state.patients[evt.target.value-1].practitionerName);
        }
     },
    updateReasonForVisit: function(evt) {
         this.setState({
             reasonForVisit: evt.target.value
         });
     },
     clearEntries: function() {
        //Clears the entries
        this.setState({
            patientId: -1,
            reasonForVisit: ""
        });
        this.updatePractitionerName("");
     },
     handleAddAppointment: function() {
        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/appointment/addAppointment",
            type: "POST",
            data: {
                  patientId: this.state.patientId,
                  practitionerName: this.state.practitionerName,
                  date: this.state.date,
                  startTime: this.state.startTime,
                  endTime: this.state.endTime,
                  reasonForVisit: this.state.reasonForVisit
            },
            success: function() {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully Added Appointment!");
                self.loadAppointmentsFromServer();
                self.clearEntries();
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
        return (
            <div className="container">
                <div className="well well-lg">
                    <h3>Add Appointment</h3>
                    <div className="row">
                        <div className="col-md-4">
                            <label>Patient:</label>
                            <PatientSelect patients={this.state.patients} value={this.state.patientId} onChange={this.updatePatientId} />
                            <hr />
                            <label>Practitioner:</label>
                            <PractitionerSelect users={this.state.users} value={this.state.practitionerName} onChange={this.updatePractitionerName} />
                            <hr />
                            <label>Reason For Visit:</label>
                            <textarea type="text" rows="4" className="form-control" onChange={this.updateReasonForVisit} placeholder="Reason for visit." value={this.state.reasonForVisit} />
                        </div>
                        <div className="col-md-8">
                            <label>Date:</label>
                            <div id="appointmentCalendar"></div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-primary center-block" onClick={this.handleAddAppointment}>Create Appointment</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

if (document.getElementById('addNewAppointment') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<AddAppointment csrf_element="{{csrf_element}}"/>, document.getElementById('addNewAppointment'));
}


var ViewAppointments = React.createClass({

    getInitialState: function() {
        return {
                  appointments: [],
                  appointmentId: -1,
                  patientName: '',
                  date: '',
                  startTime: '',
                  endTime: '',
                  reasonForVisit: '',
                  patientId: -1,
                  startTime: '',
                  endTime: '',
                  date: '',
                  reasonForVisit: '',
                  notes: '',
                  appointmentStarted: false,
                  appointmentEnded: false
        };
    },
    updateAppointment: function(id) {
        var self = this;

        var notes = self.state.appointments[id-1].notes;
        if ( notes === null) {
            notes = "";
        }

        var appointmentStartTime = self.state.appointments[id-1].sessionStartTime;
        var appointmentStarted = false;
        if (appointmentStartTime !== null) {
            appointmentStarted = true
        }

        var appointmentEndTime = self.state.appointments[id-1].sessionEndTime;
        var appointmentEnded = false;
        if (appointmentEndTime !== null) {
            appointmentEnded = true
        }

        //need to do 'id-1' offset because id is 1 based
        this.setState({
            appointmentId: id,
            patientName: self.state.appointments[id-1].patientName,
            date: self.state.appointments[id-1].date,
            startTime: self.state.appointments[id-1].startTime,
            endTime: self.state.appointments[id-1].endTime,
            reasonForVisit: self.state.appointments[id-1].reasonForVisit,
            notes: notes,
            appointmentStarted: appointmentStarted,
            appointmentEnded: appointmentEnded
        });
    },
    updateNotes: function(evt) {
        this.setState({
            notes: evt.target.value
        });
    },
    loadCalendar: function() {
     var self = this;

     var initialLocaleCode = 'en';

     $('#practitionerAppointmentsCalendar').fullCalendar({
         header: {
             left: 'prev,next today',
             center: 'title',
             right: 'agendaWeek,agendaDay'
         },
         timezone: 'America/New_York',
         defaultView: 'agendaDay',
         allDaySlot: false,
         weekends: false,
         nowIndicator: true,
         slotDuration: "00:15:00",
         locale: initialLocaleCode,
         navLinks: true, // can click day/week names to navigate views
         selectable: false,
         selectHelper: true,
         minTime: "06:00:00",
         maxTime: "18:00:00",
         editable: true,
         eventLimit: false, // allow "more" link when too many events
         eventOverlap: false,
         selectOverlap: false,
         eventStartEditable: false,
         eventDurationEditable: false,
         eventClick: function(event) {
            self.updateAppointment(event.appointmentId);
            // This makes it to where you can't close the modal by clicking away
            $('#myModal').modal({
              backdrop: 'static',
              keyboard: false
            });
         }

     });

     var username = document.getElementById("username");

     //Clears the calendar so results aren't compounded
     $('#practitionerAppointmentsCalendar').fullCalendar( 'removeEvents', function(event) {
         return true;
     });

     this.state.appointments.forEach(function(appointment) {

       if (appointment.practitionerName === username.innerText) {
         var dateFormat = "MM-DD-YYYY HH:mm";
         var start = moment((appointment.date + " " + appointment.startTime), dateFormat);
         var end   = moment((appointment.date + " " + appointment.endTime), dateFormat);

         var color = "#3CB371";
         if (appointment.checkInTime === null) {
            color = "#444";
         }

         if (appointment.sessionStartTime !== null) {
            color = "#4169E1";
         }

         if (appointment.sessionEndTime !== null) {
            color = "#8B0000";
         }

         var eventData = {
             id: appointment.publicId,
             title: appointment.patientName + " --- Reason for visit --- " + appointment.reasonForVisit,
             start: start,
             end: end,
             appointmentId: appointment.publicId,
             color: color
         };
         $('#practitionerAppointmentsCalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
       }
     });
    },
    loadAppointmentsFromServer: function() {
         var self = this;
        $.ajax({
           url: "http://localhost:8080/api/appointments"
        }).then(function (data) {
             self.setState({appointments: data._embedded.appointments});
            return self.loadCalendar();
        });
    },
    saveNotes: function() {

        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/practitioner_appointments/saveNotes",
            type: "POST",
            data: {
                  appointmentId: this.state.appointmentId,
                  notes: this.state.notes
            },
            success: function() {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully Added Notes!");
                self.loadAppointmentsFromServer();
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
    updateAppointmentStart: function() {
        this.setState({
            appointmentStarted: true
        });
    },
    startAppointment: function() {
        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/appointment/startAppointment",
            type: "POST",
            data: {
                  appointmentId: this.state.appointmentId
            },
            success: function() {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully started appointment for " + self.state.patientName);
                self.updateAppointmentStart();
                self.loadAppointmentsFromServer();
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
    updateAppointmentEnd: function() {
        this.setState({
            appointmentEnded: true
        });
    },
    endAppointment: function() {
        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/appointment/endAppointment",
            type: "POST",
            data: {
                  appointmentId: this.state.appointmentId
            },
            success: function() {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully ended appointment for " + self.state.patientName);
                self.updateAppointmentEnd();
                self.loadAppointmentsFromServer();
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
    componentDidMount: function () {
        this.loadAppointmentsFromServer();
    },
    render: function() {

        return(

        <div className="container">
            <div className="well well-lg">
                <div className="row">
                    <div className="col-md-12">
                        <div id="practitionerAppointmentsCalendar"></div>
                        <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                          <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">
                                    {this.state.patientName}
                                </h4>
                              </div>
                              <div className="modal-body">
                                  <div className="row">
                                      <div className="col-md-2">
                                          <p>Date:</p>
                                      </div>
                                      <div className="col-md-10">
                                          <p>{this.state.date}</p>
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div className="col-md-2">
                                          <p>Time:</p>
                                      </div>
                                      <div className="col-md-10">
                                          <p>{this.state.startTime} - {this.state.endTime}</p>
                                      </div>
                                  </div>
                                  <hr />
                                  <div className="row">
                                      <div className="col-md-2">
                                          <p>Reason for visit:</p>
                                      </div>
                                      <div className="col-md-10">
                                          <p>{this.state.reasonForVisit}</p>
                                      </div>
                                  </div>
                                  <hr />
                                  <div className="row">
                                      <div className="col-md-2">
                                          <p>Notes:</p>
                                      </div>
                                      <div className="col-md-10">
                                          <textarea type="text" rows="4" className="form-control" onChange={this.updateNotes} value={this.state.notes} />
                                      </div>
                                  </div>
                                  <hr />
                                  <div className="row">
                                      <div className="col-md-6">
                                          <button className="btn btn-success center-block" onClick={this.saveNotes}>Save Notes</button>
                                      </div>
                                      {this.state.appointmentStarted ? (
                                        <div className="col-md-6">
                                            <button className={this.state.appointmentEnded ? "btn btn-danger center-block disabled" : "btn btn-danger center-block" } onClick={this.endAppointment}>End Appointment</button>
                                        </div>
                                      ) : (
                                        <div className="col-md-6">
                                            <button className="btn btn-primary center-block" onClick={this.startAppointment}>Start Appointment</button>
                                        </div>
                                      )}
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        );

    }
});



if (document.getElementById('practitionerCalendar') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<ViewAppointments csrf_element="{{csrf_element}}"/>, document.getElementById('practitionerCalendar'));
}



var ViewAllAppointments = React.createClass({

    getInitialState: function() {
        return {
                  appointments: [],
                  appointmentId: -1,
                  patientName: '',
                  date: '',
                  startTime: '',
                  endTime: '',
                  reasonForVisit: '',
                  patientId: -1,
                  notes: '',
                  checkedIn: false
        };
    },
    updateAppointment: function(id) {
        var self = this;

        var notes = self.state.appointments[id-1].notes;
        if ( notes === null) {
            notes = "";
        }
        var checkInTime = self.state.appointments[id-1].checkInTime;
        var checkedIn = false
        if (checkInTime !== null) {
            var checkedIn = true
        }
        //need to do 'id-1' offset because id is 1 based
        this.setState({
            appointmentId: id,
            patientName: self.state.appointments[id-1].patientName,
            date: self.state.appointments[id-1].date,
            startTime: self.state.appointments[id-1].startTime,
            endTime: self.state.appointments[id-1].endTime,
            reasonForVisit: self.state.appointments[id-1].reasonForVisit,
            notes: notes,
            checkedIn: checkedIn
        });

    },
    updateNotes: function(evt) {
        this.setState({
            notes: evt.target.value
        });
    },
    loadCalendar: function() {
     var self = this;

     var initialLocaleCode = 'en';

     $('#practitionerAppointmentsCalendar').fullCalendar({
         header: {
             left: '',
             center: 'title',
             right: ''
         },
         timezone: 'America/New_York',
         defaultView: 'agendaDay',
         allDaySlot: false,
         weekends: false,
         nowIndicator: true,
         slotDuration: "00:15:00",
         locale: initialLocaleCode,
         navLinks: true, // can click day/week names to navigate views
         selectable: false,
         selectHelper: true,
         minTime: "06:00:00",
         maxTime: "18:00:00",
         editable: true,
         eventLimit: false, // allow "more" link when too many events
         eventOverlap: false,
         selectOverlap: false,
         eventStartEditable: false,
         eventDurationEditable: false,
         eventClick: function(event) {
            self.updateAppointment(event.appointmentId);
            // This makes it to where you can't close the modal by clicking away
            $('#myModal').modal('show');
         }

     });

     //Clears the calendar so results aren't compounded
     $('#practitionerAppointmentsCalendar').fullCalendar( 'removeEvents', function(event) {
         return true;
     });

     this.state.appointments.forEach(function(appointment) {

         var dateFormat = "MM-DD-YYYY HH:mm";
         var start = moment((appointment.date + " " + appointment.startTime), dateFormat);
         var end   = moment((appointment.date + " " + appointment.endTime), dateFormat);

         var color = "#3CB371";
         if (appointment.checkInTime === null) {
            color = "#444";
         }

         var eventData = {
             id: appointment.publicId,
             title: appointment.patientName + " (" + appointment.practitionerName + ")",
             start: start,
             end: end,
             appointmentId: appointment.publicId,
             color: color
         };

         $('#practitionerAppointmentsCalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
     });
    },
    loadAppointmentsFromServer: function() {
         var self = this;
        $.ajax({
           url: "http://localhost:8080/api/appointments"
        }).then(function (data) {
             self.setState({appointments: data._embedded.appointments});
            return self.loadCalendar();
        });
    },
    updateCheckIn: function() {
        this.setState({
            checkedIn: true
        });
    },
    checkInUser: function() {
        var self = this;
        /**
            Since a post request is being made. We must pass along this
            CSRF token.

            We need this because we have csrf protection enabled in SecurityConfig
        */

        if (csrf_element !== null) {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
            });
        }
        $.ajax({
            url: "http://localhost:8080/appointment/checkIn",
            type: "POST",
            data: {
                  appointmentId: this.state.appointmentId
            },
            success: function() {
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully checked in " + self.state.patientName);
                self.updateCheckIn()
                self.loadAppointmentsFromServer();
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
    componentDidMount: function () {
        this.loadAppointmentsFromServer();
    },
    render: function() {

        return(

        <div className="container">
            <div className="well well-lg">
                <h3 className="text-center">Today&apos;s Appointments</h3>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <div id="practitionerAppointmentsCalendar"></div>
                        <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">
                                    {this.state.patientName}
                                </h4>
                              </div>
                              <div className="modal-body">
                                  <div className="row">
                                      <div className="col-md-3">
                                          <p>Appointment Date:</p>
                                      </div>
                                      <div className="col-md-9">
                                          <p>{this.state.date}</p>
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div className="col-md-3">
                                          <p>Appointment Time:</p>
                                      </div>
                                      <div className="col-md-9">
                                          <p>{this.state.startTime} - {this.state.endTime}</p>
                                      </div>
                                  </div>
                                  <hr />
                                  <div className="row">
                                      <div className="col-md-12">
                                          {this.state.checkedIn ? (
                                              <button className="btn btn-default center-block disabled">Checked In</button>
                                          ) : (
                                              <button className="btn btn-success center-block" onClick={this.checkInUser}>Check In</button>
                                          )}
                                      </div>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        );

    }
});



if (document.getElementById('receptionistCalendar') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<ViewAllAppointments csrf_element="{{csrf_element}}"/>, document.getElementById('receptionistCalendar'));
}














/*TODO:ctn Eventually will want to convert this code (as well as the login/signup page) to utilize REACT */
/*TODO:ctn some code is repeated... This should be cleaned up */


//loads date picker for add patient form
var picker = new Pikaday(
{
    setDefaultDate: new Date(1970, 1, 1),
    field: document.getElementById('datepicker'),
    firstDay: 0,
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(),
    format: 'MMMM DD, YYYY',
    yearRange: 100
});

picker.setMoment(moment().date(1).month(0).year(1970));



$("#btnLogin").click(function(e) {
  validateLoginForm($(this), e);
});

$("#btnSignup").click(function(e) {
  validateSignupForm($(this), e);
});

$("#btnAddPatient").click(function(e){
    validateAddPatientForm($(this), e);
});

function validateAddPatientForm(element, e){
    var firstname = $("#inputFirstName");
    var lastname = $("#inputLastName");
    var zipcode = $("#inputLastName");
    var phonenumber = $("inputPhoneNumber");
    var address = $("inputAddress");
    var email = $("inputEmailAddress");
    var city = $("inputCIty");
    var dob = $("inputDOB");
    var maritalstatus = $("selectMaritalStatus");
    var gen = $("selectGender");
    var children = $("inputNumberOfChildren");
    var errorMessage = "";

    element.siblings("div.errorDiv").each(function(){
        $(this).remove();
    });

    var firstNameErrorMessage = returnNameLengthErrorMessage();
    if ( firstNameErrorMessage.length !== 0 ) {
      errorMessage += firstNameErrorMessage;
      firstname.addClass("invalid");
      firstname.removeClass("valid");
    } else {
      firstname.addClass("valid");
      firstname.removeClass("invalid");
    }

    var lastNameErrorMessage = returnLastNameLengthErrorMessage();
    if ( lastNameErrorMessage.length !== 0 ) {
      errorMessage += lastNameErrorMessage;
      lastname.addClass("invalid");
      lastname.removeClass("valid");
    } else {
      lastname.addClass("valid");
      lastname.removeClass("invalid");
    }

    var phoneNumberErrorMessage = returnPhoneLengthErrorMessage();
    if (phoneNumberErrorMessage.length !== 0 ) {
      errorMessage += phoneNumberErrorMessage;
      phonenumber.addClass("invalid");
      phonenumber.removeClass("valid");
    } else {
      phonenumber.addClass("valid");
      phonenumber.removeClass("invalid");
    }

    var zipCodeErrorMessage = returnZipLengthErrorMessage();
    if ( zipCodeErrorMessage.length !== 0 ) {
      errorMessage += zipCodeErrorMessage;
      zipcode.addClass("invalid");
      zipcode.removeClass("valid");
    } else {
      zipcode.addClass("valid");
      zipcode.removeClass("invalid");
    }

    var addressErrorMessage = returnAddressLengthErrorMessage();
    if ( addressErrorMessage.length !== 0 ) {
      errorMessage += addressErrorMessage;
      address.addClass("invalid");
      address.removeClass("valid");
    } else {
      address.addClass("valid");
      address.removeClass("invalid");
    }

    var emailErrorMessage = returnEmailLengthErrorMessage();
    if ( emailErrorMessage.length !== 0 ) {
      errorMessage += emailErrorMessage;
      email.addClass("invalid");
      email.removeClass("valid");
    } else {
      email.addClass("valid");
      email.removeClass("invalid");
    }

    var cityErrorMessage = returnCityLengthErrorMessage();
    if ( cityErrorMessage.length !== 0 ) {
      errorMessage += cityErrorMessage;
      city.addClass("invalid");
      city.removeClass("valid");
    } else {
      city.addClass("valid");
      city.removeClass("invalid");
    }

    var dobErrorMessage = returnDOBLengthErrorMessage();
    if ( dobErrorMessage.length !== 0 ) {
      errorMessage += dobErrorMessage;
      dob.addClass("invalid");
      dob.removeClass("valid");
    } else {
      dob.addClass("valid");
      dob.removeClass("invalid");
    }

    var maritalStatusErrorMessage = returnMarriedLengthErrorMessage();
    if (maritalStatusErrorMessage.length !== 0 ) {
      errorMessage += maritalStatusErrorMessage;
      maritalstatus.addClass("invalid");
      maritalstatus.removeClass("valid");
    } else {
      maritalstatus.addClass("valid");
      maritalstatus.removeClass("invalid");
    }

    var genderErrorMessage = returnGenderLengthErrorMessage();
    if ( genderErrorMessage.length !== 0 ) {
      errorMessage += genderErrorMessage;
      gen.addClass("invalid");
      gen.removeClass("valid");
    } else {
      gen.addClass("valid");
      gen.removeClass("invalid");
    }

    var childrenErrorMessage = returnChildrenLengthErrorMessage();
    if ( childrenErrorMessage.length !== 0 ) {
      errorMessage += childrenErrorMessage;
      children.addClass("invalid");
      children.removeClass("valid");
    } else {
      children.addClass("valid");
      children.removeClass("invalid");
    }

    if (errorMessage.length !== 0) {
      e.preventDefault();
      element.parent().prepend('<div class="errorDiv"><div class="alert alert-danger">'+errorMessage+'</div></div>');
    }
}

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

function returnNameLengthErrorMessage(){
     var errorMessage = "";
     var fName = document.getElementsByName("inputFirstName");
     if(fName[0].value.length === 0){
         errorMessage += "Name cannot be left blank.\n";
     }
     return errorMessage;
 }

function returnLastNameLengthErrorMessage(){
    var errorMessage = "";
    var lName = document.getElementsByName("inputLastName");
    if(lName[0].value.length === 0){
        errorMessage += "Last Name cannot be left blank.\n";
    }
    return errorMessage;
}

function returnZipLengthErrorMessage(){
    var errorMessage = "";
    var lName = document.getElementsByName("inputZipCode");
    if(lName[0].value.length < 5){
        errorMessage += "Zip must contain at least 5 numbers.\n";
    }
    return errorMessage;
}

function returnPhoneLengthErrorMessage(){
    var errorMessage = "";
    var pNumber = document.getElementsByName("inputPhoneNumber");
    if(pNumber[0].value.length === 0 || pNumber[0].value.length < 10 || pNumber[0].value.length > 10){
        errorMessage += "Phone Number is invalid.\n";
    }
    return errorMessage;
}

function returnAddressLengthErrorMessage(){
    var errorMessage = "";
    var address = document.getElementsByName("inputAddress");
    if(address[0].value.length === 0){
        errorMessage += "address cannot be left blank.\n";
    }
    return errorMessage;
}

function returnCityLengthErrorMessage(){
    var errorMessage = "";
    var city = document.getElementsByName("inputCity");
    if(city[0].value.length === 0){
        errorMessage += "City cannot be left blank.\n";
    }
    return errorMessage;
}

function returnDOBLengthErrorMessage(){
    var errorMessage = "";
    var dob = document.getElementsByName("inputDOB");
    if(dob[0].value.length === 0){
        errorMessage += "DOB cannot be left blank.\n";
    }
    return errorMessage;
}

function returnMarriedLengthErrorMessage(){
    var errorMessage = "";
    var status = document.getElementsByName("selectMaritalStatus");
    if(status[0].value.length === 0){
        errorMessage += "Marital Status cannot be left blank.\n";
    }
    return errorMessage;
}

function returnGenderLengthErrorMessage(){
    var errorMessage = "";
    var gender = document.getElementsByName("selectGender");
    if(gender[0].value.length === 0){
        errorMessage += "Gender cannot be left blank.\n";
    }
    return errorMessage;
}

function returnChildrenLengthErrorMessage(){
    var errorMessage = "";
    var children = document.getElementsByName("inputNumberOfChildren");
    if(children[0].value.length === 0){
        errorMessage += "Number of Children cannot be left blank.\n";
    }
    return errorMessage;
}

function returnEmailLengthErrorMessage(){
    var errorMessage = "";
    var email = document.getElementsByName("inputEmailAddress");
    if(email[0].value.length === 0){
        errorMessage += "Email cannot be left blank.\n";
    }else if(email[0].value.includes("@") === false || email[0].value.includes(".com") === false ){
        errorMessage += "Email is invalid.\n";
    }
    return errorMessage;
}

$(document).ready(function() {

        var initialLocaleCode = 'en';

        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaWeek,agendaDay'
            },
            height: 300,
            defaultView: 'agendaWeek',
            allDaySlot: false,
            weekends: false,
            eventOverlap: false,
            slotDuration: "00:15:00",
            locale: initialLocaleCode,
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectHelper: true,
            select: function(start, end) {
                alert(start);
                alert(end);

            },
            minTime: "06:00:00",
            maxTime: "18:00:00",
            editable: true,
            eventLimit: false // allow "more" link when too many events
        });

        // build the locale selector's options
        $.each($.fullCalendar.locales, function(localeCode) {
            $('#locale-selector').append(
                $('<option/>')
                    .attr('value', localeCode)
                    .prop('selected', localeCode == initialLocaleCode)
                    .text(localeCode)
            );
        });

        // when the selected option changes, dynamically change the calendar option
        $('#locale-selector').on('change', function() {
            if (this.value) {
                $('#calendar').fullCalendar('option', 'locale', this.value);
            }
        });

});