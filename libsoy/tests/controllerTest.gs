/*
 *  libsoy tests - controllerTest (controllerTest.gs)
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
    Posix

print_success : bool = true
prev_failed : int? = null
cnt      : int = 0
cnt_g    : int = 0
failed   : int = 0
failed_g : int = 0
name_g   : string? = null


init
    begin_group("Pathfollower")
    scene_alpha : soy.scenes.Scene = new soy.scenes.Scene()
    box_alpha : soy.bodies.Box = new soy.bodies.Box(scene_alpha)

    /* Test 0 */
    center_box(box_alpha)
    var path_alpha_0 = make_path({new soy.atoms.Position(0.0f,0.0f, 1.0f),new soy.atoms.Position(10.0f,0.0f, 1.0f)})
    controller_alpha_0 : soy.controllers.Pathfollower = new soy.controllers.Pathfollower(scene_alpha, box_alpha, 2.0f, 0.1f, false, path_alpha_0)

    check_expect_wait_pos(controller_alpha_0, box_alpha, new soy.atoms.Position(10.0f, 0.0f, 1.0f), 0.1f, 100, 10.0f)

    /* Test 1 */
    center_box(box_alpha)
    var path_alpha_1 = make_path({new soy.atoms.Position(0.0f, 0.0f, 1.0f),     
                                  new soy.atoms.Position(10.0f, 10.0f, 1.0f), 
                                  new soy.atoms.Position(0.0f, 0.0f, 1.0f)})
    controller_alpha_1 : soy.controllers.Pathfollower = new soy.controllers.Pathfollower(scene_alpha, box_alpha, 2.0f, 0.1f, false, path_alpha_1)
    check_expect_wait_pos(controller_alpha_1, box_alpha, new soy.atoms.Position(0.0f, 0.0f, 1.0f), 0.1f, 100, 10.0f)

    /* Test 2 */
    center_box(box_alpha)
    var path_alpha_2 = make_path({new soy.atoms.Position(0.0f,  0.0f, 1.0f),     
                                  new soy.atoms.Position(10.0f, 0.0f, 1.0f), 
                                  new soy.atoms.Position(9.9f,  0.0f, 1.0f),
                                  new soy.atoms.Position(12.0f, 0.0f, 1.0f)})
    /* if this runs then it passes */
    controller_alpha_2 : soy.controllers.Pathfollower = new soy.controllers.Pathfollower(scene_alpha, box_alpha, 2.0f, 0.1f, false, path_alpha_2)
    check_expect_wait_pos(controller_alpha_2, box_alpha, new soy.atoms.Position(12.0f, 0.0f, 1.0f), 0.1f, 100, 15.0f)

    /* Test 3 */
    center_box(box_alpha)
    var path_alpha_3 = make_path({new soy.atoms.Position(0.0f,  0.0f, 1.0f),
                                  new soy.atoms.Position(10.0f, 0.0f, 1.0f), 
                                  new soy.atoms.Position(10.0f, 0.0f, 1.0f),
                                  new soy.atoms.Position(10.0f, 0.0f, 1.0f),
                                  new soy.atoms.Position(10.0f, 0.0f, 1.0f),
                                  new soy.atoms.Position(10.0f, 0.0f, 1.0f),
                                  new soy.atoms.Position(12.0f, 0.0f, 1.0f)})
    /* if this runs then it passes */
    controller_alpha_3 : soy.controllers.Pathfollower = new soy.controllers.Pathfollower(scene_alpha, box_alpha, 2.0f, 0.1f, false, path_alpha_3)
    check_expect_wait_pos(controller_alpha_3, box_alpha, new soy.atoms.Position(12.0f, 0.0f, 1.0f), 0.1f, 100, 15.0f)

    /* Test 4 */
    center_box(box_alpha)
    var path_alpha_4 = make_path({new soy.atoms.Position(0.0f,  0.0f, 1.0f)})
    /* if this runs then it passes */
    controller_alpha_4 : soy.controllers.Pathfollower = new soy.controllers.Pathfollower(scene_alpha, box_alpha, 2.0f, 0.1f, false, path_alpha_4)
    check_expect_wait_pos(controller_alpha_4, box_alpha, new soy.atoms.Position(0.0f, 0.0f, 1.0f), 0.1f, 100, 1.0f)

    begin_group("GridNavigator")
    
    /* Test 5 */
    center_box(box_alpha)
    controller_alpha_5 : soy.controllers.GridNavigator = new soy.controllers.GridNavigator(scene_alpha, box_alpha, 2.0f, 0.1f, 0.1f, new soy.atoms.Position(10.0f, 10.0f,1.0f), false, false)
    check_expect_wait_pos(controller_alpha_5, box_alpha, new soy.atoms.Position(10.0f, 10.0f, 1.0f),0.1f, 100, 10.0f)

    /* Test 6 */
    center_box(box_alpha)
    //controller_alpha_6 : soy.controllers.GridNavigator = new soy.controllers.GridNavigator(scene_alpha, box_alpha, 0.1f, 0.1f, 0.1f, new soy.atoms.Position(10.0f, 10.0f,1.0f), false)
    controller_alpha_6 : soy.controllers.GridNavigator = new soy.controllers.GridNavigator(scene_alpha, box_alpha, 2.0f, 0.1f, 0.1f, new soy.atoms.Position(10.0f, 10.0f,1.0f), true, false)
    check_expect_wait_pos(controller_alpha_6, box_alpha, new soy.atoms.Position(10.0f, 10.0f, 1.0f),0.1f, 100, 10.0f)


    /* Test 7 */
    scene_beta : soy.scenes.Scene = new soy.scenes.Scene()
    box_beta : soy.bodies.Box = new soy.bodies.Box(scene_beta)
    center_box(box_beta)
    wall_beta : soy.bodies.Box = new soy.bodies.Box(scene_beta)
    wall_beta.position = new soy.atoms.Position(0.0f, 5.0f, 1.0f)
    wall_beta.size = new soy.atoms.Size(8.0f, 0.1f,2.0f)
    controller_beta_7 : soy.controllers.GridNavigator = new soy.controllers.GridNavigator(scene_beta, box_beta, 2.0f, 0.1f, 3.0f, new soy.atoms.Position(0.0f, 30.0f, 1.0f), false, false)
    check_expect_wait_pos(controller_beta_7, box_beta, new soy.atoms.Position(0.0f, 30.0f, 1.0f), 0.1f, 100, 10.0f)

    /* Test 8 */
    center_box(box_beta)
    wall_beta.velocity = new soy.atoms.Vector(0.0f, 0.0f, 0.0f)
    wall_beta.rotation = new soy.atoms.Rotation(0.0f, 0.0f, 0.0f)
    //controller_beta_8 : soy.controllers.GridNavigator = new soy.controllers.GridNavigator(scene_beta, box_beta, 0.1f, 0.1f, 3.0f, new soy.atoms.Position(0.0f, -30.0f, 1.0f), false)
    controller_beta_8 : soy.controllers.GridNavigator = new soy.controllers.GridNavigator(scene_beta, box_beta, 2.0f, 0.1f, 3.0f, new soy.atoms.Position(0.0f, -30.0f, 1.0f), true, false)
    wall_beta.position.y = -15.0f
    check_expect_wait_pos(controller_beta_8, box_beta, new soy.atoms.Position(0.0f, -30.0f, 1.0f), 0.1f, 100, 10.0f)

    center_box(box_beta)
    print_overall()

