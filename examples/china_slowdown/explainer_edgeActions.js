/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/
(function($, Edge, compId){
  
  var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes

  //Edge symbol: 'stage'
  (function(symbolName) {

    Edge.yepnope({

      load: ['explainer/explainer.min.js'],

      callback: function(){

        $(function(){

          var explainer = new FTi.Explainer('Stage', compId, {
                mp3:'audio/fiscalCliffRecording.mp3', 
                oga:'audio/fiscalCliffRecording.oga'
          });
          
        });

      }
    });

  })("stage");
  //Edge symbol end:'stage'

})(jQuery, AdobeEdge, "explainer_animation");