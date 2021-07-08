import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;

class CodeLinkCondition {
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

  bool ifCondition(int a, int b) {

    return false;
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
}