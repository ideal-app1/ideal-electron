import 'package:flutter/material.dart';

void main() {
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Main',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MainHomePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MainHomePage extends StatefulWidget {
  MainHomePage({Key key}) : super(key: key);

  @override
  Main createState() => Main();
}

class Main extends State<MainHomePage> {

  Main() {
    @override
    Widget build(BuildContext context) {
      return Scaffold(
          body: MainScaffold()
      );
    }
  }
}