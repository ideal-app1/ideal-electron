import React from 'react';
import Path from '../utils/Path';
import Process from "../Components/Main/Components/Menu/Tools/Process";

class DependenciesHandler {

    // static fs = window.require('fs');
    //

    static addDependencyToProject(sdk, projectPath, dependency) {
        Process.runScript(`${sdk} pub add ${dependency}`, null, {'cwd': projectPath});
    }

    // static addDependencyToProject(projectPath, dependency) {
    //     const YAML = require('yaml')
    //     const readYaml = require('read-yaml');
    //     const write = require('write');
    //
    //     const filePath = Path.build(projectPath, 'pubspec.yaml');
    //
    //     if (!DependenciesHandler.fs.existsSync(projectPath)) {
    //         console.log("Project Path:" + projectPath + " do not exist.")
    //         return
    //     }
    //
    //     if (!DependenciesHandler.fs.existsSync(filePath)) {
    //         console.log("Dependencies file:" + filePath + " do not exist.")
    //         return
    //     }
    //
    //     readYaml(filePath, "",function (err, data) {
    //         if (err) throw err;
    //
    //         data.dependencies = {...data.dependencies, ...dependency}
    //
    //         const doc = new YAML.Document();
    //         doc.contents = data
    //
    //         write.sync(filePath, doc.toString(), {overwrite: true}, error => {
    //             if (error) throw error;
    //         })
    //     })
    // }
}

export default DependenciesHandler