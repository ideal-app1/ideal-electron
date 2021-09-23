import 'package:flutter/material.dart';

class idealPage extends StatefulWidget {
  idealPage({Key key}) : super(key: key);

  @override
  _idealPageState createState() => _idealPageState();
}

class _idealPageState extends State<idealPage> {

  _idealPageState() {
    @override
    Widget build(BuildContext context) {
      return Scaffold(
          body: idealScaffold()
      );
    }
  }
}