/**
 * Created by Pip on 20/02/2015.
 */

module.exports = function () {

   var ffmpeg = require( 'fluent-ffmpeg' );
   var Report = require( './report' );

   var convertFPSfromString = function ( input ) {
      var split = input.split( '/' );
      var out = split[0] / split [1];
      return (isNaN( out )) ? 0 : Math.ceil( out );
   };

   var calculateFPS = function ( metadata ) {
      var out = 0;
      var len = metadata.streams.length;
      for (var i = 0; i < len; i++) {
         out = Math.max( out, convertFPSfromString( metadata.streams[i].avg_frame_rate ) );
      }
      return out;
   };


   var startBreaking = function ( fields, done ) {

      var report = new Report(fields.basefilename) ;
      report.createFolders();

      ffmpeg( 'public/videos/' + fields.filename )
         .setFfmpegPath( 'bin/ffmpeg' )
         .setFfprobePath( 'bin/ffprobe' )
         .ffprobe( 0, function ( err, data ) {
            try {
               var chunk = 32;

               fields.fps = calculateFPS( data );

               var timemarks = calculateTimemarks( fields, data );
               var maxCount = Math.ceil( timemarks.length / chunk );

               report.totalSnapshots =  timemarks.length;

               for (var i = 0; i < maxCount; i++) {
                  var start = i * chunk;

                  breakUp( fields, timemarks.slice( start, start + chunk  ), start, report );
               }

            }

            catch (err) {
               report.error = true;
               report.msg = "screenshot-creator.startBreaking:: " + err;
               console.log( report.msg );
            }

            finally{
               report.persist( );
               done();
            }
         } );
   };

   var calculateTimemarks = function ( fields, metadata ) {

      var ratio = parseInt( fields.ratio );
      ratio = (isNaN( ratio ) || ratio == 0) ? fields.fps : ratio;

      var incr = (fields.fps / 1000) * ratio;
      incr = Math.round( incr * 100 ) / 100;

      var startTime = fields.startTime;
      startTime = (isNaN( startTime ) ) ? 0 : startTime;

      var endTime = fields.endTime;
      endTime = (isNaN( endTime ) || endTime <= startTime) ? metadata.format.duration : endTime;

      var out = [];
      var count = 0;

      while (count < endTime) {
         out.push( startTime + count );
         count += incr;
      }
      console.log( "number of images to create = " + out.length );
      return out;
   };

   var  pad = function ( num, size ) {
         var s = num + "";
         while (s.length < size) s = "0" + s;
         return s;
      };

      var breakUp = function ( fields,timemarks, start, report ) {
         try {
            ffmpeg( 'public/videos/' + fields.filename )
               .setFfmpegPath( 'bin/ffmpeg' )
            .setFfprobePath( 'bin/ffprobe' )
            .screenshots( {
               timemarks: timemarks,
               filename: '%i',
               folder: 'public/out/' + fields.basefilename
            } )
            .on('filenames', function(filenames) {
               var len = filenames.length;
               for (var i = 0; i < len; i++) {
                  filenames[i] = pad( start + i, 5 )+ ".png"  ;
               }

            })
            .on( 'error', function ( err ) {
               report.error = true;
               report.msg = "ffmpeg error::screenshot-creator.breakUp::" + err;
               report.persist(  );  // because this may be asynch
               console.log( report.msg );
            } )
            .on( 'end', function () {

               report.load();
               report.printedSnapshots += timemarks.length;
               report.persist();
               console.log( "fields.timemarks.length = " + timemarks.length);
               console.log( "total so far  = " + report.printedSnapshots);
            } );

      }
      catch (err) {
         console.log( 'Breakup Error ::' + err );
         report.error = true;
         report.msg = "screenshot-creator.breakUp::" + err;
      }

   };

   return startBreaking

}  ;

