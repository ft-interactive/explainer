
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName) {

      Edge.yepnope({
      		
      	load: [
      	'../../dist/0.0.1/explainer-0.0.1.min.js'
      	],
      	
            callback: function(){
      		$(function(){
      		
      			var explainer = new IG.Explainer('Stage', compId, {
                              mp3:'guinea.mp3',
      				oga:'guinea.oga',
                              swf:'../../'
      			});
      			
      		});          		
      	}
      });

   })("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'Symbol_1'
(function(symbolName){})("Symbol_1");
//Edge symbol end:'Symbol_1'

//=========================================================

//Edge symbol: 'brasilArrow'
(function(symbolName){})("brasilArrow");
//Edge symbol end:'brasilArrow'
})(jQuery,AdobeEdge,"explainer_animation");