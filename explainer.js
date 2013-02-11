/*! FINANCIAL TIMES EXPLAINERS - v0.1.0 - 2012-10-30
* http://ft.com/
* Copyright (c) 2012 FINANCIAL TIMES Ltd; Licensed MIT */

(function($, Edge){

    var Composition = Edge.Composition,
        Symbol = Edge.Symbol;

    window.IG = window.IG || {};

    IG.Explainer = function Explainer(elementId, compId, media, size) {

        var animationSelector = '#' + elementId,

            controlsId = elementId + '_controls',

            audioId = elementId + '_audio',

            $animation = $( animationSelector ),

            stage,

            audioLength = 0,

            controlsHTML = '<div id="'+ controlsId +'" class="controls">' +
                '<div class="play-pause">' +
                    '<p class="play btn-state"><i class="icon-play icon-large"></i></p>' +
                    '<p class="pause btn-state"><i class="icon-pause icon-large"></i></p>' +
                    '<p class="loading btn-state"><i class="icon-refresh icon-large"></i></p>' +
                    '<p class="error btn-state"><i class="icon-exclamation-sign icon-large"></i></p>' +
                '</div>' +
                '<div class="scrubber-container"><div class="scrubber">' +
                    '<div class="progress"></div>' +
                    '<div class="loaded"></div>' +
                '</div></div>' +
                '<div class="time">' +
                    '<em class="played">0:00</em> / <strong class="duration">3:00</strong>' +
                '</div>' +
                '<div class="error-message"></div>' +
            '</div>',

            audioContainerHTML = '<div id="'+ audioId + '"></div>',

            $controls = $( controlsHTML ),

            $audio = $( audioContainerHTML );

        var containerClass = 'explainer-container';

        if ( typeof size === 'string' ) {
            if ( size.toLowerCase() === 'narrow' ) {
                containerClass += ' narrow';
            }
        }

        $animation.wrap('<div class="' + containerClass + '" />');

        

        $controls.insertAfter( $animation );

        $audio.insertAfter( $controls );

        var supplied = [];

        if (media.mp3) {
            supplied.push('mp3');
        }

        if (media.oga) {
            supplied.push('oga');
        }

        supplied = supplied.join(',');

        var swfPath = './';

        if (media.swf) {
            swfPath = media.swf;
        }


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
            swfPath: swfPath,
            solution:'html, flash',
            supplied: supplied,
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

        setStage( compId );

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

        function onStageAvailable() {
            $controls.css( 'visibility', 'visible' );
            $animation.addClass( 'cursor-pointer' );
            stage = Edge.getComposition(compId).getStage();
        }

        function setStage( compId ) {
            var _comp = Edge.getComposition(compId),
                _stage = _comp && _comp.getStage();

            if (_stage && _comp.compReadyCalled) {
                onStageAvailable();
            } else {
                Symbol.bindElementAction(compId, 'stage', 'document', 'compositionReady', onStageAvailable);
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

        //fdsfdsfds

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
                time = $.jPlayer.convertTime( mouseEventToSeconds(evt) ).toString().replace( /^0|/,'' );
            }

            $bars.attr( 'title',  time );

        });
    };

    /*
    Convenience method for when the things are hosted on the FTP
    */
    IG.Explainer.create = function( compId, audioName, version, size ) {

        $(function(){
                
            var explainer = new IG.Explainer('Stage', compId, {
                mp3: audioName + '.mp3',
                oga: audioName + '.oga',
                swf:'../lib/' +  version + '/'
            }, size);
                    
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
