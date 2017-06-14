 (function() {
     var fs = require('fs');
     var dialog = require('electron').remote.dialog;
     const settings = require('electron-settings');
     var anymatch = require('anymatch');
     var Watcher = require('./watcher.js');

     var optionsDiv = document.getElementById('options');
     var sourceTextbox = document.getElementById('source');
     var outputTextbox = document.getElementById('output');

     var startWatchButton = document.getElementById('startWatch');
     var selectSourceButton = document.getElementById('select-source');
     var selectOutputButton = document.getElementById('select-output');
     var includeInitialCheckbox = document.getElementById('includeInitial');


     var runningDiv = document.getElementById('running');
     var stopWatchButton = document.getElementById('stopWatch');
     var clearLogButton = document.getElementById('clearLog');

     var logEl = document.getElementById('log');

     var includedPatterns = ['*'];
     var ignoredPatterns = ['**/.git', '**/node_modules'];
     var includeInitial = false;

     var selectDirectory = (el) => {
         dialog.showOpenDialog({
             properties: ['openDirectory']
         }, (path) => {
             if (path) {
                 el.value = path;
                 validateAndSave(el);
             }
         });
     }

     var startWatch = () => {
         clearLog();
         try {
             var sourceDir = getDir(sourceTextbox);
             var outputDir = getDir(outputTextbox);

             if (sourceDir != null && outputDir != null && validatePathsAreUnique(sourceTextbox, outputTextbox) && validatePathsNotRelated(sourceTextbox, outputTextbox)) {
                 fileWatcher.watch(sourceDir, outputDir, includeInitial, includedPatterns, ignoredPatterns);

                 optionsDiv.style.display = "none";
                 runningDiv.style.display = "block";
             }
         } catch (error) {
             console.log(error);
         }
     };

     var stopWatch = () => {
         try {
             fileWatcher.dispose();

             optionsDiv.style.display = "block";
             runningDiv.style.display = "none";
         } catch (error) {
             console.log(error);
         }
     };

     var getDir = (el) => {
         removeInputErrors(el);

         var dir = null;
         if (validateElement(el)) {
             dir = el.value;
         }

         return dir;
     };

     var validateAndSave = (el) => {
         removeInputErrors(el);

         if (validateElement(el)) {
             settings.set(el.id, el.value);
         }
     };

     var validateElement = (el) => {
         var valid = true;
         try {
             var stats = fs.statSync(el.value);

             if (!stats.isDirectory()) {
                 showInputError(el, "Value is not a folder.");
                 valid = false;
             } else {
                 valid = validatePathNotInIgnoredPattern(el);
             }


         } catch (error) {
             showInputError(el, "Path does not exist.");
             valid = false;
         }

         return valid;
     };

     var validatePathNotInIgnoredPattern = (el) => {
         var valid = true;

         if (anymatch(ignoredPatterns, el.value)) {
             showInputError(el, "Path must not contain an ignored pattern.")
             valid = false;
         }

         return valid;
     };

     var validatePathsAreUnique = (first, second) => {
         var valid = true;

         if (first.value == second.value) {
             showInputError(first, "Source and Output must be different.");
             showInputError(second, "Source and Output must be different.");
             valid = false;
         }

         return valid;
     };

     var validatePathsNotRelated = (first, second) => {
         var valid = true;

         if (first.value.indexOf(second.value) >= 0) {
             showInputError(first, "Source path must not be a child of the output path.");
             valid = false;
         } else if (second.value.indexOf(first.value) >= 0) {
             showInputError(second, "Output path must not be a child of the source path.");
             valid = false;
         }

         return valid;
     };

     var showInputError = (el, msg) => {
         el.classList.add("invalid");

         errorContainerEl = el.nextElementSibling.nextElementSibling;

         var errorEl = document.createElement("div");
         errorEl.innerText = msg;

         errorContainerEl.appendChild(errorEl);

         console.log(msg);
     };

     var removeInputErrors = (el) => {
         el.classList.remove("invalid");

         errorContainerEl = el.nextElementSibling.nextElementSibling;

         while (errorContainerEl.firstChild) {
             errorContainerEl.removeChild(errorContainerEl.firstChild);
         }
     };

     var log = (...msgs) => {
         var el = document.createElement("div");

         for (var msg of msgs) {
             var span = document.createElement("span");
             span.innerText = msg;
             el.appendChild(span);
         }

         logEl.appendChild(el);

         console.log(...msgs);
     }

     var clearLog = () => {
         while (logEl.firstChild) {
             logEl.removeChild(logEl.firstChild);
         }
     }

     var fileWatcher = new Watcher(log);

     var defaultSource = settings.get('source', null);
     if (defaultSource != null) {
         sourceTextbox.value = defaultSource;
     }

     var defaultOutput = settings.get('output', null);
     if (defaultOutput != null) {
         outputTextbox.value = defaultOutput;
     }

     // option element handlers
     startWatchButton.onclick = () => startWatch();
     sourceTextbox.onchange = () => validateAndSave(sourceTextbox);
     selectSourceButton.onclick = () => selectDirectory(sourceTextbox);

     outputTextbox.onchange = () => validateAndSave(outputTextbox);
     selectOutputButton.onclick = () => selectDirectory(outputTextbox);

     includeInitialCheckbox.onchange = () => includeInitial = !includeInitial;

     // running element handlers
     stopWatchButton.onclick = () => stopWatch();
     clearLogButton.onclick = () => clearLog();
 }());