var employeeId = parseFloat(location.hash.slice(1));
var dbRequest = window.indexedDB.open('employeesdb', 1);


dbRequest.onerror = function(error) {
    throw new Error(error);
};

// ?????
dbRequest.onupgradeneeded = function(event) {
    var db = event.target.result;

    if(!db.objectStoreNames.contains('employees')) {
        var employeesStore = db.createObjectStore('employees', { keyPath: 'id' });
        employeesStore.createIndex('bossid', 'bossid', {unique: false});
    }
};

dbRequest.onsuccess = function(event) {
    db = event.target.result;

    var employeesStore = db.transaction('employees', 'readwrite').objectStore('employees');
    if(db.objectStoreNames.contains('employees')) {
        var employeesStoreRequest = employeesStore.get(employeeId);

        employeesStoreRequest.onsuccess = function(event) {
            document.getElementById('emplDet').innerHTML = employeeInfo(employeesStoreRequest.result);
            initMap(employeesStoreRequest.result);
        };

        var index = employeesStore.index('bossid');
        var getRequest = index.getAll(employeeId);
        getRequest.onsuccess = function(e) {
            var match = e.target.result;
            if(match) {
                document.getElementById('subordinatesList').innerHTML = showSubordinates(match);
            }
        };
    }
};


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

function showSubordinates(subordinates) {
    if (subordinates.length === 0 ) {
        return '<p>No subordinates found</p>';
    }

    var html = '<ul>';
    for(var i = 0; i < subordinates.length; i++ ) {
        html += '<li>' + subordinates[i].firstName + ' ' + subordinates[i].lastName  + '</li>';
    }
    html += '</ul>';

    return html;
}

function initMap(object) {
    var location = object.location;
    var myLatLng = {lat: location.latitude, lng: location.longitude};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: location.city + ', ' + location.state
    });
}

