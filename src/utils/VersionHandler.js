import Process from '../Components/Main/Components/Menu/Tools/Process';
import Main from '../Components/Main/Main';
import Path from './Path';
const fs = require('fs');

class VersionHandler {
  static alreadyChecked = false;
  static FlutterVersion = undefined;

  scriptThen = (command, toUpdateList) => {
    Process.runScript(command, () => this.update(toUpdateList));
  };

  upgradeFlutter = (toUpdateList) => {
    this.scriptThen(Main.FlutterSDK + ' upgrade', toUpdateList);
  };

  activateCodeHandler = (toUpdateList) => {
    this.scriptThen('dart pub global activate ideal_dart_code_handler', toUpdateList);
  };


  indexFlutterSources = (toUpdateList) => {
    const command = 'dart pub global run ideal_dart_code_handler index';
    const indexerArguments = {
      'requestType': 'index',
      'parameters': {
        'pathToIndex': Path.build(Main.FlutterRoot, 'packages', 'flutter', 'lib'),
        'finalPath': Path.build(Main.IdealDir, 'FlutterSDKIndex'),
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
        'finalPath': Path.build(Main.IdealDir, 'FunctionBlocksIndex'),
        'verbose' : false
      }
    }
    this.scriptThen(command + JSON.stringify(indexerArguments), toUpdateList)
  };

  verifyUpgrade = (toUpdateList) => {
    const oldFlutterVersion = VersionHandler.FlutterVersion;

    VersionHandler.FlutterVersion = fs.readFileSync(Path.build(Main.FlutterSDK + 'version'), 'utf8');
    if (oldFlutterVersion === oldFlutterVersion)
      return;
    this.indexFlutterSources(toUpdateList);
  };

  update = (toUpdateList) => {
    const toUpdate = toUpdateList.shift();

    if (toUpdate !== undefined) {
      toUpdate(toUpdateList);
    }
  };

  versionCheck = () => {
    const toUpdateList = [this.upgradeFlutter, this.activateCodeHandler, this.verifyUpgrade, this.indexCodeLinkCode];

    if (Main.MainProjectPath === undefined || Main.IdealDir === undefined ||
        Main.FlutterRoot === undefined || VersionHandler.alreadyChecked === true)
      return;
    VersionHandler.FlutterVersion = fs.readFileSync(Path.build(Main.FlutterSDK + 'version'), 'utf8');
    VersionHandler.alreadyChecked = true;
    update(toUpdateList);
  };
}