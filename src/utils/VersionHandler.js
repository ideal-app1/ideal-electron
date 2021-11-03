import Process from '../Components/Main/Components/Menu/Tools/Process';
import Main from '../Components/Main/Main';
import Path from './Path';
import codelinkBlocks from '../Components/CodeLink/Tools/FunctionBlocks';
import JsonManager from '../Components/Main/Tools/JsonManager';
import Loading from '../Components/Main/Components/Dialog/Components/Loading/Loading';
import React from 'react';

import Dialog from '../Components/Main/Components/Dialog/Dialog';


const fs = require('fs');

let execDartHandler = 'dart pub global run ideal_dart_code_handler  ';




class VersionHandler {
  static FlutterVersion = undefined;
  static hasBeenRun = false;

  constructor() {
    this.dialog = Dialog.getInstance();
    if (Main.debug) {
      // Easier to debug than to submit a new version of the Code Handler.
      // Change to the path of the dart file for debugging purpose.
      execDartHandler = ' dart C:\\Users\\axela\\IdeaProjects\\codelink-dart-indexer\\bin\\ideal_dart_code_handler.dart ';
    }

  }

  scriptThen = (command, toUpdateList) => {
    console.log('test');
    this.dialog.current.createDialog(<Loading/>);
    Process.runScript(command, () => {
      this.update(toUpdateList);
      this.dialog.current.unsetDialog();
    });
  };

  upgradeFlutter = (toUpdateList) => {
    this.scriptThen(Main.FlutterSDK + ' upgrade', toUpdateList);
  };

  activateCodeHandler = (toUpdateList) => {
    this.scriptThen('dart pub global activate ideal_dart_code_handler', toUpdateList);
  };

  moveCodeLinkCode = (toUpdateList) => {
    codelinkBlocks.forEach(x => Main.fs.writeFileSync(Path.build(Main.IdealDir, 'codelink', 'FunctionBlocks', x), require('../FunctionBlocks/' + x)));
    this.update(toUpdateList);
  };

  indexFlutterSources = (toUpdateList) => {

    const indexerArguments = {
      'requestType': 'index',
      'parameters': {
        'pathToIndex': Path.build(Main.FlutterRoot, 'packages', 'flutter', 'lib'),
        'finalPath': Path.build(Main.IdealDir, 'codelink', 'Indexer', 'FlutterSDKIndex'),
        'verbose' : false
      }
    };

    Process.runScript(execDartHandler + (new Buffer(JSON.stringify(indexerArguments)).toString('base64')), () => {});
    this.update(toUpdateList);
  };

  loadUserCode = () => {
    try {
      const file = JsonManager.get(Path.build(Main.MainProjectPath, 'Ideal_config.json'));

      return file.codeLinkUserPath;
    } catch (_) {
      return undefined;
    }
  };

  indexUserCode = (toUpdateList) => {

    const codeLinkBlocks = this.loadUserCode();

    if (!codeLinkBlocks) {
      this.update(toUpdateList);
      return;
    }
    const indexerArguments = {
      'requestType': 'index',
      'parameters': {
        'pathToIndex': codeLinkBlocks,
        'finalPath': Path.build(Main.MainProjectPath, '.ideal_project', 'code_handler', 'indexer', 'user_sources'),
        'verbose' : false
      }
    };

    Process.runScript(execDartHandler + (new Buffer(JSON.stringify(indexerArguments)).toString('base64')), () => {});
    this.update(toUpdateList);
  };

  indexCodeLinkCode = (toUpdateList) => {
    const indexerArguments = {
      'requestType': 'index',
      'parameters': {
        'pathToIndex': Path.build(Main.IdealDir, 'codelink', 'FunctionBlocks'),
        'finalPath': Path.build(Main.IdealDir, 'codelink', 'Indexer', 'FunctionBlocksIndex'),
        'verbose' : false
      }
    };
    Process.runScript(execDartHandler + (new Buffer(JSON.stringify(indexerArguments)).toString('base64')), () => {});
    this.update(toUpdateList);
  };

  verifyFlutterIndex = () => {
    return fs.existsSync(Path.build(Main.IdealDir, 'codelink', 'FlutterSDKIndex', 'classes.json'));
  };

  verifyUpgrade = (toUpdateList) => {
    const oldFlutterVersion = VersionHandler.FlutterVersion;

    VersionHandler.FlutterVersion = fs.readFileSync(Path.build(Main.FlutterRoot, 'version'), 'utf8');
    if (oldFlutterVersion === oldFlutterVersion && this.verifyFlutterIndex()) {
      this.update(toUpdateList);
    }
    this.indexFlutterSources(toUpdateList);
  };

  update = (toUpdateList) => {
    const toUpdate = toUpdateList.shift();

    if (toUpdate !== undefined) {
      toUpdate(toUpdateList);
    }
  };

  versionCheck = (force = false) => {
    console.log('v check');
    const toUpdateList = [this.upgradeFlutter, this.activateCodeHandler, this.verifyUpgrade, this.moveCodeLinkCode, this.indexUserCode, this.indexCodeLinkCode];

    console.log(Main.MainProjectPath, Main.IdealDir, Main.FlutterRoot, force, VersionHandler.hasBeenRun);
    if (Main.MainProjectPath === undefined || Main.IdealDir === undefined ||
      Main.FlutterRoot === undefined ||
      (force === false && VersionHandler.hasBeenRun === true))
      return false;
    console.log('ok');
    VersionHandler.hasBeenRun = true;
    VersionHandler.FlutterVersion = fs.readFileSync(Path.build(Main.FlutterRoot, 'version'), 'utf8');
    this.update(toUpdateList);
    return true;
  };
}

export default VersionHandler;