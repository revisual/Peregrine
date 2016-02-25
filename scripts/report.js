module.exports = function (fileName) {

   var fs = require( 'fs' );
   var self = this;
   var baseFileName = fileName;
   var baseFolder = 'public/reports/';
   var fileName = baseFolder + baseFileName + '.json' ;

   this.createFolders = function () {
      var folder = 'public/out/' + baseFileName;

      if (!fs.existsSync( folder )) {
         fs.mkdirSync( folder );
      }

      folder = baseFolder;

      if (!fs.existsSync( folder )) {
         fs.mkdirSync( folder );
      }

   };

   this.persist = function () {
      fs.writeFileSync( fileName, JSON.stringify( self ) );
   };

   this.isComplete = function(){
      return   self.printedSnapshots == self.totalSnapshots && !self.error;
   };

   this.getProgress = function(){
      return   self.printedSnapshots + "/" +  self.totalSnapshots;
   } ;

   this.delete = function(){
      fs.unlinkSync( fileName );
   } ;

   this.load = function () {
      var data = fs.readFileSync( baseFolder + baseFileName + '.json', 'utf8' );
      data = JSON.parse( data );
      self.error = data.error;
      self.msg = data.msg;
      self.totalSnapshots = data.totalSnapshots;
      self.printedSnapshots = data.printedSnapshots;
      return self;
   } ;

   this.error = false;
   this.msg = "";
   this.totalSnapshots = 0;
   this.printedSnapshots = 0;

};
