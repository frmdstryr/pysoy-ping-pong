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
    ode
    Gee 
    soy

class soy.controllers.graph.Grid : soy.controllers.graph.AbstractGraph implements soy.controllers.graph.IGraph
    _granularity : float 
    _center      : soy.atoms.Position
    _memoizer    : Gee.HashMap of soy.controllers.graph._grid.OffsetPair, soy.controllers.graph._grid.IntNode
    _terminals   : Gee.HashMultiMap of soy.controllers.graph._grid.OffsetPair, soy.controllers.graph._grid.TerminalNode

    init
        _memoizer    = new Gee.HashMap of soy.controllers.graph._grid.OffsetPair, soy.controllers.graph._grid.IntNode (
            _memo_key_hash, _memo_key_eq, _memo_value_eq)
        _terminals   = new Gee.HashMultiMap of soy.controllers.graph._grid.OffsetPair,soy.controllers.graph._grid.TerminalNode(
            _memo_key_hash, _memo_key_eq)

    /*
     * the scene is the soy.scenes.Scene that is being simulated.
     *
     * The granularity is the distance between adjacent points in the grid along
     * one of the axes. The granularity must be a non-negative, non-zero real 
     * number.
     * 
     * The optional center parameter is the point around which the graph is constructed
     */
    construct (scene       : soy.scenes.Scene,
               granularity : float,
               center      : soy.atoms.Position? = null)
        _default(scene, granularity, -1.0f, null, center)

    construct _default(scene : soy.scenes.Scene,
                       granularity : float,
                       radius : float,
                       size : soy.atoms.Size?,
                       center      : soy.atoms.Position?)
        assert granularity > 0
        super(scene, radius, size)
        _granularity = granularity
        _center      = (center is null) ? new soy.atoms.Position(0.0f,0.0f,1.0f) : center

    construct with_radius(scene       : soy.scenes.Scene,
                          granularity : float,
                          radius      : float,
                          center      : soy.atoms.Position? = null)
        _default(scene, granularity, radius, null,
                 (center is null) ? new soy.atoms.Position(0.0f,0.0f,(radius > 0) ? radius : 1.0f) : center)


    construct with_size(scene       : soy.scenes.Scene,
                        granularity : float,
                        size        : soy.atoms.Size,
                        center      : soy.atoms.Position? = null)
        _default(scene, granularity, -1.0f, size,
                 (center is null) ? new soy.atoms.Position(0.0f, 0.0f, size.depth/2.0f) : center)
                          

    /*
     * Add a node that is not on a grid-point for use as terminals. It will be connected to the four nearest
     * grid-point nodes. 
     * 
     * return a reference to this node
     */
    /* TODO Should this (and get_node etc) return unowned refferences? */
    def virtual add_terminal_node(pos : soy.atoms.Position) : soy.controllers.graph.INode
        tmp_x : float = (pos.x - self.center.x)/self.granularity
        tmp_y : float = (pos.y - self.center.y)/self.granularity
        x_floor : int = (int)Math.floorf(tmp_x)
        y_floor : int = (int)Math.floorf(tmp_y)
        if ((float)x_floor) == tmp_x and ((float)y_floor) == tmp_y
            /* Already on a grid-point so just return that node */
            return self.get_node_with_offset(x_floor,y_floor)
        connected : array of soy.controllers.graph._grid.OffsetPair = {
                new soy.controllers.graph._grid.OffsetPair(x_floor,     y_floor),
                new soy.controllers.graph._grid.OffsetPair(x_floor + 1, y_floor),
                new soy.controllers.graph._grid.OffsetPair(x_floor,     y_floor + 1),
                new soy.controllers.graph._grid.OffsetPair(x_floor + 1, y_floor + 1)}
        var node = new soy.controllers.graph._grid.TerminalNode(self, pos, connected)

        /* Make sure terminal nodes that are connected to the same 4 grid-points are connected to each other */
        maybe_other_terms : bool = true
        other_terminals_populated : bool = false
        other_terminals : Gee.Collection of soy.controllers.graph._grid.TerminalNode = new Gee.HashSet of soy.controllers.graph._grid.TerminalNode()
        for var offset in connected
            /* check to make sure other terminalNodes in this square are connected to each other */
            if maybe_other_terms
                if not(self._terminals.contains(offset))
                    /* nothing at this offset so cannot be other terminalNodes in this square */
                    maybe_other_terms = false
                else if not(other_terminals_populated) 
                    /* this is the first iteration */
                    other_terminals.add_all(self._terminals[offset])
                    other_terminals_populated = true
                else if other_terminals.is_empty
                    /* already checked if first run, and since empty can stop checking */
                    maybe_other_terms = false
                else
                    other_terminals.retain_all(self._terminals[offset])

            /* add the node at all offsets so everything will be connected up good */
            self._terminals.set(offset, node)

        if maybe_other_terms and not(other_terminals.is_empty)
            for var nd2 in other_terminals
                nd2.add_connection(node)
                node.add_connection(nd2)

        return node

    //
    // IGraph implementation
    
    def get_node(pos : soy.atoms.Position) : soy.controllers.graph.INode
        return self._do_get_node_with_offset(self.convert_to_offset(pos))

    def get_node_with_offset(x_offset : int,
                             y_offset : int) : soy.controllers.graph._grid.IntNode
        var key = new soy.controllers.graph._grid.OffsetPair(x_offset, y_offset)
        return self._do_get_node_with_offset(key)

    //
    // Other stuff

    def _do_get_node_with_offset(key : soy.controllers.graph._grid.OffsetPair) : soy.controllers.graph._grid.IntNode
        nd : soy.controllers.graph._grid.IntNode
        if self._memoizer.has_key(key)
            nd = self._memoizer[key]
        else
            nd = new soy.controllers.graph._grid.IntNode.with_OffsetPair(self, key)
            self._memoizer[key] = nd
        var terminals = self._terminals[key]
        if terminals.size == 0
            return nd
        else
            for var term in terminals
                nd.add_connection(term)
            return nd

    //
    // center property        
    prop readonly center : soy.atoms.Position
        get
            return self._center
