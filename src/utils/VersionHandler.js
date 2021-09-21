import Process from '../Components/Main/Components/Menu/Tools/Process';
import Main from '../Components/Main/Main';
import Path from './Path';
import codelinkBlocks from '../Components/CodeLink/Tools/FunctionBlocks';

const fs = require('fs');

class VersionHandler {
  static FlutterVersion = undefined;

  constructor() {
    console.log('SALUT');
    this.versionCheck();
  }

  scriptThen = (command, toUpdateList) => {
    Process.runScript(command, () => this.update(toUpdateList));
  };

  upgradeFlutter = (toUpdateList) => {
    this.scriptThen(Main.FlutterSDK + ' upgrade', toUpdateList);
  };

  activateCodeHandler = (toUpdateList) => {
    this.scriptThen('dart pub global activate ideal_dart_code_handler', toUpdateList);
  };

  moveCodeLinkCode = (toUpdateList) => {
    codelinkBlocks.forEach(x => Main.fs.writeFileSync(Path.build(Main.IdealDir, 'codelink', 'default', x), require('../FunctionBlocks/' + x)));
    this.update(toUpdateList);
  };

  indexFlutterSources = (toUpdateList) => {
    const command = 'dart pub global run ideal_dart_code_handler index';
    const indexerArguments = {
      'requestType': 'index',
      'parameters': {
        'pathToIndex': Path.build(Main.FlutterRoot, 'packages', 'flutter', 'lib'),
        'finalPath': Path.build(Main.IdealDir, 'codelink', 'FlutterSDKIndex'),
        'verbose' : false
      }
    }
    this.scriptThen(command + JSON.stringify(indexerArguments), toUpdateList);
  };

  indexCodeLinkCode = (toUpdateList) => {
    const command = 'dart pub global run ideal_dart_code_handler index';
    const indexerArguments = {
      'requestType': 'index',
      'parameters': {
        'pathToIndex': Path.build(Main.IdealDir, 'FunctionBlocks'),
        'finalPath': Path.build(Main.IdealDir, 'codelink', 'FunctionBlocksIndex'),
        'verbose' : false
      }
    }
    this.scriptThen(command + JSON.stringify(indexerArguments), toUpdateList)
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
      console.log(`Kikoo ^^ ${toUpdate.name}`);
      toUpdate(toUpdateList);
    }
  };

  versionCheck = () => {
    const toUpdateList = [this.upgradeFlutter, this.activateCodeHandler, this.verifyUpgrade, this.moveCodeLinkCode, this.indexCodeLinkCode];

    console.log(Main.MainProjectPath)
    console.log(Main.IdealDir)
    console.log(Main.FlutterRoot)

    if (Main.MainProjectPath === undefined || Main.IdealDir === undefined ||
        Main.FlutterRoot === undefined)
      return;
    VersionHandler.FlutterVersion = fs.readFileSync(Path.build(Main.FlutterRoot, 'version'), 'utf8');
    console.log('slt')
    this.update(toUpdateList);
  };
}

export default VersionHandler;