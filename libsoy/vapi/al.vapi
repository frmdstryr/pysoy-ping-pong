/*
 *  Vala API for OpenAL (al.vapi)
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

/*
NOTE: This vapi is a work-in-progress!
      Not ready for actual use.
*/

[CCode (lower_case_cprefix ="", cheader_filename = "AL/al.h")]
namespace AL {
	/** Basic data types */
	
	// 8-bit boolean
	[CCode (cname="ALboolean")]
	public struct ALboolean : int8 { }
	
	// character
	[CCode (cname="ALchar")]
	public struct ALchar : char { }
	
	// signed 8-bit 2's complement integer
	[CCode (cname="ALbyte")]
	public struct ALbyte : int8 { }
	
	// unsigned 8-bit integer
	[CCode (cname="ALubyte")]
	public struct ALubyte : uint8 { }
	
	// signed 16-bit 2's complement integer
	[CCode (cname="ALshort")]
	public struct ALshort : int16 { }
	
	// unsigned 16-bit integer
	[CCode (cname="ALushort")]
	public struct ALushort : uint16 { }
	
	// signed 32-bit 2's complement integer
	[CCode (cname="ALint")]
	public struct ALint : int32 { }
	
	// unsigned 32-bit integer
	[CCode (cname="ALuint")]
	public struct ALuint : uint32 { }
	
	// non-negative 32-bit binary integer size
	[CCode (cname="ALsizei")]
	public struct ALsizei : int32 { }
	
	// enumerated 32-bit value
	[CCode (cname="ALenum")]
	public struct ALenum : int32 { }
	
	// 32-bit IEEE754 floating-point
	[CCode (cname="ALfloat")]
	public struct ALfloat : float { }
	
	// 64-bit IEEE754 floating-point
	[CCode (cname="ALdouble")]
	public struct ALdouble : double { }
	
	// void type (for opaque pointers only)
	[CCode (cname="ALvoid")]
	public struct ALvoid { }
	
	/** Enumerated values  */
	
	public const ALenum AL_NONE;
	public const ALenum AL_FALSE;
	public const ALenum AL_TRUE;
	public const ALenum AL_SOURCE_RELATIVE;
	public const ALenum AL_CONE_INNER_ANGLE;
	public const ALenum AL_CONE_OUTER_ANGLE;
	public const ALenum AL_PITCH;
	public const ALenum AL_POSITION;
	public const ALenum AL_DIRECTION;
	public const ALenum AL_VELOCITY;
	public const ALenum AL_LOOPING;
	public const ALenum AL_BUFFER;
	public const ALenum AL_GAIN;
	public const ALenum AL_MIN_GAIN;
	public const ALenum AL_MAX_GAIN;
	public const ALenum AL_ORIENTATION;
	
	// Source state information
	public const ALenum AL_SOURCE_STATE;
	public const ALenum AL_INITIAL;
	public const ALenum AL_PLAYING;
	public const ALenum AL_PAUSED;
	public const ALenum AL_STOPPED;
	
	// Buffer Queue params
	public const ALenum AL_BUFFERS_QUEUED;
	public const ALenum AL_BUFFERS_PROCESSED;
	
	// Source buffer position information
	public const ALenum AL_SEC_OFFSET;
	public const ALenum AL_SAMPLE_OFFSET;
	public const ALenum AL_BYTE_OFFSET;
	
	// Source types
	public const ALenum AL_SOURCE_TYPE;
	public const ALenum AL_STATIC;
	public const ALenum AL_STREAMING;
	public const ALenum AL_UNDETERMINED;
	
	// Sound samples: format specifier
	public const ALenum AL_FORMAT_MONO8;
	public const ALenum AL_FORMAT_MONO16;
	public const ALenum AL_FORMAT_STEREO8;
	public const ALenum AL_FORMAT_STEREO16;
	
	public const ALenum AL_REFERENCE_DISTANCE;
	public const ALenum AL_ROLLOFF_FACTOR;
	public const ALenum AL_CONE_OUTER_GAIN;
	public const ALenum AL_MAX_DISTANCE;
	
