/*
 *  Vala API for Open Dynamics Engine (ode.vapi)
 *
 *  Copyright (C) 2006,2007,2008,2009,2010,2011,2012,2013 Copyleft Games Group
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program; if not, see http://www.gnu.org/licenses
 *
 */

using GLib;

[CCode (cprefix = "d", lower_case_cprefix = "d",
        cheader_filename = "soy-1/ode.h")]
namespace ode {

    /***********************************************************************\
      common.h                                                             */

#if dSINGLE
    [FloatingType (rank = 1)]
    public struct Real : float { }
#else
    [FloatingType (rank = 2)]
    public struct Real : double { }
#endif

    [Compact, CCode (cname="dxVector3")]
    public class Vector3 {
        public Vector3 ( );
        public Real x;
        public Real y;
        public Real z;
        public Real _w;
        [CCode (cname="dSafeNormalize3")]
        public static int SafeNormalize ( );
    }

    public struct Vector4 {
        Real x;
        Real y;
        Real z;
        Real w;
        [CCode (cname="dSafeNormalize4")]
        public static int SafeNormalize ( );
    }

    [Compact, CCode (cname="dxMatrix3")]
    public class Matrix3 {
        public Matrix3 ( );
        public Real m0;
        public Real m1;
        public Real m2;
        public Real m3;
        public Real m4;
        public Real m5;
        public Real m6;
        public Real m7;
        public Real m8;
        public Real m9;
        public Real ma;
        public Real mb;
    /***********************************************************************\
      rotation.h                                                           */
        [CCode (cname="dRSetIdentity")]
        public void SetIdentity();
        [CCode (cname="dRFromAxisAndAngle")]
        public void FromAxisAndAngle (Real ax, Real ay, Real az, Real angle);
        [CCode (cname="dRFromEulerAngles")]
        public void FromEulerAngles(Real phi, Real theta, Real psi);
        [CCode (cname="dRFrom2Axes")]
        public void From2Axes(Real ax, Real ay, Real az, 
                              Real bx, Real by, Real bz);
        [CCode (cname="dRFromZAxis")]
        public void FromZAxis(Real ax, Real ay, Real az);
    }

    public struct Matrix4 {
        Real m0;
        Real m1;
        Real m2;
        Real m3;
        Real m4;
        Real m5;
        Real m6;
        Real m7;
        Real m8;
        Real m9;
        Real ma;
        Real mb;
        Real mc;
        Real md;
        Real me;
        Real mf;
    }

    [Compact, CCode (cname="dxQuaternion")]
    public class Quaternion {
        public Quaternion ( );
        public Real w;
        public Real x;
        public Real y;
        public Real z;
        [CCode (cname="dQSetIdentity")]
        public void SetIdentity();
        [CCode (cname="dQFromAxisAndAngle")]
        public void FromAxisAndAngle(Real ax, Real ay, Real az, 
                                     Real angle);
        [CCode (cname="dQFromEulerAngles")]
        public void FromEulerAngles(Real phi, Real theta, Real psi);
        [CCode (cname="dQFrom2Axes")]
        public void From2Axes(Real ax, Real ay, Real az, 
                              Real bx, Real by, Real bz);
        [CCode (cname="dQFromZAxis")]
        public void FromZAxis(Real ax, Real ay, Real az);
    }

    public struct AABB {
        Real x1;
        Real x2;
        Real y1;
        Real y2;
        Real z1;
        Real z2;
    }

    public static void    InitODE ( );
    public static int     InitODE2 (uint uiInitFlags);
    public static int     AllocateODEDataForThread (uint uiAllocateFlags);
    public static void    CleanupODEAllDataForThread ( );
    public static void    CloseODE ( );


    [CCode (cname="dJointType", cprefix="dJointType")]
    public enum JointType {
        None = 0,           /* or "unknown" */
        Ball,
        Hinge,
        Slider,
        Contact,
        Universal,
        Hinge2,
        Fixed,
        Null,
        AMotor,
        LMotor,
        Plane2D,
        PR,
        PU,
        Piston
    }

	[CCode (cname="dParam", cprefix="dParam")]
	public enum Param {
		LoStop = 0,
	    HiStop,
		Vel,
		FMax,
		FudgeFactor,
		Bounce,
		CFM,
		StopERP,
		StopCFM,
		SuspensionERP,
		SuspensionCFM,
		ERP,
        ParamsInGroup,

        Group1 = 0x000,
		LoStop1 = 0x000,
	    HiStop1,
		Vel1,
		FMax1,
		FudgeFactor1,
		Bounce1,
		CFM1,
		StopERP1,
		StopCFM1,
		SuspensionERP1,
		SuspensionCFM1,
		ERP1,

        Group2 = 0x100,
		LoStop2 = 0x100,
	    HiStop2,
		Vel2,
		FMax2,
		FudgeFactor2,
		Bounce2,
		CFM2,
		StopERP2,
		StopCFM2,
		SuspensionERP2,
		SuspensionCFM2,
		ERP2,

        Group3 = 0x200,
		LoStop3 = 0x200,
	    HiStop3,
		Vel3,
		FMax3,
		FudgeFactor3,
		Bounce3,
		CFM3,
		StopERP3,
		StopCFM3,
		SuspensionERP3,
		SuspensionCFM3,
		ERP3,

		Group = 0x100
    }

    [CCode (cname="dJointFeedback")]
    public struct JointFeedback {
        Vector3 f1;          /* force applied to body 1 */
        Vector3 t1;          /* torque applied to body 1 */
        Vector3 f2;          /* force applied to body 2 */
        Vector3 t2;          /* torque applied to body 2 */
    }


    /***********************************************************************\
      objects.h                                                            */

