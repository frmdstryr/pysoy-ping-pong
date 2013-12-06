/*
 *  libsoy - soy.materials.Colored
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
    GL


class soy.materials.Colored : soy.materials.Material

    init
        self._ambient = {1.0f, 1.0f, 1.0f, 1.0f}
        self._diffuse = {1.0f, 1.0f, 1.0f, 1.0f}
        self._specular = {1.0f, 1.0f, 1.0f, 1.0f}
        self._emission = {0.0f, 0.0f, 0.0f, 1.0f}
        self._shades = 0
        self._shininess = 10.0f


    construct (name : string? = null)
        super()

        // If name was not provided, we're good.
        if name is null
            return

        // If we have a named material, use it
        if _map.has_key(name)
            ambient : string
            diffuse : string
            specular : string
            emission : string
            shine : string
            words : array of string = _map[name].split(" ")
            (ambient, diffuse, specular, emission, shine) = words
            self.ambient = new soy.atoms.Color.named(ambient)
            self.diffuse = new soy.atoms.Color.named(diffuse)
            self.specular = new soy.atoms.Color.named(specular)
            self.emission = new soy.atoms.Color.named(emission)
            self._shininess = (float) double.parse(shine)

        // Otherwise base it on a named color
        else
            self.ambient = new soy.atoms.Color.named(name)
            self.diffuse = new soy.atoms.Color.named(name)
            self.specular = new soy.atoms.Color.named(name)
            self.emission = new soy.atoms.Color.named("black")

            delta : float = 1 - ((self.specular.red + self.specular.green +
                                 self.specular.blue) / 255.0f * 3)
            self.specular = new soy.atoms.Color.operate(self.specular, null,
                                                        delta, soy.MathOperator.MUL)

        translucent = _diffuse[3] is not 255


    ////////////////////////////////////////////////////////////////////////
    // Methods

    def override render (pass : int, tslvs: GLvoid*,
                         texmatrix : ode.Matrix3? = null) : bool
        // This Colored is always 1-pass
        if pass == 0
            self.enable_colors()
            self.enable_shades()

            if translucent
                glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
                glEnable(GL_BLEND)
            return true

        // this Colored is clean, never needs cleanup
        return false


    def enable_colors ( )
        // lit Colored colors and settings
        glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT,   _ambient)
        glMaterialfv(GL_FRONT_AND_BACK, GL_DIFFUSE,   _diffuse)
        glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR,  _specular)
        glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION,  _emission)
        glMaterialf (GL_FRONT_AND_BACK, GL_SHININESS, _shininess)


    def enable_shades ( )
        // number of shades, currently just 0 or 1
        if self._shades == 0
            glShadeModel(GL_SMOOTH)
        else
            glShadeModel(GL_FLAT)


    ////////////////////////////////////////////////////////////////////////
    // Properties

    //
    // ambient property
    _ambient : array of GLfloat
    _ambient_obj : weak soy.atoms.Color?

    def _ambient_set(color : soy.atoms.Color)
        self._ambient = color.get4f()

    def _ambient_weak(color : Object)
        self._ambient_obj = null

    prop ambient : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _ambient_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_ambient)
                ret.on_set.connect(self._ambient_set)
                ret.weak_ref(self._ambient_weak)
                _ambient_obj = ret
            return ret
        set
            _ambient = value.get4f()
            _ambient_obj = value
            value.on_set.connect(self._ambient_set)
            value.weak_ref(self._ambient_weak)

    //
    // diffuse property
    _diffuse : array of GLfloat
    _diffuse_obj : weak soy.atoms.Color?

    def _diffuse_set(color : soy.atoms.Color)
        self._diffuse = color.get4f()

    def _diffuse_weak(color : Object)
        self._diffuse_obj = null

    prop diffuse : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _diffuse_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_diffuse)
                ret.on_set.connect(self._diffuse_set)
                ret.weak_ref(self._diffuse_weak)
                _diffuse_obj = ret
            return ret
        set
            _diffuse = value.get4f()
            _diffuse_obj = value
            value.on_set.connect(self._diffuse_set)
            value.weak_ref(self._diffuse_weak)

    //
    // specular property
    _specular : array of GLfloat
    _specular_obj : weak soy.atoms.Color?

    def _specular_set(color : soy.atoms.Color)
        self._specular = color.get4f()

    def _specular_weak(color : Object)
        self._specular_obj = null

    prop specular : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _specular_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_specular)
                ret.on_set.connect(self._specular_set)
                ret.weak_ref(self._specular_weak)
                _specular_obj = ret
            return ret
        set
            _specular = value.get4f()
            _specular_obj = value
            value.on_set.connect(self._specular_set)
            value.weak_ref(self._specular_weak)

    //
    // emission property
    _emission : array of GLfloat
    _emission_obj : weak soy.atoms.Color?

    def _emission_set(color : soy.atoms.Color)
        self._emission = color.get4f()

    def _emission_weak(color : Object)
        self._emission_obj = null

    prop emission : soy.atoms.Color
        owned get
            ret : soy.atoms.Color? = _emission_obj
            if ret == null
                ret = new soy.atoms.Color.new4f(_emission)
                ret.on_set.connect(self._emission_set)
                ret.weak_ref(self._emission_weak)
                _emission_obj = ret
            return ret
        set
            _emission = value.get4f()
            _emission_obj = value
            value.on_set.connect(self._emission_set)
            value.weak_ref(self._emission_weak)

    //
    // shades property
    _shades : int
    prop shades : int
        get
            return _shades
        set
            _shades = value

    //
    // shininess property
    _shininess : float
    prop shininess : float
        get
            return _shininess
        set
            _shininess = value

    //
    // Static properties
    _map : static dict of string, string
    init static
        // _map format: "ambient diffuse specular emission shininess"
        _map = new dict of string, string
        _map["bronze"] = "#3F2510 #663C1A #C57433 black 76"
        _map["chrome"] = "#3F3F3F #666666 #C5C5C5 black 76"
        _map["copper"] = "#3A1607 #8C3610 #943811 black 51"
        _map["gold"] = "#3F3A13 #BF9A39 #A08D5D black 51"
        _map["polishedgold"] = "#3F3910 #585017 #CBB835 black 83"
        _map["silver"] = "#3A3A3A #464646 #C5C5C5 black 89"

