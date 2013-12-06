/*
 *  libsoy tests - graphsTest (graphsTest.gs)
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
    ode
    Gee

print_success : bool = false
prev_failed : int? = null
cnt      : int = 0
cnt_g    : int = 0
failed   : int = 0
failed_g : int = 0
name_g   : string? = null


init
    ode.InitODE()
    /* DECLARATIONS */
    var cent_pos = new soy.atoms.Position(0.0f,0.0f,1.0f)
    var b1 = new soy.atoms.Position( 3.0f,  0.0f, 1.0f)
    var b2 = new soy.atoms.Position( 1.2f,  0.5f, 1.0f)
    var b3 = new soy.atoms.Position( 1.2f,  0.5f, 1.0f)
    var b4 = new soy.atoms.Position( 0.0f, -3.0f, 1.0f)
    var b5 = new soy.atoms.Position( 0.4f, -1.2f, 1.0f)
    var b6 = new soy.atoms.Position( 0.5f, -0.7f, 1.0f)

    var c1 = new soy.atoms.Position( 0.0f,  1.0f, 1.0f)
    var c2 = new soy.atoms.Position( 0.5f,  0.0f, 1.0f)
    var c3 = new soy.atoms.Position( 0.0f, -0.3f, 1.0f)
    var c4 = new soy.atoms.Position( 1.0f,  3.0f, 1.0f)
    var c5 = new soy.atoms.Position(-3.0f,  1.0f, 1.0f)

    var scene  = new soy.scenes.Scene()
    var scene_empty = new soy.scenes.Scene()
    var scene_empty2 = new soy.scenes.Scene()
    var ob1  = new soy.bodies.Box(scene)        
    ob1.size = new soy.atoms.Size(0.9f,0.9f,2)
    ob1.position = new soy.atoms.Position(1.5f, 0.0f, 1.0f)

    var ob2  = new soy.bodies.Box(scene)        
    ob2.size = new soy.atoms.Size(0.9f,0.9f,2)
    ob2.position = new soy.atoms.Position(0.0f, -1.0f, 1.0f)

    var graph1 = new soy.controllers.graph.Grid(scene, 1.0f)
    var graph2 = new soy.controllers.graph.Grid(scene, 0.25f, c2)
    var graph3 = new soy.controllers.graph.Grid.with_radius(scene, 0.25f, 0.1f)
    var graph4 = new soy.controllers.graph.Grid(scene, 4.0f)
    var graph5 = new soy.controllers.graph.Grid(scene_empty2, 1.0f)
    var graph6 = new soy.controllers.graph.Grid.with_size(scene, 4.0f, new soy.atoms.Size(1.0f, 1.0f, 1.0f))
    var graphTerm1 = new soy.controllers.graph.Grid(scene_empty, 1.0f)
    var graphTerm2 = new soy.controllers.graph.Grid(scene, 3.0f)


 /////////////////////////////////////////////////////////////////////////////////////////
 // 0

    begin_group("scene.check_path_collision")

    check_expect_bool(scene.check_path_collision(cent_pos, b1), true)
    check_expect_bool(scene.check_path_collision(b1, cent_pos), true)
    check_expect_bool(scene.check_path_collision(cent_pos, c1), false)
    check_expect_bool(scene.check_path_collision(c1, cent_pos), false)
    check_expect_bool(scene.check_path_collision(c4, cent_pos), false)

 /////////////////////////////////////////////////////////////////////////////////////////
 // 5

    check_expect_bool(scene.check_path_collision(c5, b1),       true)
    check_expect_bool(scene.check_path_collision(b1, c5),       true)
    check_expect_bool(scene.check_path_collision(c1, c3),       false)
    check_expect_bool(scene.check_path_collision(c3, c1),       false)
    check_expect_bool(scene.check_path_collision(b3, b1),       true)


 /////////////////////////////////////////////////////////////////////////////////////////
 // 10

    begin_group("scene.check_collisions")

    check_expect_boolarray(scene.check_collisions(cent_pos, {c1, c3, b1, c5}), 
                           {false, false, true, false})
    check_expect_boolarray(scene.check_collisions(cent_pos, {b1, b3, c1, c5, b4}), 
                           {true, true, false, false, true})
    check_expect_boolarray(scene.check_collisions(cent_pos, {c1, c3, c2, c5}), 
                           {false, false, false, false})
    check_expect_boolarray(scene.check_collisions(cent_pos, {b2, b3, b1, b5}), 
                           {true, true, true, true})
    check_expect_boolarray(scene.check_collisions(cent_pos, {b1, b1}), 
                           {true, true})

 /////////////////////////////////////////////////////////////////////////////////////////
 // 15

    check_expect_boolarray(scene.check_collisions(cent_pos, {c1, c1}), 
                           {false, false})

    begin_group("Grid.get_node")

    check_expect_IntNode(graph1.get_node(new soy.atoms.Position()),
                         new soy.controllers.graph._grid.IntNode.with_int_offset(graph1,0,0))
    check_expect_IntNode(graph1.get_node(c1), 
                         new soy.controllers.graph._grid.IntNode.with_int_offset(graph1,0,1))    
    check_expect_IntNode(graph1.get_node(c3), graph1.get_node(new soy.atoms.Position()))
    check_expect_IntNode(graph1.get_node(new soy.atoms.Position(1.7f, -3.6f, 1.0f)),
                         new soy.controllers.graph._grid.IntNode.with_int_offset(graph1,2,-4))

 /////////////////////////////////////////////////////////////////////////////////////////
 // 20

    check_expect_IntNode(graph1.get_node(b6), new soy.controllers.graph._grid.IntNode.with_int_offset(graph1,1,-1))
    check_expect_IntNode(graph2.get_node(c2), new soy.controllers.graph._grid.IntNode.with_int_offset(graph2,0,0))
    check_expect_IntNode(graph2.get_node(b6), new soy.controllers.graph._grid.IntNode.with_int_offset(graph2,0,-3))
    check_expect_IntNode(graph2.get_node(c3), new soy.controllers.graph._grid.IntNode.with_int_offset(graph2,-2,-1))
    check_expect_IntNode(graph2.get_node(b1), new soy.controllers.graph._grid.IntNode.with_int_offset(graph2,10,0))

 /////////////////////////////////////////////////////////////////////////////////////////
 // 25

    begin_group("memoizing and get_node_with_offset")

    check_expect_id(graph2.get_node_with_offset(3,4), graph2.get_node_with_offset(3,4))
    check_expect_id(graph1.get_node_with_offset(2,6), graph1.get_node_with_offset(2,6))
    check_expect_id(graph1.get_node_with_offset(5,3), 
                    graph1.get_node(new soy.atoms.Position(5.1f, 3.2f, 1.0f)))
    check_expect_id(graph1.get_node(new soy.atoms.Position(7.2f, -4.6f, 1.0f)),
                    graph1.get_node(new soy.atoms.Position(6.9f, -5.2f, 1.0f)))
    check_expect_id(graph2.get_node(new soy.atoms.Position(7.24f, -4.53f, 1.0f)),
                    graph2.get_node(new soy.atoms.Position(7.26f, -4.5f,  1.0f)))

 /////////////////////////////////////////////////////////////////////////////////////////
 // 30

    begin_group("INode.get_edges")

    diag : float = Math.hypotf(0.25f, 0.25f)
    start : soy.controllers.graph.INode = graph3.get_node_with_offset(0,0)
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag,  start, graph3.get_node_with_offset(-1,-1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph3.get_node_with_offset(-1,0)),
                              new soy.controllers.graph.Edge(diag,  start, graph3.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph3.get_node_with_offset(0,-1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph3.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(diag,  start, graph3.get_node_with_offset(1,-1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph3.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(diag,  start, graph3.get_node_with_offset(1,1))}, 
                            start.get_edges())

    diag = Math.hypotf(1.0f, 1.0f)
    start = graph1.get_node_with_offset(0,0)
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag, start, graph1.get_node_with_offset(-1,-1)),
                              new soy.controllers.graph.Edge(1.0f, start, graph1.get_node_with_offset(-1,0)),
                              new soy.controllers.graph.Edge(diag, start, graph1.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(1.0f, start, graph1.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(diag, start, graph1.get_node_with_offset(1,-1)),
                              new soy.controllers.graph.Edge(1.0f, start, graph1.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(diag, start, graph1.get_node_with_offset(1,1))}, 
                             start.get_edges())

    diag = Math.hypotf(0.25f, 0.25f)
    start = graph2.get_node_with_offset(0,0) 
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag,  start, graph2.get_node_with_offset(-1,-1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph2.get_node_with_offset(-1,0)),
                              new soy.controllers.graph.Edge(diag,  start, graph2.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph2.get_node_with_offset(0,-1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph2.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(diag,  start, graph2.get_node_with_offset(1,-1)),
                              new soy.controllers.graph.Edge(0.25f, start, graph2.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(diag,  start, graph2.get_node_with_offset(1,1))}, 
                             start.get_edges())

    diag = Math.hypotf(0.25f, 0.25f)
    start = graph2.get_node_with_offset(2,1) /* (1,0.25,1) */
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag,  start, graph2.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(0.25f, start, graph2.get_node_with_offset(1,1)),
                              new soy.controllers.graph.Edge(diag,  start, graph2.get_node_with_offset(1,2)),
                              new soy.controllers.graph.Edge(0.25f, start, graph2.get_node_with_offset(2,0)),
                              new soy.controllers.graph.Edge(0.25f, start, graph2.get_node_with_offset(2,2))},
                             start.get_edges()) 

    diag = Math.hypotf(4.0f, 4.0f)
    start = graph4.get_node_with_offset(0,0)
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag, start, graph4.get_node_with_offset(1,1)),
                              new soy.controllers.graph.Edge(diag, start, graph4.get_node_with_offset(1,-1)),
                              new soy.controllers.graph.Edge(4.0f, start, graph4.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(diag, start, graph4.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(4.0f, start, graph4.get_node_with_offset(-1,0)),
                              new soy.controllers.graph.Edge(diag, start, graph4.get_node_with_offset(-1,-1))},
                             start.get_edges()) /* (1,0.25,1) */

 /////////////////////////////////////////////////////////////////////////////////////////
 // 35
    
    start = graph6.get_node_with_offset(0,0)
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag, start, graph6.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(4.0f, start, graph6.get_node_with_offset(0,1))},
                             start.get_edges()) /* (1,0.25,1) */

    diag = Math.hypotf(1.0f,1.0f)
    start = graph5.get_node_with_offset(0,0)
    var result = start.get_edges() //check order of exec does not matter
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag,  start, graph5.get_node_with_offset(-1,-1)),
                              new soy.controllers.graph.Edge(1.0f, start, graph5.get_node_with_offset(-1,0)),
                              new soy.controllers.graph.Edge(diag,  start, graph5.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(1.0f, start, graph5.get_node_with_offset(0,-1)),
                              new soy.controllers.graph.Edge(1.0f, start, graph5.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(diag,  start, graph5.get_node_with_offset(1,-1)),
                              new soy.controllers.graph.Edge(1.0f, start, graph5.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(diag,  start, graph5.get_node_with_offset(1,1))}, 
                             result)

    begin_group("correct linkage of terminals and IntNodes")
    var term1 = graphTerm1.add_terminal_node(new soy.atoms.Position(0.25f, 0.66f, 1.0f))
    check_expect_edgelist_id({new soy.controllers.graph.Edge(Math.hypotf(0.25f,0.66f), term1, graphTerm1.get_node_with_offset(0,0)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.75f,0.66f), term1, graphTerm1.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.25f,0.34f), term1, graphTerm1.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.75f,0.34f), term1, graphTerm1.get_node_with_offset(1,1))},
                             term1.get_edges())

    diag = Math.hypotf(1.0f, 1.0f)
    start = graphTerm1.get_node_with_offset(0,0)
    check_expect_edgelist_id({new soy.controllers.graph.Edge(diag, start, graphTerm1.get_node_with_offset(-1,-1)),
                              new soy.controllers.graph.Edge(1.0f, start, graphTerm1.get_node_with_offset(-1,0)),
                              new soy.controllers.graph.Edge(diag, start, graphTerm1.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(1.0f, start, graphTerm1.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(1.0f, start, graphTerm1.get_node_with_offset(0,-1)),
                              new soy.controllers.graph.Edge(diag, start, graphTerm1.get_node_with_offset(1,-1)),
                              new soy.controllers.graph.Edge(1.0f, start, graphTerm1.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(diag, start, graphTerm1.get_node_with_offset(1,1)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.25f,0.66f), start, term1)}, 
                             start.get_edges())

    check_expect_IntNode(graphTerm1.add_terminal_node(new soy.atoms.Position(0.0f,1.0f,1.0f)),
                         graphTerm1.get_node_with_offset(0,1))

/////////////////////////////////////////////////////////////////////////////////////////
// 40

    var term2 = graphTerm1.add_terminal_node(new soy.atoms.Position(0.75f,0.34f,1.0f))
    check_expect_edgelist_id({new soy.controllers.graph.Edge(Math.hypotf(0.25f,0.66f), term1, graphTerm1.get_node_with_offset(0,0)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.75f,0.66f), term1, graphTerm1.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.25f,0.34f), term1, graphTerm1.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.75f,0.34f), term1, graphTerm1.get_node_with_offset(1,1)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.5f, 0.32f), term1, term2)},
                             term1.get_edges())
    

    check_expect_edgelist_id({new soy.controllers.graph.Edge(Math.hypotf(0.25f,0.66f), term2, graphTerm1.get_node_with_offset(1,1)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.75f,0.66f), term2, graphTerm1.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.25f,0.34f), term2, graphTerm1.get_node_with_offset(1,0)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.75f,0.34f), term2, graphTerm1.get_node_with_offset(0,0)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.5f, 0.32f), term2, term1)},
                             term2.get_edges())
    
    //Test with obstructions
    var term3 = graphTerm2.add_terminal_node(new soy.atoms.Position(0.5f,1.0f,1.0f))
    check_expect_edgelist_id({new soy.controllers.graph.Edge(Math.hypotf(0.5f,1.0f), term3, graphTerm2.get_node_with_offset(0,0)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.5f,2.0f), term3, graphTerm2.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(Math.hypotf(2.5f,2.0f), term3, graphTerm2.get_node_with_offset(1,1))},
                             term3.get_edges())

    diag = Math.hypotf(3.0f,3.0f)
    start = graphTerm2.get_node_with_offset(0,0)
    check_expect_edgelist_id({new soy.controllers.graph.Edge(Math.hypotf(0.5f, 1.0f), start, term3),
                              new soy.controllers.graph.Edge(diag, start, graphTerm2.get_node_with_offset(-1,-1)),
                              new soy.controllers.graph.Edge(3.0f, start, graphTerm2.get_node_with_offset(-1,0)),
                              new soy.controllers.graph.Edge(diag, start, graphTerm2.get_node_with_offset(-1,1)),
                              new soy.controllers.graph.Edge(3.0f, start, graphTerm2.get_node_with_offset(0,1)),
                              new soy.controllers.graph.Edge(diag, start, graphTerm2.get_node_with_offset(1,1)),
                              new soy.controllers.graph.Edge(diag, start, graphTerm2.get_node_with_offset(1,-1))},
                             start.get_edges())

    var term4 = graphTerm1.add_terminal_node(new soy.atoms.Position(-12.2f, -21.6f, 1.0f))
    check_expect_edgelist_id({new soy.controllers.graph.Edge(Math.hypotf(0.2f,0.6f), term4, graphTerm1.get_node_with_offset(-12,-21)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.2f,0.4f), term4, graphTerm1.get_node_with_offset(-12,-22)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.8f,0.6f), term4, graphTerm1.get_node_with_offset(-13,-21)),
                              new soy.controllers.graph.Edge(Math.hypotf(0.8f,0.4f), term4, graphTerm1.get_node_with_offset(-13,-22))},
                             term4.get_edges())

    begin_group("Pathfinder.find_path_with_graph/find_path")
    /*44*/    
    var scene2 = new soy.scenes.Scene() 
    var wall1 = new soy.bodies.Box(scene2)
    wall1.position = new soy.atoms.Position(0.0f,2.5f,1.0f)
    wall1.size = new soy.atoms.Size(3.5f,0.5f,2.0f)
    