    [Compact]
    [CCode (cname="struct dxWorld", cprefix="dWorld",
            free_function="dWorldDestroy")]
    public class World {
        [CCode (cname = "dWorldCreate")]
        public World( );
        public void         SetGravity (Real x, Real y, Real z);
        public void         GetGravity (Vector3 gravity);
        public void         SetERP (Real erp);
        public Real         GetERP ( );
        public void         SetCFM (Real cfm);
        public Real         GetCFM ( );
        public void         Step (Real stepsize);
        public void         ImpulseToForce (Real stepsize,
                                            Real x, Real y, Real z,
                                            Vector3 force);
        public void         QuickStep (Real stepsize);
        public void         SetQuickStepNumIterations (int num);
        public int          GetQuickStepNumIterations ( );
        public void         SetQuickStepW (Real over);
        public Real         GetQuickStepW ( );
        public void         SetContactMaxCorrectingVel (Real vel);
        public Real         GetContactMaxCorrectingVel ( );
        public void         SetContactSurfaceLayer (Real depth);
        public Real         GetContactSurfaceLayer ( );
        public void         StepFast1 (Real stepsize, int maxiters);
        public void         SetAutoEnableDepthSF1 (int autoEnable);
        public int          GetAutoEnableDepthSF1 ( );
        public Real         GetAutoDisableLinearThreshold ( );
        public void         SetAutoDisableLinearThreshold (Real threshold);
        public Real         GetAutoDisableAngularThreshold ( );
        public void         SetAutoDisableAngularThreshold (Real threshold);
        public Real         GetAutoDisableLinearAverageThreshold  ( );
        public void         SetAutoDisableLinearAverageThreshold  (Real ths);
        public Real         GetAutoDisableAngularAverageThreshold ( );
        public void         SetAutoDisableAngularAverageThreshold (Real ths);
        public int          GetAutoDisableAverageSamplesCount ( );
        public void         SetAutoDisableAverageSamplesCount (uint a);
        public int          GetAutoDisableSteps         ( );
        public void         SetAutoDisableSteps         (int steps);
        public Real         GetAutoDisableTime          ( );
        public void         SetAutoDisableTime          (Real time);
        public int          GetAutoDisableFlag          ( );
        public void         SetAutoDisableFlag          (int disable);
        public Real         GetLinearDampingThreshold   ( );
        public void         SetLinearDampingThreshold   (Real threshold);
        public Real         GetAngularDampingThreshold  ( );
        public void         SetAngularDampingThreshold  (Real threshold);
        public Real         GetLinearDamping            ( );
        public void         SetLinearDamping            (Real scale);
        public Real         GetAngularDamping           ( );
        public void         SetAngularDamping           (Real scale);
        public void         SetDamping                  (Real linear_scale,
                                                         Real angular_scale);
        public Real         GetMaxAngularSpeed          ( );
        public void         SetMaxAngularSpeed          (Real max_speed);
    }

    [Compact]
    [CCode (cname="struct dxBody", cprefix="dBody",
            free_function="dBodyDestroy")]
    public class Body {
        [CCode (cname = "dBodyCreate")]
        public Body (World world);
        public World         GetWorld            ( );
        public void          SetData             (void *data);
        public void*         GetData             ( );
        public void          SetPosition         (Real x, Real y, Real z);
        public void          SetRotation         (Matrix3 R);
        public void          SetQuaternion       (Quaternion q);
        public void          SetLinearVel        (Real x, Real y, Real z);
        public void          SetAngularVel       (Real x, Real y, Real z);
        public unowned Vector3 GetPosition         ( );
        public void          CopyPosition        (out Vector3 pos);
        public unowned Matrix3 GetRotation         ( );
        public void          CopyRotation        (out Matrix3 R);
        public unowned Quaternion GetQuaternion       ( );
        public void          CopyQuaternion      (Quaternion quat);
        public unowned Vector3 GetLinearVel        ( );
        public unowned Vector3 GetAngularVel       ( );
        public void          SetMass             (Mass mass);
        public void          GetMass             (Mass mass);
        public void          AddForce            (Real fx, Real fy, Real fz);
        public void          AddTorque           (Real fx, Real fy, Real fz);
        public void          AddRelForce         (Real fx, Real fy, Real fz);
        public void          AddRelTorque        (Real fx, Real fy, Real fz);
        public void          AddForceAtPos       (Real fx, Real fy, Real fz,
                                                  Real px, Real py, Real pz);
        public void          AddForceAtRelPos    (Real fx, Real fy, Real fz,
                                                  Real px, Real py, Real pz);
        public void          AddRelForceAtPos    (Real fx, Real fy, Real fz,
                                                  Real px, Real py, Real pz);
        public void          AddRelForceAtRelPos (Real fx, Real fy, Real fz,
                                                  Real px, Real py, Real pz);
        public unowned Real* GetForce ( );
        public unowned Real* GetTorque ( );
        public void          SetForce  (Real x, Real y, Real z);
        public void          SetTorque (Real x, Real y, Real z);
        public void          GetRelPointPos  (Real px, Real py, Real pz,
                                              Vector3 result);
        public void          GetRelPointVel  (Real px, Real py, Real pz,
                                              Vector3 result);
        public void          GetPointVel     (Real px, Real py, Real pz,
                                              Vector3 result);
        public void          GetPosRelPoint  (Real px, Real py, Real pz,
                                              Vector3 result);
        public void          VectorToWorld   (Real px, Real py, Real pz,
                                              Vector3 result);
        public void          VectorFromWorld (Real px, Real py, Real pz,
                                              Vector3 result);
        public void          SetFiniteRotationMode (int mode);
        public void          SetFiniteRotationAxis (Real x, Real y, Real z);
        public int           GetFiniteRotationMode ( );
        public void          GetFiniteRotationAxis (Vector3 result);
        public int           GetNumJoints ( );
        public joints.Joint  GetJoint (int index);
        public void          SetDynamic ( );
        public void          SetKinematic ( );
        public int           IsKinematic ( );
        public void          Enable ( );
        public void          Disable ( );
        public int           IsEnabled ( );
        public void          SetGravityMode (int mode);
        public int           GetGravityMode ( );
        //public void        SetMovedCallback(void (*callback)(Body body));
        public geoms.Geom    GetFirstGeom ( );
        public static geoms.Geom GetNextGeom (geoms.Geom g);
        public void          SetDampingDefaults ( );
        public Real          GetLinearDamping ( );
        public void          SetLinearDamping (Real scale);
        public Real          GetAngularDamping ( );
        public void          SetAngularDamping (Real scale);
        public void          SetDamping (Real linear_scale,
                                         Real angular_scale);
        public Real          GetLinearDampingThreshold ( );
        public void          SetLinearDampingThreshold(Real threshold);
        public Real          GetAngularDampingThreshold ( );
        public void          SetAngularDampingThreshold (Real threshold);
        public Real          GetMaxAngularSpeed ( );
        public void          SetMaxAngularSpeed (Real max_speed);
        public int           GetGyroscopicMode ( );
        public void          SetGyroscopicMode (int enabled);
        public Real          GetAutoDisableLinearThreshold ( );
        public void          SetAutoDisableLinearThreshold (Real threshold);
        public Real          GetAutoDisableAngularThreshold ( );
        public void          SetAutoDisableAngularThreshold (Real threshold);
        public int           GetAutoDisableAverageSamplesCount ( );
        public void          SetAutoDisableAverageSamplesCount (uint count);
        public int           GetAutoDisableSteps ( );
        public void          SetAutoDisableSteps (int steps);
        public Real          GetAutoDisableTime ( );
        public void          SetAutoDisableTime (Real time);
        public int           GetAutoDisableFlag ( );
        public void          SetAutoDisableFlag (int do_auto_disable);
        public void          SetAutoDisableDefaults ( );
        [CCode (cname = "dConnectingJoint")]
        public joints.Joint  ConnectingJoint (Body other);
        [CCode (cname = "dConnectingJointList")]
        public int           ConnectingJointList (Body other,
                                                  out joints.Joint[] jl);
        [CCode (cname = "dAreConnected")]
        public int           AreConnected (Body other);
        [CCode (cname = "dAreConnectedExcluding")]
        public int           AreConnectedExcluding (Body other, int joint_type);
    }

