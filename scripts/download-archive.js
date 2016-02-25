module.exports = function () {

   var archiver = require( 'archiver' );
   var p = require( 'path' );
   var fs = require( 'fs' );

   var downloadArchive = function ( req, res ) {

      var archive = archiver( 'zip' );
      var filename = req.query.file;

      archive.on( 'error', function ( err ) {
         res.status( 500 ).send( {error: err.message} );
      } );

      //on stream closed we can end the request
      res.on( 'close', function () {
         console.log( 'Archive wrote %d bytes', archive.pointer() );
         return res.status( 200 ).send( 'OK' ).end();
      } );

      //set the archive name
      res.attachment( filename + '.zip' );

      //this is the streaming magic
      archive.pipe( res );

      var files = fs.readdirSync( 'public/out/' + filename + '/' );

      for (var i in files) {
         archive.append( fs.createReadStream( 'public/out/' + filename + '/' + files[i] ), {name: p.basename( files[i] )} );
      }

      archive.finalize();
   };


   return downloadArchive

};