/////////////////////////////////////////////////////////////////////////////////////////
// 45

    /*                                            begin,          steps, distance, got */
    check_expect_dijkstras(new soy.atoms.Position(10.0f,0.0f,1.0f), 11, 10.0f,
                           soy.controllers.graph.Pathfinder.find_path_with_graph(scene_empty, 
                                                                                 new soy.atoms.Position(0.0f, 0.0f, 1.0f), 
                                                                                 new soy.atoms.Position(10.0f,0.0f,1.0f),
                                                                                 new soy.controllers.graph.Grid(scene_empty, 1.0f)))

    check_expect_dijkstras(new soy.atoms.Position(10.0f,10.0f,1.0f), 11, Math.hypotf(10.0f,10.0f),
                           soy.controllers.graph.Pathfinder.find_path_with_graph(scene_empty, 
                                                                                 new soy.atoms.Position(0.0f, 0.0f, 1.0f), 
                                                                                 new soy.atoms.Position(10.0f,10.0f,1.0f),
                                                                                 new soy.controllers.graph.Grid(scene_empty, 1.0f)))
    var room   = new soy.scenes.Room(5.0f)
    check_expect_dijkstras(new soy.atoms.Position(5.0f,5.0f,1.0f), 6, Math.hypotf(5.0f,5.0f),
                           soy.controllers.graph.Pathfinder.find_path_with_graph(room, 
                                                                                 new soy.atoms.Position(0.0f, 0.0f, 1.0f), 
                                                                                 new soy.atoms.Position(10.0f,10.0f,1.0f),
                                                                                 new soy.controllers.graph.Grid(room, 1.0f)))

    check_expect_dijkstras(new soy.atoms.Position(0.0f,3.0f,1.0f), 6, 3.0f + 2*Math.hypotf(1.0f,1.0f),
                           soy.controllers.graph.Pathfinder.find_path_with_graph(scene2, 
                                                                                 new soy.atoms.Position(0.0f,0.0f,1.0f), 
                                                                                 new soy.atoms.Position(0.0f, 3.0f, 1.0f),
                                                                                 new soy.controllers.graph.Grid(scene2, 1.0f)))

    var scene3 = new soy.scenes.Scene()
    var box1   = new soy.bodies.Box(scene3)
    box1.size = new soy.atoms.Size(3.1f,3.1f,2.0f)
    box1.position = new soy.atoms.Position(0.0f,0.0f,1.0f)

    /* Check will give up on impossible ones */
    check_expect_dijkstras(new soy.atoms.Position(0.0f,2.0f,1.0f), 4, 3.0f,
                           soy.controllers.graph.Pathfinder.find_path_with_graph(scene3, 
                                                                                 new soy.atoms.Position(0.0f,5.0f,1.0f), 
                                                                                 new soy.atoms.Position(0.0f, 0.0f, 1.0f),
                                                                                 new soy.controllers.graph.Grid(scene3, 1.0f)))