    namespace joints {
        [Compact]
        [CCode (cname="struct dxJointGroup", cprefix="dJointGroup",
                free_function="dJointGroupDestroy")]
        public class JointGroup {
            [CCode (cname = "dJointGroupCreate")]
            public JointGroup (int max_size);
            public void          Empty ( );
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Joint {
            [CCode (cname = "dJointCreateNull")]
            public Joint (World world, JointGroup? group);
            public int            GetNumBodies( );
            public void           Attach (Body? body1, Body? body2);
            public void           Enable ( );
            public void           Disable ( );
            public int            IsEnabled ( );
            public void           SetData (void* data);
            public void*          GetData ( );
            public JointType      GetType ( );
            public unowned Body   GetBody (int index);
            public void           SetFeedback (JointFeedback* jf);
            public JointFeedback* GetFeedback ( );
        }

        [Compact]
        [CCode (cname="struct dxJoint", free_function="dJointDestroy")]
        public class Ball : Joint {
            [CCode (cname = "dJointCreateBall")]
            public Ball (World world, JointGroup? group);

            [CCode (cname = "dJointSetBallAnchor")]
            public void SetAnchor (Real x, Real y, Real z);

            [CCode (cname = "dJointSetBallAnchor2")]
            public void SetAnchor2 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetBallParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointGetBallAnchor")]
            public void GetAnchor (Vector3 result);

            [CCode (cname = "dJointGetBallAnchor2")]
            public void GetAnchor2 (Vector3 result);

