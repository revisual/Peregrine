/**
 * Created by Pip on 2/25/2016.
 */
(function () {

   if ($( "#uploadForm" ).length != 0) {
      (function () {
         var animText = 'UPLOADING VIDEO';

         var textAnim = [
            '-' + animText + '-',
            '--' + animText + '--',
            '---' + animText + '---',
            '----' + animText + '----',
            '-----' + animText + '-----',
            animText
         ];

         var startUploadingAnim = function ( elem ) {
            var count = 0;
            elem.text( textAnim[count] );
            setInterval( function () {
               elem.text( textAnim[count++] );
               count = ( count >= textAnim.length) ? 0 : count;
            }, 250 );
         };

         var pendingBtn = $( '#pendingBtn' );

         var uploadBtn = $( '#uploadBtn' )
            .addClass( 'disabled' )
            .click( function () {
               $( this )
                  .addClass( 'disabled' );

               startUploadingAnim( $( this ) );

               pendingBtn.addClass( 'disabled' )
            } );

         var fileInput = $( '#fileInput' )
            .change( function () {
               uploadBtn.removeClass( 'disabled' )
                  .text( 'UPLOAD VIDEO' );
            } );
      })();
   }

})();