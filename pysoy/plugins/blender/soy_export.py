#!BPY

"""
Name: 'PySoy (.soy)...'
Blender: 241
Group: 'Export'
Tooltip: "Export to PySoy (.soy)"
"""
import Blender
from Blender import NMesh, Material
from struct import pack
import sys, os, os.path

__author__ = "Arc Riley & Palle Raabjerg"
__url__ = ("http://www.pysoy.org/wiki/Blender")
__date__ = 'Last change on '+ \
           '$Date: 2008-03-20 05:06:53 -0400 (Thu, 20 Mar 2008) $'[7:-20]+ \
           'by '+'$Author: ArcRiley $'[9:-2]
__version__ = 'Trunk (r'+'$Rev: 1191 $'[6:-2]+')'
__credits__ = '''Copyright (C) 2006,2007 Arc Riley & Palle Raabjerg

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses
'''
__bpydoc__ = """\
This script exports PySoy (.soy) files from Blender.  It supports [...]
"""


# -------------------------------------------------------------------------- #
# These classes only concern the .soy format, ie, universal to any modeler.  #
# The data passed to them should be pre-optimised by modeler-specific code.  #
# -------------------------------------------------------------------------- #

class WriteData :
  """All Write classes should inherit from WriteData.
  WriteData takes care of accumulating and writing the data
  with the right header information.
  Contains a bundle of *Field functions for helping to accumulate
  number_of blocks, for instance."""
  def accumulate(self, vars) :
    """Accumulates a block of data and creates its appropriate header.
    Input should be a tuple, containing a string with the type of data,
    according to self.Blocks, and the data which needs to be packed."""
    data = ''
    fields = self.Blocks[vars[0]]
    blockid = fields[0]
    for index in range(1, len(vars)) :
      data += fields[index](vars[index])
    #self.file.write('soy%s%s%s' % (blockid, pack('I',len(data)), data))
    self.accumulated += '%s%s%s%s' % (pack('H', self.objecttype), pack('H', blockid), pack('I', len(data)), data)

  #Write accumulated data to file. Gosh, that's long. I might cut this down later for readability.
  def write(self) :
    """Writes the complete object with the correct header, after it has been accumulated."""
    paddedname = (self.name+('\x00'*20))[:20]
    self.file.write('soy\x00%s%s%s%s%s%s' % (pack('H', self.objecttype), chr(self.version[0]), chr(self.version[1]), paddedname, pack('I', len(self.accumulated)), self.accumulated))

  def StringField(self, string) :
    return '%s%s' % (chr(len(string)), string)

  def Float2Field(self, tuplefloats) :
    payload = ''
    for tfloat in tuplefloats:
      payload += pack('ff', tfloat[0], tfloat[1])
    return '%s%s' % (pack('I',len(tuplefloats)), payload)

  def Float3Field(self, tuplefloats) :
    payload = ''
    for tfloat in tuplefloats:
      payload += pack('fff', tfloat[0], tfloat[1], tfloat[2])
    return '%s%s' % (pack('I',len(tuplefloats)), payload)

  def Uint1Field(self, ints) :
    payload = ''
    for integer in ints:
      payload += pack('I', integer)
    return '%s%s' % (pack('I',len(ints)), payload)

  def Uint2Field(self, tupleints) :
    payload = ''
    for tint in tupleints:
      payload += pack('II', tint[0], tint[1])
    return '%s%s' % (pack('I',len(tupleints)), payload)

  def Uint3Field(self, tupleints) :
    payload = ''
    for tint in tupleints:
      payload += pack('III', tint[0], tint[1], tint[2])
    return '%s%s' % (pack('I',len(tupleints)), payload)

  def UintsField(self, tupleints) :
    payload = ''
    for tint in tupleints:
      for integer in tint:
        payload += pack('I', integer)
    return '%s%s' % (pack('I', len(tupleints)), payload)

  def Matrix44Field(self, matrixlist):
    payload = ''
    for number in matrixlist:
      payload += pack('f', number)
    return payload

  def Name20Fields(self, names):
    payload = ''
    for name in names:
      payload += (name+('\x00'*20))[:20]
    return '%s%s' % (pack('I', len(names)), payload)

  def Name20Field(self, name):
    payload = (name+('\x00'*20))[:20]
    return payload

  def FloatProps(self, proplist):
    payload = ''
    for prop in proplist:
      name = (prop[0]+('\x00'*32))[:32]
      value = prop[1]
      payload += name + pack('f', value)
    return '%s%s' % (pack('I', len(proplist)), payload)

  def IntProps(self, proplist):
    payload = ''
    for prop in proplist:
      name = (prop[0]+('\x00'*32))[:32]
      value = prop[1]
      payload += name + pack('I', value)
    return '%s%s' % (pack('I', len(proplist)), payload)


class WriteMeta(WriteData) :
  def __init__(self, meta) :
    self.Blocks = {
      'Meta' : (0, self.StringField),
    }

    self.write(('Meta', meta))

class WriteMaterial(WriteData):
  def __init__(self, file, name) :
    self.Blocks = {
      'Attributes': (   0, self.Float3Field),
      'Texture'   : (   1, self.Name20Field),
    }
    self.name = name
    self.objecttype = 0x0002
    self.version = (0, 0)
    self.file = file
    self.accumulated = ''

class WriteMesh(WriteData) :
  def __init__(self, file, name) :
    self.Blocks = {
      'Positions' : (   0, self.Float3Field),
      'Normals'   : (   1, self.Float3Field),
      'TexCoords' : (   2, self.Float2Field),
      'Vertices'  : (  32, self.Uint2Field),
      'Materials' : (  64, self.Name20Fields),
      'Faces'     : (  96, self.UintsField),
    }
    self.name = name
    self.objecttype = 0x0001
    self.version = (0, 0)
    self.file = file
    self.accumulated = ''

