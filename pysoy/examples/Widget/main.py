#!/usr/bin/env python

import sys

import os
import os.path
import subprocess

def taskset():
    """Tries to set our CPU affinity using taskset.  This should not
    be necessary once mill is working."""

    pid = os.getpid()
    try:
        c = subprocess.check_call(['taskset', '-p', '1', '%d' % os.getpid()])
    except subprocess.CalledProcessError as e:
        sys.stderr.write("Could not set CPU affinity (taskset returned %d).  Example may crash." % e.returncode)

taskset()

from textwrap import TextWrapper

import soy
from Examples import getExamples

class ExampleError(Exception):
    """Errors caused by problems with loading and running Examples."""

    pass

class NoExampleProvided(ExampleError):
    """No example was specified on the command line."""

    @property
    def message(self):
        return "Please specify one of the above examples as an argument."

def help_message(exception, examples):
    """Displays the help message if something has gone wrong."""

    sys.stderr.write("""
PySoy Widget Examples

This will run one of the Widget examples from examples/Widget.  The
following examples are available:

""")

    for name, scene in examples.items():
        wrapper = TextWrapper(initial_indent = "%-13s : " % name,
                              subsequent_indent = "%13s : " % " ",
                              fix_sentence_endings = True,
                              replace_whitespace = True)

        sys.stderr.write(wrapper.fill(scene.__doc__.replace("    ", " ")))
        sys.stderr.write('\n')

    sys.stderr.write('\n')
    sys.stderr.write('The error encountered was:\n')
    sys.stderr.write('%s\n' % TextWrapper(initial_indent = "    ",
                                          subsequent_indent = "    ",
                                          fix_sentence_endings = True).fill(exception.message))
    sys.stderr.write('\n')
    sys.exit(1)

def main(examples, *names):
    try:
        exampleName = names[0]
    except IndexError:
        raise NoExampleProvided()

    example = examples[exampleName]()
    
    example.scene = soy.scenes.Scene()

    example.camera = soy.bodies.Camera(example.scene)
    example.camera.position = (0.0, 0.0, 10.0)

    example.light = soy.bodies.Light(example.scene)
    example.light.position = (-10.0, 10.0, 2.0)

    screen = soy.Screen()
    window = soy.Window(screen, exampleName, size = (800, 480))
    
    example.window = window

    quitController = soy.controllers.Keyboard(window)
    quitController[ 1 ] = soy.actions.Quit() # 9 = esc key

    example.run()
        
if __name__ == '__main__':
    examples = dict(getExamples())
    
    try:
        main(examples, *sys.argv[1:])

    except ExampleError as e:
        help_message(e, examples)
