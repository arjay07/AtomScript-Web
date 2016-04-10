/***
 *                 _                          _____                 _           _   
 *         /\     | |                        / ____|               (_)         | |  
 *        /  \    | |_    ___    _ __ ___   | (___     ___   _ __   _   _ __   | |_ 
 *       / /\ \   | __|  / _ \  | '_ ` _ \   \___ \   / __| | '__| | | | '_ \  | __|
 *      / ____ \  | |_  | (_) | | | | | | |  ____) | | (__  | |    | | | |_) | | |_ 
 *     /_/    \_\  \__|  \___/  |_| |_| |_| |_____/   \___| |_|    |_| | .__/   \__| v0.5.4.1
 *                                                                     | |          
 *                                                                     |_|          
 *
 *		©ZeroSeven Interactive 2015
 *		AtomScript is an interpreted programming language. The language is translated into JavaScript.
 * 
 */

window.onload = onLoad;

var AtomScript = {	src: null, 
					consolePath: "AtomScript/console/main.html", 
					startConsole: false, 
					CODE: "", 
					Proton: true
				};
var Console = {};

var CURRENT_SRC;
var CURRENT_SRC_DIR;

function onLoad(){

	console.log("%cAtomScript v0.5.4.1", "color: #0355ff; font-family: arial; font-size: 20px;");
	console.log("%c©ZeroSeven Interactive 2015", "color: #ff0330; font-family: arial;");

	if(AtomScript.src != null && AtomScript.src.endsWith(".atom")){

		CURRENT_SRC = readFile(AtomScript.src).url;
		CURRENT_SRC_DIR = CURRENT_SRC.substring(0, CURRENT_SRC.lastIndexOf("/"));

		setScript(AtomScript.src);
		parseCode();
		//console.log(AtomScript.CODE);
		eval(AtomScript.CODE + "if(main)main();");
	
	}else if(AtomScript.src != null && AtomScript.src.startsWith("#")){

		var id = AtomScript.src.substring(1, AtomScript.src.length);
		var script = document.getElementById(id);
		
		if(script.getAttribute("type") == "AtomScript"){

			AtomScript.CODE = script.innerHTML;
			parseCode();
			eval(AtomScript.CODE + "if(main){ if(AtomScript.startConsole)Console.start(); main(); }");

		}else{

			console.error("Make sure the type of your script tag is 'AtomScript'...");

		}

	}else if(AtomScript.src == null){

		var scripts = document.getElementsByTagName("script");
		var AtomScripts = [];

		for(var i = 0; i < scripts.length; i++){

			var script = scripts[i];
			
			if(script.getAttribute("type") == "AtomScript" || script.getAttribute("type") == "text/AtomScript"){

				AtomScript.CODE = script.innerHTML;

			}

		}

	}

	AtomScript.CODE = AtomScript.CODE;

}

function parseCode(){

	removeComments();
	includeFiles();
	convertVariables();
	convertMethods();
	convertObjects();
	convertObjectProperties();
	convertNameSpaceSplitters();
	convertObjectPropertyNameCaller();
	convertObjectPropertyCaller();
	convertEscapes();
	removeComments();
	convertColor();

}

