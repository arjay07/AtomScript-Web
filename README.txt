
            _                          _____                 _           _   
    /\     | |                        / ____|               (_)         | |  
   /  \    | |_    ___    _ __ ___   | (___     ___   _ __   _   _ __   | |_ 
  / /\ \   | __|  / _ \  | '_ ` _ \   \___ \   / __| | '__| | | | '_ \  | __|
 / ____ \  | |_  | (_) | | | | | | |  ____) | | (__  | |    | | | |_) | | |_ 
/_/    \_\  \__|  \___/  |_| |_| |_| |_____/   \___| |_|    |_| | .__/   \__|
                                                                | |          
                                                                |_|          

©ZeroSeven Interactive 2015
AtomScript is an interpreted programming language. The language is translated into JavaScript. 

BASIC USE:

	1. In your index.html document paste this in your head:
		<script src = "https://rawgit.com/arjay07/AtomScript/master/bin/AtomScript.js"></script>
	
	2. In your body of index.html, past this:
		<script>
		    AtomScript.src = "path/to/scriptname.atom";
		</script>

	3. Create a file with the extension .atom and then type this code in:
		@helloworld = "Hello, world!";
		
		$main(){

		    alert(helloworld);

		}

	4. Run index.html through a webserver...
		
