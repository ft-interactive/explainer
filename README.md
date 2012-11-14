Explainer
=========

## Usage


1. **Export the audio** from Audition as both **.mp3 and .oga (ogg)** formats.
2. Put the **audio** files **in** your **animation's folder**.
3. Grab the latest version of the Explainer zip, unpack it into the **animation's folder**.
4. In Edge, open the **code window** ( &#8984;E ). Then click the _Stage_ item in the menu on left.
5. **Paste** the Javascript **snippet** below into the code window.
6. Ensure that **paths** to audio and `explainer.js` files **are correct**. The ones below might not be quite right for you. For example you might be using a different **explainer.js** version or another audio directory. You may also want to link to Absolute URLs (rather than relative ones).
7. Add `<link rel="stylesheet" href="styles/explainer.min.css">` to the `<head>` of the HTML generated by Edge. This ensures styles are loaded immediately. Again, ensure the URL is correct.


** Javscript Snippet for pasting into the Stage section of the Edge Code window:**

```javascript
Edge.yepnope([
	{ load: 'explainer-0.0.1.min.js', callback: function(){ 
		var explainer = new FTi.Explainer('Stage', compId, {
			mp3:'explainer.mp3', 
			oga:'explainer.oga'
		});
	}}
]);	
```

There is also a **handy Edge file** to help you when getting started on a new Explainer. This is located in XXXX.

You may also like to try using Grunt to package (minify JavaScript files etc) the Explainer before publishing it. :-)

## Troubleshooting

**Adobe Audition doesn't let me export as .oga format. What should I do?**

You can export as an 'ogg' file and then manually change the the file extension to 'oga'.

**What standard settings do I need to use in Adobe Edge?** 

* Stage Width = `792px`
* Stage Height = `600px`
* Stage Background colour = `#FFF1E0`
* Autoplay = false (unchecked)
* Set the Composition Name e.g. _My Explainer_
* Set the `Composition ID`. e.g. `my_explainer_animation`
* **Fonts in Edge?**

**What should the Methode iFrame code look like?**

```html
<iframe src="http://interactive.ftdata.co.uk/path/to/explainer" width="792px" height="650px"></iframe>
```

**MORE HELP WITH EDGE**

	See the [Explainer wiki](wiki)

## Hacking the Explainer library

We use the following libs and tools.

* [jQuery](http://api.jquery.com) provided by Edge
* [Yepnope](http://yepnopejs.com/) provided by Edge and aliased as `window.AdobeEdge.yepnope`
* [jPlayer](http://www.jplayer.org/latest/developer-guide) to handle the audio including 'fall back' shim to Flash audio.
* [Font Awesome](http://fortawesome.github.com/Font-Awesome/) for icons - Play, pause etc.
* [Grunt](https://github.com/gruntjs/grunt/blob/master/docs/toc.md) for preparing the distribution package


**Getting started**
	
	$ git clone https://github.com/ft-interactive/explainer.git
	$ cd explainer
	$ npm install
	$ grunt --help
	

**Create a distribution package**
	
	$ grunt dist
	
 
**Create a release package**

	$ grunt release
	
	
**Notes**

You'll need to serve the code out of a **webserver** that is set up to do the following:

* send proper caching headers (because Yepnope is used)
* sets the correct `Content-Type` on mp3, ogg, oga audio files
* supports `Accept-Ranges:bytes` on the response headers of audio files