            [CCode (cname = "dJointGetBallParam")]
            public Real GetParam (int parameter);
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Hinge : Joint {
            [CCode (cname = "dJointCreateHinge")]
            public Hinge (World world, JointGroup? group);

            [CCode (cname = "dJointSetHingeAnchor")]
            public void SetAnchor (Real x, Real y, Real z);

            [CCode (cname = "dJointSetHingeAnchorDelta")]
            public void SetAnchorDelta (Real  x, Real  y, Real  z,
                                        Real ax, Real ay, Real az);

            [CCode (cname = "dJointSetHingeAxis")]
            public void SetAxis (Real x, Real y, Real z);

            [CCode (cname = "dJointSetHingeAxisOffset")]
            public void SetAxisOffset (Real x, Real y, Real z, Real angle);

            [CCode (cname = "dJointSetHingeParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointAddHingeTorque")]
            public void AddTorque(Real torque);

            [CCode (cname = "dJointGetHingeAnchor")]
            public void GetAnchor (Vector3 result);

            [CCode (cname = "dJointGetHingeAnchor2")]
            public void GetAnchor2 (Vector3 result);

            [CCode (cname = "dJointGetHingeAxis")]
            public void GetAxis (Vector3 result);

            [CCode (cname = "dJointGetHingeParam")]
            public Real GetParam (int parameter);

            [CCode (cname = "dJointGetHingeAngle")]
            public Real GetAngle ( );

            [CCode (cname = "dJointGetHingeAngleRate")]
            public Real GetAngleRate ( );
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Slider : Joint {
            [CCode (cname = "dJointCreateSlider")]
            public Slider (World world, JointGroup? group);

            [CCode (cname = "dJointSetSliderAxis")]
            public void SetAxis (Real x, Real y, Real z);

            [CCode (cname = "dJointSetSliderAxisDelta")]
            public void SetAxisDelta (Real  x, Real  y, Real  z,
                                      Real ax, Real ay, Real az);

            [CCode (cname = "dJointSetSliderParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointAddSliderForce")]
            public void AddForce(Real force);

            [CCode (cname = "dJointGetSliderPosition")]
            public Real GetPosition ( );

            [CCode (cname = "dJointGetSliderPositionRate")]
            public Real GetPositionRate ( );

            [CCode (cname = "dJointGetSliderAxis")]
            public void GetAxis (Vector3 result);

            [CCode (cname = "dJointGetSliderParam")]
            public Real GetParam (int parameter);
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Contact : Joint {
            [CCode (cname = "dJointCreateContact")]
            public Contact (World world, JointGroup? group,
                            ode.Contact contact);
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Hinge2 : Joint {
            [CCode (cname = "dJointCreateHinge2")]
            public Hinge2 (World world, JointGroup? group);

            [CCode (cname = "dJointSetHinge2Anchor")]
            public void SetAnchor (Real x, Real y, Real z);

            [CCode (cname = "dJointSetHinge2Axis1")]
            public void SetAxis1 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetHinge2Axis2")]
            public void SetAxis2 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetHinge2Param")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointAddHinge2Torques")]
            public void AddTorques(Real torque1, Real torque2);

            [CCode (cname = "dJointGetHinge2Anchor")]
            public void GetAnchor (Vector3 result);

            [CCode (cname = "dJointGetHinge2Anchor2")]
            public void GetAnchor2 (Vector3 result);

            [CCode (cname = "dJointGetHinge2Axis1")]
            public void GetAxis1 (Vector3 result);

            [CCode (cname = "dJointGetHinge2Axis2")]
            public void GetAxis2 (Vector3 result);

            [CCode (cname = "dJointGetHinge2Param")]
            public Real GetParam (int parameter);

            [CCode (cname = "dJointGetHinge2Angle1")]
            public Real GetAngle1 ( );

            [CCode (cname = "dJointGetHinge2Angle1Rate")]
            public Real GetAngle1Rate ( );

            [CCode (cname = "dJointGetHinge2Angle2Rate")]
            public Real GetAngle2Rate ( );
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Universal : Joint {
            [CCode (cname = "dJointCreateUniversal")]
            public Universal (World world, JointGroup? group);

            [CCode (cname = "dJointSetUniversalAnchor")]
            public void SetAnchor (Real x, Real y, Real z);

            [CCode (cname = "dJointSetUniversalAxis1")]
            public void SetAxis1 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetUniversalAxis1Offset")]
            public void SetAxis1Offset (Real x, Real y, Real z,
                                        Real offset1, Real offset2);

            [CCode (cname = "dJointSetUniversalAxis2")]
            public void SetAxis2 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetUniversalAxis2Offset")]
            public void SetAxis2Offset (Real x, Real y, Real z,
                                        Real offset1, Real offset2);

            [CCode (cname = "dJointSetUniversalParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointAddUniversalTorques")]
            public void AddTorques(Real torque1, Real torque2);

            [CCode (cname = "dJointGetUniversalAnchor")]
            public void GetAnchor (Vector3 result);

            [CCode (cname = "dJointGetUniversalAnchor2")]
            public void GetAnchor2 (Vector3 result);

            [CCode (cname = "dJointGetUniversalAxis1")]
            public void GetAxis1 (Vector3 result);

            [CCode (cname = "dJointGetUniversalAxis2")]
            public void GetAxis2 (Vector3 result);

            [CCode (cname = "dJointGetUniversalParam")]
            public Real GetParam (int parameter);

            [CCode (cname = "dJointGetUniversalAngles")]
            public void GetAngles (Real* angle1, Real* angle2);

            [CCode (cname = "dJointGetUniversalAngle1")]
            public Real GetAngle1 ( );

            [CCode (cname = "dJointGetUniversalAngle2")]
            public Real GetAngle2 ( );

            [CCode (cname = "dJointGetUniversalAngle1Rate")]
            public Real GetAngle1Rate ( );

            [CCode (cname = "dJointGetUniversalAngle2Rate")]
            public Real GetAngle2Rate ( );
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class PrismaticRotoide : Joint {
            [CCode (cname = "dJointCreatePR")]
            public PrismaticRotoide (World world, JointGroup? group);

            [CCode (cname = "dJointSetPRAnchor")]
            public void SetAnchor (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPRAxis1")]
            public void SetAxis1 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPRAxis2")]
            public void SetAxis2 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPRParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointAddPRTorque")]
            public void AddTorque (Real torque);

            [CCode (cname = "dJointGetPRAnchor")]
            public void GetAnchor (Vector3 result);

            [CCode (cname = "dJointGetPRPosition")]
            public Real GetPosition ( );

            [CCode (cname = "dJointGetPRPositionRate")]
            public Real GetPositionRate ( );

            [CCode (cname = "dJointGetPRAngle")]
            public Real GetAngle ( );

            [CCode (cname = "dJointGetPRAngleRate")]
            public Real GetAngleRate ( );

            [CCode (cname = "dJointGetPRAxis1")]
            public void GetAxis1 (Vector3 result);

            [CCode (cname = "dJointGetPRAxis2")]
            public void GetAxis2 (Vector3 result);

            [CCode (cname = "dJointGetPRParam")]
            public Real GetParam (int parameter);
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class PrismaticUniversal : Joint {
            [CCode (cname = "dJointCreatePU")]
            public PrismaticUniversal (World world, JointGroup? group);

            [CCode (cname = "dJointSetPUAnchor")]
            public void SetAnchor (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPUAnchorOffset")]
            public void SetAnchorOffset (Real  x, Real  y, Real  z,
                                         Real dx, Real dy, Real dz);

            [CCode (cname = "dJointSetPUAxis1")]
            public void SetAxis1 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPUAxis2")]
            public void SetAxis2 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPUAxis3")]
            public void SetAxis3 (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPUAxisP")]
            public void SetAxisP (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPUParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointAddPUTorque")]
            public void AddTorque (Real torque);

            [CCode (cname = "dJointGetPUAnchor")]
            public void GetAnchor (Vector3 result);

            [CCode (cname = "dJointGetPUPosition")]
            public Real GetPosition ( );

            [CCode (cname = "dJointGetPUPositionRate")]
            public Real GetPositionRate ( );

            [CCode (cname = "dJointGetPUAxis1")]
            public void GetAxis1 (Vector3 result);

            [CCode (cname = "dJointGetPUAxis2")]
            public void GetAxis2 (Vector3 result);

            [CCode (cname = "dJointGetPUAxis3")]
            public void GetAxis3 (Vector3 result);

            [CCode (cname = "dJointGetPUAxisP")]
            public void GetAxisP (Vector3 result);

            [CCode (cname = "dJointGetPUAngles")]
            public void GetAngles (Real* angle1, Real* angle2);

            [CCode (cname = "dJointGetPUAngle1")]
            public Real GetAngle1 ( );

            [CCode (cname = "dJointGetPUAngle1Rate")]
            public Real GetAngle1Rate ( );

            [CCode (cname = "dJointGetPUAngle2")]
            public Real GetAngle2 ( );

            [CCode (cname = "dJointGetPUAngle2Rate")]
            public Real GetAngle2Rate ( );

            [CCode (cname = "dJointGetPUParam")]
            public Real GetParam (int parameter);
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Piston : Joint {
            [CCode (cname = "dJointCreatePiston")]
            public Piston (World world, JointGroup? group);

            [CCode (cname = "dJointSetPistonAnchor")]
            public void SetAnchor (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPistonAnchorOffset")]
            public void SetAnchorOffset(Real  x, Real  y, Real  z,
                                        Real dx, Real dy, Real dz);

            [CCode (cname = "dJointSetPistonAxis")]
            public void SetAxis (Real x, Real y, Real z);

            [CCode (cname = "dJointSetPistonParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointAddPistonForce")]
            public void AddForce (Real force);

            [CCode (cname = "dJointGetPistonPosition")]
            public Real GetPosition ( );

            [CCode (cname = "dJointGetPistonPositionRate")]
            public Real GetPositionRate ( );

            [CCode (cname = "dJointGetPistonAngle")]
            public Real GetAngle ( );

            [CCode (cname = "dJointGetPistonAngleRate")]
            public Real GetAngleRate ( );

            [CCode (cname = "dJointGetPistonAnchor")]
            public void GetAnchor (Vector3 result);

            [CCode (cname = "dJointGetPistonAnchor2")]
            public void GetAnchor2 (Vector3 result);

            [CCode (cname = "dJointGetPistonAxis")]
            public void GetAxis (Vector3 result);

            [CCode (cname = "dJointGetPistonParam")]
            public Real GetParam (int parameter);
        }

        [Compact]
        [CCode (cname="struct dxJoint", cprefix="dJoint",
                free_function="dJointDestroy")]
        public class Fixed : Joint {
            [CCode (cname = "dJointCreateFixed")]
            public Fixed (World world, JointGroup? group);

            [CCode (cname = "dJointSetFixed")]
            public void Set ( );

            [CCode (cname = "dJointSetFixedParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointGetFixedParam")]
            public Real GetParam (int parameter);
        }

        [Compact]
        [CCode (cname="struct dxJoint", free_function="dJointDestroy")]
        public class AMotor : Joint {
            [CCode (cname = "dJointCreateAMotor")]
            public AMotor (World world, JointGroup? group);

            [CCode (cname = "dJointSetAMotorNumAxes")]
            public void SetNumAxes (int num);

            [CCode (cname = "dJointSetAMotorAxis")]
            public void SetAxis (int anum, int rel, Real x, Real y, Real z);

            [CCode (cname = "dJointSetAMotorAngle")]
            public void SetAngle (int anum, Real angle);

            [CCode (cname = "dJointSetAMotorParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointSetAMotorMode")]
            public void SetMode (int mode);

            [CCode (cname = "dJointAddAMotorTorques")]
            public void AddTorques (Real torque1, Real torque2, Real torque3);

            [CCode (cname = "dJointGetAMotorNumAxes")]
            public int GetNumAxes ( );

            [CCode (cname = "dJointGetAMotorAxis")]
            public void GetAxis (int anum, Vector3 result);

            [CCode (cname = "dJointGetAMotorAxisRel")]
            public int GetAxisRel (int anum);

            [CCode (cname = "dJointGetAMotorAngle")]
            public Real GetAngle (int anum);

            [CCode (cname = "dJointGetAMotorAngleRate")]
            public Real GetAngleRate (int anum);

            [CCode (cname = "dJointGetAMotorParam")]
            public Real GetParam (int parameter);

            [CCode (cname = "dJointGetAMotorMode")]
            public int GetMode ( );
        }

        [Compact]
        [CCode (cname="struct dxJoint", free_function="dJointDestroy")]
        public class LMotor : Joint {
            [CCode (cname = "dJointCreateLMotor")]
            public LMotor (World world, JointGroup? group);

            [CCode (cname = "dJointSetLMotorNumAxes")]
            public void SetNumAxes (int num);

            [CCode (cname = "dJointSetLMotorAxis")]
            public void SetAxis (int anum, int rel, Real x, Real y, Real z);

            [CCode (cname = "dJointSetLMotorParam")]
            public void SetParam (int parameter, Real value);

            [CCode (cname = "dJointGetLMotorNumAxes")]
            public int GetNumAxes ( );

            [CCode (cname = "dJointGetLMotorAxis")]
            public void GetAxis (int anum, Vector3 result);

            [CCode (cname = "dJointGetLMotorParam")]
            public Real GetParam (int parameter);
        }

        [Compact]
        [CCode (cname="struct dxJoint", free_function="dJointDestroy")]
        public class Plane2D : Joint {
            [CCode (cname = "dJointCreatePlane2D")]
            public Plane2D (World world, JointGroup? group);

            [CCode (cname = "dJointSetPlane2DXParam")]
            public void SetXParam (int parameter, Real value);

            [CCode (cname = "dJointSetPlane2DYParam")]
            public void SetYParam (int parameter, Real value);

            [CCode (cname = "dJointSetPlane2DAngleParam")]
            public void SetAngleParam (int parameter, Real value);
        }
    }

    /***********************************************************************\
      collision.h                                                          */

    namespace geoms {
        public struct GeomClass {
            public int bytes;
            public GetColliderFnFn *collider;
            public GetAABBFn *aabb;
            public AABBTestFn *aabb_test;
            public DtorFn *dtor;
        }

        public int CreateGeomClass (ref GeomClass classptr);

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeom",
                free_function="dGeomDestroy")]
        public class Geom {
            [CCode (cname = "dCreateGeom")]
            public Geom (int classnum);
            [CCode (cname = "dCollide")]
            public int           Collide (Geom o2, int flags,
                                          ContactGeomArray contacts, int skip);
            public void*         GetClassData ( );
            public void          SetData (void *data);
            public void*         GetData ( );
            public void          SetBody (Body? body);
            public unowned Body? GetBody ( );
            [CCode (cname = "dBodyGetNextGeom")]
            public geoms.Geom?   GetNextGeom( );
            public void          SetPosition (Real x, Real y, Real z);
            public void          SetRotation (Matrix3 R);
            public void          SetQuaternion (Quaternion Q);
            public unowned Vector3 GetPosition ( );
            public void          CopyPosition (Vector3 pos);
            public unowned Matrix3 GetRotation ( );
            public void          CopyRotation (Matrix3 R);
            public void          GetQuaternion (Quaternion result);
            public void          GetAABB (AABB aabb);
            public int           IsSpace ( );
            public unowned spaces.Space? GetSpace ( );
            public int           GetClass ( );
            public void          SetCategoryBits (ulong bits);
            public void          SetCollideBits (ulong bits);
            public ulong         GetCategoryBits ( );
            public ulong         GetCollideBits ( );
            public void          Enable ( );
            public void          Disable ( );
            public int           IsEnabled ( );
            public void          SetOffsetPosition (Real x, Real y, Real z);
            public void          SetOffsetRotation (ref Matrix3 R);
            public void          SetOffsetQuaternion (ref Quaternion Q);
            public void          SetOffsetWorldPosition (Real x, Real y, Real z);
            public void          SetOffsetWorldRotation (ref Matrix3 R);
            public void          SetOffsetWorldQuaternion (ref Quaternion Q);
            public void          ClearOffset ( );
            public int           IsOffset ( );
            public unowned Real* GetOffsetPosition ( );
            public void          CopyOffsetPosition (Vector3 pos);
            public unowned Real* GetOffsetRotation ( );
            public void          CopyOffsetRotation (Matrix3 R);
            public void          GetOffsetQuaternion (Quaternion result);
            [CCode (cname="dSpaceCollide2")]
            public void          Collide2 (geoms.Geom other,
                                           [CCode (delegate_target_pos=0.9)]
                                           NearCallback callback);
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeomSphere",
                free_function="dGeomDestroy")]
        public class Sphere : Geom {
            [CCode (cname = "dCreateSphere")]
            public Sphere (spaces.Space? space, Real radius);
            public void          SetRadius (Real radius);
            public Real          GetRadius ( );
            public Real          PointDepth (Real x, Real y, Real z);
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeom",
                free_function="dGeomDestroy")]
        public class Convex : Geom {
            [CCode (cname = "dCreateConvex")]
            public Convex         (spaces.Space? space, Real[] _planes,
                                   Real[] _points, uint* _polygons);
            public void SetConvex (Real[] _planes, Real[] _points,
                                   uint *_polygons);
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeomBox",
                free_function="dGeomDestroy")]
        public class Box : Geom {
            [CCode (cname = "dCreateBox")]
            public Box (spaces.Space? space, Real lx, Real ly, Real lz);
            public void SetLengths (Real lx, Real ly, Real lz);
            public void GetLengths (Vector3 result);
            public Real PointDepth (Real x, Real y, Real z);
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeomPlane",
                free_function="dGeomDestroy")]
        public class Plane : Geom {
            [CCode (cname = "dCreatePlane")]
            public Plane (spaces.Space? space, Real a, Real b, Real c, Real d);
            public void SetParams  (Real a, Real b, Real c, Real d);
            public void GetParams  (Vector4 result);
            public Real PointDepth (Real x, Real y, Real z);
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeomCapsule",
                free_function="dGeomDestroy")]
        public class Capsule : Geom {
            [CCode (cname = "dCreateCapsule")]
            public Capsule                (spaces.Space? space,
                                           Real radius, Real length);
            public void SetParams  (Real radius, Real length);
            public void GetParams  (out Real radius, out Real length);
            public Real PointDepth (Real x, Real y, Real z);
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeomCylinder",
                free_function="dGeomDestroy")]
        public class Cylinder : Geom {
            [CCode (cname = "dCreateCylinder")]
            public Cylinder               (spaces.Space? space,
                                           Real radius, Real length);
            public void SetParams (Real radius, Real length);
            public void GetParams (out Real radius, out Real length);
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeomRay",
                free_function="dGeomDestroy")]
        public class Ray : Geom {
            [CCode (cname = "dCreateRay")]
            public Ray                   (spaces.Space? space, Real length);
            public void SetLength     (Real length);
            public Real GetLength     ( );
            public void Set           (Real px, Real py, Real pz,
                                          Real dx, Real dy, Real dz);
            public void Get           (Vector3 start, Vector3 dir);
            public void SetParams     (int FirstContact, int BackfaceCull);
            public void GetParams     (out int* FirstContact,
                                          out int* BackfaceCull);
            public void SetClosestHit (int closestHit);
            public int  GetClosestHit ( );
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeomTransform",
                free_function="dGeomDestroy")]
        public class Transform : Geom {
            [CCode (cname = "dCreateGeomTransform")]
            public Transform                (spaces.Space? space);

