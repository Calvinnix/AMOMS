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

        var dltUserId = this.props.user.username;
        var dltUserIdTarget = "#" + this.props.user.username;

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
                        <button className="btn btn-danger" data-toggle="modal" data-target={dltUserIdTarget}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                        <div className="modal fade" id={dltUserId} tabindex="-1" role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                         <h4 className="modal-title"/>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete {this.props.user.username}?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={this.handleDelete} data-dismiss="modal">Yes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            <div className="faq">
                <div className="panel panel-default">
                  <div className="panel-body">
                    <input id="inputSearch" type="text" className="form-control" placeholder="Search" id="searchBar"/>
                    <div className="faq_not_found">
                        <p>No Matches were found</p>
                    </div>
                  </div>
                  <table className="table">
                    <thead className="panel-heading">
                        <tr className=" ">
                            <th>Username</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Enabled</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className=" ">
                        {rows}
                    </tbody>
                  </table>
                </div>
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
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully deleted patient");
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
        var modalDltId = "dlt" + modalId;
        var modalDltIdTarget = "#" + modalDltId;

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
                    <button type="button" className="btn btn-danger" data-toggle="modal" data-target={modalDltIdTarget}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                    <div className="modal fade" id={modalDltId} tabindex="-1" role="dialog" aria-labelledby={modalLabelId}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                     <h4 className="modal-title" id={modalLabelId}>Delete Confirmation</h4>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete {this.props.patient.firstName} {this.props.patient.middleName} {this.props.patient.lastName}?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.handleDelete} data-dismiss="modal">Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
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
            <div className="faq">
                <div className="panel panel-default">
                  <div className="panel-body">
                    <input type="text" className="form-control" placeholder="Search" id="searchBar" />
                    <div className="faq_not_found">
                        <p>No Matches were found</p>
                    </div>
                  </div>
                  <table className="table">
                    <thead className="panel-heading">
                        <tr className=" ">
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                            <th>Practitioner</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className=" ">
                        {rows}
                    </tbody>
                  </table>
                </div>
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
    //Initializes selectpicker after every user choice is loaded
    componentDidUpdate: function(){
        if (this.props.users.length > 0){
            $('#practitionerSelect').selectpicker({
              liveSearch: true,
              maxOptions: 1
            });
       }
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
            <select className="form-control" name="selectRole" id="practitionerSelect" data-live-search="true" value={this.props.value} onChange={this.props.onChange}>
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
    //Initializes selectpicker after all patients are loaded
    componentDidUpdate: function(){
        if (this.props.patients.length > 0){
            $('#patientSelect').selectpicker({
              liveSearch: true,
              maxOptions: 1
            });
       }
    },

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
            <select className="form-control" id="patientSelect" data-live-search="true" value={this.props.value} onChange={this.props.onChange}>
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
        var pracDisplay = document.getElementsByClassName('filter-option pull-left');
        if (evt.target.value !== "") {
            this.setState({
                patientId: evt.target.value
            });
            this.updatePractitionerName(this.state.patients[evt.target.value-1].practitionerName); //Subtract 1 from index because it isn't 0 based
            pracDisplay[1].textContent = this.state.patients[evt.target.value-1].practitionerName;
        } else {
            this.setState({
                patientId: -1
            });
            this.updatePractitionerName(this.props.patients[evt.target.value-1].practitionerName);
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

var PrescriptionOption = React.createClass({
    render: function() {
        return (
            <option value={this.props.prescription.name}>{this.props.prescription.name}</option>
        );
    }
});

var PrescriptionSelect = React.createClass({
    propTypes: {
                prescriptionName: React.PropTypes.string
    },
    componentDidUpdate: function(){
        $('#prescriptionSearch').selectpicker({
          liveSearch: true,
          maxOptions: 1
        });
    },
    render: function() {
        var prescriptions = [];
        var index = 0;
        //Adding blank default to ensure selected value will get set
        prescriptions.push(<option key={index}></option>);
        this.props.prescriptions.forEach(function(prescription) {
            index ++;
            prescriptions.push(<PrescriptionOption prescription={prescription} key={index}/>);
        });
        return (
            <select id="prescriptionSearch" className="form-control" value={this.props.value} onChange={this.props.onChange}>
                {prescriptions}
            </select>
        );
    }
});



var ListPrescriptions  = React.createClass({
    propTypes: {
            prescriptions: React.PropTypes.array
    },
    render: function() {
        var self = this;
        var prescriptions = [];
        var index = 0;
        this.props.prescriptions.forEach(function(prescription) {
            index++;
            prescriptions.push(
                <li className="list-group-item" key={index}>
                    <div className="row">
                        <div className="col-md-10">{prescription}</div>
                        <div className="col-md-2">
                            <button className="btn btn-danger pull-right" onClick={() => self.props.removePrescription({prescription})}>
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </li>
            );
        });
        return (
            <ul className="list-group">
                {prescriptions}
            </ul>
        );
    }
});

var PatientHistory = React.createClass({
  getInitialState: function() {
    return {
      appointmentHistory: [],
      appointments: []
    };
  },
  loadAppointmentHistoryFromServer: function() {
    var self = this;
    $.ajax({
       url: "http://localhost:8080/api/patients/"+self.props.patientId+"/appointments"
    }).then(function (data) {
       self.setState({appointmentHistory: data._embedded.appointments});
       return self.populateAppointments();
    });
  },
  componentDidMount: function() {
    this.loadAppointmentHistoryFromServer();
  },
  populateAppointments: function() {
    var index = 0;
    var self = this;
    this.setState({
      appointments: self.state.appointments.concat(
        <div className="row" key={index}>
          <hr />
          <div className="col-md-2"><b>Practitioner</b></div>
          <div className="col-md-2"><b>Date/Time</b></div>
          <div className="col-md-2"><b>Reason for visit</b></div>
          <div className="col-md-3"><b>Notes</b></div>
          <div className="col-md-3"><b>Prescriptions</b></div>
        </div>
      )
    });
    var appointments = [];
    this.state.appointmentHistory.forEach(function(appointment) {
        if (appointment.sessionEndTime !== null) {
          index++;
          var prescriptions = [];
          $.ajax({
             url: "http://localhost:8080/api/appointments/"+appointment.publicId+"/prescriptions"
          }).then(function (data) {
             prescriptions = data._embedded.prescriptions;
             var prescriptionList = [];
             prescriptions.forEach(function(prescription) {
                prescriptionList.push(<li className="list-group-item word-wrap" key={prescription.publicId}>{prescription.name}</li>)
             });
             self.setState({
                appointments: self.state.appointments.concat(
                  <div className="row" key={appointment.publicId}>
                     <hr />
                     <div className="col-md-2">{appointment.practitionerName}</div>
                     <div className="col-md-2">{appointment.date} <br /> {appointment.startTime} - {appointment.endTime}</div>
                     <div className="col-md-2 word-wrap">{appointment.reasonForVisit}</div>
                     <div className="col-md-3 word-wrap">{appointment.notes}</div>
                     <div className="col-md-3">
                        <ul className="list-group">
                          {prescriptionList}
                        </ul>
                     </div>
                   </div>
                )
             });
          });
        }
    });
  },
  render: function() {
    return (
      <div>
        {this.state.appointments}
      </div>
    );
  }
});

var ViewAppointments = React.createClass({

    getInitialState: function() {
        return {
                  appointments: [],
                  prescriptions: [],
                  addedPrescriptions: [],
                  prescriptionName: '',
                  prescriptionDescription: '',
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
                  appointmentEnded: false,
                  checkedIn: false,
                  showHistory: false
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

        var checkInTime = self.state.appointments[id-1].checkInTime;
        var checkedIn = false;
        if (checkInTime !== null) {
          checkedIn = true;
        }

        //need to do 'id-1' offset because id is 1 based
        this.setState({
            appointmentId: id,
            patientName: self.state.appointments[id-1].patientName,
            patientId: self.state.appointments[id-1].patientId,
            date: self.state.appointments[id-1].date,
            startTime: self.state.appointments[id-1].startTime,
            endTime: self.state.appointments[id-1].endTime,
            reasonForVisit: self.state.appointments[id-1].reasonForVisit,
            notes: notes,
            appointmentStarted: appointmentStarted,
            appointmentEnded: appointmentEnded,
            checkedIn: checkedIn,
            showHistory: false,
            addedPrescriptions: []
        });

        this.loadAddedPrescriptionsFromServer();

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
             title: appointment.patientName + "\n" + appointment.reasonForVisit,
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
    loadPrescriptionsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/prescriptions"
        }).then(function (data) {
            self.setState({prescriptions: data._embedded.prescriptions});
        });
    },
    loadAddedPrescriptionsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/appointments/"+self.state.appointmentId+"/prescriptions"
        }).then(function (data) {
            data._embedded.prescriptions.forEach(function (prescription) {
              self.setState({
                addedPrescriptions: self.state.addedPrescriptions.concat(prescription['name'])
              });
            });
        });
    },
    addPrescriptions: function() {

        if (this.state.prescriptionName === "") {
            return;
        }

        if (!($.inArray(this.state.prescriptionName, this.state.addedPrescriptions) > -1)) {
          var tempArray = this.state.addedPrescriptions;
          tempArray.push(this.state.prescriptionName);
          this.setState({
            addedPrescriptions: tempArray
          });
        }
    },
    removePrescription: function(name) {
        var self = this;
        name = name['prescription']; //Extract name from the JSON array

        var index = $.inArray(name, this.state.addedPrescriptions);

        this.state.addedPrescriptions.splice(index, 1);
        this.setState({
            addedPrescriptions: self.state.addedPrescriptions
        });
    },
    saveChanges: function() {

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
            url: "http://localhost:8080/practitioner_appointments/saveChanges",
            type: "POST",
            data: {
                  appointmentId: this.state.appointmentId,
                  notes: this.state.notes,
                  prescriptions: JSON.stringify(this.state.addedPrescriptions)
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
                toastr.success("Successfully Updated Appointment!");
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
            url: "http://localhost:8080/practitioner_appointments/startAppointment",
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
                console.log(xhr.message())
            }
        });
    },
    updateAppointmentEnd: function() {
        this.setState({
            appointmentEnded: true
        });
    },
    updatePrescriptionName: function(evt) {
        this.setState({
            prescriptionName: evt.target.value
        });
    },
    updatePrescriptionDescription: function(evt) {
        this.setState({
            prescriptionDescription: evt.target.value
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
            url: "http://localhost:8080/practitioner_appointments/endAppointment",
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
    showHistory: function() {
      this.setState({
        showHistory: true
      });
    },
    hideHistory: function() {
      this.setState({
        showHistory: false
      });
    },
    componentDidMount: function () {
        this.loadAppointmentsFromServer();
        this.loadPrescriptionsFromServer();
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
                                    <div className="col-md-3">
                                      <p>Prescriptions:</p>
                                    </div>
                                    <div className="col-md-7">
                                        <PrescriptionSelect prescriptions={this.state.prescriptions} value={this.state.prescriptionName} onChange={this.updatePrescriptionName} />
                                    </div>
                                    <div className="col-md-2">
                                      <button className="btn btn-success center-block" onClick={this.addPrescriptions}>Add</button>
                                    </div>
                                  </div>
                                  <hr />
                                  <div className="row">
                                    <div className="col-md-3">
                                      <p>Added Prescriptions:</p>
                                    </div>
                                    <div className="col-md-7">
                                        <ListPrescriptions prescriptions={this.state.addedPrescriptions} removePrescription={this.removePrescription} />
                                    </div>
                                    <div className="col-md-2"></div>
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
                                  {this.state.showHistory &&
                                    <PatientHistory patientId={this.state.patientId}/>
                                  }
                                  <hr />
                                  <div className="row">
                                      {this.state.appointmentStarted ? (
                                        <div className="col-md-4">
                                            <button className={this.state.appointmentEnded ? "btn btn-danger center-block disabled" : "btn btn-danger center-block" } onClick={this.endAppointment}>End Appointment</button>
                                        </div>
                                      ) : (
                                        <div className="col-md-4">
                                            <button className={this.state.checkedIn ? "btn btn-primary center-block" : "btn btn-primary center-block disabled"} onClick={this.startAppointment}>Start Appointment</button>
                                        </div>
                                      )}
                                      <div className="col-md-4">
                                        {this.state.showHistory ? (
                                            <button className="btn btn-default center-block" onClick={this.hideHistory}>Hide Patient History</button>
                                        ):(
                                            <button className="btn btn-default center-block" onClick={this.showHistory}>Show Patient History</button>
                                        )}
                                      </div>
                                      <div className="col-md-4">
                                        <button className={this.state.appointmentEnded || !this.state.appointmentStarted ? "btn btn-success center-block disabled" : "btn btn-success center-block"} onClick={this.saveChanges}>Save Changes</button>
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
    cancelAppointment: function() {
      var self = this;
      if (csrf_element !== null) {
        $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
          jqXHR.setRequestHeader('X-CSRF-Token', csrf_element.value);
        });
      }

      $.ajax({
        url: "http://localhost:8080/api/appointments/"+this.state.appointmentId,
        type: 'DELETE',
        success: function(result) {
          toastr.options = {
            "debug": false,
            "positionClass": "toast-top-center",
            "onclick": null,
            "fadeIn": 300,
            "fadeOut": 1000,
            "timeOut": 5000,
            "extendedTimeOut": 1000
          }
          toastr.success("Successfully deleted appointment!");
          $("#practitionerAppointmentsCalendar").fullCalendar('removeEvents', self.state.appointmentId);
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
        var id = "#" + this.state.appointmentId;

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
                                      <div className="col-md-6">
                                          {this.state.checkedIn ? (
                                              <button className="btn btn-default center-block disabled">Checked In</button>
                                          ) : (
                                              <button className="btn btn-success center-block" onClick={this.checkInUser}>Check In</button>
                                          )}
                                      </div>
                                      <div className="col-md-6">
                                          {this.state.checkedIn ? (
                                              <button className="btn btn-default center-block disabled">Cancel</button>
                                          ) : (
                                              <button className="btn btn-danger center-block" data-toggle="modal" data-dismiss="modal" href={id} >Cancel Appointment</button>
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
            <div className="modal fade" id={this.state.appointmentId} tabindex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                             <h4 className="modal-title">Delete Confirmation</h4>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this appointment?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.cancelAppointment} data-dismiss="modal">Yes</button>
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




var Prescription = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
        prescription:      React.PropTypes.object.isRequired,
        csrf_element: React.PropTypes.object.isRequired
    },
    /**
        This sets the initial state of the User class. As well as defines initial state variables
    */
    getInitialState: function() {
        return {
            prescriptions: [],
            display: true,
            editing: false,
            name: this.props.prescription.name,
            originalName: this.props.prescription.name,
            description: this.props.prescription.description,
            originalDescription: this.props.prescription.description,
        };
    },
    componentDidMount: function () {
        this.loadPrescriptionsFromServer();
    },
    loadPrescriptionsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/prescriptions"
        }).then(function (data) {
            self.setState({prescriptions: data._embedded.prescriptions});
        });
    },
    updateName: function(evt) {
        this.setState({
            name: evt.target.value
        });
    },
    updateDescription: function(evt) {
        this.setState({
            description: evt.target.value
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
            url: self.props.prescription._links.self.href,
            type: 'DELETE',
            success: function(result) {
                self.setState({display: false});
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully deleted " + self.state.name);
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
        this.setState({
            editing: true
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
            url: "http://localhost:8080/prescriptions/editPrescription",
            type: "POST",
            data: {
                  id: this.props.prescription.publicId,
                  name: this.state.name,
                  description: this.state.description
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
                self.props.loadPrescriptionsFromServer();
                toastr.success("Successfully Edited Prescription!");
                self.setState({
                    editing: false
                })
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
            name: self.state.originalName,
            description: self.state.originalDescription,
            editing: false
        });
    },
    /**
        Renders the HTML
    */
    render: function() {

        var dltPrescriptionId = this.props.prescription.name;
        var dltPrescriptionTarget = "#" + this.props.prescription.name;

        if (this.state.display == false) {
            return null;
        } else {
            /**
                This HTML provides fields to show user data.
            */
            return (
                this.state.editing ? (
                    <tr>
                      <td className="col-md-4">{this.props.prescription.name}</td>
                      <td className="col-md-6">
                        <textarea type="text" rows="4" className="form-control" onChange={this.updateDescription} placeholder="Prescription Description" value={this.state.description} />
                      </td>
                      <td className="col-md-1">
                        <button className="btn btn-success" onClick={this.handleEditConfirm}>
                            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        </button>
                      </td>
                      <td className="col-md-1">
                        <button className="btn btn-danger" onClick={this.handleEditCancel}>
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                      </td>
                    </tr>
                ) : (
                    <tr>
                      <td className="col-md-4">{this.props.prescription.name}</td>
                      <td className="col-md-6">{this.props.prescription.description}</td>
                      <td className="col-md-1">
                        <button className="btn btn-warning" onClick={this.handleEdit}>
                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </button>
                      </td>
                      <td className="col-md-1">
                        <button className="btn btn-danger" data-toggle="modal" data-target={dltPrescriptionTarget}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                        <div className="modal fade" id={dltPrescriptionId} tabindex="-1" role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                         <h4 className="modal-title">Delete Confirmation</h4>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete {this.props.prescription.name}?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={this.handleDelete} data-dismiss="modal">Yes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </td>
                    </tr>
                )
            );
        }
    }

});

var PrescriptionTable = React.createClass({
    /**
        propTypes defines the values that this class will be expecting as properties.
    */
    propTypes: {
            prescriptions: React.PropTypes.array.isRequired
    },
    /**
        Renders the HTML
    */
    render: function() {
        var self = this;
        var rows = [];
        var index = 0;
        this.props.prescriptions.forEach(function(prescription) {
            index++;
            rows.push(<Prescription csrf_element={csrf_element} prescription={prescription} key={prescription.publicId} loadPrescriptionsFromServer={self.props.loadPrescriptionsFromServer} />);
        });
        return (
            <div className="faq">
                <div className="panel panel-default">
                  <div className="panel-body">
                    <input id="searchBar" type="text" className="form-control" placeholder="Search" />
                    <div className="faq_not_found">
                        <p>No Matches were found</p>
                    </div>
                  </div>
                  <table className="table">
                    <thead className="panel-heading">
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                  </table>
                </div>
            </div>
        );
    }
});

var AllPrescriptions = React.createClass({
    /**
        This method loads the initial state variables
    */

    getInitialState: function() {
        return {
                  prescriptions: [],
                  name: '',
                  description: ''
                };
    },
    /**
        This method fires when the component has mounted
    */
    componentDidMount: function () {
        this.loadPrescriptionsFromServer();
    },
    /**
        This method loads the prescriptions from the server
    */
    loadPrescriptionsFromServer: function() {
        var self = this;
        $.ajax({
            url: "http://localhost:8080/api/prescriptions"
        }).then(function (data) {
            self.setState({prescriptions: data._embedded.prescriptions});
        });
    },
    /**
        This method handles the adding of a user. (via AJAX)
    */
    handleAddPrescription: function() {
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
            url: "http://localhost:8080/practitioner_appointments/addPrescription",
            type: "POST",
            data: {
                  name: this.state.name,
                  description: this.state.description
            },
            success: function() {
                self.loadPrescriptionsFromServer();
                toastr.options = {
                    "debug": false,
                    "positionClass": "toast-top-center",
                    "onclick": null,
                    "fadeIn": 300,
                    "fadeOut": 1000,
                    "timeOut": 5000,
                    "extendedTimeOut": 1000
                }
                toastr.success("Successfully Added Prescription!");
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

    updateName: function(evt) {
        this.setState({
            name: evt.target.value
        });
    },
    updateDescription: function(evt) {
        this.setState({
            description: evt.target.value
        });
    },
    render() {
        return (
            <div>
                <div className="container">
                    <div className="well well-lg">
                        <div className="row">
                            <div className="col-md-3">
                                <label>Name:</label>
                                <input type="text" className="form-control" placeholder="Prescription Name" value={this.state.name} onChange={this.updateName} />
                            </div>
                            <div className="col-md-6">
                                <label>Description:</label>
                                <textarea type="text" rows="4" className="form-control" onChange={this.updateDescription} placeholder="Prescription Description" value={this.state.description} />
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-primary center-block" id="btnAddPrescription" onClick={this.handleAddPrescription}>Add Prescription</button>
                            </div>
                        </div>
                    </div>
                    <PrescriptionTable prescriptions={this.state.prescriptions} csrf_element={csrf_element} loadPrescriptionsFromServer={this.loadPrescriptionsFromServer} />
                </div>
            </div>
        );
    }
});


if (document.getElementById('allPrescriptions') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<AllPrescriptions csrf_element="{{csrf_element}}"/>, document.getElementById('allPrescriptions'));
}

var PatientViewReport = React.createClass({
  getInitialState: function() {
      return {
        appointments: [],
        month: '',
        year: '',
        day: '',
        practitionerName: ''
      };
    },
    loadAppointmentsFromServer: function() {
      var self = this;
      $.ajax({
        url: "http://localhost:8080/api/appointments"
      }).then(function (data) {
        self.setState({appointments: data._embedded.appointments});
      });
    },
    componentDidMount: function() {
      this.loadAppointmentsFromServer();
    },
    handlePrint: function() {
      $("#patientViewReport").printThis();
    },
    updatePractitionerName: function(evt) {
      this.setState({
        practitionerName: evt.target.value
      });
    },
    updateYear: function(evt) {
      this.setState({
        year: evt.target.value
      });
    },
    updateMonth: function(evt) {
      this.setState({
        month: evt.target.value
      });
    },
    updateDay: function(evt) {
      this.setState({
        day: evt.target.value
      });
    },
    getMonthName: function(monthNumber) {
      var monthName = "";

      switch(Number(monthNumber)) {
        case 1:
          monthName = "January"
          break;
        case 2:
          monthName = "February"
          break;
        case 3:
          monthName = "March"
          break;
        case 4:
          monthName = "April"
          break;
        case 5:
          monthName = "May"
          break;
        case 6:
          monthName = "June"
          break;
        case 7:
          monthName = "July"
          break;
        case 8:
          monthName = "August"
          break;
        case 9:
          monthName = "September"
          break;
        case 10:
          monthName = "October"
          break;
        case 11:
          monthName = "November"
          break;
        case 12:
          monthName = "December"
          break;
        default:
          monthName = "ERROR"
      }

      return monthName;
    },
    render: function() {
      var self = this;
      var noShowCount = 0;
      var seenCount = 0;
      var rows = [];
      var practitioners = [<option value={''} key={-1}>All</option>];
      var addedPractitionerNames = [];
      var years = [<option value={''} key={-1}>All</option>];
      var addedYears = [];
      var months = [<option value={''} key={-1}>All</option>];
      var addedMonths = [];
      var days = [<option value={''} key={-1}>All</option>];
      var addedDays = [];
      var index = 0;

      this.state.appointments.forEach(function(appointment) {
        //Check if appointment is in the past
        if (moment(appointment.date).isBefore(moment().subtract(1, 'days'))) {

          var practitionerNameOption = <option value={appointment.practitionerName} key={appointment.practitionerName}>{appointment.practitionerName}</option>
          if (($.inArray(appointment.practitionerName, addedPractitionerNames) === -1)) {
            practitioners.push(practitionerNameOption);
            addedPractitionerNames.push(appointment.practitionerName);
          }

          var year = (appointment.date).split('-')[2]; //This assumes month-day-year format

          var yearOption = <option value={year} key={year}>{year}</option>
          if (($.inArray(year, addedYears) === -1)) {
            years.push(yearOption);
            addedYears.push(year);
          }

          var month = (appointment.date).split('-')[0]; //This assumes month-day-year format
          var monthName = self.getMonthName(month)

          var monthOption = <option value={month} key={month}>{monthName}</option>
          if (($.inArray(month, addedMonths) === -1)) {
            months.push(monthOption);
            addedMonths.push(month);
          }

          var day = (appointment.date).split('-')[1]; //This assumes month-day-year format

          var dayOption = <option value={day} key={day}>{day}</option>
          if (($.inArray(day, addedDays) === -1)) {
            days.push(dayOption);
            addedDays.push(day);
          }

          if ( (self.state.practitionerName === appointment.practitionerName     || self.state.practitionerName === '') &&
               (self.state.year             === (appointment.date).split('-')[2] || self.state.year === '')             &&
               (self.state.month            === (appointment.date).split('-')[0] || self.state.month === '')            &&
               (self.state.day              === (appointment.date).split('-')[1] || self.state.day === '') ) {

              if (appointment.checkInTime === null) {
                noShowCount++;
              } else {
                seenCount++;
              }

            index++;
            rows.push(
              <div className={appointment.checkInTime === null ? 'row text-danger' : 'row text-success'} key={index}>
                <div className="col-md-3 col-print-2">
                  {appointment.patientName}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.patientNumber}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.date}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.startTime} - {appointment.endTime}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.practitionerName}
                </div>
              </div>
            );
          }
        }
      });
      return(
        <div>
          <h1>Patient Visits Report</h1>
          <button className="btn btn-primary" onClick={this.handlePrint}>Print</button>
          <hr />
          <div className="row">
            <div className="col-md-3 col-print-3">
              <label>Practitioner:</label>
              <select className="form-control" value={this.state.practitionerName} onChange={this.updatePractitionerName}>
                {practitioners}
              </select>
            </div>
            <div className="col-md-3 col-print-3">
              <label>Year:</label>
              <select className="form-control" value={this.state.year} onChange={this.updateYear}>
                {years}
              </select>
            </div>
            <div className="col-md-3 col-print-3">
              <label>Month:</label>
              <select className="form-control" value={this.state.month} onChange={this.updateMonth}>
                {months}
              </select>
            </div>
            <div className="col-md-3 col-print-3">
              <label>Day:</label>
              <select className="form-control" value={this.state.day} onChange={this.updateDay}>
                {days}
              </select>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-6 col-print-6">
              <h2 className="text-success">Seen Count: {seenCount}</h2>
            </div>
            <div className="col-md-6 col-print-6">
              <h2 className="text-danger">No Show Count: {noShowCount}</h2>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-3 col-print-3">
              <b>Name</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Number</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Date</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Start - End</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Practitioner</b>
            </div>
          </div>
          {rows}
          <hr />
        </div>
      );
    }
});

if (document.getElementById('patientViewReport') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<PatientViewReport csrf_element="{{csrf_element}}"/>, document.getElementById('patientViewReport'));
}

var MissedAppointmentsReport = React.createClass({
  getInitialState: function() {
      return {
        appointments: []
      };
    },
    loadAppointmentsFromServer: function() {
      var self = this;
      $.ajax({
        url: "http://localhost:8080/api/appointments"
      }).then(function (data) {
        self.setState({appointments: data._embedded.appointments});
      });
    },
    componentDidMount: function() {
      this.loadAppointmentsFromServer();
    },
    handlePrint: function() {
      $("#missedAppointmentsReport").printThis();
    },
    render: function() {
      var self = this;
      var rows = [];
      this.state.appointments.forEach(function(appointment) {

        var sevenDaysAgo    = moment().subtract(7, 'days'); //todo:ctn this edge case needs to be tested
        var currentDay      = moment().subtract(1, 'days'); //Need to subtract 1 day to not include current appoinments
        var appointmentDate = moment(appointment.date);

        //Check if the appointment was been 1-7 days in the past
        if (appointmentDate.isBefore(currentDay) && appointmentDate.isAfter(sevenDaysAgo)) {
          //If checkInTime is null they didn't checkIn, thus, they missed the appointment
          if (appointment.checkInTime === null) {
            rows.push(
              <div className="row row-striped" key={appointment.publicId}>
                <div className="col-md-3 col-print-3">
                  {appointment.patientName}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.patientNumber}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.date}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.startTime} - {appointment.endTime}
                </div>
                <div className="col-md-2 col-print-2">
                  {appointment.practitionerName}
                </div>
              </div>
            );
          }
        }
      });
      return(
        <div>
          <h1>Missed Appointments Report</h1>
          <button className="btn btn-primary" onClick={this.handlePrint}>Print</button>
          <hr />
          <div className="row">
            <div className="col-md-3 col-print-3">
              <b>Name</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Number</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Date</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Start - End</b>
            </div>
            <div className="col-md-2 col-print-2">
              <b>Practitioner</b>
            </div>
          </div>
          {rows}
          <hr />
        </div>
      );
    }
});

