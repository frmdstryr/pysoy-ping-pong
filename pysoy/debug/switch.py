
import os

def dirwalk(dir):
  "walk a directory tree, using a generator"
  for f in os.listdir(dir):
    if f == '.svn' :
      continue
    fullpath = os.path.join(dir,f)
    if os.path.isdir(fullpath) and not os.path.islink(fullpath):
      for x in dirwalk(fullpath):  # recurse into subdir
        yield x
    else:
      if f[-3:]!='.py' and f[-2:] != '.c' and f[-4:]!='.pyx' and f[-4:]!='.pxd' and f[-4:]!='.pxi':
        continue
      yield fullpath


switch = {
 '    it under the terms of the GNU Genera' :
 '    it under the terms of the GNU Affero General Public License as published',

 '#  it under the terms of the GNU General' :
 '#  it under the terms of the GNU Affero General Public License as published',

 '    the Free Software Foundation; either' :
 '    by the Free Software Foundation, either version 3 of the License, or',

 '#  the Free Software Foundation; either ' :
 '#  by the Free Software Foundation, either version 3 of the License, or',
 
 '    GNU General Public License for more ' :
 '    GNU Affero General Public License for more details.',

 '#  GNU General Public License for more d' :
 '#  GNU Affero General Public License for more details.',
 
 '    You should have received a copy of t' :
 '    You should have received a copy of the GNU Affero General Public License',

 '#  You should have received a copy of th' :
 '#  You should have received a copy of the GNU Affero General Public License',
}

def doswitch(path) :
  fr = open('../pysoy6/%s' % path[2:], 'r')
  fw = open(path, 'w')
  while 1 :
    ln = fr.readline()
    if ln == '' :
      break
    for s in switch :
      if ln[:40] == s :
        ln = '%s\n' % switch[s]
      
    fw.write(ln)
  fr.close()
  fw.close()      

ds = dirwalk('./') 
for d in ds :
  doswitch(d)
