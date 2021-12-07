var ideal_carrouselslider;

var _height;
var _child;

/* IDEAL_INITIALISATION_START */
_child = <Widget>[/* IDEAL_CHILD */];
ideal_carrouselslider = new ImageSlideshow(
  width: double.infinity,
  height: _height,
  initialPage: 0,
  indicatorColor: Colors.blue,
  indicatorBackgroundColor: Colors.grey,
  children: _child,
  onPageChanged: (value) {
  },
  autoPlayInterval: 3000,
  isLoop: true,
);
/* IDEAL_INITIALISATION_END */
