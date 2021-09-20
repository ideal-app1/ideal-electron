import Process from '../Components/Main/Components/Menu/Tools/Process';

class VersionHandler {
  static alreadyChecked = false;
  static FlutterVersion = undefined;

  upgradeFlutter = (toUpdateList) => {
    Process.runScript(Main.FlutterSDK + ' upgrade', () => {update(toUpdateList)})
  };

  activateCodeHandler = (toUpdateList) => {
    Process.runScript('dart pub global activate ideal_dart_code_handler', () => {update(toUpdateList)});
  };

  getFlutterVersion = (toUpdateList) => {

  };

  update = (toUpdateList) => {
    const toUpdate = toUpdateList.shift();

    if (toUpdate !== undefined) {
      toUpdate(toUpdateList);
    }
  };

  versionCheck = () => {
    const toUpdateList = [this.upgradeFlutter, this.activateCodeHandler];

    if (VersionHandler.alreadyChecked) {
      return;
    }
    VersionHandler.alreadyChecked = true;
    update(toUpdateList);
  };
}