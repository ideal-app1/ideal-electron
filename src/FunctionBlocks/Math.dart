import 'dart:convert';
import 'dart:io';
import 'dart:async' as async;
import 'dart:math';

int addFunction(int a, int b) {
  int res = a + b;
  print (res);
  return (res);
}

int subsFunction(int a, int b) {
  int res = a - b;
  print (res);
  return (res);
}

int mulFunction(int a, int b) {
  int res = a * b;
  print (res);
  return (res);
}

int divFunction(int a, int b) {
  int res = a % b;
  print (res);
  return (res);
}

int RandomNumber(int min, int max) {
  Random rnd;
  rnd = new Random();
  int res = min + rnd.nextInt(max - min);
  return res;      
}

Random RandomBool() {
  var random = Random();
  random.nextBool();
  return (random);
}

bool isOperator(String x) {
  if (x == '/' || x == 'x' || x == '-' || x == '+' || x == '=') 
  {
    return true;
  }
  return false;
}