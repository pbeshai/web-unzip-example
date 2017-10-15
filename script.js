// actually do the reading of the zip files when a file is set
function parseZipFile(zipFile) {
  console.log('Parsing zip file ' + zipFile.name + ' ...');

  // read the zip file
  JSZip.loadAsync(zipFile).then(
    function(zip) {
      // get a promise for decoding each file in the zip
      const fileParsePromises = [];

      // note zip does not have a .map function, so we push manually into the array
      zip.forEach(function(relativePath, zipEntry) {
        console.log(' -> Parsing ' + zipEntry.name + ' ...');

        // parse the file contents as a string
        fileParsePromises.push(
          zipEntry.async('string').then(function(data) {
            console.log(' -> Finished parsing ' + zipEntry.name);
            return {
              name: zipEntry.name,
              textData: data,
              zipEntry: zipEntry,
            };
          })
        );
      });

      // when all files have been parsed run the processing step with
      // the text content of the files.
      Promise.all(fileParsePromises).then(processDecompressedFiles);
    },
    function(error) {
      console.error('An error occurred processing the zip file.', error);
    }
  );
}

// do whatever processing of the decompressed zip file
function processDecompressedFiles(decompressedFiles) {
  console.log('Got decompressed files', decompressedFiles);
}

// attach change listener to the file input
var fileInput = document.querySelector('#file');

fileInput.addEventListener('change', function(event) {
  // handle multiple files
  var files = event.target.files;
  for (var i = 0; i < files.length; i++) {
    parseZipFile(files[i]);
  }
});