class WriteEntity(WriteData) :
  def __init__(self, file, name) :
    self.Blocks = {
      'Mesh'       : (   1, self.Name20Field),
      'Matrix'     : (   2, self.Matrix44Field),
      'FloatProps' : ( 256, self.FloatProps),
      'IntProps'   : ( 257, self.IntProps),
      'BoolProps'  : ( 258, self.IntProps),
      'TimeProps'  : ( 259, self.FloatProps),
    }
    self.name = name
    self.objecttype = 0x0003
    self.version = (0, 0)
    self.file = file
    self.accumulated = ''

class WriteNode(WriteData) :
  def __init__(self, file, name) :
    self.Blocks = {
      'Entities'   : (   1, self.Name20Fields),
      'Nodes'      : (   2, self.Name20Fields),
      'Matrix'     : (   3, self.Matrix44Field),
      'FloatProps' : ( 256, self.FloatProps),
      'IntProps'   : ( 257, self.IntProps),
      'BoolProps'  : ( 258, self.IntProps),
      'TimeProps'  : ( 259, self.FloatProps),
    }
    self.name = name
    self.objecttype = 0x0004
    self.version = (0, 0)
    self.file = file
    self.accumulated = ''

  # .write should be used directly, these just show how to use them:

  def WritePositions(self, positions) :
    self.write(('Positions', positions))

  def WriteNormals(self, normals) :
    self.write(('Normals', normals))

  def WriteUVCoords(self, coords) :
    self.write(('TexCoords', coords))

def WriteEOD(soyfile) :
  soyfile.write('soy%s%s' % (chr(255), pack('I', 0)))



# -------------------------------------------------------------------------- #
# These are Blender-specific classes for obtaining and optimizing data lists #
# appropriate for the .soy write classes above.  They are seperate for clean #
# abstraction between the "modeler" and "formatting" steps of the exporter.  #
# -------------------------------------------------------------------------- #

class GrabData :
  def Consolidate(self, pool) :
    # Some generic data consolidation routine, optimized for any data type
    pass

class ConjureNode(GrabData):
  """This must be initiated with an already created Entity object.
  Entities are created from Blender Objects, and receive childs and
  parents like their Blender counterparts. PySoy does not have a
  parent/child abstraction for Entities, though. So every time an
  Entity is discovered to have children, this Entity must provoke the
  creation of a Node with the Entity itself placed at 0, 0 in the Node
  (applied with a unit matrix), and all the other children placed with
  their localspace matrices."""
  def __init__(self, sourceparent):
    self.sourceparent = sourceparent
    self.name = self.sourceparent.name
    self.entitychildren = {self.name: self.sourceparent}
    self.nodechildren = []
    self.parent = self.sourceparent.parent
    self.sourceparent.parent = self

    for name, child in self.sourceparent.entitychildren.iteritems():
      child.parent = self
      self.entitychildren[name] = child

    self.nodechildren = self.sourceparent.nodechildren
    self.sourceparent.nodechildren = None
    self.sourceparent.entitychildren = None
    self.GrabProperties()

  def __call__(self, nodefile):
    self.write = WriteNode(nodefile, self.name)

    self.GrabMatrix()
    #Since ConjureNode receives its matrix from the original parent entity,
    #this entity's matrix should be 'nullified'
    self.sourceparent.setUnitMatrix()
    #print "Children: " + self.entitychildren
    self.entitynames = list(self.entitychildren)
    self.nodenames = []
    for node in self.nodechildren:
      self.nodenames.append(node.name)
    self.write.accumulate(('Entities', self.entitynames))
    self.write.accumulate(('Nodes', self.nodenames))
    self.write.accumulate(('Matrix', self.matrix))
    if len(self.floatprops) > 0:
      self.write.accumulate(('FloatProps', self.floatprops))
    if len(self.intprops) > 0:
      self.write.accumulate(('IntProps', self.intprops))
    if len(self.boolprops) > 0:
      self.write.accumulate(('BoolProps', self.boolprops))
    if len(self.timeprops) > 0:
      self.write.accumulate(('TimeProps', self.timeprops))
    self.write.write()

  def hasParent(self):
    if self.parent == None:
      return False
    else :
      return self.parent

  def setParent(self, parent):
    self.parent = parent

  def GrabMatrix(self):
    self.matrix = self.sourceparent.matrix

  def GrabProperties(self):
    self.intprops = self.sourceparent.intprops
    self.sourceparent.intprops = []
    self.floatprops = self.sourceparent.floatprops
    self.sourceparent.floatprops = []
    self.boolprops = self.sourceparent.boolprops
    self.sourceparent.boolprops = []
    self.timeprops = self.sourceparent.timeprops
    self.sourceparent.timeprops = []

  def appendEntity(self, childname, child):
    self.entitychildren[childname] = child
  def appendNode(self, name):
    self.nodechildren.append(name)

class LevelNode(ConjureNode):
  def __init__(self, levelname):
    self.name = levelname
    self.entitychildren = {}
    self.nodechildren = []

    self.matrix = (1.0, 0.0, 0.0, 0.0,
                   0.0, 1.0, 0.0, 0.0,
                   0.0, 0.0, 1.0, 0.0,
                   0.0, 0.0, 0.0, 1.0)

  def __call__(self, nodefile):
    self.write = WriteNode(nodefile, self.name)

    self.entitynames = list(self.entitychildren)
    self.nodenames = []
    for node in self.nodechildren:
      self.nodenames.append(node.name)
    #print self.entitynames
    #print self.nodenames
    self.write.accumulate(('Entities', self.entitynames))
    self.write.accumulate(('Nodes', self.nodenames))
    self.write.accumulate(('Matrix', self.matrix))
    self.write.write()

