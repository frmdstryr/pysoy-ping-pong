#!/usr/bin/env python
import soy
from time import sleep

#win.background.hex = '#000'
#stx = soy.widgets.StackY(win)
#ca1 = soy.widgets.Canvas(stx, margin=5, texture=tex2)

class ConsoleChar(soy.textures.Print):
  """
  I am the basic building block of the console, I hold a texture which
  represents a character in the ConsoleLine(s).
  """
  def __init__(self, aChar):
    assert len(aChar) == 1, "aChar must be of length one not %d" % len(aChar)
    self.background = soy.colors.Blue()
    self.foreground = soy.colors.White()
    self.font = "courier"
    self.text = str(aChar)
  def __repr__(self): return self.text

class ConsoleLine(object):
  """
  I am a line in the Console. ConsoleChars are added to me, and I grow right.
  when I'm full, I tell Console and he adds a new ConsoleLine
  """
  def __init__(self, aConsole):
    self.maxColumns   = 20
    self.textArea     = soy.widgets.StackX(aConsole)
    self.columns      = []
    self.add_char(']')
    self.add_char(' ')

  def full(self):
    if len(self.columns) < self.maxColumns: return False
    return True

  def add_char(self, aChar):
    if not self.full():
      newChar = ConsoleChar(aChar)
      self.columns.append(  soy.widgets.Canvas( self.textArea,
                            margin  = 1,
                            texture = newChar ) )
      return 0
    return 1    # tell console to make a new line, cause we're full
  
class KeyPress(soy.actions.Action):
  def __init__(self):
    pass
    
class Console(object):
  """
  I am going to handle key input too, but currently am a basic container for 
  ConsoleLine(s).
  """
  def __init__(self):
    self.scr                = soy.Screen()
    self.win                = soy.Window(self.scr, 'Console')
    self.win.background.hex = '#123'
    self.textArea       = [ soy.widgets.StackY(self.win) ]
    self.lines          = []
    self.currentLine    = -1
    self.add_line()
    self.key            = soy.controllers.Keyboard(self.win)    
    for char in 'abcdefghijklmnopqrtuvwxyz':
      self.key[char] = KeyPress(1)
  def add_line(self):
    print "Adding Line: ", len(self.lines)    
    self.lines.append(ConsoleLine(self.win))
    self.textArea.append(ConsoleLine(self.win))
    self.currentLine += 1

  def add_char(self, aChar):
    print "Adding", aChar
    currentLine = self.lines[self.currentLine]
    needNewLine = currentLine.add_char(aChar)
    if needNewLine == True:  self.add_line()

if __name__ == '__main__' :
  sleep(1)
  C = Console()
  count = 0
  while True:

    C.add_char(str(count)[0])
    count += 1
    sleep(.1)
    
