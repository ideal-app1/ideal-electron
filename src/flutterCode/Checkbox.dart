var ideal_checkbox;

var _data;
var _size;
var _checked;

/* IDEAL_INITIALISATION_START */
ideal_checkbox = new Row(
  children: [
    Checkbox(
      checkColor: Colors.white,
      activeColor: Colors.blue,
      value: _checked,
      onChanged: (bool? value) {
        setState(() {
          _checked = value!;
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
