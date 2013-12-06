import soy
from time import sleep
class Pyramid (soy.models.Mesh) :
  def __init__(self, tex=None) :
    mat0 = soy.materials.Material(ambient=soy.colors.cyan,
                                  diffuse=soy.colors.cyan)
    mat1 = soy.materials.Material(ambient=soy.colors.yellowGreen,
                                  diffuse=soy.colors.goldenRod)
    mat2 = soy.materials.Textured(colormap=tex)

    a = soy.atoms.Vertex(self,position=( 0, 1, 0), texcoord=(0,0,0))
    b = soy.atoms.Vertex(self,position=(-1,-1, 1), texcoord=(0,0,0))
    c = soy.atoms.Vertex(self,position=( 1,-1, 1), texcoord=(0,1,0))
    d = soy.atoms.Vertex(self,position=( 1,-1,-1), texcoord=(1,1,0))
    e = soy.atoms.Vertex(self,position=(-1,-1,-1), texcoord=(1,0,0))

    soy.atoms.Face(self, verts=(a,b,c), material=mat0)
    soy.atoms.Face(self, verts=(a,d,e), material=mat0)
    soy.atoms.Face(self, verts=(a,c,d), material=mat1)
    soy.atoms.Face(self, verts=(a,e,b), material=mat1)
    soy.atoms.Face(self, verts=(d,c,b), material=mat2)
    soy.atoms.Face(self, verts=(e,d,b), material=mat2)

if __name__ == "__main__" :
    sce = soy.scenes.Scene()
    lava = soy.transports.File('media/lava.soy')['gimp']
    a = Pyramid(lava)
    scr = soy.Screen()
    win = soy.Window(scr, 'Pyramid')
    cam = soy.bodies.Camera(sce)
    body = soy.bodies.Body(sce, model=a)
    #myjoint = soy.joints.Fixed(sce,body,body1)
    body.rotation=(1,1,1)
    cam.position = (0.0, 0.0, 6.0)
    lig = soy.bodies.Light(sce)
    lig.position = (-10.0,10.0,2.0)
    #ca1 = soy.widgets.Canvas(win, aspect=2.0, texture=lava)
    pro = soy.widgets.Projector(win, camera=cam)
    
    while 1 :
      sleep(60)
