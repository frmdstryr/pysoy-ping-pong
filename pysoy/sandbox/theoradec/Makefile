PACKAGES := gtkglext-1.0 glib-2.0 gio-2.0 gee-1.0 liboil-0.3 theora ogg

CFLAGS += -g $(shell pkg-config --cflags $(PACKAGES))
LDLIBS += $(shell pkg-config --libs $(PACKAGES)) -ltheoradec

theora_decode_test: theora_decode_test.c
	gcc $^ $(CFLAGS) $(LDLIBS) -o $@

theora_decode_test.c: theora_decode_test.vala
	valac --vapidir ../../lib/vapi/ $(addprefix --pkg=,$(PACKAGES)) -C $^

clean:
	rm theora_decode_test theora_decode_test.c theora_decode_test.h

.PHONY: clean