/////////////////////////////////////////////////////////////////////////////////////////
// 50
    
    check_expect_dijkstras(new soy.atoms.Position(0.0f,-2.0f,1.0f), 9, 8.0f,
                           soy.controllers.graph.Pathfinder.find_path_with_graph(scene3, 
                                                                                 new soy.atoms.Position(0.0f,2.0f,1.0f), 
                                                                                 new soy.atoms.Position(0.0f, -1.0f, 1.0f),
                                                                                 new soy.controllers.graph.Grid(scene3, 1.0f)))

    check_expect_dijkstras(new soy.atoms.Position(0.1f,-2.1f,1.0f), 5, 2.0f + 2*Math.hypotf(0.1f,0.1f),
                           soy.controllers.graph.Pathfinder.find_path_with_graph(scene_empty, 
                                                                                 new soy.atoms.Position(0.1f,0.1f,1.0f), 
                                                                                 new soy.atoms.Position(0.1f,-2.1f, 1.0f),
                                                                                 new soy.controllers.graph.Grid(scene_empty, 1.0f)))

    check_expect_dijkstras(new soy.atoms.Position(100.0f,0.0f,1.0f), 51, 100.0f,
                           soy.controllers.graph.Pathfinder.find_path(scene_empty2, new soy.atoms.Position(0.0f,0.0f,1.0f), new soy.atoms.Position(100.0f,0.0f,1.0f)))
    
    check_expect_dijkstras(new soy.atoms.Position(0.0f,-2.0f,1.0f), 8, 7.0f,
                           soy.controllers.graph.Pathfinder.find_path_with_graph(scene3, 
                                                                                 new soy.atoms.Position(1.0f,2.0f,1.0f), 
                                                                                 new soy.atoms.Position(0.0f, -1.0f, 1.0f),
                                                                                 new soy.controllers.graph.Grid(scene3, 1.0f)))

    begin_group("Pathfinder.find_optimized_path")

    check_expect_dijkstras(new soy.atoms.Position(10.0f,1.0f,1.0f), 2, Math.hypotf(1.0f, 10.0f),
                           soy.controllers.graph.Pathfinder.find_optimized_path(scene_empty, new soy.atoms.Position(0.0f,0.0f,1.0f),
                                                                                new soy.atoms.Position(10.0f, 1.0f, 1.0f),
                                                                                new soy.controllers.graph.Grid(scene_empty, 1.0f)))

