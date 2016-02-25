module.exports = function () {

   var express = require( 'express' );
   var router = express.Router();

   var uploading = require( './uploading' );
   var downloading = require( './downloading' );

   var FILE_FIELD = "videofile"; //name of the

   var uploader = require( '../scripts/video-uploader' )(FILE_FIELD);

   var uploadController = uploading();
   router.get( '/', uploadController.index );
   router.get( '/upload', uploadController.index );
   router.post( '/upload', uploader.middleware( ), uploadController.upload, uploadController.errors );

   var downloadController = downloading();
   router.get( '/list', downloadController.index );
   router.get( '/download', downloadController.download );
   router.get( '/delete', downloadController.deleteItem );
   return router;
}