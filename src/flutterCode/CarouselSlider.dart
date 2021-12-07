import 'package:flutter_image_slideshow/flutter_image_slideshow.dart';

var ideal_carouselslider;

var _height;
var _child;

/* IDEAL_INITIALISATION_START */
_child = [/* IDEAL_CHILD */];
ideal_carouselslider = new ImageSlideshow(
  width: double.infinity,
  height: _height,
  initialPage: 0,
  indicatorColor: Colors.blue,
  indicatorBackgroundColor: Colors.grey,
  children: [_child],
  onPageChanged: (value) {
    print('Page changed: $value');
  },
  autoPlayInterval: 3000,
  isLoop: true,
);
/* IDEAL_INITIALISATION_END */
