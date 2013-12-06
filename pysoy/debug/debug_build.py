# debug_build.py  Danger! Danger! Danger!
#
# Copyright (C) 2006,2007,2008,2009 PySoy Group
#
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published
#  by the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Affero General Public License for more details.
#
#  You should have received a copy of the GNU Affero General Public License
#  along with this program; if not, see http://www.gnu.org/licenses
#
# $Id: debug_build.py 1393 2008-12-31 23:51:25Z ArcRiley $

import os

class PXIfile(object):
  def __init__(self, aPXI):
    self.filePath = aPXI
    self.lines    = iter(open(aPXI))
    self.outText  = ''
    self.buffer   = []
    self.curScope = None  # 'cdef' or 'def'

    ##setup
    self.make_lines()
    self.commit()    

  def set_cur_scope_cdef(self): self.curScope = 'cdef'
  def set_cur_scope_def(self):  self.curScope = 'def'

  def make_lines(self):
    self.buffer.append("cimport stdio\n")
    self.buffer.append("cimport py\n")
    lineNum  = 0
    for line in self.lines:
      lineNum += 1
      nextLine  = Line(line, lineNum, self.filePath, self.curScope)
      self.buffer.append(nextLine)
    
      if nextLine.get_line_type() == False: continue
      if nextLine.get_line_type() == 'cdef':  self.set_cur_scope_cdef()
      if nextLine.get_line_type() == 'def' :  self.set_cur_scope_def()
      nextLine  = Line(line, lineNum, self.filePath, self.curScope)

      self.buffer.append(nextLine.make_thread_line())        
      lineType  = nextLine.get_line_type()

      if lineType == 'cond':
        self.buffer.append(nextLine.make_cond_line())
      if lineType == 'def' or lineType == 'cdef':
        self.buffer.append(nextLine.make_func_line())
      if lineType == 'lock':
        self.buffer.append(nextLine.make_lock_line())
          
  def build_outText(self):
    self.buffer   = map(str, self.buffer)
    self.outText  = ''.join(self.buffer)
   
  def commit(self):
    self.build_outText()
    outfile = open(self.filePath, 'w')
    outfile.write(self.outText)
    print self.outText
    
    
class Line(object):
  def __init__(self, aLine, lineNum, filePath, curScope=None):
    self.text       = aLine
    self.stripped   = self.text.strip()
    self.whitespace = ''
    self.lineNum    = "line: %05d, " % lineNum
    self.filePath   = filePath
    self.curScope   = curScope
    ##setup
    self.make_whitespace()
  
  def __repr__(self): return self.text
                                
  def make_whitespace(self):
    for char in self.text:
      if char != ' ': 
        if self.is_lock(): return
        self.whitespace += '  '
        return
      self.whitespace += ' '

  def line_valid(self):           # can't print funcs with multiline args... yet
    if ":" not in self.text:     return False
    if "self" not in self.text:  return False
    if "class" in self.text:     return False
    return True

  def get_line_type(self):
    if self.is_lock():        return 'lock'
    if not self.line_valid(): return False
    if self.is_cond():        return 'cond'
    if self.is_cdef():        return 'cdef'
    if self.is_def():         return 'def'
    return False
    
  def is_cond(self):
    if self.stripped[0:2]   == 'if':    return True
    if self.stripped[0:3]   == 'for':   return True
    if self.stripped[0:4]   == 'elif':  return True
    if self.stripped[0:5]   == 'while': return True
    return False
  
  def is_lock(self):
    if "py.PyThread_acquire_lock" in self.stripped: return True
    if "py.PyThread_release_lock" in self.stripped: return True  
    return False
    
  def is_cdef(self):
    if self.stripped[0:4] == "cdef": return True
    return False
    
  def is_def(self):
    if self.stripped[0:3] == "def":  return True
    return False
  
  def make_thread_line(self):
    threadingMask = 'stdio.printf("%sThread ID: Python GIL, ")#autogen' 
    threadingInfo = threadingMask % self.lineNum
    if self.curScope  == 'cdef':               #Print threading information also
      threadingMask = r'stdio.printf("%sThread ID:%s ,",<long>py.PyThread_get_thread_ident())#autogen'
      threadingInfo = threadingMask % (self.lineNum, '%d')   # snuck the '%d' in
    newLine = self.whitespace + threadingInfo + '\n'
    return newLine
    
  def make_func_line(self):
    lineText  = self.stripped.split('(')[0]
    return self.build_line(lineText)    

  def make_cond_line(self):
    lineText  = self.stripped
    return self.build_line(lineText)
    
  def make_lock_line(self):
    lineText  = self.stripped
    return self.build_line(lineText)
    
  def build_line(self, lineText):
    mask = '%sstdio.printf("%s: %s\\n")#autogen\n'    
    newLine = mask % (self.whitespace, self.filePath, lineText)    
    return newLine
    
        
class Augmentator(object):
  def __init__(self, rootDir):
    self.rootDir  = rootDir
    self.pxiFiles = []
    ##setup
    self.get_pxi_files()
    
  def valid_fileName(self, fileName):
    if fileName[-4:]  == '.pxi': return True
    return False
    
  def get_pxi_files(self):
    tree = os.walk(self.rootDir)
    for group in tree:
      curDir, ignore, fileNames = group
      for aFile in fileNames:
        if not self.valid_fileName(aFile): continue
        path    = os.path.join(curDir, aFile)
        newFile = PXIfile(path)       
        self.pxiFiles.append(newFile)



def WARNING():
  import time, sys
  msg = """\
+------------------------------------------------------------------------------+
| debug_build.py                                                               |
+------------------------------------------------------------------------------|
|  This program inserts printf statements in *.pxi files at the following      |
|  locations:                                                                  |
|  @ the def and cdef function heads                                           |
|  @ if, for, elif, while                                                      |
|  @ if the function scope is a cdef the Thread ID will be printed as well.    |
|                                                                              |
|  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    |
|  << Warning >>  << Danger >>  << Warning >>  << Danger >>  << Warning >>     |
|                                                                              |
|  This program will utterly mangle your ./src directory.                      |
|  It will not be commitable afterwards.                                       |
|  Again. By using this program, you may cause Global Thermonuclear War,       |
|  black plague or rabies in small animals within a radius of two miles.       |
|  You have been warned.                                                       |
|                                                                              |
+------------------------------------------------------------------------------+
"""
  print msg
  cin = raw_input("Do you wish to proceed [(Y)es, (N)o]: ")
  if cin != 'Y':
    print "--\nPerhaps we can play again sometime. Bye. [process terminated]\n"
    sys.exit()
  for i in range(5,0,-1):
    time.sleep(.5)
    print i
    
if __name__ == "__main__":
  WARNING()
  Augmentator('../src')  
  
  
  
  
