import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;

class CodeLinkType {
  int getInt(int res) {
    int createint = res;
    return (createint);
  }

  String getString(String res) {
    String createString = res;
    return (createString);
  }

  bool getBool(bool res) {
    bool createBool = res;
    return (createBool);
  }

  int StringToInt(var str) {
    int res = int.parse(str);
    assert(res is int);
    return res;
  }

  String IntToString(int number) {
    String res = number.toString();
    assert(res is String);
    return res;
  }

  DateTime getDate() {
    var now = DateTime.now();
    return (now);
  }

  DateTime DateFromString(String date) {
    var parsedDate = DateTime.parse(date);
    return (parsedDate);
  }
}

