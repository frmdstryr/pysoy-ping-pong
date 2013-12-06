/*
 *  libsoy - soy.controllers.graph.Grid
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
    soy.atoms
    Gee


interface soy.controllers.graph.INode : Object
    //the position this node represents
    prop abstract readonly position : soy.atoms.Position
    def abstract get_edges() : Gee.List of soy.controllers.graph.Edge


/*
 * This is the struct used to hold values for dijkstra's algorithm.
 */
class soy.controllers.graph.Edge
    distance : float
    total_cost : float = 0
    begin    : unowned soy.controllers.graph.INode
    end      : unowned soy.controllers.graph.INode

    construct (dist : float, begin : soy.controllers.graph.INode, end : soy.controllers.graph.INode)
        self.distance = dist
        self.begin = begin
        self.end   = end

/*
 * This is the interface that the implementation of Dijkstra's algorithm 
 * uses. The way the graph is constructed is implementation defined.
 * 
 * The use of an IGraph is the only allowed method for the creation of INodes.
 */
interface soy.controllers.graph.IGraph : Object
    
    /*
     * This must take in a position and return the collection of edges 
     * adjacent to that position. If the position given is not on the graph 
     * it must return the set of edges adjacent to the nearest point that 
     * is on the graph.
     */
    //def abstract get_edges(n1 : soy.atoms.Position) : Gee.Collection of soy.controllers.graph.IEdge

    /*
     * This takes in a position and returns the node closest to this position.
     * N.B. If a and b are represented by the same node on the graph than 
     *      get_node(a) == get_node(b) must be true, even if a != b.
     */
    def abstract get_node(pos : soy.atoms.Position) : soy.controllers.graph.INode

    /*
     * This takes in a position and requests that the graph add a node to itself at precisely the given position.
     *
     * This request may be ignored, in which case it should return the same as get_node.
     * This method returns a node on the graph that either represents exactly the position given or is the same as the
     * output to get_node
     */
    def abstract add_terminal_node(pos : soy.atoms.Position) : soy.controllers.graph.INode

    /*
     * This must be a function that will shell out to the appropriate scene method to check for collisions
     */
    def abstract check_collisions(start : soy.atoms.Position, ends : array of soy.atoms.Position) : array of bool 