            public void SetGeom    (Geom obj);
            public Geom GetGeom    ( );
            public void SetCleanup (int mode);
            public int  GetCleanup ( );
            public void SetInfo    (int mode);
            public int  GetInfo    ( );
        }

        [Compact]
        [CCode (cname="struct dxGeom", cprefix="dGeom",
                free_function="dGeomDestroy")]
        public class Heightfield : Geom {
            [CCode (cname = "dCreateHeightfield")]
            public Heightfield              (spaces.Space? space,
                                             HeightfieldData data,
                                             int bPlaceable);
            public void SetHeightfieldData  (HeightfieldData d);
            public HeightfieldData GetHeightfieldData ( );
        }

        [Compact]
        [CCode (cname="struct dxHeightfieldData",
                cprefix="dGeomHeightfieldData",
                free_function="dGeomHeightfieldDataDestroy")]
        public class HeightfieldData {
            [CCode (cname = "dGeomHeightfieldDataCreate")]
            public HeightfieldData ( );

            public void BuildCallback  (void* pUserData,
                                        HeightfieldGetHeight* pCallback,
                                        Real width, Real depth,
	                                    int widthSamples, int depthSamples,
	                                    Real scale, Real offset,
	                                    Real thickness, int bWrap);
            public void BuildByte      (uchar* pHeightData,
                                        int bCopyHeightData,
                                        Real width, Real depth,
                                        int widthSamples, int depthSamples,
                                        Real scale, Real offset,
                                        Real thickness, int bWrap);
            public void BuildShort     (short* pHeightData,
                                        int bCopyHeightData,
                                        Real width, Real depth,
                                        int widthSamples, int depthSamples,
                                        Real scale, Real offset,
                                        Real thickness, int bWrap);
            public void BuildSingle    (float* pHeightData,
                                        int bCopyHeightData,
                                        Real width, Real depth,
                                        int widthSamples, int depthSamples,
                                        Real scale, Real offset,
                                        Real thickness, int bWrap);
            public void BuildDouble    (double* pHeightData,
                                        int bCopyHeightData,
                                        Real width, Real depth,
                                        int widthSamples, int depthSamples,
                                        Real scale, Real offset,
                                        Real thickness, int bWrap);
            public void SetBounds      (Real minHeight, Real maxHeight);
        }