class GrabObject(GrabData):
  """Class for creating Entities from Blender Objects."""
  def __init__(self, obj):
    self.obj = obj
    self.name = obj.name
    self.entitychildren = {}
    self.nodechildren = []
    self.parent = None
    self.intprops = []
    self.floatprops = []
    self.boolprops = []
    self.timeprops = []
    self.GrabProperties()

  def __call__(self, entfile):
    self.write = WriteEntity(entfile, self.name)

    self.write.accumulate(('Mesh', self.meshname))
    self.write.accumulate(('Matrix', self.matrix))
    if len(self.floatprops) > 0:
      self.write.accumulate(('FloatProps', self.floatprops))
    if len(self.intprops) > 0:
      self.write.accumulate(('IntProps', self.intprops))
    if len(self.boolprops) > 0:
      self.write.accumulate(('BoolProps', self.boolprops))
    if len(self.timeprops) > 0:
      self.write.accumulate(('TimeProps', self.timeprops))
    self.write.write()

  def hasParent(self):
    if self.obj.parent == None:
      return False
    else :
      return self.obj.parent

  def setParent(self, parent):
    self.parent = parent

  def GrabMatrix(self):
    print self.name
    print self.hasParent()

    objmat = self.obj.getMatrix('worldspace')
    parent = self.hasParent()
    if parent == False:
      self.matrix = (objmat[0][0], objmat[0][1], objmat[0][2], objmat[0][3],
                     objmat[1][0], objmat[1][1], objmat[1][2], objmat[1][3],
                     objmat[2][0], objmat[2][1], objmat[2][2], objmat[2][3],
                     objmat[3][0], objmat[3][1], objmat[3][2], objmat[3][3])
    else :
      parentmat = parent.getMatrix('worldspace')
      localmat = objmat - parentmat
      self.matrix = (localmat[0][0], localmat[0][1], localmat[0][2], localmat[0][3],
                     localmat[1][0], localmat[1][1], localmat[1][2], localmat[1][3],
                     localmat[2][0], localmat[2][1], localmat[2][2], localmat[2][3],
                     localmat[3][0], localmat[3][1], localmat[3][2], localmat[3][3])

  def GrabProperties(self):
    """Get all the properties of the Blender Object."""
    objproperties = self.obj.getAllProperties()
    for prop in objproperties:
      if prop.getType() == 'INT':
        self.intprops.append((prop.getName(), prop.getData()))
      elif prop.getType() == 'FLOAT':
        self.floatprops.append((prop.getName(), prop.getData()))
      elif prop.getType() == 'BOOL':
        boolproperty = 0
        if prop.getData() == True:
          boolproperty = 0
        elif prop.getData() == False:
          boolproperty = 1
        self.boolprops.append((prop.getName(), boolproperty))
      elif prop.getType() == 'TIME':
        self.timeprops.append((prop.getName(), float(prop.getData())))
      else :
        print 'Invalid property type \"%s\". Discarding.' % (prop.getType())

  #def assignMesh(self, mesh):
  #  self.mesh = mesh
  #  self.meshname = mesh.name

  def setUnitMatrix(self):
    """Sets this Entitys Matrix to the Unit Matrix.
    Useful for Node creation."""
    self.matrix = (1.0, 0.0, 0.0, 0.0,
                   0.0, 1.0, 0.0, 0.0,
                   0.0, 0.0, 1.0, 0.0,
                   0.0, 0.0, 0.0, 1.0)

  def assignMeshName(self, name):
    self.meshname = name

  def appendEntity(self, childname, child):
    self.entitychildren[childname] = child

class GrabGroup(GrabData):
  """Responsible for converting all objects of a group to a PySoy Mesh."""
  def __init__(self, group):
    self.group = group
    self.name = group.name

  def __call__(self, meshfile):
    self.Meshify(meshfile)

  def Meshify(self, meshfile):
    #Someone give cubicool a cookie. .join() works nicely.
    objectlist = []

    #Create a new Mesh Object to contain the joined mesh.
    #baseobject = Blender.Object.New('Mesh')
    #Workaround. The above makes Blender segfault on the join.
    #I was told by Ton that this is because New('Mesh') does not actually
    #create a new Mesh Object as it should, but an Empty Object.
    #Apparantly, this is because Blender has some pretty major
    #design-flaws in its Python API. It's something they would try
    #to work out sometime after the 2.42 release. Hopefully, I wont
    #Crash into any other little 'oddities' caused by this.
    basenmesh = Blender.NMesh.New(self.group.name)
    baseobject = Blender.NMesh.PutRaw(basenmesh)

    for obj in self.group.objects:
      if obj.getType() == 'Mesh':
        objectlist.append(obj)

    baseobject.join(objectlist)

    nmesh = baseobject.getData()
    nmesh.name = self.name

    ourmesh = GrabMesh(nmesh)

    ourmesh(meshfile)

class GrabMaterial(GrabData):
  def __init__(self, mat):
    self.blendmaterial = mat
    self.blendtextures = self.blendmaterial.getTextures()
    self.textures = []
    #Get all material-specific attributes
    #These may need some sort of conversion
    self.diffuse_color = self.blendmaterial.rgbCol
    self.specular_color = self.blendmaterial.specCol
    self.specularity = self.blendmaterial.spec

  def __call__(self, soyfile):
    self.GrabTextures()

  def GrabTextures(self):
    for mtex in self.blendtextures:
      if (mtex != None):
        if (mtex.tex.getType() == 'Image') and (mtex.tex.getImage() != None):
          blendtexture = mtex.tex
          mapto_attributes = {}
          for mapping in Blender.Texture.MapTo.items():
            if (mtex.mapto & mapping[1]) != 0:
              mapto_attributes[mapping[0]] = self.Texture(mapping[0])
          for attype, texture in mapto_attributes.iteritems():
            #Get any texture-specific attributes here, and put them into the texture object.
            texture.setImage(blendtexture.getImage())

          #print Blender.Texture.MapTo.items()
          #print mtex.mapto

        elif (mtex.tex.getType() != 'Image'):
          print 'Sorry. Texture \"%s\" of type %s discarded. This exporter only supports textures of type \'Image\'' % (mtex.tex.name, mtex.tex.getType())
        elif (mtex.tex.getImage() == None):
          print 'Sorry. Texture \"%s\" discarded. Please define an image.' % (mtex.tex.name)

  class Texture:
    def __init__(self, textype):
      self.type = textype
    def setImage(self, image):
      self.origimage = image
      self.imagepath = self.origimage.getFilename()

