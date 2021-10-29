var ideal_button;
var _onPressed;
var _text;
var _enable;
var _width;
var _height;


/* IDEAL_INITIALISATION_START */
ideal_button = new SizedBox(
  width: _width,
  height: _height,
  child: FlatButton(
    onPressed: _enable ? _onPressed : null,
      child: Text(
      _text,
      style: TextStyle(
      fontSize: 16
    ),
  ),
  color: Color.fromRGBO(33, 8, 174, 1),
  textColor: Colors.white
),
);
/* IDEAL_INITIALISATION_END */