	// Sounds samples: frequency
	public const ALenum AL_FREQUENCY;
	public const ALenum AL_BITS;
	public const ALenum AL_CHANNELS;
	public const ALenum AL_SIZE;
	
	// Buffer state
	public const ALenum AL_UNUSED;
	public const ALenum AL_PENDING;
	public const ALenum AL_PROCESSED;
	
	// Errors
	public const ALenum AL_NO_ERROR;

	public const ALenum AL_INVALID_NAME;
	public const ALenum AL_INVALID_ENUM;
	public const ALenum AL_INVALID_VALUE;
	public const ALenum AL_INVALID_OPERATION;
	public const ALenum AL_OUT_OF_MEMORY;

	// Context strings: Vendor name
	public const ALenum AL_VENDOR;
	public const ALenum AL_VERSION;
	public const ALenum AL_RENDERER;
	public const ALenum AL_EXTENSIONS;
	
	// Global tweakage
	public const ALenum AL_DOPPLER_FACTOR;
	public const ALenum AL_DOPPLER_VELOCITY;
	public const ALenum AL_SPEED_OF_SOUND;
	
	// Distance models
	public const ALenum AL_DISTANCE_MODEL;
	public const ALenum AL_INVERSE_DISTANCE;
	public const ALenum AL_INVERSE_DISTANCE_CLAMPED;
	public const ALenum AL_LINEAR_DISTANCE;
	public const ALenum AL_LINEAR_DISTANCE_CLAMPED;
	public const ALenum AL_EXPONENT_DISTANCE;
	public const ALenum AL_EXPONENT_DISTANCE_CLAMPED;
	
	/** Functions  */
	
	// Renderer State management	
	public static void alEnable(ALenum capability);
	public static void alDisable(ALenum capability);
	public static ALboolean alIsEnabled(ALenum capability);
	
	// State retrieval
	public static ALchar* alGetString(ALenum param);
	public static void alGetBooleanv(ALenum param, ALboolean* data);
	public static void alGetIntegerv(ALenum param, ALint* data);
	public static void alGetFloatv(ALenum param, ALfloat*  data);
	public static void alGetDoublev(ALenum param, ALdouble* data);
	public static ALboolean alGetBoolean(ALenum param);
	public static ALint alGetInteger(ALenum param);
	public static ALfloat alGetFloat(ALenum param);
	public static ALdouble alGetDouble(ALenum param);
	
	// Error support
	public static ALenum alGetError();
	
	// Extension support
	public static ALboolean alIsExtensionPresent(ALchar* extname);
	public static void* alGetProcAddress(ALchar* fname);
	public static ALenum alGetEnumValue(ALchar* ename);

	/** LISTENER */
	
	// Setters
	public static void alListenerf(ALenum param, ALfloat value);
	public static void alListener3f(ALenum param, ALfloat value1, 
									ALfloat value2, ALfloat value3);
	public static void alListenerfv(ALenum param, ALfloat* values);
	public static void alListeneri(ALenum param, ALint value);
	public static void alListener3i(ALenum param, ALint value1, ALint value2, 
									ALint value3);
	public static void alListeneriv(ALenum param, ALint* values);

	// Getters
	public static void alGetListenerf(ALenum param, ALfloat* value);
	public static void alGetListener3f(ALenum param, ALfloat *value1, 
									   ALfloat *value2, ALfloat *value3);
	public static void alGetListenerfv(ALenum param, ALfloat* values);
	public static void alGetListeneri(ALenum param, ALint* value);
	public static void alGetListener3i(ALenum param, ALint *value1, 
									   ALint *value2, ALint *value3);
	public static void alGetListeneriv(ALenum param, ALint* values);

	/** SOURCE */
	
	public static void alGenSources(ALsizei n, ALuint* sources);
	public static void alDeleteSources(ALsizei n, ALuint* sources);
	public static ALboolean alIsSource(ALuint sid);
	
