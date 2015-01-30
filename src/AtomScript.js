/***
 *                 _                          _____                 _           _   
 *         /\     | |                        / ____|               (_)         | |  
 *        /  \    | |_    ___    _ __ ___   | (___     ___   _ __   _   _ __   | |_ 
 *       / /\ \   | __|  / _ \  | '_ ` _ \   \___ \   / __| | '__| | | | '_ \  | __|
 *      / ____ \  | |_  | (_) | | | | | | |  ____) | | (__  | |    | | | |_) | | |_ 
 *     /_/    \_\  \__|  \___/  |_| |_| |_| |_____/   \___| |_|    |_| | .__/   \__| v0.5.4
 *                                                                     | |          
 *                                                                     |_|          
 *
 *		©ZeroSeven Interactive 2015
 *		AtomScript is an interpreted programming language. The language is translated into JavaScript.
 * 
 */

window.onload = onLoad;

var AtomScript = {src: null, consolePath: "AtomScript/console/main.html", startConsole: false};
var Console = {};

var code = "";
var CURRENT_SRC;
var CURRENT_SRC_DIR;

function onLoad(){

	console.log("%cAtomScript v0.5.4", "color: #0355ff; font-family: arial; font-size: 20px;");
	console.log("%c©ZeroSeven Interactive 2015", "color: #ff0330; font-family: arial;");

	if(AtomScript.src != null && AtomScript.src.endsWith(".atom")){

		CURRENT_SRC = readFile(AtomScript.src).url;
		CURRENT_SRC_DIR = CURRENT_SRC.substring(0, CURRENT_SRC.lastIndexOf("/"));

		setScript(AtomScript.src);
		parseCode();
		//console.log(code);
		eval(code + "if(main)main();");
	
	}else if(AtomScript.src != null && AtomScript.src.startsWith("#")){

		var id = AtomScript.src.substring(1, AtomScript.src.length);
		var script = document.getElementById(id);
		
		if(script.getAttribute("type") == "AtomScript"){

			code = script.innerHTML;
			parseCode();
			eval(code + "if(main){ if(AtomScript.startConsole)Console.start(); main(); }");

		}else{

			console.error("Make sure the type of your script tag is 'AtomScript'...");

		}

	}else if(AtomScript.src == null){

		var scripts = document.getElementsByTagName("script");
		var AtomScripts = [];

		for(var i = 0; i < scripts.length; i++){

			var script = scripts[i];
			
			if(script.getAttribute("type") == "AtomScript" || script.getAttribute("type") == "text/AtomScript"){

				code = script.innerHTML;

			}

		}

	}

}

function parseCode(){

	includeFiles();
	convertVariables();
	convertMethods();
	convertObjects();
	convertObjectProperties();
	convertNameSpaceSplitters();
	convertObjectPropertyNameCaller();
	convertObjectPropertyCaller();
	removeComments();
	convertColor();

}

function removeComments(){

	code = code.replace(/\B\#[^\n]+\n/g, "");

}

function convertVariables(){

	var matches = code.match(/\B@\w+/g);
	
	if(matches != null)
	
	for(var i = 0; i < matches.length; i++){
	
		code = code.replace(matches[i].substring(0, 1), "var ");
	
	}

}

function convertMethods(){

	var matches = code.match(/\$\w+|\$\(/g);
	
	if(matches != null)
	
	for(var i = 0; i < matches.length; i++){
	
		code = code.replace(matches[i].substring(0, 1), "function ");
	
	}

}

function convertObjects(){

	var matches = code.match(/\*\w\D\S[^;]+/g);
	
	if(matches != null)
	
		for(var i = 0; i < matches.length; i++){
		
			code = code.replace(matches[i].substring(0, 1), "new ");
		
		}

}

function convertObjectProperties(){

	code = code.replace(/this ->|this->|this-> |this -> /g, "this.");

}

function convertNameSpaceSplitters(){

	var matches = code.match(/::/g);

	if(matches != null)

		for(var i = 0; i < matches.length; i++){

			code = code.replace(matches[i], ".");

		}

}

function convertObjectPropertyCaller(){

	var matches = code.match(/\b\<(.+?)\>/g);

	if(matches != null)
		for(var i = 0; i < matches.length; i++){

			var match = matches[i];
			var propname = match.substring(1, match.length-1);

			code = code.replace(match, "." + propname);

		}

}

function convertObjectPropertyNameCaller(){

	var matches = code.match(/\b\<(.+?)\> \w+|\<(.+?)\>\w+/g);

	if(matches != null)
		for(var i = 0; i < matches.length; i++){

			var match = matches[i];
			var propname = match.substring(1, match.indexOf(">"));
			var other = match.split(/\>/g)[1];

			code = code.replace(match, "." + propname + "." + other);

		}

}

function convertColor(){

	code = code.replace(/%c/g, "#");

}

function includeFiles(){

	var matches = code.match(/include[^;]+;/g);
	
	if(matches != null)
	
		for(var i = 0; i < matches.length; i++){
			
			if(AtomScript.src.endsWith(".atom")){

				var match = matches[i];
				var includer = match.split(" ")[1];
				var file = CURRENT_SRC_DIR + "/" + eval(includer);
				if(file.endsWith(".atom")){

					var read = readFile(file).text;
					code = code.replace(match, read);

				}

			}else if(AtomScript.src.startsWith("#")){

				var match = matches[i];
				var file = eval(match.split(" ")[1]);
				if(file.endsWith(".atom")){

					var read = readFile(file).text;
					code = code.replace(match, read);

				}else{

					var read = readFile(file + ".atom").text;
					code = code.replace(match, read);

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

	code = readFile(file).text;

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
