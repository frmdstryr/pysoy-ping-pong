/*
 *  libsoy - soy.controllers.graph.Pathfinder
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
    Gee

class soy.controllers.graph.Pathfinder : Object

    _max_tries : uint = 50000
    _tries   : uint   = 0

    _end     : soy.controllers.graph.INode
    _start   : soy.controllers.graph.INode
    _closest : soy.controllers.graph.INode
    _closest_dist : float
    _prev_dist    : float
    _graph   : soy.controllers.graph.IGraph
    _scene   : soy.scenes.Scene
    _queue   : Gee.PriorityQueue of soy.controllers.graph.Edge

    // This maps a node to the length of the shortest path from start to that node.
    _best_length : Gee.HashMap of soy.controllers.graph.INode, float?

    // This maps a node to the edge in the shortest path from start to it that the node is on.
    _best_path   : Gee.HashMap of soy.controllers.graph.INode, soy.controllers.graph.Edge

    construct (scene : soy.scenes.Scene, start : soy.atoms.Position, end : soy.atoms.Position, graph : soy.controllers.graph.IGraph)
        self._graph = (soy.controllers.graph.IGraph)graph
        self._end = self._graph.add_terminal_node(end)
        self._start = self._graph.add_terminal_node(start)
        self._closest = self._start
        self._closest_dist = _calc_dist(self._start.position, self._end.position)
        self._prev_dist = self._closest_dist
        self._scene = scene
        self._queue = new Gee.PriorityQueue of soy.controllers.graph.Edge((CompareFunc of soy.controllers.graph.Edge)_compare_edges)
        /* can use these since there is a gaurentee that IGraph will memoize */
        self._best_path   = new Gee.HashMap of soy.controllers.graph.INode, soy.controllers.graph.Edge()
        self._best_length = new Gee.HashMap of soy.controllers.graph.INode, float?

    /*
     * return 1 if e1 is farther from start then e2, 0 if same distance and -1 if e2 is farther then e1
     */
    //TODO This should probably be in soy.controllers.graph.Edge
    def static _compare_edges(e1 : soy.controllers.graph.Edge, e2 : soy.controllers.graph.Edge) : int
        /* maybe?*/
        var diff = e1.total_cost - e2.total_cost
        if diff > 0
            return 1
        else if diff == 0
            return 0
        else 
            return -1

    /* 
     * Use find_closest to fill up the best_path map and then backtrace it to find
     * the best path from start to end. Return this path.
     */
    def get_path() : Gee.List of soy.atoms.Position
        var ret = new Gee.LinkedList of soy.atoms.Position
        cur : soy.controllers.graph.INode = find_closest()
        ret.offer_head(cur.position)
        while self._best_path.has_key(cur)
            cur = self._best_path[cur].begin
            ret.offer_head(cur.position)
        return ret

    /*
     * Will find the best path from start to end and then remove intermediate steps that can be skipped 
     * without hitting any obstructions.
     */
    def get_optimized_path() : Gee.List of soy.atoms.Position
        raw_path : Gee.ArrayList of soy.atoms.Position = new Gee.ArrayList of soy.atoms.Position()
        raw_path.add_all(self.get_path())
        var ret = new Gee.LinkedList of soy.atoms.Position()
        cur_index : int = 0
        len : int = raw_path.size
        ret.add(raw_path.get(0))
        while cur_index < (len-1)
            finished : bool = true
            blocked : array of bool = self._graph.check_collisions(raw_path.get(cur_index), 
                                                                   raw_path.slice(cur_index + 2, len).to_array())
            blen : int = blocked.length
            //FIXME It might be better to go backwards checking blocked, however forwards is probably faster...
            for var i = 0 to (blen - 1)
                if blocked[i]
                    finished = false
                    cur_index = cur_index + i + 1
                    ret.add(raw_path.get(cur_index))
                    break 
            if finished
                ret.add(raw_path.last())
                break
        return ret

    /*
     * Get the node closest to end that is reachable from start.
     * This will fill best_path with the next link in the chain leading back
     * to start from the given location.
     */
    def find_closest() : soy.controllers.graph.INode
        self._best_length.set(self._start, 0.0f)
        next : soy.controllers.graph.INode = self._start
        while true
            if self._best_path.has_key(self._end)
                /* Have found solution */
                return self._end
            if self._tries > self._max_tries
                /* tried for a while without improvement, calling this impossible */
                return self._closest

            self._add_to_queue(next)

            if self._queue.is_empty
                /* all possible paths exhausted */
                return self._closest

            next = self._queue.poll().end

            next_dist : float = _calc_dist(next.position, self._end.position)
            if next_dist < self._closest_dist
                self._tries = 0
                self._closest_dist = next_dist
                self._prev_dist = next_dist
                self._closest = next
            else if next_dist < self._prev_dist
                self._prev_dist = next_dist
            else
                /* this path got us no closer then last one, we might be in impossible situation. */
                self._tries++


    def _add_to_queue(node : soy.controllers.graph.INode)
        var edges = node.get_edges()
        var best_len = self._best_length[node]
        for var ed in edges
            var new_len = best_len + ed.distance
            if ed.end in self._best_length.keys
                if self._best_length[ed.end] > new_len
                    self._best_length[ed.end] = new_len
                    self._best_path[ed.end] = ed
                else
                    /* already gotten to the node at other end of this edge in a faster manner, skip it */
                    continue
            else
                self._best_length[ed.end] = new_len
                self._best_path[ed.end] = ed
            

            ed.total_cost = new_len + _calc_dist(ed.end.position, self._end.position)
            self._queue.add(ed)
        return

    def inline _calc_dist(p1 : soy.atoms.Position, p2 : soy.atoms.Position) : float
        return Math.hypotf(Math.hypotf(p1.x - p2.x, p1.y - p2.y), p1.z - p2.z)

    def static find_path(scene : soy.scenes.Scene, begin : soy.atoms.Position, end : soy.atoms.Position) : Gee.List of soy.atoms.Position
        var pfinder = new soy.controllers.graph.Pathfinder(
                                scene, begin, end, new soy.controllers.graph.Grid(scene, Math.hypotf(begin.x - end.x, begin.y - end.y)/50.0f))
        return pfinder.get_path() 

    def static find_path_with_graph(scene : soy.scenes.Scene, 
                                    begin : soy.atoms.Position, 
                                    end   : soy.atoms.Position, 
                                    graph : soy.controllers.graph.IGraph) : Gee.List of soy.atoms.Position
        var pfinder = new soy.controllers.graph.Pathfinder(scene, begin, end, graph)
        return pfinder.get_path() 

    def static find_optimized_path(scene : soy.scenes.Scene, begin : soy.atoms.Position, end : soy.atoms.Position, graph : soy.controllers.graph.IGraph) : Gee.List of soy.atoms.Position
        var pfinder = new soy.controllers.graph.Pathfinder(scene, begin, end, graph)
        return pfinder.get_optimized_path() 


//    def _find_best_path(begin : soy.controllers.graph.INode) : soy.controllers.graph.Edge
//        print "Not implemented _find_best_path"
//        return new soy.controllers.graph.Edge(0,begin,_end)
    
        

    def tp_repr() : string
        return "Pathfinder"   