/////////////////////////////////////////////////////////////////////////////////////////
// 55
    
    check_expect_dijkstras(new soy.atoms.Position(10.0f,1.0f,1.0f), 2, Math.hypotf(1.0f, 10.0f),
                           soy.controllers.graph.Pathfinder.find_optimized_path(scene_empty, new soy.atoms.Position(0.0f,0.0f,1.0f),
                                                                                new soy.atoms.Position(10.0f, 1.0f, 1.0f),
                                                                                new soy.controllers.graph.Grid(scene_empty, 1.0f)))

    check_expect_dijkstras(new soy.atoms.Position(2.0f, 4.0f, 1.0f), 3, Math.hypotf(2.0f, 2.0f) + 2.0f,
                           soy.controllers.graph.Pathfinder.find_optimized_path(scene2, new soy.atoms.Position(0.0f,0.0f,1.0f),
                                                                                new soy.atoms.Position(2.0f, 4.0f, 1.0f),
                                                                                new soy.controllers.graph.Grid(scene2, 1.0f)))

    check_expect_dijkstras(new soy.atoms.Position(2.1f, 4.3f, 1.0f), 3, Math.hypotf(2.0f, 2.0f) + Math.hypotf(0.1f, 2.3f),
                           soy.controllers.graph.Pathfinder.find_optimized_path(scene2, new soy.atoms.Position(0.0f,0.0f,1.0f),
                                                                                new soy.atoms.Position(2.1f, 4.3f, 1.0f),
                                                                                new soy.controllers.graph.Grid(scene2, 1.0f)))
    begin_group("scene.check_collisions with GeomIgnored")

    scene4 : soy.scenes.Scene = new soy.scenes.Scene()
    ign1 : soy.bodies.Box = new soy.bodies.Box(scene4)
    ign1.size = new soy.atoms.Size(1.0f,1.0f,2.0f)
    ign1.position = new soy.atoms.Position(0.0f,0.0f,1.0f)
    geom : ode.geoms.Geom = ign1.body.GetFirstGeom()
    while geom != null
        geom.SetCategoryBits(geom.GetCategoryBits()|GeomIgnored)
        geom = ign1.body.GetNextGeom(geom)

    check_expect_bool(scene4.check_path_collision(new soy.atoms.Position(0.0f,0.0f,1.0f),new soy.atoms.Position(1.0f,0.0f,1.0f)), false)

    box2 : soy.bodies.Box = new soy.bodies.Box(scene4)
    box2.position = new soy.atoms.Position(2.0f, 0.0f, 1.0f)
    box2.size = new soy.atoms.Size(1.0f, 1.0f, 2.0f)

    check_expect_bool(scene4.check_path_collision(new soy.atoms.Position(0.0f, 0.0f, 1.0f), new soy.atoms.Position(2.0f, 0.0f, 1.0f)), true)

