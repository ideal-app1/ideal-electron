import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

 Future<Directory> get _localPath async {
  final directory = await getApplicationDocumentsDirectory();
  return directory.path;
}

Future<File> get _localFile async {
  final path = await _localPath;
  print('path ${path}');
  return (File('$path/counter.txt'));
}

Future<int> deleteFile() async {
  try {
    final file = await _localFile;

    await file.delete();
  } catch (e) {
    return 0;
  }
  return (0);
}

Future<void> ListAllFile(String path) async {
  var dir = Directory(path);

  try {
    var dirList = dir.list();
    await for (FileSystemEntity f in dirList) {
      if (f is File) {
        print('Found file ${f.path}');
      } else if (f is Directory) {
        print('Found dir ${f.path}');
      }
    }
  } catch (e) {
    print(e.toString());
  }
}

class CodeLinkFile {
  
  void createFile(String name, String filepath) {
    new File(name);
  }

  void readFile(String name, String filepath) {
    new File(name).readAsString().then((String contents) {
      print(contents);
    });
  }

  Future<File> writeCounter(int counter) async {
    final file = await _localFile;

    // Write the file
    return file.writeAsString('$counter');
  }

  Future<int> readCounter() async {
    try {
      final file = await _localFile;

      // Read the file
      final contents = await file.readAsString();

      return int.parse(contents);
    } catch (e) {
      // If encountering an error, return 0
      return 0;
    }
  }

  void writeFile(String name, String text) async {
    var file = File(name);
    var sink = file.openWrite();
    sink.write(text);

    // Close the IOSink to free system resources.
    sink.close();
  }
}