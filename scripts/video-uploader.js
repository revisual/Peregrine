module.exports = function (filename) {


   var upload = require( 'formidable-upload' );


   var uploader = upload()
      .accept( /video*/ )
      .to( ['public', 'videos'] );

   uploader.middleware = function ( ) {
      var self = this;

      return function ( req, res, next ) {
         self.parse( req, formParsed );

         function formParsed( err, fields, files ) {
            if (err) return next( err );

            req.files = files;
            req.fields = fields;
            req.fields.filename = req.files[filename].name;
            req.fields.basefilename = req.files[filename].name.split( "." )[0];
            self.exec( req.files[filename], next );
         }

         function respond( err, file ) {
            if (err) {
               return next( err );
            }

            req.files[filename] = file;
            next();
         }
      };
   };

   return uploader;

}