/////////////////////////////////////////////////////////////////////////////////////////
// 60
    
    check_expect_bool(scene4.check_path_collision(new soy.atoms.Position(2.0f, 2.0f, 1.0f), new soy.atoms.Position(2.0f, 0.0f, 1.0f)), true)

    begin_group("scene.check_collisions_with_size")
    
    scene5 : soy.scenes.Scene = new soy.scenes.Scene()
    center : soy.atoms.Position = new soy.atoms.Position(0.0f,0.0f,0.0f)
    box3 : soy.bodies.Box = new soy.bodies.Box(scene5)
    box3.size = new soy.atoms.Size(1.0f, 1.0f, 1.0f)
    box3.position = new soy.atoms.Position(1000.0f, 0.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_size(center,
                                                             {new soy.atoms.Position(12.0f, 10.0f, 0.0f),
                                                              new soy.atoms.Position(2000.0f, 0.0f, 0.0f),
                                                              new soy.atoms.Position(998.0f, 0.0f, 0.0f),
                                                              new soy.atoms.Position(1000.0f, 0.0f, 2.0f),
                                                              new soy.atoms.Position(1000.0f, 2.0f, 0.0f),
                                                              new soy.atoms.Position(1000.0f, 2.0f, 2.0f),
                                                              new soy.atoms.Position(2000.0f, 2.0f, 0.0f),
                                                              new soy.atoms.Position(2000.0f, 0.0f, 2.0f),
                                                              new soy.atoms.Position(2000.0f, 2.0f, 2.0f)},
                                                             new soy.atoms.Size(1.0f, 1.0f, 1.0f)),
                           {false, true, false, false, false, false, true, true, true})
    box3.position = new soy.atoms.Position(0.0f, 1000.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_size(center,
                                                             {new soy.atoms.Position(10.0f, 12.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, 2000.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, 998.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, 1000.0f, 2.0f),
                                                              new soy.atoms.Position(2.0f, 1000.0f, 0.0f),
                                                              new soy.atoms.Position(2.0f, 1000.0f, 2.0f),
                                                              new soy.atoms.Position(2.0f, 2000.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, 2000.0f, 2.0f),
                                                              new soy.atoms.Position(2.0f, 2000.0f, 2.0f)},
                                                             new soy.atoms.Size(1.0f, 1.0f, 1.0f)),
                           {false, true, false, false, false, false, true, true, true})
    box3.position = new soy.atoms.Position(-1000.0f, 0.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_size(center,
                                                             {new soy.atoms.Position(-12.0f, 10.0f, 0.0f),
                                                              new soy.atoms.Position(-2000.0f, 0.0f, 0.0f),
                                                              new soy.atoms.Position(-998.0f, 0.0f, 0.0f),
                                                              new soy.atoms.Position(-1000.0f, 0.0f, 2.0f),
                                                              new soy.atoms.Position(-1000.0f, 2.0f, 0.0f),
                                                              new soy.atoms.Position(-1000.0f, 2.0f, 2.0f),
                                                              new soy.atoms.Position(-2000.0f, 2.0f, 0.0f),
                                                              new soy.atoms.Position(-2000.0f, 0.0f, 2.0f),
                                                              new soy.atoms.Position(-2000.0f, 2.0f, 2.0f)},
                                                             new soy.atoms.Size(1.0f, 1.0f, 1.0f)),
                           {false, true, false, false, false, false, true, true, true})
    box3.position = new soy.atoms.Position(0.0f, -1000.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_size(center,
                                                             {new soy.atoms.Position(10.0f, -12.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, -2000.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, -998.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, -1000.0f, 2.0f),
                                                              new soy.atoms.Position(2.0f, -1000.0f, 0.0f),
                                                              new soy.atoms.Position(2.0f, -1000.0f, 2.0f),
                                                              new soy.atoms.Position(2.0f, -2000.0f, 0.0f),
                                                              new soy.atoms.Position(0.0f, -2000.0f, 2.0f),
                                                              new soy.atoms.Position(2.0f, -2000.0f, 2.0f)},
                                                             new soy.atoms.Size(1.0f, 1.0f, 1.0f)),
                           {false, true, false, false, false, false, true, true, true})