//        set 
//            self._reset_memoizer() 
//            // do i need to do anything else?
//            self._center = value

    //
    // granularity property
    prop readonly granularity : float 
        get 
            return self._granularity
//        set
//            assert value > 0
//            self._reset_memoizer()
//            self._granularity = value

    def convert_to_offset(pos : soy.atoms.Position) : soy.controllers.graph._grid.OffsetPair
        tmp_x : float = (pos.x - self.center.x)/self.granularity
        tmp_y : float = (pos.y - self.center.y)/self.granularity
        return new soy.controllers.graph._grid.OffsetPair((int)Math.roundf(tmp_x), 
                                                          (int)Math.roundf(tmp_y))
        

    //
    // Memoizer functions

//    def _reset_memoizer()
//        // TODO this should also destroy all edges and nodes
//        self._memoizer = new Gee.HashMap of soy.controllers.graph._grid.OffsetPair, soy.controllers.graph._grid.IntNode (
//            self._memo_key_hash, self._memo_key_eq, self._memo_value_eq)
//

    def static _memo_key_hash(key : soy.controllers.graph._grid.OffsetPair*) : uint
        var k = (soy.controllers.graph._grid.OffsetPair*)key
        return soy.controllers.graph._grid.OffsetPair.offset_hash(k->x, k->y)

    def static _memo_key_eq(k1 : soy.controllers.graph._grid.OffsetPair*, k2 : soy.controllers.graph._grid.OffsetPair*) : bool
        return k1->x == k2->x and k1->y == k2->y

    /* Do I even need this, memoization means that == should be good enough? */
    def static _memo_value_eq(val1 : void*, val2 : void*) : bool
        var v1 = (soy.controllers.graph._grid.IntNode*)val1
        var v2 = (soy.controllers.graph._grid.IntNode*)val2
        return v1->x == v2->x and v1->y==v2->y
        //return v1->equal_to(*v2)

// struct used as key for graph memoizer
class soy.controllers.graph._grid.OffsetPair : Object
    x : int
    y : int
    construct (x : int, y : int)
        self.x = x
        self.y = y
    
    def hash() : uint
        return offset_hash(x,y)

    def static offset_hash(x : int, y : int) : int
        p1 : int = 3571 //the 500th prime number
        return p1*x + y 

/* 
 * This represents a location which is held using the integer
 * representation closest to the position on the grid of the position. 
 *
 * This means that if the grid is along the x,y plane and granularity = .1 then
 * the point (.3,.42,1.43) will be represented as (3,4,1.43).
 */
