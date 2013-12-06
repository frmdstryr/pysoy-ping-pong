/*
 *  libsoy tests - meshTest (meshTest.gs)
 *  Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

[indent=4]
uses
    soy

init
    //testing mesh construction
	scene : soy.scenes.Scene = new soy.scenes.Scene()
    pyramid : soy.bodies.Mesh = new soy.bodies.Mesh(scene) 
    pyramid.length = 6

    var pos = new soy.atoms.Position(0,0,1)
    var norm = new soy.atoms.Vector(1,0,0)
    var tan = new soy.atoms.Vector(0,1,0)
    var v1 = new soy.atoms.Vertex(pos,norm,pos,tan)  

    pos = new soy.atoms.Position(1,1,0)
    norm = new soy.atoms.Vector(1,0,0)
    tan = new soy.atoms.Vector(0,1,0)
    var v2 = new soy.atoms.Vertex(pos,norm,pos,tan)  

    pos = new soy.atoms.Position(2,2,1)
    norm = new soy.atoms.Vector(1,0,0)
    tan = new soy.atoms.Vector(1,1,0)
    var v3 = new soy.atoms.Vertex(pos,norm,pos,tan)  

    pos = new soy.atoms.Position(1,0,1)
    norm = new soy.atoms.Vector(1,0,0)
    tan = new soy.atoms.Vector(1,1,0)
    var v4 = new soy.atoms.Vertex(pos,norm,pos,tan)  

    pos = new soy.atoms.Position(0,1,0)
    norm = new soy.atoms.Vector(1,0,0)
    tan = new soy.atoms.Vector(1,1,0)
    var v5 = new soy.atoms.Vertex(pos,norm,pos,tan)  

    pyramid[0] = new soy.atoms.Face(v1,v2,v3)
    pyramid[1] = new soy.atoms.Face(v1,v2,v5)
    pyramid[2] = new soy.atoms.Face(v1,v4,v5)
    pyramid[3] = new soy.atoms.Face(v1,v3,v4)
    pyramid[4] = new soy.atoms.Face(v2,v3,v4)
    pyramid[5] = new soy.atoms.Face(v1,v4,v5)

    //TODO - test updating existing faces for both Mesh and Target; we want to be sure the weak_face() and weak_vert() functions are working properly

    var target = new soy.models.Target(pyramid)
    var clone = pyramid.clone()
    
    //make changes to clone
    clone[5] = new soy.atoms.Face(v3,v4,v5)
    target.morphs.add(pyramid.morph(clone,(float) 0.5))

    print("Face 6 has a vertex at %f,%f,%f",target[5][0].position.x,target[5][0].position.y,target[5][0].position.z)

    target.apply_morphs()

    print("Morphed face 6; it has a vertex at %f,%f,%f",target[5][0].position.x,target[5][0].position.y,target[5][0].position.z)

    print("Success")
