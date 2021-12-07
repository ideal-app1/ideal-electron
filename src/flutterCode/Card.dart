var ideal_card;

var _width;
var _height;
var _imgUrl;
var _imgWidth;
var _imgHeight;
var _titleContent;
var _titleSize;
var _textContent;
var _textSize;
var _buttonText;
var _buttonColor;
var _buttonWidth;
var _buttonHeight;
var _onPressed;
var _enable;

/* IDEAL_INITIALISATION_START */
ideal_card = new Container(
  width: _width,
  height: _height,
  child: Card(
    semanticContainer: true,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(10.0),
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.network(_imgUrl,
            width: _imgWidth,
            height: _imgHeight,
          ),
        ),
        SizedBox(height: 10),
        Text(_titleContent,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: _titleSize,
          ),
        ),
        SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            Text(_textContent,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: _textSize,
              ),
            ),
          ],
        ),
        SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(
              width: _buttonWidth,
              height: _buttonHeight,
              child: FlatButton(
                onPressed: _enable ? _onPressed : null,
                child: Text(
                  _buttonText,
                  style: TextStyle(
                   fontSize: 16
                  ),
                ),
                color: _buttonColor,
                textColor: Colors.white
              ),
            ),
          ],
        ),
      ],
    ),
    elevation: 5,
    margin: EdgeInsets.all(10),
  ),
);
/* IDEAL_INITIALISATION_END */
