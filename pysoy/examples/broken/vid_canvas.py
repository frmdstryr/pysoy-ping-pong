#!/usr/bin/env python
import soy
from time import sleep

ogg = soy.transports.File('media/changeworld.ogg')
vid = ogg['video']

scr = soy.Screen()
win = soy.Window(scr, 'Video Canvas')
can = soy.widgets.Canvas(win, texture=vid)
key = soy.controllers.Keyboard(win)
key['q'] = soy.actions.Quit()
key[ 1 ] = soy.actions.Quit() # 9 = esc key
wcn = soy.controllers.Window(win)
wcn['close'] = soy.actions.Quit()

if __name__ == '__main__' :
  while True:
    sleep(0.3)
