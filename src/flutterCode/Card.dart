var ideal_card;

var _width;
var _height;
var _imgUrl;
var _imgWidth;
var _imgHeight;
var _titleData;
var _titleSize;
var _textData;
var _textSize;
var _buttonText;
var _buttonColor;
var _buttonWidth;
var _buttonHeight;

/* IDEAL_INITIALISATION_START */
ideal_card = new Card(
  child: Container(
    width: _width,
    height: _height,
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(15.0),
      image: DecorationImage(
        fit: BoxFit.cover,
        image: NetworkImage(_imgUrl))),
    child: Padding(
      padding: const EdgeInsets.all(10.0),
      child: Text(_titleData),
    ),
  ),
  margin: EdgeInsets.only(left: 20.0, right: 20.0, top: 5.0),
);
/* IDEAL_INITIALISATION_END */