class soy.controllers.graph._grid.IntNode : Object implements soy.controllers.graph.INode
    _x : int
    _y : int
    _position : soy.atoms.Position
    _graph : unowned soy.controllers.graph.Grid
    _connections : Gee.HashSet of unowned soy.controllers.graph.INode
    
    construct (graph : soy.controllers.graph.Grid,
               pos : soy.atoms.Position)
        with_OffsetPair(graph, graph.convert_to_offset(pos))

    construct with_OffsetPair(graph : soy.controllers.graph.Grid,
                              offset : soy.controllers.graph._grid.OffsetPair)
        with_int_offset(graph, offset.x, offset.y)

    construct with_int_offset(graph : soy.controllers.graph.Grid,
                              x_offset : int,
                              y_offset : int)
        self._x = x_offset
        self._y = y_offset
        self._graph = graph
        self._connections = new Gee.HashSet of unowned soy.controllers.graph.INode()
        self._position = new soy.atoms.Position(
                                    ((float)self.x)*((float)self._graph.granularity) + self._graph.center.x,
                                    ((float)self.y)*((float)self._graph.granularity) + self._graph.center.y,
                                    self._graph.center.z)
       
    prop readonly x : int
        get
            return self._x

    prop readonly y : int
        get
            return self._y

    def virtual add_connection(other : soy.controllers.graph.INode) : void
        if not(self._connections.contains(other))
            self._connections.add(other)        

    //
    // Implement INode

    prop readonly position : soy.atoms.Position
        get
            return self._position
    
    def virtual get_edges() : Gee.List of soy.controllers.graph.Edge
        diag : float = Math.hypotf(self._graph.granularity, self._graph.granularity)
        flat : float = self._graph.granularity
        var lst = new Gee.LinkedList of soy.controllers.graph.Edge ()
        poss : array of soy.atoms.Position = new array of soy.atoms.Position[8 + self._connections.size]
        cnt : int = 0
        // Create initial list of possible links
        for var i = -1 to 1
            for var j = -1 to 1
                dist : float
                if i==0 or j==0
                    if i == j 
                        continue
                    else
                        dist = flat
                else
                    dist = diag
                var node = self._graph.get_node_with_offset(self.x + i, self.y + j)
                poss[cnt] = node.position
                cnt++
                lst.add(new soy.controllers.graph.Edge(dist, self, node))

        for var node in self._connections
            poss[cnt] = node.position
            dist : float = Math.hypotf(Math.hypotf(self._position.x - node.position.x, self._position.y - node.position.y),
                                       self._position.z - node.position.z)
            lst.add(new soy.controllers.graph.Edge(dist, self, node))
            cnt++
        
        // Determine those that are unreachable
        blocked : array of bool = self._graph.check_collisions(self._position, poss)

        /* remove blocked edges, (done like this because cannot step backwards and this way means no fooling around with index) */
        cnt--
        while cnt >= 0 
            if blocked[cnt]
                lst.remove_at(cnt)
            cnt--
        return lst

    //
    // Implement Hashable

    // return the hash of the x and y numbers (can ignore the z since that is 
    // orthogonal to the plane we are working on and does not matter).
    def inline virtual hash() : uint
        return soy.controllers.graph._grid.OffsetPair.offset_hash(self.x, self.y)

    //
    // Static Methods

class soy.controllers.graph._grid.TerminalNode : Object implements soy.controllers.graph.INode
    
    _graph : unowned soy.controllers.graph.Grid
    _position : soy.atoms.Position
    _grid_nodes : array of soy.controllers.graph._grid.OffsetPair
    _connections : Gee.HashSet of unowned soy.controllers.graph.INode

    construct (graph : soy.controllers.graph.Grid,
               pos   : soy.atoms.Position,
               connected : array of soy.controllers.graph._grid.OffsetPair)
        _graph = graph
        _position = pos
        _grid_nodes = connected
        _connections = new Gee.HashSet of unowned soy.controllers.graph.INode

    prop readonly position : soy.atoms.Position
        get
            return self._position

    def virtual get_edges() : Gee.List of soy.controllers.graph.Edge
        var lst = new Gee.LinkedList of soy.controllers.graph.Edge ()
        poss : array of soy.atoms.Position = new array of soy.atoms.Position[self._grid_nodes.length + self._connections.size]
        cnt : int = 0
        for var offset in self._grid_nodes
            var node = self._graph.get_node_with_offset(offset.x, offset.y)
            poss[cnt] = node.position
            dist : float = Math.hypotf(self._position.x - node.position.x, self._position.y - node.position.y)
            lst.add(new soy.controllers.graph.Edge(dist, self, node))
            cnt++

        for var node in self._connections
            poss[cnt] = node.position
            dist : float = Math.hypotf(self._position.x - node.position.x, self._position.y - node.position.y)
            lst.add(new soy.controllers.graph.Edge(dist, self, node))
            cnt++

        // Determine those that are unreachable
        blocked : array of bool = self._graph.check_collisions(self._position, poss)

        /* remove blocked edges, (done like this because cannot step backwards and this way means no fooling around with index) */
        cnt--
        while cnt >= 0 
            if blocked[cnt]
                lst.remove_at(cnt)
            cnt--
        return lst

    def virtual add_connection(other : soy.controllers.graph.INode) : void
        if not(self._connections.contains(other))
            self._connections.add(other)

