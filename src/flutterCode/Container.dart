var ideal_container;
var _child;
var _width;
var _height;
var _color;
var _bottomLeft;
var _bottomRight;
var _topLeft;
var _topRight;
var _marginHorizontal;
/* IDEAL_INITIALISATION_START */
_child = /* IDEAL_CHILD */;
ideal_container = new Container(
  child: _child,
  width: _width,
  height: _height,
  margin: EdgeInsets.symmetric(horizontal: _marginHorizontal),
  decoration: BoxDecoration(
    color: Color(_color),
    borderRadius: BorderRadius.only(
      bottomLeft: Radius.circular(_bottomLeft),
      topLeft: Radius.circular(_topLeft),
      bottomRight: Radius.circular(_bottomRight),
      topRight: Radius.circular(_topRight),
    ),
    boxShadow: [
      BoxShadow(offset: Offset(0, 10),
        blurRadius: 50,
        color: Color(0xFF0C9869).withOpacity(0.23),
      ),
    ],
  ),
);
/* IDEAL_INITIALISATION_END */
