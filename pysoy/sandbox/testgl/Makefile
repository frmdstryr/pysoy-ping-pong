PACKAGES := glib-2.0 gl gtk+-2.0 gtkglext-1.0
VALAFLAGS := --vapidir ../../vapi

testgl: testgl.vala
	valac $(VALAFLAGS) $(addprefix --pkg=,$(PACKAGES))  -o $@ $^

clean:
	rm testgl

.PHONY: clean

