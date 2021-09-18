var button;
var onPressed;
var text;
var enable;
var width;
var height;


/* IDEAL_INITIALISATION_START */
button = new SizedBox(
  width: width,
  height: height,
  child: FlatButton(
    onPressed: enable ? onPressed : null,
      child: Text(
      text,
      style: TextStyle(
      fontSize: 16
    ),
  ),
  color: Color.fromRGBO(33, 8, 174, 1),
  textColor: Colors.white
),
);
/* IDEAL_INITIALISATION_END */

