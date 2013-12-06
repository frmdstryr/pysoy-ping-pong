/*
 *  libsoy tests - soy.colors (colors.gs)
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
    // color construction test
    color : soy.atoms.Color = new soy.atoms.Color(255, 127, 63, 0)
    print "new soy.atoms.Color(255, 127, 63, 0) : (%i, %i, %i, %i)", \
        color.red, color.green, color.blue, color.alpha

    // color division test
    var color1 = new soy.atoms.Color(127, 50, 84, 255)
    var color2 = new soy.atoms.Color(255, 127, 63, 127)
    var color3 = new soy.atoms.Color.divide(color1, color2)
    print "Division (127, 50, 84, 255)/(255, 127, 63, 127) = (127, 101, 255, 255) : (%d, %d, %d, %d)", \
                                                          color3.red, color3.green, \
                                                          color3.blue, color3.alpha
    
    // color multiplication test
    color1 = new soy.atoms.Color(127, 50, 84, 255)
    color2 = new soy.atoms.Color(255, 127, 63, 127)
    color3 = new soy.atoms.Color.multiply(color1, color2)
    print "Multiplication (127, 50, 84, 255)*(255, 127, 63, 127) = (127, 25, 21, 255) : (%d, %d, %d, %d)", \
                                                          color3.red, color3.green, \
                                                          color3.blue, color3.alpha
    
    // color addition test
    color1 = new soy.atoms.Color(127, 50, 84, 255)
    color2 = new soy.atoms.Color(255, 127, 63, 127)
    color3 = new soy.atoms.Color.add(color1, color2)
    print "Addition (127, 50, 84, 255)+(255, 127, 63, 127) = (255, 177, 147, 255) : (%d, %d, %d, %d)", \
                                                          color3.red, color3.green, \
                                                          color3.blue, color3.alpha
    
    // color subtraction test
    color1 = new soy.atoms.Color(127, 50, 84, 255)
    color2 = new soy.atoms.Color(255, 127, 63, 127)
    color3 = new soy.atoms.Color.subtract(color1, color2)
    print "Subtraction (127, 50, 84, 255)-(255, 127, 63, 127) = (0, 0, 21, 255) : (%d, %d, %d, %d)", \
                                                          color3.red, color3.green, \
                                                          color3.blue, color3.alpha
    //print "Hex property: %s", color1.string()
    //var darkBlue = new soy.atoms.Color.named("dark blue")
    //print "Named colors (dark blue): (%d, %d, %d, %d)", \
    //                                                      darkBlue.red, darkBlue.green, \
    //                                                      darkBlue.blue, darkBlue.alpha */
    //var red = new soy.atoms.Color.named("red")
    //print "Named colors (red): (%d, %d, %d, %d)", \
    //                                                      red.red, red.green, \
    //                                                      red.blue, red.alpha

    // comparison tests
    var white = new soy.atoms.Color.named("white")
    var purple = new soy.atoms.Color.named("purple")
    var cmp_color2 = new soy.atoms.Color(230, 230, 230)
    cmp_result : string

    if (soy.atoms.Color.cmp_eq(purple, white))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: purple == white: %s", cmp_result

    if (soy.atoms.Color.cmp_eq(white, white))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: whtie == white: %s", cmp_result

    if (soy.atoms.Color.cmp_ne(cmp_color2, white))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: (230, 230, 230) != white: %s", cmp_result

    if (soy.atoms.Color.cmp_ne(cmp_color2, cmp_color2))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: (230, 230, 230) != (230, 230, 230): %s", cmp_result

    var scene = new soy.scenes.Room(2.0f)
    if (soy.atoms.Color.cmp_ne(white, scene))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: soy.atoms.Color != soy.scenes.Room: %s", cmp_result

    if (soy.atoms.Color.cmp_eq(white, scene))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: soy.atoms.Color == soy.scenes.Room: %s", cmp_result
    
    // test soy.atoms.Color.cmp(left, right, comparison)
    
    if (soy.atoms.Color.cmp(white, white, soy.Comparison.EQ))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white == white: %s", cmp_result

    if (soy.atoms.Color.cmp(white, purple, soy.Comparison.EQ))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white == purple: %s", cmp_result

    if (soy.atoms.Color.cmp(cmp_color2, white, soy.Comparison.NE))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: (230, 230, 230) != white: %s", cmp_result

    if (soy.atoms.Color.cmp(cmp_color2, cmp_color2, soy.Comparison.NE))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: (230, 230, 230) != (230, 230, 230): %s", cmp_result

    if (soy.atoms.Color.cmp(white, white, soy.Comparison.GT))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white > white: %s", cmp_result
    
    if (soy.atoms.Color.cmp(white, purple, soy.Comparison.GT))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white > purple: %s", cmp_result

    if (soy.atoms.Color.cmp(white, purple, soy.Comparison.LT))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white < purple: %s", cmp_result

    if (soy.atoms.Color.cmp(white, white, soy.Comparison.GE))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white >= white: %s", cmp_result
    
    if (soy.atoms.Color.cmp(white, purple, soy.Comparison.GE))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white >= purple: %s", cmp_result

    if (soy.atoms.Color.cmp(white, purple, soy.Comparison.LE))
        cmp_result = "True"
    else
        cmp_result = "False"
    print "Comparison: white <= purple: %s", cmp_result
