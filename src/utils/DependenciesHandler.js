import React from 'react';
import YAML from "yaml";
import write from "write";
import Path from '../utils/Path';

class DependenciesHandler {

    static Sep = window.navigator.platform === "Win32" ? '\\' : "/";
    static fs = window.require('fs');

    static addDependencyToProject(projectPath, dependency) {
        const YAML = require('yaml')
        const readYaml = require('read-yaml');
        const write = require('write');

        const filePath = Path.build(projectPath, 'pubspec.yaml');

        if (!DependenciesHandler.fs.existsSync(projectPath)) {
            console.log("Project Path:" + projectPath + " do not exist.")
            return
        }

        if (!DependenciesHandler.fs.existsSync(filePath)) {
            console.log("Dependencies file:" + filePath + " do not exist.")
            return
        }

        readYaml(filePath, "",function (err, data) {
            if (err) throw err;

            data.dependencies = {...data.dependencies, ...dependency}

            const doc = new YAML.Document();
            doc.contents = data

            write.sync(filePath, doc.toString(), {overwrite: true}, error => {
                if (error) throw error;
            })
            // https://www.npmjs.com/package/write
            // write.sync(filePath, doc.toString(), {override: true}, error => {
            //     if (error) throw error;
            // })
        })
    }
}

export default DependenciesHandler