def make_path(poses : array of soy.atoms.Position) : Gee.LinkedList of soy.atoms.Position
    lst : Gee.LinkedList of soy.atoms.Position = new Gee.LinkedList of soy.atoms.Position()
    for var i in poses
        lst.add(i)
    return lst

def center_box(box : soy.bodies.Box) : void
    box.size = new soy.atoms.Size(1.0f,1.0f, 2.0f)
    box.position = new soy.atoms.Position(0.0f, 0.0f, 1.0f)
    box.velocity = new soy.atoms.Vector(0.0f, 0.0f, 0.0f)

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
        print "| test %d passed", cnt-1

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

def Rotation_str(rot : soy.atoms.Rotation) : string
    return "<Rotation (%f, %f, %f)>".printf(rot.alpha, rot.beta, rot.gamma)

def Position_str(pos : soy.atoms.Position) : string
    return "<Position (%f, %f, %f)>".printf(pos.x, pos.y, pos.z)

def check_expect_wait_pos(controller : soy.controllers.VirtualController, controlled : soy.bodies.Body, dest : soy.atoms.Position, fuzziness : float, sleep_usec : uint, wait_sec : double)
    tmr : Timer = new Timer()
    tmr.start()
    while tmr.elapsed() < wait_sec
        if controller.finished 
            pos : soy.atoms.Position = controlled.position
            if Math.hypotf(Math.hypotf(pos.x - dest.x, pos.y - dest.y), pos.z - dest.z) < fuzziness
                check_expect_passed()
            else
                check_expect_failed("Finished with a final position of %s, farther then %g from target".printf(Position_str(pos), fuzziness),
                                    "Within %g of destination".printf(fuzziness))
            return
        Posix.usleep(sleep_usec) 
    tmr.stop()
    check_expect_failed("After %g seconds was never within %f of %s; final position of %s".printf(tmr.elapsed(), fuzziness, Position_str(dest), Position_str(controlled.position)),
                        "To be within %f of %s within %g seconds".printf(fuzziness, Position_str(dest), wait_sec))

def check_expect_orientation(body : soy.bodies.Body, exp_pos : soy.atoms.Position, exp_rot : soy.atoms.Rotation, pos_fuzz : float, rot_fuzz : float)
    b_pos : soy.atoms.Position = body.position
    b_rot : soy.atoms.Rotation = body.rotation
    f_pos : bool = false
    f_rot : bool = false
    if Math.fabsf(b_pos.x - exp_pos.x) > pos_fuzz
        f_pos = true
    if Math.fabsf(b_pos.y - exp_pos.y) > pos_fuzz
        f_pos = true
    if Math.fabsf(b_pos.z - exp_pos.z) > pos_fuzz
        f_pos = true
    if Math.fabsf(b_rot.alpha - exp_rot.alpha) > pos_fuzz
        f_rot = true
    if Math.fabsf(b_rot.beta - exp_rot.beta) > pos_fuzz
        f_rot = true
    if Math.fabsf(b_rot.gamma - exp_rot.gamma) > pos_fuzz
        f_rot = true

    if f_pos
        print_failure(Position_str(exp_pos), Position_str(b_pos))
    if f_rot
        print_failure(Rotation_str(exp_rot), Rotation_str(b_rot))

