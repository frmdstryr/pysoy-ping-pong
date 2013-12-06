__all__ = ['Examples']

from random import random

import soy
from Interfaces import Example

class LabeledText(soy.widgets.StackX):
    """A widget with two text fields arranged horizontally."""

    def __init__(self, parent = None, margin = None, aspect = -1.0,
                 label = "", text = "",
                 labelFont = "DejaVu Sans", textFont = "DejaVu Sans"):

        """Creates the Canvases for the label text and the updatable
        text."""

        self._labelTexture = soy.textures.Print(font = labelFont)
        self._textTexture = soy.textures.Print(font = textFont)
        self._labelCanvas = soy.widgets.Canvas(self,
                                               texture = self._labelTexture)
        self._textCanvas = soy.widgets.Canvas(self,
                                              texture = self._textTexture)

        self.label = label
        self.text = text

    def getText(self):
        """The text displayed in the text field."""

        return self._textTexture.text

    def setText(self, text):
        self._textTexture.text = str(text)

    text = property(getText, setText)

    def getTextColor(self):
        """The RGB floats of the current text color."""

        return self._textTexture.foreground.floats

    def setTextColor(self, color):
        self._textTexture.foreground = soy.colors.Color(color)

    textColor = property(getTextColor, setTextColor)
    
    def getLabelColor(self):
        """The RGB floats of the current text color."""

        return self._labelTexture.foreground.floats

    def setLabelColor(self, color):
        self._labelTexture.foreground = soy.colors.Color(color)

    labelColor = property(getLabelColor, setLabelColor)
    
    def getLabel(self):
        """The label displayed in the label field."""

        return self._labelTexture.text

    def setLabel(self, label):
        self._labelTexture.text = str(label)

    label = property(getLabel, setLabel)

class HudWidget(soy.widgets.StackY):
    """Displays the velocity and position of body."""
    
    def __init__(self, parent = None, margin = None, aspect = -1.0,
                 body = None):
        """Initializes the L{LabeledText} widgets displaying position
        and velocity and stores C{body}."""

        self.positionHud = LabeledText(self,
                                      label = "Position:")
        self.velocityHud = LabeledText(self,
                                      label = "Velocity:")

        self.body = body

        self.update()
        
    def formatVector(self, vector):
        """Formats a 3-tuple of floats."""
        return "(%6.2f x, %6.2f y, %6.2f z)" % tuple(vector)
    
    def update(self):
        """Updates the position and velocity text fields with the
        position of self.body."""
        
        if self.body is None:
            return
        
        self.positionHud.text = self.formatVector(self.body.position)
        self.velocityHud.text = self.formatVector(self.body.velocity)

class BouncingBody(soy.bodies.Body):
    """This body bounces off the walls."""

    def __init__(self, scene=None, 
                 position=None, rotation=None, velocity=None,
                 model=None, shape=None, bounds = 3.0):
        """Initializes this Body to be constrained to a cube centered
        on the origin with edges M{bounds * 2} long."""

        self.shape = soy.shapes.Box(1,1,1)
        self.model = soy.models.Shape(soy.materials.StainlessSteel())
        
        self.rotation = [random() - 0.5 * 1.1
                         for v in range(3)]
        self.position = [3.0 - (random() - 0.5)
                         for v in range(3) ]
        self.velocity = [2.0 - (1.5 * (random() - 0.5))
                         for v in range(3)]

        self.bounds = bounds

    def update(self):
        """Updates the motion and rotation vectors with some
        randomness and keeps us constrained to the bounds with some
        random jitter."""

        vel = []
        for p, v in zip(self.position, self.velocity):
            v += (random() - 0.5) * 0.1
            if abs(p) > self.bounds + random() - 0.5 and ((v > 0 and p > 0) or
                                                          v < 0 and p < 0):
                v = -v * (1 - random() * 0.15)
            vel.append(v)
        self.velocity = vel

        rot = []
        for r in self.rotation:
            r += (random() - 0.5) * 0.06

            rot.append(r)

        self.rotation = rot

class InstructionsWidget(soy.widgets.StackY):
    def __init__(self, parent = None, margin = None, aspect = -1.0,
                 label = "", text = "",
                 labelFont = "DejaVu Sans", textFont = "DejaVu Sans"):

        width, height = self.size

        self.directions = LabeledText(self,
                                      label = "To Quit:",
                                      text = "Hit ESC",
                                      margin = (height * 27 / 100, 0, 0, width * 20 / 100))

        self.directions.textColor = [random() for c in range(3)]

        self.labelColor = 1.0
        self.labelAlpha = 1.0
        self.labelColorAdd = 0.05
        
        self.update()
        
    def update(self):
        color = []

        for c in self.directions.textColor:
            c *= (random() + 0.8)
            if c > 1.0:
                c = random()
            color.append(c)
        self.directions.textColor = color

        self.labelColor += self.labelColorAdd
        if self.labelColor >= 1 or self.labelColor <= 0:
            self.labelColorAdd = -self.labelColorAdd
            self.labelColor = self.labelColor + 2 * self.labelColorAdd
        self.directions.labelColor = (self.labelColor, self.labelAlpha)
        
class HeadsUp(Example):
    """A simple Heads-Up Display example.

    This example creates a scene containing a basic shape moving
    around the screen with a Canvas widget displaying the x, y, and z
    coordinates of the body.

    The Widgets used are the Projector, the Canvas, and the StackZ.
    The StackZ stacks the Canvas in front of the Projector so that the
    text showing the block position and velocity is rendered last.    
    """

    def createWidgets(self):
        """Builds the widget stack on self.window."""

        self.stackz = soy.widgets.StackZ(self.window)
        self.projector = soy.widgets.Projector(self.stackz,
                                               camera = self.camera)

        self.hud = HudWidget(self.stackz, body = self.body)
        self.instructions = InstructionsWidget(self.stackz)
        self.addUpdatable(self.hud)
        self.addUpdatable(self.instructions)
        
    def buildScene(self):
        """Builds the scene graph on L{scene}."""

        self.body = BouncingBody(self.scene)
        self.addUpdatable(self.body)