/////////////////////////////////////////////////////////////////////////////////////////
// 65
    
    box3.position = new soy.atoms.Position(1000.0f, 2000.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_size(center,
                                                             {new soy.atoms.Position(999.0f, 1999.1f, 0.0f),
                                                              new soy.atoms.Position(4000.0f, 8000.0f, 0.0f),
                                                              new soy.atoms.Position(1000.0f, 2000.0f, 2.0f),
                                                              new soy.atoms.Position(1000.0f, 1998.0f, 0.0f)},
                                                             new soy.atoms.Size(1.0f, 1.0f, 1.0f)),
                           {true, true, false, false})

    //Add more tests for this

    begin_group("scene.check_collisions_with_radius")
    
    box3.position = new soy.atoms.Position(1000.0f, 0.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_radius(center,
                                                               {new soy.atoms.Position(12.0f, 10.0f, 0.0f),
                                                                new soy.atoms.Position(2000.0f, 0.0f, 0.0f),
                                                                new soy.atoms.Position(998.0f, 0.0f, 0.0f),
                                                                new soy.atoms.Position(1000.0f, 0.0f, 2.0f),
                                                                new soy.atoms.Position(1000.0f, 2.0f, 0.0f),
                                                                new soy.atoms.Position(1000.0f, 2.0f, 2.0f),
                                                                new soy.atoms.Position(2000.0f, 2.0f, 0.0f),
                                                                new soy.atoms.Position(2000.0f, 0.0f, 2.0f),
                                                                new soy.atoms.Position(2000.0f, 2.0f, 2.0f)},
                                                               Math.sqrtf(2.0f)),
                           {false, true, false, false, false, false, true, true, true})
    box3.position = new soy.atoms.Position(0.0f, 1000.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_radius(center,
                                                               {new soy.atoms.Position(10.0f, 12.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, 2000.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, 998.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, 1000.0f, 2.0f),
                                                                new soy.atoms.Position(2.0f, 1000.0f, 0.0f),
                                                                new soy.atoms.Position(2.0f, 1000.0f, 2.0f),
                                                                new soy.atoms.Position(2.0f, 2000.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, 2000.0f, 2.0f),
                                                                new soy.atoms.Position(2.0f, 2000.0f, 2.0f)},
                                                               Math.sqrtf(2.0f)),
                           {false, true, false, false, false, false, true, true, true})
    box3.position = new soy.atoms.Position(-1000.0f, 0.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_radius(center,
                                                               {new soy.atoms.Position(-12.0f, 10.0f, 0.0f),
                                                                new soy.atoms.Position(-2000.0f, 0.0f, 0.0f),
                                                                new soy.atoms.Position(-998.0f, 0.0f, 0.0f),
                                                                new soy.atoms.Position(-1000.0f, 0.0f, 2.0f),
                                                                new soy.atoms.Position(-1000.0f, 2.0f, 0.0f),
                                                                new soy.atoms.Position(-1000.0f, 2.0f, 2.0f),
                                                                new soy.atoms.Position(-2000.0f, 2.0f, 0.0f),
                                                                new soy.atoms.Position(-2000.0f, 0.0f, 2.0f),
                                                                new soy.atoms.Position(-2000.0f, 2.0f, 2.0f)},
                                                               Math.sqrtf(2.0f)),
                           {false, true, false, false, false, false, true, true, true})
    box3.position = new soy.atoms.Position(0.0f, -1000.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_radius(center,
                                                               {new soy.atoms.Position(10.0f, -12.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, -2000.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, -998.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, -1000.0f, 2.0f),
                                                                new soy.atoms.Position(2.0f, -1000.0f, 0.0f),
                                                                new soy.atoms.Position(2.0f, -1000.0f, 2.0f),
                                                                new soy.atoms.Position(2.0f, -2000.0f, 0.0f),
                                                                new soy.atoms.Position(0.0f, -2000.0f, 2.0f),
                                                                new soy.atoms.Position(2.0f, -2000.0f, 2.0f)},
                                                               Math.sqrtf(2.0f)),
                           {false, true, false, false, false, false, true, true, true})

