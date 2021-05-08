SizedBox(
  width: /* IDEAL_BUTTON_WIDTH */,
  height: /* IDEAL_BUTTON_HEIGHT */,
  child: FlatButton(
    onPressed: '/* IDEAL_BUTTON_STATE */' == 'disabled' ? null : () {

    },
    child: Text(
      '/* IDEAL_BUTTON_TEXT */',
      style: TextStyle(
        fontSize: 16
      ),
    ),
    color: Color.fromRGBO(33, 8, 174, 1),
    textColor: Colors.white
  ),
)