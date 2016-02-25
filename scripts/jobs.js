module.exports = function () {

   var fs = require( 'fs' );
   var Report = require( './report' );

   var retrieveJobs = function () {
      var jobfolders = fs.readdirSync( 'public/out/' );
      var out = [];

      for (var i in jobfolders) {
         var folder = jobfolders[i];
         var o = {
            folder: folder,
            images: fs.readdirSync( 'public/out/' + folder )  ,
            report: new Report(folder).load()
         };
         out.push( o );
      }
      return out;
   };

   var deleteImages = function ( filename ) {
      var path = 'public/out/' + filename + '/';
      var images = fs.readdirSync( path );
      for (var i in images) {
         fs.unlinkSync( path + images[i] );
      }
      fs.rmdirSync( path );
   };

   var deleteVideo = function ( filename ) {
      var path = 'public/videos/'     ;
      var videos = fs.readdirSync( path );
      for (var i in videos) {
         if (videos[i].indexOf( filename + "." ) != -1) {
            fs.unlinkSync( path + videos[i] );
            return;
         }
      }
   };

   var deleteReport = function ( filename ) {
      new Report(filename).delete()
   };

   var deleteItem = function ( filename, error, success ) {
      try {
         deleteImages( filename );
         deleteVideo( filename );
         deleteReport( filename );
         success();
      }
      catch (err) {
         error( err );
      }


   };

   return {
      retrieveJobs: retrieveJobs,
      deleteItem: deleteItem
   }
};
