#!/usr/bin/env python3
''' PySoy's compile and install script '''
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
__author__  = 'Copyleft Games Group'
__version__ = '1.0_beta3'

import os, sys
import subprocess
from distutils.core import setup
from distutils.cmd import Command
from distutils.command import build_py

# sphinx setup
from sphinx.setup_command import BuildDoc

# PySoy only supports Python 3.1+
# Removing this test will only cause it to fail during build on Python 2.x
# 
if sys.version_info[0] != 3 or sys.version_info[1] == 0 :
    raise RuntimeError('Python 3.1+ is required for this package.')

from subprocess import getstatusoutput

class WafClean (Command):
    description = 'Clean using Waf'
    user_options = []

    def initialize_options (self) :
        return
        

    def finalize_options (self) :
        return


    def run (self) :
        subprocess.call(['./waf', 'clean'])

class WafBuild (Command):
    description = 'Build using Waf'
    user_options = []

    def initialize_options (self) :
        return
        

    def finalize_options (self) :
        return


    def run (self) :
        subprocess.call(['./waf', 'configure', 'build'])

class WafInstall (Command):
    description = 'Install using Waf'
    user_options = []

    def initialize_options (self) :
        return
        

    def finalize_options (self) :
        return


    def run (self) :
        subprocess.call(['./waf', 'install'])


cmdclass = {'build_docs': BuildDoc, 'clean': WafClean, 'build': WafBuild, 'install': WafInstall}
name = 'PySoy'

if __name__ == '__main__' : setup(
  #
  #############################################################################
  #
  # PyPI settings (for pypi.python.org)
  #
  name             = name,
  version          = __version__,
  description      = 'Cloud 3D Game Engine for Python',
  long_description = ''' ''',
  author           = __author__,
  maintainer       = 'Arc Riley',
  url              = 'http://www.pysoy.org/',
  download_url     = 'http://hg.pysoy.org/pysoy',
  license          = 'GNU Affero General Public License version 3 (AGPLv3)',
  classifiers      = [
    'Development Status :: 4 - Beta',
    'Intended Audience :: Developers',
    'License :: OSI Approved :: GNU Affero General Public License v3',
    'Natural Language :: English',
    'Topic :: Education',
    'Topic :: Games/Entertainment',
    'Topic :: Multimedia :: Graphics',
    'Topic :: System :: Distributed Computing',
  ],
  #
  #############################################################################
  #
  # Extension settings
  #
  cmdclass=cmdclass,
  command_options={
        'build_docs': {
            'source_dir': ('setup.py', 'docs'),
            'build_dir': ('setup.py', os.path.join("docs", "build")),
            'project': ('setup.py', name),
            'version': ('setup.py', __version__),
            },
        },
)
