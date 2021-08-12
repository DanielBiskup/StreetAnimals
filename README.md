# Street Animals
a simple 2D shoot 'em up in HTML and JavaScript


## [v0.1-alpha](https://github.com/DanielBiskup/StreetAnimals/tree/v0.1-alpha) Anchor placement
What I mean by anchor is the (x,y)-position of an object
on the screen. Objects usually have some form of image and
a hitbox which we can use to detect collisions with
other objects as well as detecting if the player clicked on
them.

Some images (or animated images) might actually only be
using the lower 50% of an image file.
In those cases it is desirable to have a hitbox which does
not have the same size as the image we're rendering, because
otherwise we might have a hitbox twice as high as the object
visible on the screen.

We have to keep track of a hitbox and the
position where to draw the image individually and we need to
calculate them relative to the (x,y)-position (I call
anchor) or the object.

We also need to change the value mentioned above depending
on the scale at which we want to draw the image.

We can imagine the anchor to be positioned at several
positions relative to the object. Below we discuss placing
it at the origin or the image, and placing it in the center
of the objects hitbox.

### Anchor at the origin of the image
In the following image we have:
* Green filled Square: The anchor position of the object.
* Cyan filled square: The origin of the image being drawn.
* Cyan Border: The border of the image being drawn.
* Red filled square: The origin of the objects hitbox.
* Red Border: The border of the objects hitbox.

![anchor at image origin](./readme-images/ScalingWithAnchorAtImageOrigin.gif)
Here we set the anchor (green) to be the  (x,y)-position of the image origin and 
calculate everything else relative to it.

As you can see, this choice pushes the dog further and further
away with increasing scale. This is not desirable.

### Anchor in the center of the hitbox
![anchor at hitbox center](./readme-images/ScalingWithAnchorInCenter.gif)

Here we set the anchor (green) to be the (x,y)-position of the center
of the hitbox. Both the hitbox origin The images origin is calculated 
based on that position.

This seems more intuitive and useful to me.