        public delegate Real HeightfieldGetHeight (void* p_user_data,
                                                   int x, int z);

        public delegate void GetAABBFn (Geom o, ref AABB aabb);
        public delegate int ColliderFn (Geom o1, Geom o2, int flags,
    			                        ContactGeomArray contact, int skip);
        public delegate ColliderFn* GetColliderFnFn (int num);
        public delegate void DtorFn    (Geom o);
        public delegate int AABBTestFn (Geom o1, Geom o2, ref AABB aabb);
    }

    public enum settings {
        dMaxUserClasses = 4,
    }

    public enum geomclasses {
        dSphereClass = 0,
        dBoxClass,
        dCapsuleClass,
        dCylinderClass,
        dPlaneClass,
        dRayClass,
        dConvexClass,
        TransformClass,
        dTriMeshClass,
        dHeightfieldClass,
        dFirstSpaceClass,
        dSimpleSpaceClass ,
        dHashSpaceClass,
        dSweepAndPruneSpaceClass,
        dQuadTreeSpaceClass,
        dLastSpaceClass,
        dFirstUserClass,
        dLastUserClass,
        NumClasses
    }

    public void ClosestLineSegmentPoints(ref Vector3 a1, ref Vector3 a2,
                                         ref Vector3 b1, ref Vector3 b2,
                                         Vector3 cp1, Vector3 cp2);
    public int BoxTouchesBox            (ref Vector3 _p1, ref Matrix3 R1,
                                         ref Vector3 side1, ref Vector3 _p2,
                                         ref Matrix3 R2, ref Vector3 side2);
    public int BoxBox                   (ref Vector3 p1, ref Matrix3 R1,
                                         ref Vector3 side1, ref Vector3 p2,
                                         ref Matrix3 R2, ref Vector3 side2,
                                         Vector3 normal, Real* depth,
                                         out int return_code, int flags,
                                         ContactGeomArray contact, int skip);
    public void InfiniteAABB            (ref AABB aabb);
    public void SetColliderOverride     (int i, int j, geoms.ColliderFn* fn);