if (document.getElementById('missedAppointmentsReport') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<MissedAppointmentsReport csrf_element="{{csrf_element}}"/>, document.getElementById('missedAppointmentsReport'));
}

var CallListReport = React.createClass({

  getInitialState: function() {
    return {
      appointments: []
    };
  },
  loadAppointmentsFromServer: function() {
    var self = this;
    $.ajax({
      url: "http://localhost:8080/api/appointments"
    }).then(function (data) {
      self.setState({appointments: data._embedded.appointments});
    });
  },
  componentDidMount: function() {
    this.loadAppointmentsFromServer();
  },
  handlePrint: function() {
    $("#callListReport").printThis();
  },
  render: function() {
    var self = this;
    var rows = [];
    this.state.appointments.forEach(function(appointment) {
      //Check if appointment date is less than 7 days away
      //If true add it to the Call List Report

      //Check to see if the appointment is within 1-7 days away
      if (moment(appointment.date).isBefore(moment().add(7, 'days')) && moment(appointment.date).isAfter(moment())) {
        rows.push(
          <div className="row row-striped" key={appointment.publicId}>
            <div className="col-md-3 col-print-3">
              {appointment.patientName}
            </div>
            <div className="col-md-2 col-print-2">
              {appointment.patientNumber}
            </div>
            <div className="col-md-2 col-print-2">
              {appointment.date}
            </div>
            <div className="col-md-2 col-print-2">
              {appointment.startTime} - {appointment.endTime}
            </div>
            <div className="col-md-2 col-print-2">
              {appointment.practitionerName}
            </div>
          </div>
        );
      }
    });
    return(
      <div>
        <h1>Call Lists Report</h1>
        <button className="btn btn-primary" onClick={this.handlePrint}>Print</button>
        <hr />
        <div className="row">
          <div className="col-md-3 col-print-3">
            <b>Name</b>
          </div>
          <div className="col-md-2 col-print-2">
            <b>Number</b>
          </div>
          <div className="col-md-2 col-print-2">
            <b>Date</b>
          </div>
          <div className="col-md-2 col-print-2">
            <b>Start - End</b>
          </div>
          <div className="col-md-2 col-print-2">
            <b>Practitioner</b>
          </div>
        </div>
        {rows}
        <hr />
      </div>
    );
  }
});

