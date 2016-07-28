events.on("task:copy", function(task, options) {

	//load all backend/routes
	var globs = new GlobCollection([
		"**",
		"*"
	]);
	var treecontext = new TreeContext({
	    files: true,
	    dirs: true,
	    cache: true
	});
	
	var tree = treecontext.Tree(".", options.src);
	var modules = tree.mapGlobs(globs);

	FileSystem.mkdir(options.build);

	var includes = [];
	for (var i = 0, l = modules.files.length; i < l; i++) {
		var relativeLocation = modules.files[i].relativeLocation;
		var fromPath = path.join(options.src, relativeLocation);
		var fileContents = fs.readFileSync(fromPath);
		
		var relativePath = relativeLocation.slice(0, relativeLocation.length-modules.files[i].basename.length);
		FileSystem.mkdir(path.join(options.build, relativePath ));

		var toPath = path.join(options.build, modules.files[i].relativeLocation);

		fs.writeFileSync(toPath, fileContents);

		//console.log(fromPath, toPath);
	}

	task.success();

});