class GrabMesh(GrabData) :
  """Responsible for converting a Blender Mesh to a .soy Mesh.
  Has it's own inner class structure of Vertices, Faces and Materials."""
  def __init__(self, nmesh, parentobject=None) :
    self.nmesh = nmesh
    self.nmeshmaterials = nmesh.getMaterials(1)
    self.parentobject = parentobject
    self.positions = []
    self.normals = []
    self.uvcoords = []
    self.vertices = []
    self.faces = []
    self.materials = []

    self.quads = 0

    self.GrabMaterials()

  def __call__(self, soyfile) :
    self.write = WriteMesh(soyfile, self.nmesh.name)

    self.GrabVerts()
    self.GrabFaces()

    posprint = []
    normprint = []
    uvprint = []
    vertprint = []
    faceprint = []
    for position in self.positions:
      posprint.append(position.coord)
    for normal in self.normals:
      normprint.append(normal.norm)
    for uv in self.uvcoords:
      uvprint.append(uv.uv)
    for vertex in self.vertices:
      vertprint.append((vertex.position.index, vertex.normal.index))
    for face in self.faces:
      optlist = [face.vertices[0].index, face.vertices[1].index, face.vertices[2].index, face.attmap]
      optlist.extend(face.options)
      faceprint.append(optlist)

    if len(posprint) > 0:
      self.write.accumulate(('Positions', posprint))
    if len(normprint) > 0:
      self.write.accumulate(('Normals', normprint))
    if len(uvprint) > 0:
      self.write.accumulate(('TexCoords', uvprint))
    if len(vertprint) > 0:
      self.write.accumulate(('Vertices', vertprint))
    if len(self.materials) > 0:
      self.write.accumulate(('Materials', self.materials))
    if len(faceprint) > 0:
      self.write.accumulate(('Faces', faceprint))

    self.write.write()


    return True

  def AddLeaf(self, data, dtype, intolist, checkdict, counter):
    """Basically, given some hash-capable data (usable as key for a dict),
    a datatype class with two arguments in its __init__, for data and index,
    a list, a dict and a counter,
    this will create a new object from the data and the
    datatype class if needed, and insert it into the list,
    or return an old object from the dict if it already exists in the dict.
    This may seem a bit crude for a function.
    But this procedure is needed several times in GrabMesh. So at least we can
    avoid duplicating this stump over and over again."""
    if checkdict.has_key(data) :
      dataobject = checkdict[data]
    else :
      dataobject = dtype(data, counter)
      checkdict[data] = dataobject
      intolist.append(dataobject)
      counter += 1
    return dataobject, counter

  def GrabMaterials(self):
    for material in self.nmeshmaterials:
      if material == None:
        self.materials.append('\x00')
      else :
        self.materials.append(material.name)

  def GrabVerts(self) :
    # This function is to parse all the verticies into data structs
    poscount = 0
    normcount = 0
    vertexcount = 0
    poscheck = {}
    normcheck = {}
    for vertex in self.nmesh.verts:
      coord = vertex.co[0], vertex.co[1], vertex.co[2]
      position, poscount = self.AddLeaf(coord, self.Position, self.positions, poscheck, poscount)

      norm = vertex.no[0], vertex.no[1], vertex.no[2]
      normal, normcount = self.AddLeaf(norm, self.Normal, self.normals, normcheck, normcount)

      soyvert = self.Vertex(position, normal, vertexcount)
      self.vertices.append(soyvert)

      vertexcount += 1

    #Examples:
    #Get index of position from a vertex:
    #print self.vertices[3].position.index
    #Get a normal:
    #print self.vertices[2].normal.norm

  def GrabFaces(self) :
    facecount = 0
    uvcount = 0
    uvcheck = {}
    #print self.nmesh.name
    for face in self.nmesh.faces:
      #Find the correct vertices from self.vertices
      faceverts = []
      for vertex in face.v:
        facevertex = self.vertices[vertex.index]
        faceverts.append(facevertex)

      #print face.col
      #Fetch vertex colours, if they exist
      #if (face.col != None):
      #  for i in range(len(face.col)):
      #  .addColour()


      soyface = self.Face((faceverts[0], faceverts[1], faceverts[2]), facecount)

      if len(self.nmeshmaterials) > 0:
        soyface.setMaterial(face.materialIndex)

      soyface.setAttributeMap()

      self.faces.append(soyface)
      facecount += 1

      #If face contains UV coordinates, check if coordinate exist already in this mesh.
      #If it does, use the one already in existance
      #If it doesn't create a new, and append it to both the dict-checker,
      #the uvlist for the mesh, and the temporary faceuv list for this face.
      faceuvs = []
      if len(face.uv) > 0:
        for uvco in face.uv:
          uvcoord, uvcount = self.AddLeaf(uvco, self.UVCoord, self.uvcoords, uvcheck, uvcount)

          faceuvs.append(uvcoord)

        soyface.setUVs((faceuvs[0], faceuvs[1], faceuvs[2]))

      #What to do if we encountered a quad
      if len(face.v) == 4:
        self.quads += 1
        #The list of vertices in a face are ordered with
        #edges between 0 and 1, 1 and 2, etc.
        #We just choose to always split the face between 0 and 2

        #Create new tri-face from vertices and UVcoords 0, 2 and 3
        triface = self.Face((faceverts[0], faceverts[2], faceverts[3]), facecount)
        if len(face.uv) > 0:
          triface.setUVs((faceuvs[0], faceuvs[2], faceuvs[3]))
        if len(self.nmeshmaterials) > 0:
          triface.setMaterial(face.materialIndex)

        triface.setAttributeMap()

        self.faces.append(triface)
        facecount += 1


    #Example:
    #Print coordinates of vertex 2 in face 7
    #print self.faces[7].vertices[2].position.coord
    #Strictly speaking though, we don't need to go this far down in the tree for exporting a face.
    #We just need to be able to fetch the indices of its vertices.

  class Position:
    def __init__(self, coord, index):
      self.index = index
      self.coord = coord

  class Normal:
    def __init__(self, norm, index):
      self.index = index
      self.norm = norm

  class UVCoord:
    def __init__(self, uv, index):
      self.index = index
      self.uv = uv

  class Vertex:
    def __init__(self, position, normal, index):
      self.index = index
      self.position = position
      self.normal = normal
      self.colours = []
      self.optionsmap = [None]*32
      self.options = []
    def addColour(self, colour):
      self.colours.append((colour[0]/255.0, colour[1]/255.0, colour[2]/255.0))
    def mergeColours(self):
      r, g, b = 0.0, 0.0, 0.0
      num_colours = len(self.colours)
      if num_colours > 0:
        for i in range(num_colours):
          r += self.colours[0]
          g += self.colours[1]
          b += self.colours[2]
        self.optionsmap[0] = r / num_colours
        self.optionsmap[1] = g / num_colours
        self.optionsmap[2] = b / num_colours
    def setAttributeMap(self):
      self.mergeColours()
      self.attmap = map2int(self.optionsmap)
      for att in self.optionsmap:
        if att != None:
          self.options.append(att)

  class Face:
    def __init__(self, vertices, index) :
      self.index = index
      self.vertices = vertices
      self.optionsmap = [None]*32
      self.options = []
      #self.material = material
    #def appendVert(self, vertex):
    #  self.vertices.append(vertex)
    def setMaterial(self, matindex):
      self.optionsmap[0] = matindex
    def setUVs(self, uvcoords):
      self.optionsmap[1] = uvcoords[0].index
      self.optionsmap[2] = uvcoords[1].index
      self.optionsmap[3] = uvcoords[2].index
    def setAttributeMap(self):
      self.attmap = map2int(self.optionsmap)
      for att in self.optionsmap:
        if att != None:
          self.options.append(att)

  #class Material:


