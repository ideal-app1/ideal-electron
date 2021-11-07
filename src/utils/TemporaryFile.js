import Main from '../Components/Main/Main';
import Path from './Path';

class TemporaryFile {

  static readableRandomStringMaker(length) {
    let str = '';

    for (str=''; str.length < length; str += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random()*62|0));
    str += '.idch_tmp';
    return str;
  }

  static createSync(content) {
    let randomName = this.readableRandomStringMaker(5);
    let path = '';

    Main.fs.mkdirSync(Path.build(Main.IdealDir, 'DartCodeHandler'), {recursive: true});
    while (Main.fs.existsSync(randomName)) {
      randomName = this.readableRandomStringMaker(5);
    }
    path = Path.build(Main.IdealDir, 'DartCodeHandler', randomName);
    Main.fs.writeFileSync(path, content);
    return path;
  }

}

export default TemporaryFile