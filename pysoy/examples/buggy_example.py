#!/usr/bin/env python3

import soy
from time import sleep

# this is the floor material, used when we create the scene
# in this example, it uses checkered pattern with light and dark green
mat = soy.materials.Textured(colormap=
        soy.textures.Texture('checkered', (soy.atoms.Color('chartreuse'),
                                           soy.atoms.Color('darkgreen'))))
mat.colormap.wrap = True

# we create the planar scene
# a planar scene is an infinity flat floor, perfect for this example
scene = soy.scenes.Planar(material=mat, step=6)

# we put a camera and a light to the scene, something required in
# almost every game or example you will make
scene['cam'] = soy.bodies.Camera(soy.atoms.Position((0, 1, 5)))
scene['light'] = soy.bodies.Light(soy.atoms.Position((-2, 3, 5)))

# this is the Buggy class
# when you want a buggy, you create a new instance of this class (you can see how below)
class Buggy:
	id = 0  # this class var is used as a suffix when we add new bodies to the scene
			# each time we create a new buggy, we increment this var
			# that way, we can have as many bodies as we want,
			# and they all will have different keys

	# this is the class constructor (the function called each time we create a new buggy)
	def __init__(self, scene, pos):
		# first, we add some instance variables, that we can modify after the buggy is created
		self.buggy_mat = soy.materials.Colored('red') # material of the buggy
		self.tire_mat = soy.materials.Colored('grey') # material of the tires
		self.position = pos                           # position of the buggy
		
		# this is used as material for the joints
		# when we create a new Fixed joint, a material will be used to draw a straight line
		# between the connected bodies. It us usually used for debugging purposes.
		# We don't want that, so we will pass a transparent material.
		# You can try and set it to a non-transparent material, so you can see the result.
		transparent_mat = soy.materials.Colored('black')
		transparent_mat.diffuse.alpha = 0 # e.g. make the material transparent

		# each buggy we will make will have 4 tires and
		# 2 boxes - a bigger one and a small one on top of it

		# this is the bigger box of the buggy
		buggy_box = soy.bodies.Box()
		buggy_box.size = soy.atoms.Size((1, 0.5, 2))
		buggy_box.position = soy.atoms.Position((0 + pos.x, 0.25 + pos.y, 0 + pos.z))
		buggy_box.material = self.buggy_mat # we set its material to the already created one

		# this is the small box on top of the one we created above
		buggy_box2 = soy.bodies.Box()
		buggy_box2.size = soy.atoms.Size((0.8,0.4,0.8))
		buggy_box2.position = soy.atoms.Position((0 + pos.x, 0.7 + pos.y, 0.4 + pos.z))
		buggy_box2.material = self.buggy_mat
		
		# we set instance variables to the boxes we created
		# NOTE that this isn't necessary,
		# but it is useful if you want to modify them after you created an instance
		self._buggy_box = buggy_box
		self._buggy_box2 = buggy_box2

		# we create the 4 tires by calling a method of the class, so we won't reuse code
		self._tire1 = self.createTire(soy.atoms.Position((0.7 + pos.x, 0.2 + pos.y, 0.6 + pos.z)))
		self._tire2 = self.createTire(soy.atoms.Position((0.7 + pos.x, 0.2 + pos.y, -0.6 + pos.z)))
		self._tire3 = self.createTire(soy.atoms.Position((-0.7 + pos.x, 0.2 + pos.y, 0.6 + pos.z)))
		self._tire4 = self.createTire(soy.atoms.Position((-0.7 + pos.x, 0.2 + pos.y, -0.6 + pos.z)))
		
		# add all parts of the buggy that we created to the scene, so we can see the buggy
		# note how we append the suffix id to the key, so we can have as many buggy parts in the scene
		# and all of them will be with different names
		scene['buggy_box_'   + str(Buggy.id)] = buggy_box
		scene['buggy_box2_'  + str(Buggy.id)] = buggy_box2
		scene['buggy_tire1_' + str(Buggy.id)] = self._tire1
		scene['buggy_tire2_' + str(Buggy.id)] = self._tire2
		scene['buggy_tire3_' + str(Buggy.id)] = self._tire3
		scene['buggy_tire4_' + str(Buggy.id)] = self._tire4

		# join all parts of the buggy that we created, so they stick together
		soy.joints.Fixed(buggy_box, buggy_box2, transparent_mat)
		soy.joints.Fixed(buggy_box, self._tire1, transparent_mat)
		soy.joints.Fixed(buggy_box, self._tire2, transparent_mat)
		soy.joints.Fixed(buggy_box, self._tire3, transparent_mat)
		soy.joints.Fixed(buggy_box, self._tire4, transparent_mat)

		Buggy.id += 1 # increment the suffix id, so next time it is another one

	# this method creates a tire at the given pos and returns it
	def createTire(self, pos):
		wheel = soy.bodies.Sphere()    # a sphere representing the tire
		wheel.radius = 0.2             # radius of the sphere
		wheel.position = pos           # position of the tire (we pass the one we get as parameter)
		wheel.material = self.tire_mat # we set the material to the class member,
									   # so it can be changed outside of the class

		return wheel # returns the tire we have just created

Buggy(scene, soy.atoms.Position((0,0,0)))  # create a buggy at this position
Buggy(scene, soy.atoms.Position((0,3,0)))  # and another one at this position
Buggy(scene, soy.atoms.Position((2,0,2)))  # and so on
Buggy(scene, soy.atoms.Position((2,3,2)))
Buggy(scene, soy.atoms.Position((-2,0,-2)))

# now what if you want to modify a buggy after you have created it
# first, you will have to keep a reference to the buggy
buggy = Buggy(scene, soy.atoms.Position((-2,3,-2)))

# let's say you want to make the buggy transparent
# you can do this by setting the alpha value of the diffuse color of a Colored material
buggy.buggy_mat.diffuse.alpha = 128
buggy.tire_mat.diffuse.alpha = 128

# we create a client and append a Projector, which will project what the camera sees on the screen
client = soy.Client()
client.window.append(soy.widgets.Projector(scene['cam']))

# this will prevent our script from closing right after we start it
if __name__ == '__main__' :
	while client.window:
		sleep(.1)