if (document.getElementById('callListReport') != null) {
    var csrf_element = document.getElementById('csrf_token');
    ReactDOM.render(<CallListReport csrf_element="{{csrf_element}}"/>, document.getElementById('callListReport'));
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


$('#searchBar').click(function(e){
    //'use strict';

      ;( function ( document, window, index )
      {
        var hasElementClass   = function( element, className ){ return element.classList ? element.classList.contains( className ) : new RegExp( '(^| )' + className + '( |$)', 'gi' ).test( element.className ); },
          addElementClass   = function( element, className ){ element.classList ? element.classList.add( className ) : element.className += ' ' + className; },
          removeElementClass  = function( element, className ){ element.classList ? element.classList.remove( className ) : element.className = element.className.replace( new RegExp( '(^|\\b)' + className.split( ' ' ).join( '|' ) + '(\\b|$)', 'gi' ), ' ' );
      };


        // search & highlight

        ;( function ( document, window, index )
        {
          var container = document.querySelector( '.faq' );
          if( !container ) return true;

          var input     = container.querySelector( 'input' ),
            notfound    = container.querySelector( '.faq_not_found' ),
            items     = document.querySelectorAll( '.faq > div > table > tbody > tr' ),
            item      = {},
            itemsIndexed  = [];

          [].forEach.call( items, function( entry )
          {
            itemsIndexed.push( entry.textContent.replace( /\s{2,}/g, ' ' ).toLowerCase() );
          });

          input.addEventListener( 'keyup', function( e )
          {
            if( e.keyCode == 13 ) // enter
            {
              input.blur();
              return true;
            }

            [].forEach.call( items, function( entry )
            {
              //entry.innerHTML = entry.innerHTML.replace( /<span class="highlight">([^<]+)<\/span>/gi, '$1' );
            });

            var searchVal = input.value.trim().toLowerCase();
            if( searchVal.length )
            {
              itemsIndexed.forEach( function( entry, i )
              {
                if( itemsIndexed[ i ].indexOf( searchVal ) != -1 )
                {
                  //removeElementClass( items[ i ], 'is-hidden' );
                  //items[ i ].innerHTML = items[ i ].innerHTML.replace( new RegExp( searchVal+'(?!([^<]+)?>)', 'gi' ), '<span class="highlight">$&</span>' );
                }
                else
                  addElementClass( items[ i ], 'is-hidden' );
              });
            }
            else [].forEach.call( items, function( entry ){ removeElementClass( entry, 'is-hidden' ); });

            if( items.length == [].filter.call( items, function( entry ){ return hasElementClass( entry, 'is-hidden' ) } ).length )
              addElementClass( notfound, 'is-visible' );
            else
              removeElementClass( notfound, 'is-visible' );

          });
        }( document, window, 0 ));


        // toggling items on title press
        ;( function ( document, window, index )
        {
          [].forEach.call( document.querySelectorAll( '.faq div table tbody tr' ), function( entry )
          {
            addElementClass( entry, 'js--is-toggleable-item' );
          });

          document.addEventListener( 'click', function( e )
          {
            if( hasElementClass( e.target, 'js--is-toggleable-item' ) )
            {
              e.preventDefault();
              var current = e.target;
              while( current.parentNode )
              {
                current = current.parentNode;
                if( current.tagName.toLowerCase() == 'div' )
                {
                  hasElementClass( current, 'is-active' ) ? removeElementClass( current, 'is-active' ) : addElementClass( current, 'is-active' );
                  break;
                }
              }
            }
          });
        }( document, window, 0 ));


        // auto-show item content when show results reduces to single

        ;( function ( document, window, index )
        {
          var container = document.querySelector( '.faq' );
          if( !container ) return true;

          var input = container.querySelector( 'input' ),
            items = document.querySelectorAll( '.faq > div > table > tbody > tr' ),
            item  = {};

          input.addEventListener( 'keyup', function( e )
          {
            item = [].filter.call( items, function( entry ){ return !hasElementClass( entry, 'is-hidden' ); } )

            if( item.length == 1 )
            {
              addElementClass( item[ 0 ], 'js--autoshown' );
              addElementClass( item[ 0 ], 'is-active' );
            }
            else
              [].forEach.call( items, function( entry )
              {
                if( hasElementClass( entry, 'js--autoshown' ) )
                {
                  removeElementClass( entry, 'js--autoshown' );
                  removeElementClass( entry, 'is-active' );
                }
              });
          });
        }( document, window, 0 ));

      }( document, window, 0 ));
   });

