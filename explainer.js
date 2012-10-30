/*! FINANCIAL TIMES EXPLAINERS - v0.1.0 - 2012-10-30
* http://ft.com/
* Copyright (c) 2012 FINANCIAL TIMES Ltd; Licensed MIT */

(function($, Edge){

    var Composition = Edge.Composition,
        Symbol = Edge.Symbol;

    window.FTi = window.FTi || {};

    FTi.Explainer = function Explainer(elementId, compId, media) {

        var animationSelector = '#' + elementId,

            controlsId = elementId + '_controls',

            audioId = elementId + '_audio',

            $animation = $( animationSelector ),

            stage,

            audioLength = 0,

            controlsHTML = '<div id="'+ controlsId +'" class="controls">\
                <div class="play-pause">\
                    <p class="play"><i class="icon-play icon-large"></i></p>\
                    <p class="pause"><i class="icon-pause icon-large"></i></p>\
                    <p class="loading"><i class="icon-refresh icon-large"></i></p>\
                    <p class="error"><i class="icon-exclamation-sign icon-large"></i></p>\
                </div>\
                <div class="scrubber-container"><div class="scrubber">\
                    <div class="progress"></div>\
                    <div class="loaded"></div>\
                </div></div>\
                <div class="time">\
                    <em class="played">0:00</em> / <strong class="duration">3:00</strong>\
                </div>\
                <div class="error-message"></div>\
            </div>',

            audioContainerHTML = '<div id="'+ audioId + '"></div>',

            $controls = $( controlsHTML ),

            $audio = $( audioContainerHTML );



        $controls.insertAfter( $animation );

        $audio.insertAfter( $controls );


        $audio.jPlayer({
            ready: function( readyEvent ){
                $( this ).jPlayer( "setMedia", media );

                // Setup a click handler on the audio scrubber bar
                // to work out where to jump the animation to. Not needed on HTML audio!
                var p = $audio.data('jPlayer');
                if ( p.flash.active ) {
                    $controls.find( '.loaded, .progress' ).on( 'click', function( clickEvent ){
                        if ( !audioLength ) {
                            return;
                        }

                        if ( !!stage ) {
                            var secs = mouseEventToSeconds( clickEvent );
                            if ( p.status.paused ) {
                                p.play( secs );
                            }
                            stage.play( secondsToMilliseconds(secs) );
                        } else {
                            p.pause();
                        }
                    });
                }
            },
            swfPath: 'scripts',
            solution:'html, flash',
            supplied:"mp3,oga",
            preload:'auto',
            wmode:'window',
            cssSelectorAncestor:'#' + controlsId,
            cssSelector:{
                play: '.play',
                pause: '.pause',
                stop: '.stop',
                seekBar: '.loaded',
                playBar: '.progress',
                currentTime: '.played',
                duration: '.duration'
            },
            errorAlerts: false,
            warningAlerts: false,
            play: playStage,
            seeked: playStage, /* WARNING this doesn't fire when flash is used to play the audio */
            waiting: stopStage,
            pause: stopStage,
            ended: function( evt ) {
                logEvent( evt );
                setTimeout(function(){
                    !!stage && stage.stop( 0 );
                    $animation.addClass( 'cursor-pointer' );
                }, 500);
            },
            progress: setAudioDuration,
            canplay: setAudioDuration,
            loadstart: setAudioDuration
        });

        setStage( Edge.getComposition(compId) );

        // If composition still loading the stage won't be set yet
        // so need to wait to set the stage
        if (!stage) {
            Symbol.bindElementAction(compId, 'stage', 'document', 'compositionReady', function( sym, e ) {
                setStage( sym.getComposition() );
            });
        }

        Symbol.bindElementAction(compId, 'stage', animationSelector, 'click', function clickToStart( sym, e ) {

            // All we have to do is start the audio and the animation will start too
            var p = $audio.data( 'jPlayer' ),
                status = p.status;

            if ( status.currentTime === 0 || status.paused ) {
                $animation.removeClass( 'cursor-pointer' );
                $audio.jPlayer( 'play' );
            }
        });

        // HTML and Flash players have different behaviours (and depending on if the audio is cached).
        // THerefore we need to rund this on the following events: progress, canplay, loadstart
        function setAudioDuration( evt ) {
            audioLength = evt.jPlayer.status.duration;
        }

        function setStage( composition ) {
            var oldStage = stage;
            stage = composition && composition.getStage();

            if ( !oldStage && stage ) {
                $controls.css( 'visibility', 'visible' );
                $animation.addClass( 'cursor-pointer' );
            }
        }

        function mouseEventToSeconds( evt ) {
            return getMouseOffset( evt ).x * audioLength / $scrubber.width();
        }

        function playStage( evt ) {
            logEvent( evt );

            var currentTime = evt.jPlayer.status ? evt.jPlayer.status.currentTime : 0,
                milliseconds = secondsToMilliseconds( currentTime );

            !!stage ? stage.play( milliseconds ) : $( this ).jPlayer( 'pause' );

            if ( evt.jPlayer.status.paused ) {
                $animation.removeClass( 'cursor-pointer' );
                $( this ).jPlayer( 'play' );
            }
        }

        function stopStage( evt ) {
            logEvent( evt );
            $animation.addClass( 'cursor-pointer' );
            !!stage && stage.stop();
        }

        var $bars = $controls.find( '.progress, .loaded' ),
            $scrubber = $controls.find( '.scrubber' );

        $controls.on('mousemove', '.loaded, .progress', function( evt ){

            var time = '';
            
            if ( audioLength ) {
                time = $.jPlayer.convertTime( mouseEventToSeconds(evt) ).toString().replace( /^0|/,'' )
            }

            $bars.attr( 'title',  time );

        });
    };

    // Private helper functions
    function getMouseOffset( evt ) {

        var result = { x: evt.offsetX, y: evt.offsetY };

        if ( !evt.offsetX ){
            // FireFox Fix
            var off = $( evt.currentTarget ).offset(),
                origEvt = evt.originalEvent;

            result.x = origEvt.pageX - off.left;
            result.y = origEvt.pageY - off.top;
        }

        return result;
    }

    function secondsToMilliseconds( secs ) {
        return Math.round( secs * 1000 );
    }

    function logEvent( evt ) {
        if ( typeof window.console !== 'undefined' ) {
            console.log( evt.type, evt );
        }
    }


}(jQuery, AdobeEdge));
