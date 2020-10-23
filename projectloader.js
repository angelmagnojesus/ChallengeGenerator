var ProjectLoader = function(){};

ProjectLoader.prototype.unzipBlob = function(blob, callback){
     // use a zip.BlobReader object to read zipped data stored into blob variable
     zip.workerScriptsPath = "./zip_api/";
     zip.useWebWorkers = false;
     zip.createReader(new zip.BlobReader(blob), function(zipReader){
       // get entries from the zip file
       zipReader.getEntries(function(entries){
         // get data from the first file
         for(i = 0; i < entries.length; i++){     
           if(entries[i].filename.indexOf(".json")!==-1){
             entries[i].getData(new zip.BlobWriter("text/plain"), function(data){
                             // close the reader and calls callback function with uncompressed data as parameter
                             zipReader.close();
                             callback(data);
             });
           }//if
         }//for
       });
     }, onerror);
 };
 
ProjectLoader.prototype.onerror = function(message){
       console.error(message);
};