# -------------------------------------------------------------------------- #
# Here's __main__; all that's left to do is loop through each object and run #
# the Grab class associated with it, prehaps with a GUI progress bar/etc.    #
# Each Grab class should export a 0.0-1.0 float representing it's % finished #
# which will come in handy when whole levels are being exported at once.     #
# -------------------------------------------------------------------------- #

from Blender import BGL, Draw, Window

class DialogGrid:
  """Sets up another coordinate system for the interface, over
  the standard one, with lower granularity, a set height,
  and (0, 0) in the top left corner.
  This makes interface creation and modification a bit easier."""
  def setup(self):
    """Call this in the __init__ of each inheriting class."""
    self.numrows = 22
    self.rowheight = 20
    self.columnwidth = 10

  def line(self, linerow):
    return (self.numrows - linerow) * self.rowheight

  def column(self, columnnr):
    return columnnr * self.columnwidth

  def width(self, numcolumns):
    return self.column(numcolumns)

  def height(self, numlines):
    return numlines * self.rowheight

class ExportDialog(DialogGrid):
  """Class for drawing the interface dialog. it contains the
  functions that should be passed on to Blender.Draw.Register().
  Namely DrawDialog, ButtonEvent and KeyEvent."""
  def __init__(self, blendfile):
    self.setup()
    # (Maybe not easier than previous approach, but I think this may be cleaner, at least.
    # And we get the path without the filename, too. Which may be useful.)
    pathlist = blendfile.split('/')
    origfilename = pathlist.pop()
    self.path = '/'.join(pathlist)
    self.newfilename = origfilename.split('.')
    self.newfilename.pop()
    self.newfilename.append('soy')
    self.newfilename = '.'.join(self.newfilename)

    self.filename = self.path + '/' + self.newfilename

    #Blender.Window.DrawProgressBar(0.0, 'Opening %s' % filename)


    #Using these values and the self.line() and self.column() functions
    #instead of just coordinates will make it easier to expand and change the dialog
    self.EVENT_ACTIVE_SCENE = 0
    self.EVENT_ALL_SCENES = 1
    self.EVENT_ROOTPATH = 2
    self.EVENT_SETPATH = 3
    self.EVENT_HEIGHTMAP = 4
    self.EVENT_EXPORTLEVEL = 5
    self.EVENT_MODELPATH = 6
    self.EVENT_EXPORTMODEL = 7
    self.EVENT_SETMODEL = 8
    self.EVENT_HEIGHTMULT = 9
    self.EVENT_HEIGHTSCALE = 10

    self.next_event_nr = 11

    self.meshdialog = self.DataGroup('mesh', self.next_event_nr)
    self.next_event_nr += 4
    self.entitydialog = self.DataGroup('entity', self.next_event_nr)
    self.next_event_nr += 4
    self.nodedialog = self.DataGroup('node', self.next_event_nr)
    self.next_event_nr += 4
    self.materialdialog = self.DataGroup('material', self.next_event_nr)
    self.next_event_nr += 4

    self.activesceneBT = True
    self.allscenesBT = False
    self.rootpathSTR = self.path
    self.commonSTR = 'common'
    self.levelSTR = 'levels'
    self.heightmultFLT = 1.0
    self.heightscaleFLT = 1.0

    self.modelpathSTR = self.path

  def setrootpath(self, path):
    self.rootpathSTR = path

  def setmodelfile(self, modelfile):
    self.modelpathSTR = modelfile


  class DataGroup(DialogGrid):
    """Inner class which defines the standard way of Drawing
    the granularity boxes for an object type in the .soy format."""
    def __init__(self, typename, eventnumber):
      self.setup()

      self.typename = typename
      self.EVENT_SEP = eventnumber
      self.EVENT_GROUP = eventnumber + 1
      self.EVENT_SPLIT = eventnumber + 2
      self.EVENT_SUFFIX = eventnumber + 3
      self.sepBT = True
      self.groupSTR = self.typename
      self.splitBT = False
      self.suffixSTR = '.soy'

    def DrawGroup(self, x, y):
      self.separate = Draw.Toggle('',
                                  self.EVENT_SEP,
                                  self.column(x), self.line(y),
                                  self.width(2), self.height(1),
                                  self.sepBT, 'Separate ' + self.typename + ' group from level-file')

      self.group = Draw.String(self.typename.capitalize() + ' group name: ',
                               self.EVENT_GROUP,
                               self.column(x + 2), self.line(y),
                               self.width(30), self.height(1),
                               self.groupSTR, 399, 'Name of directory or file for this ' + self.typename + ' group')

      self.split = Draw.Toggle('',
                               self.EVENT_SPLIT,
                               self.column(x + 2), self.line(y + 1),
                               self.width(2), self.height(1),
                               self.splitBT, 'Split each ' + self.typename + ' into a separate file')

      self.suffix = Draw.String('[' + self.typename + 'name]',
                                self.EVENT_SUFFIX,
                                self.column(x + 4), self.line(y + 1),
                                self.width(30), self.height(1),
                                self.suffixSTR, 399, 'Suffix for each ' + self.typename + ' file')

    def UpdateGroup(self):
      self.sepBT = self.separate.val
      self.groupSTR = self.group.val
      self.splitBT = self.split.val
      self.suffixSTR = self.suffix.val



  def DrawDialog(self):
    """Should be passed as the 'draw' argument to Blender.Draw.Register().
    Defines how the dialog should be drawn on every redraw."""
    BGL.glClear(BGL.GL_COLOR_BUFFER_BIT)
    #BGL.glEnable(BGL.GL_BLEND)
    #BGL.glBlendFunc(
    #  BGL.GL_SRC_ALPHA,
    #  BGL.GL_ONE_MINUS_SRC_ALPHA
    #)
    BGL.glRasterPos2d(self.column(1), self.line(0))
    Draw.Text('PySoy exporter', 'large')

    BGL.glRasterPos2d(self.column(1), self.line(2))
    Draw.Text('Level export options:')

    self.activescene = Draw.Toggle('Only active scene',
                                   self.EVENT_ACTIVE_SCENE,
                                   self.column(1), self.line(4),
                                   self.width(13), self.height(1),
                                   self.activesceneBT, 'Only export the currently active scene as a level')

    self.allscenes = Draw.Toggle('All scenes',
                                 self.EVENT_ALL_SCENES,
                                 self.column(14), self.line(4),
                                 self.width(13), self.height(1),
                                 self.allscenesBT, 'Export all scenes as levels')

    self.rootpath = Draw.String('Root datapath: ',
                                self.EVENT_ROOTPATH,
                                self.column(1), self.line(5),
                                self.width(30), self.height(1),
                                self.rootpathSTR, 399, 'File path for game data')

    self.setroot = Draw.PushButton('Set root path',
                                   self.EVENT_SETPATH,
                                   self.column(31), self.line(5),
                                   self.width(10), self.height(1),
                                   'Set another root path for data')

    self.meshdialog.DrawGroup(1, 6)
    self.entitydialog.DrawGroup(1, 8)
    self.nodedialog.DrawGroup(1, 10)
    self.materialdialog.DrawGroup(1, 12)

    self.heightmultiplier = Draw.Number('heightmultiplier',
                                        self.EVENT_HEIGHTMULT,
                                        self.column(32), self.line(14),
                                        self.width(15), self.height(1),
                                        self.heightmultFLT, 0.0, 10000.0,
                                        'Intended scale of height for the heightmap')

    self.heightscale = Draw.Number('XY-scale',
                             self.EVENT_HEIGHTSCALE,
                             self.column(32), self.line(15),
                             self.width(15), self.height(1),
                             self.heightscaleFLT, 0.0, 10000.0,
                             'Intended scale for the X and Y axis of the heightmap.')

    self.heightmap = Draw.PushButton('Import heightmap',
                                     self.EVENT_HEIGHTMAP,
                                     self.column(17), self.line(15),
                                     self.width(15), self.height(2),
                                     'Import heightmap for reference')

    self.exportlevel = Draw.PushButton('Export as level(s)',
                                       self.EVENT_EXPORTLEVEL,
                                       self.column(1), self.line(15),
                                       self.width(15), self.height(2),
                                       'Export scene(s) as level(s)')

    BGL.glRasterPos2d(self.column(1), self.line(17))
    Draw.Text('Model export options:')

    self.modelpath = Draw.String('Save model as: ',
                                 self.EVENT_MODELPATH,
                                 self.column(1), self.line(19),
                                 self.width(30), self.height(1),
                                 self.modelpathSTR, 399, 'File path for meshified model')

    self.setmodel = Draw.PushButton('Set model path',
                                    self.EVENT_SETMODEL,
                                    self.column(31), self.line(19),
                                    self.width(10), self.height(1),
                                    'Set another path for meshes')

    self.exportmodel = Draw.PushButton('Export as mesh(es)',
                                       self.EVENT_EXPORTMODEL,
                                       self.column(1), self.line(21),
                                       self.width(15), self.height(2),
                                       'Export each Group as a mesh')


  def KeyEvent(self, event, value):
    """Should be passed as the 'event' argument to Blender.Draw.Register().
    Defines any events from the keyboard."""
    if (event == Draw.ESCKEY) or (event == Draw.QKEY):
      Draw.Exit()

  def ButtonEvent(self, event):
    """Should be passed as the 'button' argument to Blender.Draw.Register().
    Defines any events caused by interacting with the interface."""
    if event == self.EVENT_ACTIVE_SCENE:
      self.activesceneBT = self.activescene.val
      self.allscenesBT = not self.activescene.val
      Draw.Redraw()
    elif event == self.EVENT_ALL_SCENES:
      self.allscenesBT = self.allscenes.val
      self.activesceneBT = not self.allscenes.val
      Draw.Redraw()
    elif event == self.EVENT_SETPATH:
      Window.FileSelector(self.setrootpath, 'Set root path for data', '')
    elif event == self.EVENT_SETMODEL:
      Window.FileSelector(self.setmodelfile, 'Set file for meshified model export', '')
    elif event == self.EVENT_HEIGHTMAP:
      Window.FileSelector(self.HeightMapImport, 'Import heightmap', '')
      Draw.Exit()
    elif event == self.EVENT_EXPORTLEVEL:
      self.LevelExporter()
      Draw.Exit()
    elif event == self.EVENT_EXPORTMODEL:
      self.ModelExporter()
      Draw.Exit()

    self.heightmultFLT = self.heightmultiplier.val
    self.heightscaleFLT = self.heightscale.val

    self.rootpathSTR = self.rootpath.val
    self.meshdialog.UpdateGroup()
    self.entitydialog.UpdateGroup()
    self.nodedialog.UpdateGroup()
    self.materialdialog.UpdateGroup()

  def getMapVertex(self, x, y, heightmap):
    return heightmap.size[0]*y+x

  def HeightMapImport(self, mapfile):
    import Image, math
    heightmap = Image.open(mapfile)
    if (heightmap.mode != 'L'):
      print 'Rejected. Image map must be a greyscale image.'
      return False
    #check0 = math.sqrt(heightmap.size[0] - 1)
    #check1 = math.sqrt(heightmap.size[1] - 1)
    #zero0 = check0 - int(check0)
    #zero1 = check1 - int(check1)
    #if ((zero0 == 0.0) and (zero1 == 0.0)):
    nmesh = NMesh.GetRaw()
    mapseq = heightmap.getdata()
    pixelnumber = 0
    for i in range(heightmap.size[1]):
      y = (-((heightmap.size[1] - 1)/2) + i)*self.heightscaleFLT
      for j in range(heightmap.size[0]):
        x = (-((heightmap.size[0] - 1)/2) + j)*self.heightscaleFLT
        z = (mapseq[pixelnumber]/255.0)*self.heightmultFLT
        landvertex = NMesh.Vert(x, y, z)
        nmesh.verts.append(landvertex)
        pixelnumber += 1

    nmesh.update()

    for y in range(heightmap.size[1]-1):
      for x in range(heightmap.size[0]-1):
        vertindex1 = self.getMapVertex(x, y, heightmap)
        vertindex2 = self.getMapVertex(x+1, y, heightmap)
        vertindex3 = self.getMapVertex(x+1, y+1, heightmap)
        vertindex4 = self.getMapVertex(x, y+1, heightmap)
        vert1 = nmesh.verts[vertindex1]
        vert2 = nmesh.verts[vertindex2]
        vert3 = nmesh.verts[vertindex3]
        vert4 = nmesh.verts[vertindex4]
        face = NMesh.Face([vert1, vert2, vert3, vert4])
        nmesh.addFace(face)

    nmesh.update()
    blendobject = Blender.Object.New('Mesh', 'landscape')
    NMesh.PutRaw(nmesh, blendobject.name)

    #else :
    #print 'Rejected. Image map dimensions must be (2^n)+1, where n is an integer'
    #print math.sqrt(heightmap.size[0] - 1)
    #print math.sqrt(heightmap.size[1] - 1)
    #return False
      

  def ModelExporter(self):
    """Called when choosing model export.
    Will export every group in the .blend as
    PySoy meshes."""
    for group in Blender.Group.Get():
      modelrootpath = self.rootpathSTR
      self.ExportGroup(group, modelrootpath)

  def ExportGroup(self, group, modelrootpath):
    meshfilepath = modelrootpath + '/' + group.name + '.soy'
    meshfile = open(meshfilepath, "wb")
    groupgrabber = GrabGroup(group)
    groupgrabber(meshfile)
    meshfile.close()

  def LevelExporter(self):
    """Called when choosing level export.
    Will either export the current scene as a level,
    or _all_ scenes as levels."""
    if self.activesceneBT == True:
      scene = Blender.Scene.GetCurrent()
      levelrootpath = self.rootpathSTR
      self.ExportScene(scene, levelrootpath)
    elif self.allscenesBT == True:
      for scene in Blender.Scene.Get():
        levelrootpath = self.rootpathSTR + '/' + scene.name
        self.ExportScene(scene, levelrootpath)


  def ExportScene(self, scene, levelrootpath):
    meshes = {}
    entities = {}
    parents = {}
    nodes = {}
    materials = {}

    dialoglist = [(self.meshdialog, meshes),
                  (self.entitydialog, entities),
                  (self.nodedialog, nodes),
                  (self.materialdialog, materials)]

    if not os.path.exists(levelrootpath):
      os.mkdir(levelrootpath)

    self.levelfile = open(levelrootpath + '/' + scene.name + '.soy', "wb")

    for obj in scene.getChildren():
      treatObject(obj, meshes, entities, parents)

    for name, mesh in meshes.iteritems():
      for materialname in mesh.materials:
        if (not materials.has_key(materialname)) and (materialname != '\x00'):
          blendmaterial = Blender.Material.Get(materialname)
          material = GrabMaterial(blendmaterial)
          materials[materialname] = material


    bindNodes(parents, entities, nodes)

    for dialog in dialoglist:
      #Include data in level file
      if dialog[0].sepBT == False:
        for name, data in dialog[1].iteritems():
          data(self.levelfile)
      #Separate data from level file
      else :
        #Merge data in same file
        if dialog[0].splitBT == False:
          datapath = levelrootpath
          if not os.path.exists(datapath):
            os.mkdir(datapath)
          datafilename = datapath + '/' + dialog[0].groupSTR + '.soy'
          datafile = open(datafilename, "wb")
          for name, data in dialog[1].iteritems():
            data(datafile)
          datafile.close()
        #Split data into a file per object
        else :
          for name, data in dialog[1].iteritems():
            objectpath = levelrootpath + '/' + dialog[0].groupSTR
            if not os.path.exists(objectpath):
              os.mkdir(objectpath)
            objectfilename = objectpath + '/' + name + dialog[0].suffixSTR
            objectfile = open(objectfilename, "wb")
            data(objectfile)
            objectfile.close()

