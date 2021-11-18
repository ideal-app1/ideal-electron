var ideal_checkbox;

var _checked;
var _data;
var _size;

/* IDEAL_INITIALISATION_START */
ideal_checkbox = new Row(
  children: [
    Checkbox(
      checkColor: Colors.white,
      fillColor: Colors.blue,
      value: _checked,
      onChanged: (value) {
        setState(() {
          _checked = !_checked;
        });
      },
    ),
    Text(_data,
      style: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: _size
      ),
    ),
  ],
);
/* IDEAL_INITIALISATION_END */