	// Setters
	public static void alSourcef(ALuint sid, ALenum param, ALfloat value);
	public static void alSource3f(ALuint sid, ALenum param, ALfloat value1, 
								  ALfloat value2, ALfloat value3); 
	public static void alSourcefv(ALuint sid, ALenum param, 
								  ALfloat* values);
	public static void alSourcei(ALuint sid, ALenum param, ALint value);
	public static void alSource3i(ALuint sid, ALenum param, ALint value1, 
								  ALint value2, ALint value3); 
	public static void alSourceiv(ALuint sid, ALenum param, 
								  ALint* values); 
	
	// Getters
	public static void alGetSourcef(ALuint sid, ALenum param, ALfloat* value);
	public static void alGetSource3f(ALuint sid, ALenum param, ALfloat* value1,
									 ALfloat* value2, ALfloat* value3); 
	public static void alGetSourcefv(ALuint sid, ALenum param, ALfloat* values);
	public static void alGetSourcei(ALuint sid,  ALenum param, ALint* value); 
	public static void alGetSource3i(ALuint sid, ALenum param, ALint* value1,
									 ALint* value2, ALint* value3); 
	public static void alGetSourceiv(ALuint sid,  ALenum param, ALint* values);
	
	public static void alSourcePlayv(ALsizei ns, ALuint *sids); 
	public static void alSourceStopv(ALsizei ns, ALuint *sids); 
	public static void alSourceRewindv(ALsizei ns, ALuint *sids); 
	public static void alSourcePausev(ALsizei ns, ALuint *sids);
	
	public static void alSourcePlay(ALuint sid); 
	public static void alSourceStop(ALuint sid); 
	public static void alSourceRewind(ALuint sid); 
	public static void alSourcePause(ALuint sid); 
	
	public static void alSourceQueueBuffers(ALuint sid, ALsizei numEntries, 
											ALuint *bids); 
	public static void alSourceUnqueueBuffers(ALuint sid, ALsizei numEntries, 
											  ALuint *bids); 

	/** BUFFER */
	public static void alGenBuffers(ALsizei n, ALuint* buffers); 
	public static void alDeleteBuffers(ALsizei n, ALuint* buffers);
	public static ALboolean alIsBuffer(ALuint bid); 
	public static void alBufferData(ALuint bid, ALenum format,
									ALvoid* data, ALsizei size, ALsizei freq); 

	// Setters
	public static void alBufferf(ALuint bid, ALenum param, ALfloat value);
	public static void alBuffer3f(ALuint bid, ALenum param, ALfloat value1, 
								  ALfloat value2, ALfloat value3);
	public static void alBufferfv(ALuint bid, ALenum param, 
								  ALfloat* values); 
	public static void alBufferi(ALuint bid, ALenum param, ALint value); 
	public static void alBuffer3i(ALuint bid, ALenum param, ALint value1, 
								  ALint value2, ALint value3);
	public static void alBufferiv(ALuint bid, ALenum param, 
								  ALint* values); 
	
	// Getters
	public static void alGetBufferf(ALuint bid, ALenum param, ALfloat* value); 
	public static void alGetBuffer3f(ALuint bid, ALenum param, ALfloat* value1,
									 ALfloat* value2, ALfloat* value3); 
	public static void alGetBufferfv(ALuint bid, ALenum param, ALfloat* values); 
	public static void alGetBufferi(ALuint bid, ALenum param, ALint* value); 
	public static void alGetBuffer3i(ALuint bid, ALenum param, ALint* value1, 
									 ALint* value2, ALint* value3); 
	public static void alGetBufferiv(ALuint bid, ALenum param, ALint* values); 
	
	// Global parameters
	public static void alDopplerFactor( ALfloat value ); 
	public static void alDopplerVelocity( ALfloat value ); 
	public static void alSpeedOfSound( ALfloat value ); 
	public static void alDistanceModel( ALenum distanceModel ); 
}

