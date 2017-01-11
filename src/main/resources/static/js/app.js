var Employee = React.createClass({
    getInitialState: function() {
        return {display: true};
    },
    handleDelete() {
        var self = this;
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
            rows.push(<Employee employee={employee} key={employee.username} />);
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
        return (<EmployeeTable employees={this.state.employees} />);
    }
});



ReactDOM.render(<App />, document.getElementById('root'));