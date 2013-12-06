#!/usr/bin/env python
# encoding: utf-8
#
#   Waf tool for orc
#   Copyright (C) 2010,2011,2012,2013 Copyleft Games Group
#
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU Affero General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU Affero General Public License for more details.
#
#   You should have received a copy of the GNU Affero General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

import os.path, shutil, sys, platform
from waflib import Context, Task, Runner, Utils, Logs, Build, Node, Options, Errors
from waflib.TaskGen import extension
from waflib.Configure import conf
if sys.version_info[0] == 2:
    from httplib import HTTPConnection
else:
    from http.client import HTTPConnection


class orcc(Task.Task):
    vars = ['GENERATE_C', 'GENERATE_ASM', 'BUILD_ORC_C']

    def run(self):
        # if orcc available locally
        if self.env.BUILD_ORC_C:
            ext_out = ['.orc.c']
            for input in self.inputs:
                ret = self.exec_command('%s --implementation %s -o %s' % (
                                        self.env['ORCC'],
                                        input.abspath(),
                                        input.change_ext('.orc.c').abspath()))
                # return error code if not successful
                if ret != 0:
                    return ret
        elif self.env['ORCC']:
            ext_out = ['.s']
            # generate command string for targets
            arch_targets = ' --target '.join(self.arch_targets)
            if arch_targets:
                arch_targets = '--target ' + arch_targets

            # generate .s file for every .orc input file
            for input in self.inputs:
                # generate assembly (.s)
                ret = self.exec_command('%s --assembly %s -o %s %s' % (
                                        self.env['ORCC'],
                                        arch_targets,
                                        input.change_ext('.s').abspath(),
                                        input.abspath()))
                # return error code if not successful
                if ret != 0:
                    return ret

        # orcc not available locally, use build server
        else:
            ext_out = ['.s']
            cgi = '&'.join(('target=%s' % t for t in self.arch_targets))
            for input in self.inputs:
                output = input.change_ext('.s')
                url = 'http://%s/%s?%s' % (self.http_builder, output.name, cgi)
                req = HTTPConnection(self.http_builder)
                req.request('POST', url, open(input.abspath(), 'rb'))
                res = req.getresponse()
                if res.status != 200:
                    self.err_msg = res.read().decode()
                    return res.status
                open(output.abspath(), 'wb').write(res.read())

        # if it gets this far, everything went well
        return 0


@extension('.orc')
def orc_file(self, node):
    orctask = getattr(self, "orctask", None)

    if not orctask:
        self.orctask = self.create_task('orcc')
        self.orctask.arch_targets = getattr(self, 'arch_targets',
                                            ['mmx', 'sse'])
        self.orctask.http_builder = getattr(self, 'http_builder',
                                            'build.pysoy.org')

    if self.env.BUILD_ORC_C:
        s_node = node.change_ext('.orc.c')
        if not 'ORC' in self.uselib:
            self.uselib.append('ORC')
    else:
        s_node = node.change_ext('.s')

    self.source.append(s_node)
    self.orctask.inputs.append(node)
    self.orctask.outputs.append(s_node)


@conf
def check_orc(self):
    self.find_program('orcc', var='ORCC', mandatory=False)


@conf
def check_orc_deps(self):
    # check if liborc will be needed
    from platform import machine
    orc_needed = (machine() == 'i686' and
                  self.options.generate_asm != 'True') or\
                 self.options.generate_c == 'True'

    # orcc is currently broken and does not produce correct code
    # because of this, orc.c files will be built by default until it is fixed
    orc_needed = True

    self.env.BUILD_ORC_C = orc_needed

    self.check_cfg(package='orc-0.4', uselib_store='ORC', mandatory=orc_needed,
                   args='--cflags --libs')


def configure(self):
    self.load('gnu_dirs')
    self.check_orc_deps()
    self.check_orc()

