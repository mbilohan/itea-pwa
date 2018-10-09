// @TODO get data from indexedDB

// var empl = JSON.parse(localStorage.getItem('empls'))[location.hash.slice(1)];
// emplDet.innerHTML = JSON.stringify(empl);

var employeeId = parseFloat(location.hash.slice(1));
var dbRequest = window.indexedDB.open('employeesdb', 1);


dbRequest.onerror = function(error) {
    throw new Error(error);
}

// ?????
dbRequest.onupgradeneeded = function(event) {
    var db = event.target.result;

    if(!db.objectStoreNames.contains('employees')) {
        var employeesStore = db.createObjectStore('employees', { keyPath: 'id' });
        employeesStore.createIndex('bossid', 'bossid', {unique: false});
    }
}

dbRequest.onsuccess = function(event) {
    db = event.target.result;

    var employeesTransaction = db.transaction('employees', 'readwrite').objectStore('employees');
    if(db.objectStoreNames.contains('employees')) {
        var employeesStoreRequest = employeesTransaction.get(employeeId);

        employeesStoreRequest.onsuccess = function(event) {
            console.log(employeesStoreRequest.result);

            document.getElementById('emplDet').innerHTML = employeeInfo(employeesStoreRequest.result);
        }
    }
}


function employeeInfo(employee) {
    var html = '';

    html += `
            <h1>${employee.firstName} ${employee.lastName}</h1>
            <h2>${employee.position}</h2>
            <dl>
                <dt>Username</dt>
                <dd>${employee.userName}</dd>
                <dt>Birth Date</dt>
                <dd>${employee.birthDate}</dd>
                <dt>Email</dt>
                <dd>${employee.email}</dd>
                <dt>Gender</dt>
                <dd>${employee.gender}</dd>
            </dl>
            <img src="${employee.avatar}" alt="">
        `;


    return html;
}

