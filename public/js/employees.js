fetch(ew.apis.employees).then(function(res) {
    return res.json()
        .then(function(arrUsers) {
            localStorage.setItem('empls', JSON.stringify(arrUsers));
            var trs = '';
            for (var i = 0; i < arrUsers.length; i++) {
                trs += `
            		<tr>
						<td>${arrUsers[i].firstName} ${arrUsers[i].lastName}</td>
						<td>${arrUsers[i].position}</td>
						<td>${arrUsers[i].birthDate}</td>
						<td><a href="/pages/empl-details.html#${arrUsers[i].id}">Details</a></td>
					</tr>
            	`;
            }
            employeesBody.innerHTML = trs;
            $('#dataTable').DataTable();
        });
})