    /***********************************************************************\
      collision_space.h                                                    */

    [CCode (instance_pos=0.9)]
    public delegate void NearCallback (geoms.Geom o1, geoms.Geom o2);

    namespace spaces {
        [Compact]
        [CCode (cname="struct dxSpace", cprefix="dSpace",
                free_function="dSpaceDestroy")]
        public class Space : geoms.Geom {
            [CCode (cname = "dSimpleSpaceCreate")]
            public Space                    (Space? parent);
            public void          SetCleanup (int mode);
            public int           GetCleanup ( );
            public void          SetSublevel(int sublevel);
            public int           GetSublevel( );
            public void          Add        (geoms.Geom g);
            public void          Remove     (geoms.Geom g);
            public int           Query      (geoms.Geom g);
            public void          Clean      ( );
            public int           GetNumGeoms( );
            public geoms.Geom    GetGeom    (int i);
            public int           GetClass   ( );
            // from collision.h :
            public void          Collide    ([CCode (delegate_target_pos=0.9)]
                                             NearCallback func);
        }

        [Compact]
        [CCode (cname="struct dxSpace", cprefix="dHashSpace",
                        free_function="dSpaceDestroy")]
        public class HashSpace : Space {
            [CCode (cname = "dHashSpaceCreate")]
            public HashSpace      (Space? parent);
            public void SetLevels (int  minlevel, int  maxlevel);
            public void GetLevels (int* minlevel, int *maxlevel);
        }