/////////////////////////////////////////////////////////////////////////////////////////
// 70

    box3.position = new soy.atoms.Position(1000.0f, 2000.0f, 0.0f)
    check_expect_boolarray(scene5.check_collisions_with_radius(center,
                                                               {new soy.atoms.Position(999.0f, 1999.0f, 1.0f),
                                                                new soy.atoms.Position(4000.0f, 8000.0f, 0.0f),
                                                                new soy.atoms.Position(1000.0f, 2000.0f, 2.0f),
                                                                new soy.atoms.Position(1000.0f, 1998.0f, 0.0f)},
                                                               Math.sqrtf(2.0f)),
                           {true, true, false, false})

    //Add more tests for this

    begin_group("soy.controllers.graph._space.Int3Node.get_edges")
    
    var graph7 = new soy.controllers.graph.Space(scene_empty, 0.1f)

    start = graph7.get_node_with_offset(5,1,2)
    var flat = 0.1f
    diag = Math.hypotf(flat, flat)
    var ddag = Math.hypotf(flat, diag)
    check_expect_edgelist_id({new soy.controllers.graph.Edge(flat,start,graph7.get_node_with_offset(5,1,3)),
                              new soy.controllers.graph.Edge(flat,start,graph7.get_node_with_offset(5,2,2)),
                              new soy.controllers.graph.Edge(flat,start,graph7.get_node_with_offset(6,1,2)),
                              new soy.controllers.graph.Edge(flat,start,graph7.get_node_with_offset(5,1,1)),
                              new soy.controllers.graph.Edge(flat,start,graph7.get_node_with_offset(5,0,2)),
                              new soy.controllers.graph.Edge(flat,start,graph7.get_node_with_offset(4,1,2)),

                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(6,2,2)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(6,1,3)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(6,0,2)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(6,1,1)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(4,2,2)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(4,1,3)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(4,0,2)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(4,1,1)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(5,0,3)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(5,0,1)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(5,2,3)),
                              new soy.controllers.graph.Edge(diag,start,graph7.get_node_with_offset(5,2,1)),

                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(6,2,3)),
                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(6,2,1)),
                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(6,0,3)),
                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(6,0,1)),
                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(4,2,3)),
                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(4,2,1)),
                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(4,0,3)),
                              new soy.controllers.graph.Edge(ddag,start,graph7.get_node_with_offset(4,0,1))},
                             start.get_edges())

    scene6 : soy.scenes.Scene = new soy.scenes.Scene()
    var wall2 = new soy.bodies.Box(scene6)
    wall2.position = new soy.atoms.Position(0.0f, 0.0f, 5.0f)
    wall2.size = new soy.atoms.Size(10.0f, 10.0f, 2.0f)

    flat = 5.0f
    diag = Math.hypotf(flat, flat)
    ddag = Math.hypotf(flat, diag)
    var graph8 = new soy.controllers.graph.Space(scene6, 5.0f)
    start = graph8.get_node(new soy.atoms.Position(0.0f, 0.0f, 0.0f))
    check_expect_edgelist_id({new soy.controllers.graph.Edge(flat,start,graph8.get_node_with_offset(0,1,0)),
                              new soy.controllers.graph.Edge(flat,start,graph8.get_node_with_offset(1,0,0)),
                              new soy.controllers.graph.Edge(flat,start,graph8.get_node_with_offset(0,0,-1)),
                              new soy.controllers.graph.Edge(flat,start,graph8.get_node_with_offset(0,-1,0)),
                              new soy.controllers.graph.Edge(flat,start,graph8.get_node_with_offset(-1,0,0)),

                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(1,1,0)),
                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(1,-1,0)),
                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(1,0,-1)),
                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(-1,1,0)),
                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(-1,-1,0)),
                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(-1,0,-1)),
                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(0,-1,-1)),
                              new soy.controllers.graph.Edge(diag,start,graph8.get_node_with_offset(0,1,-1)),

                              new soy.controllers.graph.Edge(ddag,start,graph8.get_node_with_offset(1,1,-1)),
                              new soy.controllers.graph.Edge(ddag,start,graph8.get_node_with_offset(1,-1,-1)),
                              new soy.controllers.graph.Edge(ddag,start,graph8.get_node_with_offset(-1,1,-1)),
                              new soy.controllers.graph.Edge(ddag,start,graph8.get_node_with_offset(-1,-1,-1))},
                             start.get_edges())



    print_overall()

def print_overall()
    end_group()
    print "\n*******************************************************************************************************"
    print "*"
    if failed == 0
        print "* PASSED all %d tests", cnt
    else
        print "* FAILED %d out of %d tests overall", failed, cnt
    print "*"

def end_group()
    if not(name_g is null) 
        if failed_g > 0
            print "|"
            print "* FAILED %d out of %d tests for %s", failed_g, cnt_g, name_g
        else 
            print "* PASSED all %d tests for %s", cnt_g, name_g
    cnt_g = 0
    failed_g = 0

def begin_group(name : string)
    end_group()
    name_g = name
    print "\n@ BEGINING tests for %s", name

def check_expect_passed()
    cnt++
    cnt_g++
    if print_success
        print "test %d passed", cnt

def print_failure(got : string, exp : string) : void
    if prev_failed != cnt
        print "|\n|# test %i failed.", cnt-1
        prev_failed = cnt
    else
        print "||"
    print  "||--> Expected: %s \n||--> Recieved: %s", exp, got

def increment_failure()
    cnt++
    cnt_g++
    failed++
    failed_g++

def check_expect_failed(got : string, exp : string) : void
    increment_failure()
    print_failure(got,exp)