#    for name, mesh in meshes.iteritems():
#      mesh(self.soyfile)

#    for name, entity in entities.iteritems():
#      entity(self.soyfile)

#    for name, node in nodes.iteritems():
#      node(self.soyfile)

    topnode = LevelNode(scene.name)
    for name, entity in entities.iteritems():
      if entity.parent == None:
        #print entity.name
        topnode.appendEntity(name, entity)

    for name, node in nodes.iteritems():
      if node.parent == None:
        #print node.name
        topnode.appendNode(node)

    topnode(self.levelfile)

    self.levelfile.close()


#def int2str(n): #Nabbed from http://mail.python.org/pipermail/python-list/2005-January/261562.html
#  return ''.join([str(n >> x & 1) for x in (31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)])
#Elaborated a bit for readability:
def int2map(n):
  """Convert an integer to a string of 1s and 0s."""
  binlist = []
  for i in range(32):
    place = 31 - i
    binlist.append(str(n >> place & 1))

  return ''.join(binlist)

#Maps a list of objects to a 32 bit bitmap. None is zero, anything else becomes 1.
def map2int(listmap):
  """Convert a 32 item list to an integer bitmap.
  None fields become zeroes. Anything else becomes ones."""
  integer = 0
  for i in range(32):
    if listmap[i] == None:
      bit = 0
    else :
      bit = pow(2, (31-i))

    #integer = (bit << (31 - i)) | integer
    integer = bit | integer

  return integer

