import React from 'react';

class DependenciesHandler {

    static Sep = window.navigator.platform === "Win32" ? '\\' : "/";
    static fs = window.require('fs');

    static addDependencyToProject(projectPath, dependency) {
        let readYaml = require('read-yaml');
        const fileName = "." + DependenciesHandler.Sep + "pubspec.yaml"

        if (!DependenciesHandler.fs.existsSync(projectPath)) {
            console.log("Project Path:" + projectPath + " do not exist.")
            return
        }
        console.log("Project Path:" + projectPath)

        if (!DependenciesHandler.fs.existsSync(projectPath + DependenciesHandler.Sep + fileName)) {
            console.log("Dependencies file:" + fileName + " do not exist.")
            return
        }
        console.log("Dependencies file:" + fileName)

        // Read le yaml
        readYaml(projectPath + DependenciesHandler.Sep + fileName, "",function (err, data) {
            if (err) throw err;
            // Contenu du yaml
            console.log("Contenu du YAML")
            console.log(data)
            // Merge de deux objects (en gros ajout de la dependance)
            data.dependencies = {...data.dependencies, dependency}
            // Résultat avec ajout
            console.log(data)
            // Need écrire dans le fichier

            // Lien peut être utile (Déso j'ai pas testé ...) https://www.npmjs.com/package/write
        })
    }
}

export default DependenciesHandler