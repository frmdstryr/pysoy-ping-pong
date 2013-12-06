#!/usr/bin/env python

''' api_sherlock.py
    prints a decent overview of the projects structure.
'''
__credits__ = '''
    Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group

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
__author__  = 'PySoy Group'
__date__    = 'Last change on '+ \
              '$Date: 2008-12-31 18:51:25 -0500 (Wed, 31 Dec 2008) $'[7:-20]+ \
              'by '+'$Author: ArcRiley $'[9:-2]
__version__ = 'Trunk (r'+'$Rev: 1393 $'[6:-2]+')'

import sys

def get_attributes(aModule, shortList):
  attributes  = [att for att in dir(aModule) if '_' not in att]
  if '.' not in aModule.__name__: print('\t', end=' ')
  print(aModule.__name__)
  
  for att in attributes:
    try:
      attType = type(aModule.__getattribute__(att)).__name__
    except:
      continue
    
    if attType == 'module' or attType == 'type':
      if (aModule,att) not in shortList:
        shortList.append((aModule,att))
        get_attributes(aModule.__getattribute__(att), shortList)
        
if __name__=="__main__":
  shortList = []
  try:
    rootModule  = __import__(sys.argv[1])
  except:
    print("*\n*\n*\n\nYou'll need to supply an importable module name")
    print("example: $ python sherlock.py soy")
    print("or     : $ python sherlock.py soy | less\n\n*\n*")
  get_attributes(rootModule, shortList)
  
