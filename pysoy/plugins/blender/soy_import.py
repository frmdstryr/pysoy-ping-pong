#!BPY

"""
Name: 'Soya3D (.soy)...'
Blender: 241
Group: 'Import'
Tooltip: 'Import PySoy files (.soy)'
"""
import Blender
from Blender import NMesh
from struct import unpack, calcsize
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
This script imports PySoy (.soy) files to Blender.  It supports [...]
"""

# -------------------------------------------------------------------------- #
# These classes only concern the .soy format, ie, universal to any modeler.  #
# -------------------------------------------------------------------------- #

#This could be used to abstract from unpacking data from a file everywhere.
#Do we want a global function, though?
def FromFile(soyfile, format):
  return unpack(format, soyfile.read(calcsize(format))), calcsize(format)

def int2map(n):
  """Convert an integer to a string of 1s and 0s."""
  binlist = []
  for i in range(32):
    place = 31 - i
    binlist.append(str(n >> place & 1))

  return ''.join(binlist)

class ObjectFinder :
  """Responsible for finding Objects, with the location of soyfile
  as the basis for its search."""
  def __init__(self, soyfile):
    self.mainfile = soyfile
    self.mainreader = ObjectReader(self.mainfile)
    self.mainreader.indexFile()
    pathlist = self.mainfile.name.split('/')
    self.mainfilename = pathlist.pop()
    mainfiledir = pathlist.pop()
    toppath = '/'.join(pathlist)
    os.chdir(toppath)
    self.topsearchpath = os.getcwd()
    os.chdir(mainfiledir)
    self.mainsearchpath = os.getcwd()
    #pathlist.append(self.mainfilename)
    #self.mainfilepath = '/'.join(pathlist)
    #print self.mainpath

    maindirs = {}
    self.maindirslist = []
    self.mainreaders = {}
    #Map all files recursively in the main directory
    for root, dirs, files in os.walk(self.mainsearchpath):
      maindirs[root] = (dirs, files)
      self.maindirslist.append((root, dirs, files))
    self.maindirslist[0][2].remove(self.mainfilename)

    self.topdirslist = []
    self.topreaders = {}

    #Map all files recursively in the parent directory.
    for root, dirs, files in os.walk(self.topsearchpath):
      if not maindirs.has_key(root):
        self.topdirslist.append((root, dirs, files))

  def fetchReader(self, filename, readerdict):
    """Creates a new ObjectReader with the filename file
    as its source. If an ObjectReader with this filename
    is already contained in readerdict, that one is returned
    instead."""
    if not readerdict.has_key(filename):
      soyfile = open(filename, "rb")
      reader = ObjectReader(soyfile)
      readerdict[filename] = reader
      if reader.is_soy == True:
        reader.indexFile()
        return reader
    else :
      if readerdict[filename].is_soy == True:
        return readerdict[filename]
    return None

  def findObject(self, type, name):
    """Finds a data object. The search goes in three steps. First,
    the self.mainreader (created from soyfile) is searched. Then
    the directory of the original soyfile is searched recursively.
    Then the parent directory is searched. Note: Searching the parent
    directory sometimes has consequences, if it contains many directories
    and many, many files. This can make an import pretty slow.
    """
    #Three steps.
    #First. Search the main file.
    typereader = self.mainreader.getObject(type, name)
    if typereader != False:
      return typereader

    #Second. Recursively search the files in the main file's path.
    for dirtuple in self.maindirslist:
      for filename in dirtuple[2]:
        filepath = dirtuple[0] + '/' + filename
        objectreader = self.fetchReader(filepath, self.mainreaders)
        if objectreader != None:
          typereader = objectreader.getObject(type, name)
          if typereader != False:
            return typereader

    #Third. Recursively search the files in the parent directory.
    for dirtuple in self.topdirslist:
      for filename in dirtuple[2]:
        filepath = dirtuple[0] + '/' + filename
        objectreader = self.fetchReader(filepath, self.topreaders)
        if objectreader != None:
          typereader = objectreader.getObject(type, name)
          if typereader != False:
            return typereader

    return None

class ObjectReader :
  """This class is instantiated once for every .soy file we need.
  Its responsibility is to index a file, and thus be able to quickly
  fetch any data object this file contains."""
  def __init__(self, soyfile):
    self.soyfile = soyfile
    self.badobjects = 0
    self.fileindex = [{}, {}, {}, {}, {}]
    self.is_soy = True

    self.meshes = []
    self.materials = []
    self.entities = []
    self.nodes = []
    #Dict with all possible object types and their associated list in a tuple.
    #The first item in each tuple contains another dict which associates major
    #versions with classes, making the adding of new versions, as well as types, easy.
    self.ObjectTypes = {
      0x0001: ({0: ReadMesh1}, self.meshes),
      0x0002: ({0: ReadMaterial1}, self.materials),
      0x0003: ({0: ReadEntity1}, self.entities),
      0x0004: ({0: ReadNode1}, self.nodes),
    }
    #self.current_object_type

    #Check if it's the right filetype
    magic = self.soyfile.read(4)
    if magic != 'soy\x00':
      print '%s is not a .soy file!' % (self.soyfile.name)
      self.is_soy = False
    self.soyfile.seek(0)

  def indexFile(self):
    """Indexes the file by reading all the object headers,
    creates their Reader objects and stores them in a separate
    objectdict for each type. This is done to avoid nameclashes, as
    objects of different types are allowed to have the same names."""
    header = self.readNextHeader()
    fileposition = 0
    self.soyfile.seek(fileposition)
    while header != False:
      if header != None:
        objectdict = self.fileindex[header.objecttype]
        if not objectdict.has_key(header.name):
          #Instantiate the right type and version
          type_class = self.ObjectTypes[header.objecttype][0][header.version_major]
          type_object = type_class(self.soyfile, header.name, header.size, header.version, header.datapos)

          objectdict[header.name] = type_object
        self.soyfile.seek(header.size, 1)
      header = self.readNextHeader()
    self.soyfile.seek(0)

  def readNextHeader(self):
    """Reads next header and returns an ObjectHeader containing
    all the header information."""
    #Search for next instance of the magic.
    magic = self.soyfile.read(4)
    while magic != 'soy\x00':
      self.soyfile.seek(-3, 1)
      magic = self.soyfile.read(4)
      #EOF
      if len(magic) < 4:
        return False

    #Read header
    objecttype = unpack('H', self.soyfile.read(calcsize('H')))[0]
    version = (ord(self.soyfile.read(1)), ord(self.soyfile.read(1)))
    name = self.soyfile.read(20).rstrip('\x00')
    size = unpack('I', self.soyfile.read(calcsize('I')))[0]
    datapos = self.soyfile.tell()

    header = self.ObjectHeader(objecttype, version, name, size, datapos)

    #Do we know this kind of object?
    if not self.ObjectTypes.has_key(objecttype):
      print 'Unknown object type %d discarded.' % (header.objecttype)
      return None
    if not self.ObjectTypes[objecttype][0].has_key(header.version_major):
      print 'Version %d of object type %d not supported. Object discarded.' % (header.version_major, header.objecttype)

    return header

  def getObject(self, type, name):
    """Fetches the Reader for an object, reads the
    blocks of the object into the Reader and returns it."""
    objectdict = self.fileindex[type]
    if objectdict.has_key(name):
      reader = objectdict[name]
    else :
      return False

    success = reader()

    if success == False:
      print 'Object corrupted. Discarding.'
      self.badobjects += 1
    else :
      self.ObjectTypes[type][1].append(reader)

    return reader


  def getNextObject(self):
    """Deprecated. It reads the next object. But this is
    really the wrong way of going about reading this kind
    of file."""
    header = self.readNextHeader()
    if header == False:
      return False
    elif header == None:
      return None

    #Instantiate the right type and version
    type_class = self.ObjectTypes[header.objecttype][0][header.version_major]
    type_object = type_class(self.soyfile, header.name, header.size, header.version, header.datapos)

    #__call__ will make the object type object read all its data from its blocks and return
    #a bool, indicating success or failure.
    success = type_object()

    if success == False:
      print 'Object corrupted. Discarding.'
      self.badobjects += 1
    else :
      self.ObjectTypes[header.objecttype][1].append(type_object)

    return type_object

  class ObjectHeader:
    """Contains the information of an object header."""
    def __init__(self, objecttype, version, name, size, datapos):
      self.objecttype = objecttype
      self.version = version
      self.version_major = self.version[0]
      self.version_minor = self.version[1]
      self.name = name
      self.size = size
      self.datapos = datapos

class ReadData :
  """All Readers for specific object types inherits
  from this class."""
  def __call__(self):
    """Universal function for reading all blocks of an object"""
    self.soyfile.seek(self.datapos)
    while self.amountread < self.size:
      success = self.readNextBlock()
      if success == False:
        return False

    return True

  def readNextBlock(self):
    """Universal function for reading one block"""
    parenttype = self.type

    #Read blockheader
    objecttype = unpack('H', self.soyfile.read(calcsize('H')))[0]
    blockid = unpack('H', self.soyfile.read(calcsize('H')))[0]
    blocksize = unpack('I', self.soyfile.read(calcsize('I')))[0]

    #Check if block was expected at this point, in this object
    if parenttype != objecttype:
      print 'In file %s: Error: Wrong object type (%d) for blockid (%d) belonging to type (%d).' % (self.soyfile.name, parenttype, blockid, objecttype)
      return False
    if blockid <= self.previousblockid:
      print 'Error: Wrong block order. Block type (%d) must not appear before (%d).' % (self.previousblockid, blockid)
      return False

    if self.Blocks.has_key(blockid):
      sizeread = self.acceptblock(blockid, blocksize)
      #If the entire block wasn't read, this will skip past the unread data
      self.soyfile.seek(blocksize - sizeread, 1)
    else :
      print 'Unsupported block type, %d. Dropping.' % (blockid)
      self.soyfile.seek(blocksize, 1)

    #Blocksize counting should be a bit more sophisticated
    self.amountread += blocksize + 8
    return True

  #To be honest, I'm not sure these Read* functions are such a good idea.
  #I don't want to make them global, but by isolating file reads to the
  #various places and classes where the information is needed, I've created the
  #interesting problem of wanting to use these functions in several places.
  #I'm inclined to go back to just using unpack(etc.) directly where needed.
  #Or maybe just the one global function I just wrote at the start of the script
  def Read1Char(self):
    return ord(self.soyfile.read(1))

  def ReadString(self, size):
    return self.soyfile.read(size)

  def Read1Int(self):
    #print calcsize('I')
    return unpack('I', self.soyfile.read(calcsize('I')))[0]

  def Read2Ints(self):
    return unpack('II', self.soyfile.read(calcsize('II')))

  def Read3Ints(self):
    return unpack('III', self.soyfile.read(calcsize('III')))

  def Read2Floats(self):
    return unpack('ff', self.soyfile.read(calcsize('ff')))

  def Read3Floats(self):
    return unpack('fff', self.soyfile.read(calcsize('fff')))

class ReadEntity1(ReadData):
  """The Entity reader. Responsible for reading an
  Entity into a Blender Object."""
  def __init__(self, soyfile, name, size, version, datapos):
    self.soyfile = soyfile
    self.name = name.replace('\x00', '')
    self.size = size
    self.datapos = datapos
    self.type = 0x0003
    self.amountread = 0
    self.previousblockid = -1

    self.meshname = self.Mesh(self.soyfile)
    self.matrix = self.Matrix(self.soyfile)

    self.floatprops = []
    self.intprops = []
    self.boolprops = []
    self.timerprops = []

    self.Blocks = {
      1: (self.Mesh, self.meshname),
      2: (self.Matrix, self.matrix),
      256: (self.FloatProp, self.floatprops),
      257: (self.IntProp, self.intprops),
      258: (self.BoolProp, self.boolprops),
      259: (self.TimerProp, self.timerprops),
    }

  def acceptblock(self, blockid, blocksize):
    """When called, attempts to read one block
    of the specified id. This happens by instantiating
    the data-container class of that object, either
    one or more times."""
    bytesread = 0
    dataclass = self.Blocks[blockid][0]
    datacontainer = self.Blocks[blockid][1]
    #self.lastblock = datacontainer
    if blockid <= 2:
      datacontainer.read()
      bytesread = datacontainer.size
    elif blockid >= 256:
      number_of, bytesread = FromFile(self.soyfile, 'I')
      number_of = number_of[0]
      for i in range(number_of):
        datablock = dataclass(self.soyfile)
        datacontainer.append(datablock)
        bytesread += datablock.size

    return bytesread


  class Mesh:
    def __init__(self, soyfile):
      self.soyfile = soyfile
    def read(self):
      self.name = self.soyfile.read(20).replace('\x00', '')
      self.size = 20

  class Matrix:
    def __init__(self, soyfile):
      self.soyfile = soyfile
    def read(self):
      self.size = 0
      self.matrix = []
      for i in range(4):
        self.matrix.append(unpack('ffff', self.soyfile.read(calcsize('ffff'))))
        self.size += calcsize('ffff')

  class FloatProp:
    def __init__(self, soyfile):
      self.name = soyfile.read(32).replace('\x00', '')
      self.size = 32
      self.value = unpack('f', soyfile.read(calcsize('f')))[0]
      self.size += calcsize('f')

  class IntProp:
    def __init__(self, soyfile):
      self.name = soyfile.read(32).replace('\x00', '')
      self.size = 32
      self.value = unpack('I', soyfile.read(calcsize('I')))[0]
      self.size += calcsize('I')

  class BoolProp:
    def __init__(self, soyfile):
      self.name = soyfile.read(32).replace('\x00', '')
      self.size = 32
      intvalue = unpack('I', soyfile.read(calcsize('I')))[0]
      self.size += calcsize('I')
      if intvalue == 0:
        self.value = False
      else :
        self.value = True

  class TimerProp:
    def __init__(self, soyfile):
      self.name = soyfile.read(32).replace('\x00', '')
      self.size = 32
      self.value = unpack('f', soyfile.read(calcsize('f')))[0]
      self.size += calcsize('f')

class ReadNode1(ReadEntity1):
  """The Node reader. Due to its similarity to the
  Entity reader, this inherits from ReadEntity1 instead
  of ReadData."""
  def __init__(self, soyfile, name, size, version, datapos):
    self.soyfile = soyfile
    self.name = name.replace('\x00', '')
    self.size = size
    self.datapos = datapos
    self.type = 0x0004
    self.amountread = 0
    self.previousblockid = -1

    self.matrix = self.Matrix(self.soyfile)

    self.entitynames = []
    self.nodenames = []
    self.floatprops = []
    self.intprops = []
    self.boolprops = []
    self.timerprops = []

    self.Blocks = {
      1: (self.Entity, self.entitynames),
      2: (self.Node, self.nodenames),
      3: (self.Matrix, self.matrix),
      256: (self.FloatProp, self.floatprops),
      257: (self.IntProp, self.intprops),
      258: (self.BoolProp, self.boolprops),
      259: (self.TimerProp, self.timerprops),
    }

  def acceptblock(self, blockid, blocksize):
    bytesread = 0
    dataclass = self.Blocks[blockid][0]
    datacontainer = self.Blocks[blockid][1]
    #self.lastblock = datacontainer
    if blockid == 3:
      datacontainer.read()
      bytesread = datacontainer.size
    elif (blockid >= 256) or (blockid <= 2):
      number_of, bytesread = FromFile(self.soyfile, 'I')
      number_of = number_of[0]
      for i in range(number_of):
        datablock = dataclass(self.soyfile)
        datacontainer.append(datablock)
        bytesread += datablock.size

    return bytesread

  class Entity:
    def __init__(self, soyfile):
      self.name = soyfile.read(20).replace('\x00', '')
      self.size = 20

  class Node:
    def __init__(self, soyfile):
      self.name = soyfile.read(20).replace('\x00', '')
      self.size = 20

class ReadMesh1(ReadData):
  """Mesh reader. Responsible for reading a Mesh type object."""
  def __init__(self, soyfile, name, size, version, datapos):
    self.soyfile = soyfile

    #namesize = self.Read1Char()
    #self.name = self.ReadString(namesize)
    self.name = name.replace('\x00', '')
    self.size = size
    self.datapos = datapos
    self.amountread = 0
    self.type = 0x0001
    self.previousblockid = -1

    self.positions = []
    self.normals = []
    self.uvcoords = []
    self.vertices = []
    self.faces = []

    self.Blocks = {
      0: (self.Position, self.positions),
      1: (self.Normal, self.normals),
      2: (self.UVCoord, self.uvcoords),
      32: (self.Vertex, self.vertices),
      96: (self.Face, self.faces),
    }

  #All Read* class data types must have an acceptblock function
  #for accepting and incorporating blocks under this type.
  #The read class should return the number of bytes _actually_
  #read from the block.
  def acceptblock(self, blockid, blocksize):
    bytesread = 0
    number_of, bytesread = FromFile(self.soyfile, 'I')
    number_of = number_of[0]
    dataclass = self.Blocks[blockid][0]
    datalist = self.Blocks[blockid][1]
    #datafunc = self.Blocks[blockid][2]
    #self.lastblock = datalist
    for i in range(number_of):
      datablock = dataclass(self.soyfile, i)
      datalist.append(datablock)
      bytesread += datablock.size

    return bytesread

  #Binds the list structure, based on the indices
  #Of the objects in the lists.
  def bindstructure(self):
    for vertex in self.vertices:
      vertex.position = self.positions[vertex.position]
      vertex.normal = self.normals[vertex.normal]
    for face in self.faces:
      face.vertices = (self.vertices[face.vertices[0]], self.vertices[face.vertices[1]], self.vertices[face.vertices[2]])

  class Position:
    def __init__(self, soyfile, index):
      self.index = index
      #self.coord = unpack('fff', soyfile.read(calcsize('fff')))
      self.coord, self.size = FromFile(soyfile, 'fff')

  class Normal:
    def __init__(self, soyfile, index):
      self.index = index
      #self.norm = unpack('fff', soyfile.read(calcsize('fff')))
      self.norm, self.size = FromFile(soyfile, 'fff')

  class UVCoord:
    def __init__(self, soyfile, index):
      self.index = index
      #self.uv = unpack('ff', soyfile.read(calcsize('ff')))
      self.uv, self.size = FromFile(soyfile, 'ff')

  class Vertex:
    def __init__(self, soyfile, index):
      self.index = index
      #posnorm = unpack('II', soyfile.read(calcsize('II')))
      posnorm, self.size = FromFile(soyfile, 'II')
      self.position = posnorm[0]
      self.normal = posnorm[1]

  class Face:
    def __init__(self, soyfile, index) :
      self.index = index
      self.size = 0
      self.mappedlist = [None]*32
      #self.vertices = unpack('III', soyfile.read(calcsize('III')))
      self.vertices, self.size = FromFile(soyfile, 'III')
      self.map = int2map(unpack('I', soyfile.read(calcsize('I')))[0])
      self.size += calcsize('I')
      #for i in range(32):
      #  if self.map[i] == '1':
      #    self.mappedlist.insert(i, unpack('I', soyfile.read(calcsize('I')), calcsize('I')))
      if self.map[0] == '1':
        self.materialindex = unpack('I', soyfile.read(calcsize('I')))
        self.size += calcsize('I')
      if self.map[1:4] == '111':
        self.uvcoords = unpack('III', soyfile.read(calcsize('III')))
        self.size += calcsize('I')
      elif self.map[1:4] != '000':
        print 'Map inconsistency in UV coordinates'
        soyfile.seek(self.map[1:4].count('1'), 1)
        self.size += calcsize('I'*self.map[1:4].count('1'))
      #self.uvcoords = unpack('III', soyfile.read(calcsize('III')))
      #self.material = material
    #def appendVert(self, vertex):
    #  self.vertices.append(vertex)
    #def setUVs(self, uvcoords):
    #  self.uvcoords = uvcoords

class ReadMaterial1(ReadData) :
  def __init__(self, soyfile, name, size, version, datapos):
    self.soyfile = soyfile


#Dialog box
from Blender import BGL, Draw, Window

class DialogGrid:
  """Sets up another coordinate system for the interface, over
  the standard one, with lower granularity, a set height,
  and (0, 0) in the top left corner.
  This makes interface creation and modification a bit easier."""
  def setup(self):
    """Call this in the __init__ of each inheriting class."""
    self.numrows = 10
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

class ImportDialog(DialogGrid):
  """Class for drawing the interface dialog. it contains the
  functions that should be passed on to Blender.Draw.Register().
  Namely DrawDialog, ButtonEvent and KeyEvent."""
  def __init__(self):
    self.setup()
    self.fileselected = False
    self.EVENT_IMPORTFROM = 0
    self.EVENT_SETIMPORT = 1
    self.EVENT_IMPORTMENU = 2

    self.IMPORT_MESH = 1
    self.IMPORT_MATERIAL = 2
    self.IMPORT_ENTITY = 3
    self.IMPORT_NODE = 4

    self.filepathSTR = ''

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
    Draw.Text('PySoy importer', 'large')

    self.importfile = Draw.String('Import from: ',
                                  self.EVENT_IMPORTFROM,
                                  self.column(1), self.line(2),
                                  self.width(30), self.height(1),
                                  self.filepathSTR, 399, 'Import an element from this file')

    self.importfilebutton = Draw.PushButton('Set import file',
                                            self.EVENT_SETIMPORT,
                                            self.column(31), self.line(2),
                                            self.width(10), self.height(1),
                                            'Set file to import from')

    if self.fileselected == True:
      self.importmenu = Draw.Menu('Import element:%t|Mesh|Material|Entity|Node',
                                  self.EVENT_IMPORTMENU,
                                  self.column(1), self.line(4),
                                  self.width(10), self.height(1),
                                  1, 'Select element from file to import')


  def KeyEvent(self, event, value):
    """Should be passed as the 'event' argument to Blender.Draw.Register().
    Defines any events from the keyboard."""
    if (event == Draw.ESCKEY) or (event == Draw.QKEY):
      Draw.Exit()

  def ButtonEvent(self, event):
    """Should be passed as the 'button' argument to Blender.Draw.Register().
    Defines any events caused by interacting with the interface."""
    if event == self.EVENT_SETIMPORT:
      Window.FileSelector(self.setimportfile, 'Set import file', '')
      self.fileselected = True
      Draw.Redraw()

    if event == self.EVENT_IMPORTMENU:
      if self.importmenu.val == self.IMPORT_MESH:
        importMesh(self.objectfinder)
      if self.importmenu.val == self.IMPORT_ENTITY:
        importEntity(self.objectfinder)
      if self.importmenu.val == self.IMPORT_NODE:
        importNode(self.objectfinder)

  def setimportfile(self, filepath):
    """Called from the FileSelector on a SETIMPORT event.
    Sets the file to import from."""
    self.filepathSTR = filepath
    soyfile = open(self.filepathSTR, "rb")
    self.objectfinder = ObjectFinder(soyfile)
    #self.objectreader = ObjectReader(soyfile)
    #self.objectreader.indexFile()

dialog = ImportDialog()
Draw.Register(dialog.DrawDialog, dialog.KeyEvent, dialog.ButtonEvent)

def importMesh(objectfinder):
  """Called on an IMPORT_MESH event. Imports
  a single mesh into a Blender Object."""
  meshdict = objectfinder.mainreader.fileindex[1]
  menustring = 'Choose Mesh:%t'
  num_meshes = 0
  name_map = []
  for name in meshdict.keys():
    menustring += '|' + name
    num_meshes += 1
    name_map.append(name)
  choice = Draw.PupMenu(menustring)
  if choice != -1:
    meshname = name_map[choice-1]

    nmesh = fetchNMesh(meshname, objectfinder)

    #For testing
    NMesh.PutRaw(nmesh, nmesh.name)

def importEntity(objectfinder):
  """Called on an IMPORT_ENTITY event. Imports
  a single entity to a Blender Object."""
  entitydict = objectfinder.mainreader.fileindex[3]
  menustring = 'Choose Entity:%t'
  num_entities = 0
  name_map = []
  for name in entitydict.keys():
    menustring += '|' + name
    num_entities += 1
    name_map.append(name)
  choice = Draw.PupMenu(menustring)
  if choice != -1:
    entityname = name_map[choice-1]

    blendobject = fetchEntObject(entityname, objectfinder)

def importNode(objectfinder):
  """Called on an IMPORT_NODE event. Imports
  a single node into the currently active Scene.
  This can cause the creation of several Objects.
  If the Node contains an Entity of the same name,
  this Entity is made the parent of the rest of the
  Entities. Otherwise, Each Entity/Node of the Node
  is just imported directly into the Scene."""
  nodedict = objectfinder.mainreader.fileindex[4]
  menustring = 'Choose Node:%t'
  num_nodes = 0
  name_map = []
  for name in nodedict.keys():
    menustring += '|' + name
    num_nodes += 1
    name_map.append(name)
  choice = Draw.PupMenu(menustring)
  if choice != -1:
    blendzeromatrix = Blender.Mathutils.Matrix([0.0, 0.0, 0.0, 0.0],
                                               [0.0, 0.0, 0.0, 0.0],
                                               [0.0, 0.0, 0.0, 0.0],
                                               [0.0, 0.0, 0.0, 0.0])
    nodename = name_map[choice-1]
    parentobject = fetchEntObject(nodename, objectfinder, Blender.Mathutils.Matrix(blendzeromatrix))
    #If parent-object is None, it means there is no source object, and that this
    #must then be a top-Node used for a level.
    if parentobject == None:
      nodereader = objectfinder.findObject(4, nodename)
      for entityname in nodereader.entitynames:
        blendobject = fetchEntObject(entityname.name, objectfinder, Blender.Mathutils.Matrix(blendzeromatrix))
      for nodenm in nodereader.nodenames:
        blendnode = fetchNodeObject(nodenm.name, objectfinder, Blender.Mathutils.Matrix(blendzeromatrix))
    else :
      nodeobject = fetchNodeObject(nodename, objectfinder, Blender.Mathutils.Matrix(blendzeromatrix))

    #blendobject = CreateNodeObject(nodename, objectfinder)

def Vertex2NMVert(vertex):
  """Converts a native Vertex instance from the
  ReadMesh1 class to a Blender NMVert."""
  nmvert = NMesh.Vert(vertex.position.coord[0], vertex.position.coord[1], vertex.position.coord[2])
  nmvert.no[0] = vertex.normal.norm[0]
  nmvert.no[1] = vertex.normal.norm[1]
  nmvert.no[2] = vertex.normal.norm[2]

  return nmvert

def fetchNMesh(meshname, objectfinder):
  """Finds and imports a Mesh to an NMesh from an ObjectFinder.
  If a Mesh of this name already exists in the Blender environment,
  it returns that instead."""
  if NMesh.GetRaw(meshname) == None:
    print meshname
    meshreader = objectfinder.findObject(1, meshname)
    meshreader.bindstructure()
    nmesh = NMesh.GetRaw()
    for vertex in meshreader.vertices:
      nmesh.verts.append(Vertex2NMVert(vertex))

    for face in meshreader.faces:
      nmface = NMesh.Face([nmesh.verts[face.vertices[0].index], nmesh.verts[face.vertices[1].index], nmesh.verts[face.vertices[2].index]])
      nmesh.addFace(nmface)

    nmesh.name = meshname
    nmesh.update()
  else :
    nmesh = NMesh.GetRaw(meshname)

  return nmesh

def ObjectExists(objectname):
  objectlist = Blender.Object.Get()
  for obj in objectlist:
    if objectname == obj.name:
      return True
  return False

def addPropertyBlock(obj, proplist, proptype):
  """Adds all properties from a property block to this
  object. This should perhaps be moved somewhere else.
  Into the Entity-reader, for instance."""
  for prop in proplist:
    obj.addProperty(prop.name, prop.value, proptype)

def fetchEntObject(entityname, objectfinder, parentworldmat):
  """Finds and imports an Entity and its associated Mesh
  to a Blender Object from an ObjectFinder. If an Object
  of this name already exists in the Blender environment,
  it returns that instead."""
  if not ObjectExists(entityname):
    entityreader = objectfinder.findObject(3, entityname)
    if entityreader == None:
      return None

    obj = Blender.Object.New('Mesh', entityname)
    nmesh = fetchNMesh(entityreader.meshname.name, objectfinder)
    obj.link(nmesh)

    entitylocalmat = Blender.Mathutils.Matrix(entityreader.matrix.matrix[0], entityreader.matrix.matrix[1], entityreader.matrix.matrix[2], entityreader.matrix.matrix[3])

    entityworldmat = entitylocalmat + parentworldmat

    obj.setMatrix(entityworldmat)

    addPropertyBlock(obj, entityreader.floatprops, 'FLOAT')
    addPropertyBlock(obj, entityreader.intprops, 'INT')
    addPropertyBlock(obj, entityreader.boolprops, 'BOOL')
    addPropertyBlock(obj, entityreader.timerprops, 'TIME')

    currentscene = Blender.Scene.GetCurrent()
    currentscene.link(obj)

  else :
    obj = Blender.Object.Get(entityname)

  return obj

def fetchNodeObject(nodename, objectfinder, parentworldmat):
  """Finds and imports a Node to a Blender Object from an ObjectFinder.
  Additionally, it will also recursively import all subNodes and the
  related Entities and Meshes."""
  nodereader = objectfinder.findObject(4, nodename)
  parentobject = fetchEntObject(nodename, objectfinder, parentworldmat)

  nodelocalmat = Blender.Mathutils.Matrix(nodereader.matrix.matrix[0], nodereader.matrix.matrix[1], nodereader.matrix.matrix[2], nodereader.matrix.matrix[3])

  nodeworldmat = nodelocalmat + parentworldmat

  parentobject.setMatrix(nodeworldmat)

  addPropertyBlock(parentobject, nodereader.floatprops, 'FLOAT')
  addPropertyBlock(parentobject, nodereader.intprops, 'INT')
  addPropertyBlock(parentobject, nodereader.boolprops, 'BOOL')
  addPropertyBlock(parentobject, nodereader.timerprops, 'TIME')

  childlist = []
  for entityname in nodereader.entitynames:
    if entityname.name != nodename:
      blendobject = fetchEntObject(entityname.name, objectfinder, nodeworldmat)
      childlist.append(blendobject)
  for nodenm in nodereader.nodenames:
    blendnode = fetchNodeObject(nodenm.name, objectfinder, nodeworldmat)
    childlist.append(blendnode)

  parentobject.makeParent(childlist)
  return parentobject


def file_callback(filename):
  soyfile = open(filename, "rb")
  objectreader = ObjectReader(soyfile)
  objectreader.indexFile()
  for objectkind in objectreader.fileindex:
    print objectkind
  datatype = objectreader.getNextObject()
  while datatype != False:
    if datatype != None:
      datatype.bindstructure()
    datatype = objectreader.getNextObject()

  meshes = objectreader.meshes

  for mesh in meshes:
    nmesh = Mesh2NMesh(mesh)

    #For testing
    NMesh.PutRaw(nmesh, mesh.name)

  soyfile.close()


#Blender.Window.FileSelector(file_callback, "Import .soy")