def check_expect_id(got : Object, expect : Object)
    if got is expect
        check_expect_passed()
    else
        check_expect_failed("not(got is expect)", "got is expect")

def check_expect_bool(got : bool, expect : bool) : void
    if got is expect
        check_expect_passed()
    else
        check_expect_failed(got.to_string(), failed.to_string())

def check_expect_boolarray(got : array of bool, expect : array of bool)
    if boolarray_eq(got, expect)
        check_expect_passed()
    else
        check_expect_failed(boolarray_str(got), boolarray_str(expect))

def check_expect_IntNode(got : soy.controllers.graph.INode, 
                         expect : soy.controllers.graph.INode)
    var gt = (soy.controllers.graph._grid.IntNode)got
    var expec = (soy.controllers.graph._grid.IntNode)expect
    if IntNode_eq(gt, expec)
        check_expect_passed()
    else
        check_expect_failed(IntNode_str(gt), IntNode_str(expec))

//FIXME For some reason this will not compile unless expect is first :(
def check_expect_edgelist_id(expect : array of soy.controllers.graph.Edge,
                             got : Gee.List of soy.controllers.graph.Edge) : void
    failed : bool = false
    if got.size != expect.length
        failed = true
        print_failure("List of length %d".printf(got.size), "List of length %d".printf(expect.length))
    var dists = new dict of soy.controllers.graph.INode,float?
    var begins = new dict of soy.controllers.graph.INode,soy.controllers.graph.INode
    for var i = 0 to (expect.length - 1)
        dists[expect[i].end] = expect[i].distance
        begins[expect[i].end] = expect[i].begin
    for var e in got
        var nd = e.end
        if not(dists.has_key(nd)) 
            failed = true
            print_failure("List containing %s".printf(node_str(nd)), "List without %s".printf(node_str(nd)))
            continue
        if not(e.begin is begins[nd]) or Math.fabsf(dists[nd] - e.distance) > 0.00001*dists[nd]
            failed = true
            print_failure("%s".printf(edge_str(e)), "%s".printf(edge_str(new soy.controllers.graph.Edge(dists[nd], begins[nd], nd))))
        dists.unset(nd)

    if not(dists.is_empty)
        failed = true
        for var nd in dists.keys
            print_failure("List missing expected values", "%s to be in list".printf(edge_str(new soy.controllers.graph.Edge(dists[nd], begins[nd], nd))))

    if not(failed)
        check_expect_passed()
    else
        increment_failure()
    return
        
def check_expect_dijkstras(exp_end : soy.atoms.Position, exp_steps : int, exp_len : float, 
                           got : Gee.List of soy.atoms.Position) : void
    failed : bool = false
    if got.size != exp_steps
        failed = true
        print_failure("List of length %d".printf(got.size), "List of length %d".printf(exp_steps))
    if not(soy.atoms.Position.cmp_eq(exp_end,got.last()))
        failed = true
        print_failure("Final location of %s".printf(Position_str(got.last())), "Final location of %s".printf(Position_str(exp_end)))
    
    tot_len : float = 0.0f
    prev : soy.atoms.Position? = null
    for var loc in got
        if prev is null
            prev = loc
            continue
        tot_len += Math.hypotf(loc.x - prev.x, loc.y - prev.y)
        prev = loc

    if Math.fabsf(tot_len - exp_len) > (0.001 * exp_len)
        failed = true
        print_failure("Total length of %f".printf(tot_len), "Total length of %f".printf(exp_len))
    
    if not(failed)
        check_expect_passed()
    else
        increment_failure()
    return
    
def node_str(nd : soy.controllers.graph.INode) : string
    if nd isa soy.controllers.graph._grid.IntNode
        var ndi = (soy.controllers.graph._grid.IntNode)nd
        return "<IntNode X: %d, Y: %d, Position: %s>".printf(ndi.x, ndi.y, Position_str(ndi.position))
    else if nd isa soy.controllers.graph._grid.TerminalNode
        return "<TerminalNode Position: %s>".printf(Position_str(nd.position))
    else
        return "<INode Position: %s>".printf(Position_str(nd.position))

def edge_str(edg : soy.controllers.graph.Edge) : string
    return "<Edge distance: %f, begin: %s,  end: %s>".printf(edg.distance, node_str(edg.begin), node_str(edg.end))


def Position_str(pos : soy.atoms.Position) : string
    return "(%f, %f, %f)".printf(pos.x, pos.y, pos.z)

def boolarray_eq(ar1 : array of bool, ar2 : array of bool) : bool
    if ar1.length != ar2.length
        return false
    else 
        for var i = 0 to (ar1.length - 1)
            if ar1[i] != ar2[i]
                return false
        return true

def boolarray_str(ar1 : array of bool) : string
    if ar1.length == 0
        return "{}"
    st : string = "{" + ar1[0].to_string()
    for i : int = 1 to (ar1.length - 1)
        st+=", %s".printf(ar1[i].to_string())
    return st+"}"

def IntNode_eq(ind1 : soy.controllers.graph._grid.IntNode, 
               ind2 : soy.controllers.graph._grid.IntNode) : bool
    return ind1.x == ind2.x and ind1.y == ind2.y and soy.atoms.Position.cmp_eq(ind1.position, ind2.position)
    //return ind1.equal_to(ind2)

def IntNode_str(ind : soy.controllers.graph._grid.IntNode) : string
    return "<IntNode x:%d, y:%d, position:%s>".printf(ind.x, ind.y, Position_str(ind.position))
    