def treatObject(obj, meshdict, entitydict, parentdict):
  #If .DupGroup contains a Group, this is an instance of that Group
  #And in this case, we have already created the mesh above.
  #Create an entity and link
  if obj.DupGroup != None:
    entity = GrabObject(obj)
    entity.GrabMatrix()
    entity.assignMeshName(obj.DupGroup.name)
    entitydict[entity.name] = entity
  #If it's a Mesh object, create the new mesh (if it doesn't exist) and the Entity
  elif obj.getType() == 'Mesh':
    nmesh = obj.getData()
    entity = GrabObject(obj)
    entity.GrabMatrix()
    entity.assignMeshName(nmesh.name)
    entitydict[entity.name] = entity
    if not meshdict.has_key(nmesh.name):
      mesh = GrabMesh(nmesh)
      meshdict[nmesh.name] = mesh

  #Parenting. This is a bit tricky. This is just the first stage of the parenting process,
  #where we create a dict over all objects that are parents, and their children's names.
  if entitydict.has_key(obj.name):
    entity = entitydict[obj.name]
    parent = entity.hasParent()
    if parent != False:
      if not parentdict.has_key(parent.name):
        parentdict[parent.name] = []
      parentdict[parent.name].append(obj.name)
      entity.setParent(obj.name)
      #node = ConjureNode(soyfile, parent)

