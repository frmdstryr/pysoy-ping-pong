#!/usr/bin/env python3

import soy
from time import sleep

client = soy.Client()

if __name__ == '__main__' :
	while client.window :
		print("Position:", client.pointer.position)
		sleep(.1)
