module.exports = function () {

   var downloadArchive = require( '../scripts/download-archive' )();
   var jobs = require( '../scripts/jobs' )();

   var index = function index( req, res, next ) {
      res.locals.title = 'Job List';
      res.locals.host = req.headers.host;
      res.locals.files = jobs.retrieveJobs();
      res.render( 'job-list' );
   };

   var download = function ( req, res, next ) {
      downloadArchive( req, res );
   };

   var deleteItem = function ( req, res, next ) {
      jobs.deleteItem( req.query.file,
         function ( err ) {
            errors( err, req, res, next );
         },
         function () {
            index( req, res, next )
         } );
   };

   var errors = function ( err, req, res, next ) {
      res.locals.error = err.message;
      index( req, res, next )
   };

   return {
      index: index,
      download: download,
      deleteItem: deleteItem,
      errors: errors
   };

};

