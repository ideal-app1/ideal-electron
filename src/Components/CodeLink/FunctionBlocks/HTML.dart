import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;
import 'dart:html';

class CodeLinkHTML {
  Element getElementbyID(String id) {
    Element IdElement = querySelector(id)!;
    return (IdElement);
  }

  Element getElementbyclass(String str) {
    Element classElement = querySelector(str)!;
    return (classElement);
  }

  void createElement(String str) {
    var elem = ParagraphElement();
    elem.text = str;
  }
}