function removeComments(){

	AtomScript.CODE = AtomScript.CODE.replace(/\B\#[^\n]+\n/g, "");

}

function convertVariables(){

	var matches = AtomScript.CODE.match(/\B@\w+/g);
	
	if(matches != null){
	
		for(var i = 0; i < matches.length; i++){
	
			AtomScript.CODE = AtomScript.CODE.replace(matches[i].substring(0, 1), "var ");
		}
	}

}

function convertMethods(){

	var matches = AtomScript.CODE.match(/\$\w+|\$\(/g);
	
	if(matches != null){
	
		for(var i = 0; i < matches.length; i++){
	
			AtomScript.CODE = AtomScript.CODE.replace(matches[i].substring(0, 1), "function ");
		}
	}

}

function convertObjects(){

	var matches = AtomScript.CODE.match(/\*[^0-9;\s ]+/g);
	
	if(matches != null){
	
		for(var i = 0; i < matches.length; i++){
		
			AtomScript.CODE = AtomScript.CODE.replace(matches[i].substring(0, 1), "new ");
		
		}
	}
}

function convertObjectProperties(){

	AtomScript.CODE = AtomScript.CODE.replace(/this ->|this->|this-> |this -> /g, "this.");

}

function convertNameSpaceSplitters(){

	var matches = AtomScript.CODE.match(/::/g);

	if(matches != null){

		for(var i = 0; i < matches.length; i++){

			AtomScript.CODE = AtomScript.CODE.replace(matches[i], ".");

		}
	}
}

function convertObjectPropertyCaller(){

	var matches = AtomScript.CODE.match(/\b\<(.+?)\>/g);

	if(matches != null){
		for(var i = 0; i < matches.length; i++){

			var match = matches[i];
			var propname = match.substring(1, match.length-1);

			AtomScript.CODE = AtomScript.CODE.replace(match, "." + propname);

		}
	}
}

function convertObjectPropertyNameCaller(){

	var matches = AtomScript.CODE.match(/\b\<(.+?)\> \w+|\<(.+?)\>\w+/g);

	if(matches != null){
		for(var i = 0; i < matches.length; i++){

			var match = matches[i];
			var propname = match.substring(1, match.indexOf(">"));
			var other = match.split(/\>/g)[1];

			AtomScript.CODE = AtomScript.CODE.replace(match, "." + propname + "." + other);

		}
	}
}

function convertColor(){

	AtomScript.CODE = AtomScript.CODE.replace(/%c/g, "#");

}

function convertEscapes(){

	AtomScript.CODE = AtomScript.CODE.replace(/%evar /g, "@").replace(/%efunction /g, "$").replace(/%e#/g, "#");

}

function includeFiles(){

	var matches = AtomScript.CODE.match(/include[^;]+;/g);
	
	if(matches != null){
	
		for(var i = 0; i < matches.length; i++){
			
			if(AtomScript.src.endsWith(".atom") && !AtomScript.src.startsWith("#")){

				var match = matches[i];
				var includer = match.split(" ")[1];
				var file = CURRENT_SRC_DIR + "/" + eval(includer);
				if(file.endsWith(".atom")){

					var read = readFile(file).text;
					AtomScript.CODE = AtomScript.CODE.replace(match, read);

				}else if(file.startsWith("http://") && file.endsWith(".atom")){
					
					var read = readFile(file).text;
					AtomScript.CODE = AtomScript.CODE.replace(match, read);
					
				}

			}else if(AtomScript.src.startsWith("#")){

				var match = matches[i];
				var file = eval(match.split(" ")[1]);
				if(file.endsWith(".atom")){

					var read = readFile(file).text;
					AtomScript.CODE = AtomScript.CODE.replace(match, read);

				}else if(file.startsWith("http://") && file.endsWith(".atom")){
					
					var read = readFile(file).text;
					AtomScript.CODE = AtomScript.CODE.replace(match, read);
					
				}else{

					var read = readFile(file + ".atom").text;
					AtomScript.CODE = AtomScript.CODE.replace(match, read);

				}

			}
		
		}
	}
}

function readFile(file){
    
    var request = new XMLHttpRequest();
	request.open("GET", file, false);
    var returnValue = null;
	request.onload = function(e){

		if(request.readyState == 4){

			if(request.status === 200){

				returnValue = request.responseText;

			}

		}

	};

	request.onerror = function(e){

		console.error(request.statusText);

	};

	request.send(null); 
	
	return {text: returnValue, url: request.responseURL, request: request};
    
}

function setScript(file){

	AtomScript.CODE = readFile(file).text;

}

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    value: function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
  });
}

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

/***
 *              _                   _____           _       _   
 *         /\  | |                 / ____|         (_)     | |  
 *        /  \ | |_ ___  _ __ ___ | (___   ___ _ __ _ _ __ | |_ 
 *       / /\ \| __/ _ \| '_ ` _ \ \___ \ / __| '__| | '_ \| __|
 *      / ____ \ || (_) | | | | | |____) | (__| |  | | |_) | |_ 
 *     /_/    \_\__\___/|_| |_| |_|_____/ \___|_|  |_| .__/ \__|
 *                / ____|                    | |     | |        
 *               | |     ___  _ __  ___  ___ | | ___ |_|        
 *               | |    / _ \| '_ \/ __|/ _ \| |/ _ \           
 *               | |___| (_) | | | \__ \ (_) | |  __/           
 *                \_____\___/|_| |_|___/\___/|_|\___|           
 *                                                              
 *                                                              
 */

Console.start = function(){

	Console.Window = window.open(AtomScript.consolePath, "AtomScriptConsole", "width=650,height=440,menubar=no,statusbar=no,location=no");
	Console.Document = Console.Window.document;
	Console.inputElement = Console.Document.getElementById("input");
	Console.displayElement = Console.Document.getElementById("display");
	//console.log(Console.inputElement);
	//console.log(Console.displayElement);
	Console.out("Welcome to the AtomScript Console!");
}

Console.out = function(t){

	var text = createText(t);
	text.style.display = "block";
	append(text, Console.displayElement);

}
