/***
 *                 _                          _____                 _           _   
 *         /\     | |                        / ____|               (_)         | |  
 *        /  \    | |_    ___    _ __ ___   | (___     ___   _ __   _   _ __   | |_ 
 *       / /\ \   | __|  / _ \  | '_ ` _ \   \___ \   / __| | '__| | | | '_ \  | __|
 *      / ____ \  | |_  | (_) | | | | | | |  ____) | | (__  | |    | | | |_) | | |_ 
 *     /_/    \_\  \__|  \___/  |_| |_| |_| |_____/   \___| |_|    |_| | .__/   \__|
 *                                                                     | |          
 *                                                                     |_|          
 *
 *		©ZeroSeven Interactive 2015
 *		AtomScript is an interpreted programming language. The language is translated into JavaScript.
 * 
 */

window.onload = onLoad;

var AtomScript = {src: null, include: [], FORMAT: false, consolePath: "AtomScript/console/main.html", startConsole: false};
var Console = {};

var code = "";
var CURRENT_SRC;
var CURRENT_SRC_DIR;

function onLoad(){

	console.log("%cAtomScript v0.5", "color: #0355ff; font-family: arial; font-size: 20px;");
	console.log("%c©ZeroSeven Interactive 2015", "color: #ff0330; font-family: arial;");

	if(AtomScript.src != null && AtomScript.src.endsWith(".atom")){

		CURRENT_SRC = readFile(AtomScript.src).request.responseURL;
		CURRENT_SRC_DIR = CURRENT_SRC.substring(0, CURRENT_SRC.lastIndexOf("/"));

		setScript(AtomScript.src);
		parseCode();
		//console.log(code);
		eval(code + "if(main){ if(AtomScript.startConsole)Console.start(); main(); }");
	
	}else if(AtomScript.src != null && AtomScript.src.startsWith("#")){

		var id = AtomScript.src.substring(1, AtomScript.src.length);
		var script = document.getElementById(id);
		
		if(script.getAttribute("type") == "AtomScript"){

			code = script.innerHTML;
			parseCode();
			eval(code + "if(main){ if(AtomScript.startConsole)Console.start(); main(); }");

		}else{

			console.log("%cMake sure the type of your script tag is 'AtomScript'...", "color: #f00;");

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
	if(AtomScript.FORMAT)formatCode();
	convertVariables();
	convertMethods();
	convertObjects();
	convertObjectProperties();
	convertNameSpaceSplitters();
	convertObjectPropertyCaller();
	removeComments();

}

function formatCode(){

	code = code.replace(/[\n\t\r]/g, "");

}

function removeComments(){

	code = code.replace(/\B\#[^\n]+\b/g, "");

}

function convertVariables(){

	var matches = code.match(/\B@\w+/g);
	
	if(matches != null)
	
	for(var i = 0; i < matches.length; i++){
	
		code = code.replace(matches[i].substring(0, 1), "var ");
	
	}

}

function convertMethods(){

	var matches = code.match(/\$[^; ]+/g);
	
	if(matches != null)
	
	for(var i = 0; i < matches.length; i++){
	
		code = code.replace(matches[i].substring(0, 1), "function ");
	
	}

}

function convertObjects(){

	var matches = code.match(/\*[^;0-9 ]+/g);
	
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
			var propname = match.substring(1, match.indexOf(">")-1);

			code = code.replace(match, "." + propname + ".");

		}

}

function includeFiles(){

	var matches = code.match(/include[^;]+;/g);
	
	if(matches != null)
	
		for(var i = 0; i < matches.length; i++){
			
			if(AtomScript.src.endsWith(".atom")){

				var match = matches[i];
				var file = CURRENT_SRC_DIR + "/" + eval(match.split(" ")[1]);
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

				}

			}
		
		}

}

function readFile(file){
    
    var request = new XMLHttpRequest();
	request.open("GET", file, false);
	request.send(null);
	var returnValue = request.responseText;  
	
	return {text: returnValue, request: request};
    
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
 *              _                   _____           _       _              _____ _____ 
 *         /\  | |                 / ____|         (_)     | |       /\   |  __ \_   _|
 *        /  \ | |_ ___  _ __ ___ | (___   ___ _ __ _ _ __ | |_     /  \  | |__) || |  
 *       / /\ \| __/ _ \| '_ ` _ \ \___ \ / __| '__| | '_ \| __|   / /\ \ |  ___/ | |  
 *      / ____ \ || (_) | | | | | |____) | (__| |  | | |_) | |_   / ____ \| |    _| |_ 
 *     /_/    \_\__\___/|_| |_| |_|_____/ \___|_|  |_| .__/ \__| /_/    \_\_|   |_____|
 *                                                   | |                               
 *                                                   |_|                               
 */

var Doc = document;
var Window = window;

function createButton(text){

	var i = document.createElement("input");
	i.type = "button";
	i.value = text;
	i.onClick = function(onclick){
	
		i.addEventListener("click", onclick);
	
	};
	
	return i;

}

function createTextInput(){

	var i = document.createElement("input");
	i.type = "text";
	i.onKeyPress = function(onpress){
	
		i.addEventListener("keydown", onpress);
	
	};
	
	i.setText = function(t){
	
		i.value = t;
	
	}
	
	i.getText = function(){
	
		return i.value;
		
	}
	
	return i;

}

function createText(text){

	var i = document.createElement("span");
	i.innerText = text;
	
	i.setText = function(t){
		
		i.innerHTML = t;
	
	}
	
	i.getText = function(){
	
		return i.innerText;
	
	}
	
	return i;

}

function createDiv(){

	var i = Doc.createElement("div");
	return i;

}

function append(element, parent){

	if(parent==null)Doc.body.appendChild(element);
	else parent.appendChild(element);

}

function get(id, root){
	
	if(root == null)root = document;

	if(id.startsWith(":")){

		return root.getElementById(id.substring(1, id.length));

	}else if(id.startsWith(".")){

		return root.getElementsByClassName(id.substring(1, id.length));

	}else if(id.startsWith("<") && id.endsWith(">")){ 

		return root.getElementsByTagName(id.substring(1, id.length-1));

	}else if(id.startsWith("^")){

		return root.getElementsByName(id.substring(1, id.length));

	}else{

		return id;

	}
	
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
