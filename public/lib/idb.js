var idb = (function(){
	
}())
if(window.indexedDB){
	var dbRequest = window.indexedDB.open("empldb", 1);
}

dbRequest.onsuccess = function(event){
	console.log("onsuccess: db opened");

	var db = event.target.result;
	var tx = db.transaction('employees', 'readonly')
			   .objectStore('employees')
			   .openCursor()
			   .onsuccess = function (e){
			   		var c = e.target.result;
			   		if(c) {
			   			console.log(c.value)
			   			c.continue();
			   		}
			   }


}

dbRequest.onupgradeneeded = function(event){
	console.log("onupgradeneeded: db created");
	var db = event.target.result;

	if(!db.objectStoreNames.contains('employees')){
		var emplStore = db.createObjectStore('employees', { keyPath: 'id' });
		emplStore.transaction.oncomplete = function(ev){
			var emplTr = db.transaction('employees', 'readwrite')
			  .objectStore("employees");
			for (var i = 0; i < employees.length; i++) {
				emplTr.add(employees[i]);
			}
		};
	} else {
		// event.target.transaction.objectStore('employees')
		//  	 .createIndex("firstName", "firstName", {unique:false});
	}
}

dbRequest.onerror = function(event){
	console.log("onerror: failure");
}