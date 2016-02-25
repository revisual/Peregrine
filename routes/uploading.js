/**
 * Created by Pip on 20/02/2015.
 */

module.exports = function () {

   var createScreenShots = require( '../scripts/screenshot-creator' )();

   var index = function index( req, res, next ) {
      res.locals.title = 'Home';
      res.locals.host = req.headers.host;
      res.render( 'index' );
   };

   var upload = function ( req, res, next ) {
      createScreenShots( req.fields,
         function () {
            res.locals.title = 'Upload Successful';
            res.locals.host = req.headers.host;
            res.render( 'upload-success', req.files );
         } );
   };

   var errors = function ( err, req, res, next ) {

      res.locals.title = 'Upload Failed';
      res.locals.host = req.headers.host;
      res.render( 'upload-failure', {
         result: 'failed',
         error: err
      } );

   };


   return {
      index: index,

      upload: upload,

      errors: errors
   };

};
