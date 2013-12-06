"""Declares the interfaces used in the Widget examples."""

__all__ = ['Example', 'Animation']

from time import sleep

class Updatable(object):
    """Interface for any scene item that should be updated by
    L{Example.run}."""

    def update(self):
        """Update the state of this object in a main loop iteration."""

        raise NotImplementedError("Updatable.update must be implemented in subclasses.")

class Example(Updatable):
    """Interface implemented by all examples.  Implementations of this
    are searched for by the L{main} module for listing and running.
    The class docstring is displayed to the user by L{main} when it
    presents the available examples."""

    def __init__(self, frameRate = 45.0):
        """Initializes the attributes and the frame length for this
        example."""
        
        self._updatables = ()
        self._scene = None
        self._light = None
        self._camera = None
        self._window = None
        self.frameLength = 1.0 / frameRate
        
    def addUpdatable(self, widget):
        """Adds an updatable item to the list of items updated during
        the main loop."""

        self._updatables += (widget, )

    def update(self):
        """Called during the main loop to update all updatable widgets."""

        for u in self._updatables:
            u.update()

    def buildScene(self):
        """Hook for subclasses to build the scene when L{scene} is
        changed."""

        raise NotImplementedError("buildScene must be implemented in subclasses of Example.")
    
    def getScene(self):
        """The L{Scene} for this example.  The scene is initialized by
        the L{Example} instance, but can be manipulated at any time by
        L{main} or the L{Example}."""

        return self._scene

    def setScene(self, scene):
        self._scene = scene
        self.buildScene()

    scene = property(getScene, setScene)

    def getCamera(self):
        """The active L{soy.bodies.Camera} for this example."""

        return self._camera

    def setCamera(self, camera):
        self._camera = camera

    camera = property(getCamera, setCamera)

    def getLight(self):
        """The active L{soy.bodies.Light} for this example."""

        return self._light

    def setLight(self, light):
        self._light = light

    light = property(getLight, setLight)

    def getWindow(self):
        """The Window to build the Widget stack in.

        Setting this will rebuild the widget stack for the scene in
        the new window."""

        return self._window

    def setWindow(self, window):
        self._window = window
        self.createWidgets()

    window = property(getWindow, setWindow)

    def createWidgets(self):
        """Creates the widget stack for this L{Example}.  This is
        called by L{setWindow} whenever the L{Window} changes."""

        pass
    
    def run(self):
        """Sleeps between each iteration and updates the textures."""

        while True:
            self.update()
            sleep(self.frameLength)
    
