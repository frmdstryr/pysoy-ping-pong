"""Loads all subclasses of Example within this package.

Why?  Because Gonzology hates main methods and loops and repeated code
for updating things that can be updated and basically is obsessively
autistic about these things.  This can either be reworked or discarded
as anyone else sees fit."""

__all__ = ['getExamples']

import os
import os.path
import imp
import inspect

from Interfaces import Example

def isexample(o):
    """True if o is a subclass of Example."""

    try:
        return o is not Example and issubclass(o, Example)
    except Exception as e:
        pass

MODPATH = os.path.dirname(__file__) or '.'
def getExamples():
    """Finds all of the modules in this package and yield the
    subclasses of L{Example}."""

    f = None
    for root, dirs, files in os.walk(MODPATH):
        for fn in files:
            try:
                name = inspect.getmodulename(fn)
                if name is None: continue
                f, path, description = imp.find_module(name, [root])
                mod = imp.load_module(name, f, path, description)
                for c in inspect.getmembers(mod, isexample):
                    yield c
                    
            except ImportError:
                continue

            finally:
                if f is not None:
                    f.close()
