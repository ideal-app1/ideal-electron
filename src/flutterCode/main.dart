import 'package:flutter/material.dart';

/* IDEAL_IMPORT_START */
/* IDEAL_IMPORT_END */

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  _MyHomePageState() {
    /* IDEAL_INITIALISATION_CODELINK_START */
    /* IDEAL_INITIALISATION_CODELINK_END */
    /* IDEAL_INITIALISATION_START */
    /* IDEAL_INITIALISATION_END */
  }

  /* IDEAL_VARIABLE_START */
  /* IDEAL_VARIABLE_END */

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body:
        /* IDEAL_BODY_START */
            Text("Start")
        /* IDEAL_BODY_END */

        );
  }
}
