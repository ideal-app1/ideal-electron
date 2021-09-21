import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;


String printf(String str)
{
  print(str);
  return str;
}

bool onPressed(bool button) {
  if (button == false)
    return false;
  else
    return true;
}

int getMaxNumber(int a, int b) {
  if (a > b)
    return (a);
  else
    return (b);
}

int getMinNumber(int a, int b) {
  if (a < b)
    return (a);
  else
    return (b);
}

String UpperString(String str) {
  String res = str.toUpperCase();
  return (res);
}

String LowerString(String str) {
  String res = str.toLowerCase();
  return (res);
}

void PrintAllMap(var data)
{
  data.forEach((k, v) => print('${k}: ${v}'));
}

void PrintFirstList(List data)
{
  print(data.first);
}