var Employee = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.employee.name}</td>
                <td>{this.props.employee.age}</td>
                <td>{this.props.employee.years}</td>
            </tr>
        );
    }
});
var EmployeeTable = React.createClass({
    render: function() {
        var rows = [];
        this.props.employees.forEach(function(employee) {
            rows.push(<Employee employee={employee} key={employee.name} />);
        });
        return (
            <div className="container">
            <table className="table table-striped">
            <thead>
            <tr>
            <th>Name</th><th>Age</th><th>Years</th>
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