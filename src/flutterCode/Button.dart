var ideal_button;
var ideal_onPressed;
var ideal_text;
var ideal_enable;
var ideal_width;
var ideal_height;


/* IDEAL_INITIALISATION_START */
ideal_button = new SizedBox(
  width: ideal_width,
  height: ideal_height,
  child: FlatButton(
    onPressed: ideal_enable ? ideal_onPressed : null,
      child: Text(
      ideal_text,
      style: TextStyle(
      fontSize: 16
    ),
  ),
  color: Color.fromRGBO(33, 8, 174, 1),
  textColor: Colors.white
),
);
/* IDEAL_INITIALISATION_END */

