fetch(ew.apis.employees)
    .then(function(response) {
        if (response.status !== 200) {
            throw new Error('Bad response');
        }

        return response.json();
    })
    .then(function(arrUsers) {
        localStorage.setItem('empls', JSON.stringify(arrUsers));

        var trs = '';
        for (var i = 0; i < arrUsers.length; i++) {
            trs += `
                    <tr>
                        <td>${arrUsers[i].firstName} ${arrUsers[i].lastName}</td>
                        <td>${arrUsers[i].position}</td>
                        <td>${findAge(arrUsers[i].birthDate)}</td>
                        <td><a href="/pages/empl-details.html#${arrUsers[i].id}">Details</a></td>
                    </tr>
                `;
        }
        employeesBody.innerHTML = trs;
        $('#dataTable').DataTable();


        if (!('indexedDB' in window)) {
            throw new Error("This browser doesn't support IndexedDB");
        }

        var dbRequest = window.indexedDB.open('employeesdb', 1);

        dbRequest.onerror = function(error) {
            throw new Error(error);
        }

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
                for(var i = 0; i < arrUsers.length; i++) {
                    employeesTransaction.put(arrUsers[i]);
                }
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });


function findAge(birthDate) {
    if(!birthDate) {
        return '-';
    }

    return (new Date()).getFullYear() - parseFloat(birthDate.slice(6, 10));
}