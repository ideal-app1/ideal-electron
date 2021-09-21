import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;

int getInt(int res) {
  int? createint = res;
  return (createint);
}

String getString(String res) {
  String? createString = res;
  return (createString);
}

bool getBool(bool res) {
  bool? createBool = res;
  return (createBool);
}

int StringToInt(var str) {
  int? res = int.parse(str);
  assert(res is int);
  return res;
}

String IntToString(int number) {
  String? res = number.toString();
  assert(res is String);
  return res;
}

Map AddMap(Map data, String index, String res)
{
  data[index] = res;
  return (data);
}

String GetMapKey(var data)
{
  return (data.keys);
}

String GetMapValue(var data)
{
  return (data.values);
}

int GetMapLength(var data)
{
  return (data.length);
}

bool IsMapEmpty(var data)
{
  return (data.isEmpty);
}

void ClearMap(var data)
{
  data.clear();
}

List CreateList(String value)
{
  var list_data = [value];
  return (list_data);
}

int GetListLength(List data)
{
  return (data.length);
}

bool IsListEmpty(List data)
{
  return (data.isEmpty);
}

void ClearList(List data)
{
  data.clear();
}

List AddElemList(List data, var value)
{
  data.add(value);
  return (data);
}

class CodeLinkType {
  DateTime getDate() {
    var now = DateTime.now();
    return (now);
  }

  DateTime DateFromString(String date) {
    var parsedDate = DateTime.parse(date);
    return (parsedDate);
  }
}

