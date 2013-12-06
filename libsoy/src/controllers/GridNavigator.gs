/*
 *  libsoy - soy.controllers.GridNavigator
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

class soy.controllers.GridNavigator : soy.controllers.BaseNavigator

    construct (scene : soy.scenes.Scene, controlled : soy.bodies.Body, speed : float, fuzziness : float, granularity : float, end : soy.atoms.Position, updates : bool, paused : bool)
        with_graph(scene, controlled, speed, fuzziness, new soy.controllers.graph.Grid(scene, granularity), end, updates, paused)

    construct with_graph (scene       : soy.scenes.Scene,
                          controlled  : soy.bodies.Body,
                          speed       : float,
                          fuzziness   : float, 
                          graph       : soy.controllers.graph.IGraph,
                          end         : soy.atoms.Position, 
                          updates     : bool,
                          paused      : bool)
        super(scene, controlled,speed,fuzziness,graph,end,updates,paused)