def bindNodes(parentdict, entitydict, nodedict):
  #Second stage. Link all entities in a parent/child structure corresponding to the parents dict.
  #Creating nodes becomes a lot easier when we know exactly which childs a node should have, _and_ which parent an entity/node has.
  for parentname, entitylist in parentdict.iteritems():
    entity = entitydict[parentname]
    #node = ConjureNode(soyfile, entity)
    for childname in parentdict[parentname]:
      #print childname
      child = entitydict[childname]
      entity.appendEntity(childname, child)
      child.setParent(entity)
    parentdict[parentname] = entity

  #Third stage. Create the nodes.
  for parentname, entitylist in parentdict.iteritems():
    entity = entitydict[parentname]
    node = ConjureNode(entity)
    if node.parent != None:
      node.parent.entitychildren.pop(parentname)
      node.parent.nodechildren.append(node)
    nodedict[parentname] = node


blendfile = Blender.Get('filename')
#Start dialog
dialog = ExportDialog(blendfile)
Draw.Register(dialog.DrawDialog, dialog.KeyEvent, dialog.ButtonEvent)


#for name in NMesh.GetNames():
#  print name
#  nmesh = NMesh.GetRaw(name)
#  Blender.Window.DrawProgressBar(0.5, 'Writing Mesh: %s' % nmesh.name)
#  mesh = GrabMesh(soyfile, nmesh)
#  mesh()

  #print mesh.vertices
  #while True :
  #  if mesh() : break

#WriteEOD(soyfile)

# Clear ProgressBar and Exit
#Blender.Window.DrawProgressBar(1.0, '')
#for sfile in files:
#  sfile.close()
