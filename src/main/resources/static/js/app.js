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
            rows.push(<Employee employee={employee} key={employee.id} />);
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

    returnEmployees: function() {
        return [
            { name: "Calvin Nix", age: 22, years: 3, id: 1 },
            { name: "Alex Estrada", age: 23, years: 2, id: 2 },
            { name: "Zacch Thomas", age: 36, years: 5, id: 3 },
            { name: "Eric Plascencia", age: 23, years: 2, id: 4 }
        ];
    },

    render() {
        return (<EmployeeTable employees={this.returnEmployees()} />)
    }
});



ReactDOM.render(<App />, document.getElementById('root'));