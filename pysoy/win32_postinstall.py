import os, os.path
import sys
import distutils.sysconfig as sysconfig

desktop = get_special_folder_path("CSIDL_DESKTOPDIRECTORY")
shortcut = os.path.join(desktop, 'PySoy Examples.lnk')
examples = os.path.join(sysconfig.get_python_lib(True), 'soy', 'examples')

if sys.argv[1] == '-install':
    create_shortcut(examples, "PySoy Examples", shortcut)
else:
    if os.path.exists(shortcut):
        os.remove(shortcut)