        [Compact]
        [CCode (cname="struct dxSpace", cprefix="dQuadTreeSpace",
                free_function="dSpaceDestroy")]
        public class QuadTreeSpace : Space {
        [CCode (cname = "dQuadTreeSpaceCreate")]
        public QuadTreeSpace (Space parent, Vector3 Center,
                              Vector3 Extents, int Depth);
        }

        [Compact]
        [CCode (cname="struct dxSpace", cprefix="dSAP_",
                free_function="dSpaceDestroy")]
        public class SweepAndPruneSpace : Space {
            [CCode (cname = "dSweepAndPruneSpaceCreate")]
            public SweepAndPruneSpace (Space parent, int axisorder);

            [CCode (cprefex="dSAP_AXES_")]
            public class AXES {
                public static const int XYZ;
                public static const int XZY;
                public static const int YXZ;
                public static const int YZX;
                public static const int ZXY;
                public static const int ZYX;
            }
        }
    }


    /***********************************************************************\
      contact.h                                                            */

    [CCode (cprefix="dContact")]
    public enum contacts {
        Mu2           = 0x001,
        FDir1         = 0x002,
        Bounce        = 0x004,
        SoftERP       = 0x008,
        SoftCFM       = 0x010,
        Motion1       = 0x020,
        Motion2       = 0x040,
        MotionN       = 0x080,
        Slip1         = 0x100,
        Slip2         = 0x200,
        Approx0       = 0x0000,
        Approx1_1     = 0x1000,
        Approx1_2     = 0x2000,
        Approx1       = 0x3000
    }

    [CCode (has_copy_function=false, has_destroy_function=false)]
    public struct SurfaceParameters {
        int mode;
        Real mu;
        Real mu2;
        Real bounce;
        Real bounce_vel;
        Real soft_erp;
        Real soft_cfm;
        Real motion1;
        Real motion2;
        Real motionN;
        Real slip1;
        Real slip2;
    }

    public struct ContactGeom {
        Real px;
        Real py;
        Real pz;
        Real pw;
        Real nx;
        Real ny;
        Real nz;
        Real nw;
        Real depth;
        unowned geoms.Geom g1;
        unowned geoms.Geom g2;
        int side1;
        int side2;
    }

    // This class is a workaround for Vala's lack of proper struct arrays
    // Please, forgive me.  ~ Arc 2011-03-05
    [Compact, CCode (cname="dContactGeom")]
    public class ContactGeomArray {
        public ContactGeomArray(int number);
        [CCode (returns_floating_reference=false)]
        public ContactGeom get(int index);
    }

    [CCode (has_copy_function=false, has_destroy_function=false)]
    public struct Contact {
        SurfaceParameters surface;
        ContactGeom geom;
        unowned Vector3 fdir1;
    }


    /***********************************************************************\
      mass.h                                                               */

    [Compact, CCode (cprefix="dMass")]
    public class Mass {
        public Real mass;

        public Mass ( );

        public int Check ( );
        public void SetParameters   (Real themass,
                                     Real cgx, Real cgy, Real cgz,
                                     Real I11, Real I22, Real I33,
                                     Real I12, Real I13, Real I23);
        public void SetZero         ( );
        public void SetSphere       (Real density, Real radius);
        public void SetSphereTotal  (Real total_mass, Real radius);
        public void SetCapsule      (Real density, int direction,
                                     Real radius, Real length);
        public void SetCapsuleTotal (Real total_mass, int direction,
                                     Real radius, Real length);
        public void SetCylinder     (Real density, int direction,
                                     Real radius, Real length);
        public void SetCylinderTotal(Real total_mass, int direction,
                                     Real radius, Real length);
        public void SetBox          (Real density, Real lx, Real ly, Real lz);
        public void SetBoxTotal     (Real total_m, Real lx, Real ly, Real lz);
        public void SetTrimesh      (Real density, geoms.Geom g);
        public void SetTrimeshTotal (Real total_mass, geoms.Geom g);
        public void Adjust          (Real newmass);
        public void Translate       (Real x, Real y, Real z);
        public void Rotate          (ref Matrix3 R);
        public void Add             (ref Mass* b);
    }


}
