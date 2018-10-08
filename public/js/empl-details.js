// @TODO get data from indexedDB

var empl = JSON.parse(localStorage.getItem('empls'))[location.hash.slice(1)];
emplDet.innerHTML = JSON.stringify(empl);
