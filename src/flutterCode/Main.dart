import 'package:flutter/material.dart';

void main() {
  runApp(IdealApp());
}

class IdealApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ideal',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: IdealHomePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class IdealHomePage extends StatefulWidget {
  IdealHomePage({Key key}) : super(key: key);

  @override
  _IdealHomePageState createState() => _IdealHomePageState();
}

class _IdealHomePageState extends State<IdealHomePage> {

  _IdealHomePageState() {
    @override
    Widget build(BuildContext context) {
      return Scaffold(
          body: IdealScaffold()
      );
    }
  }
}