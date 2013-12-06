[indent=4]

init
    // Read SVG
    converter : soy.SGK2PNGConverter = new soy.SGK2PNGConverter()
    svgString : string
    svgSize : size_t
    try
        print("Loading test SVG file...")
        FileUtils.get_contents("./tests/sgk2pngTest_logo.svg", out svgString, out svgSize)
    except f : GLib.FileError
        stdout.printf("Error: %s\n", f.message)
        return
    
    // Process SVG into PNG
    print("Processing SVG into PNG...")
    svgData : array of uchar = (array of uchar) svgString.to_utf8()
    converter.sgk2png(svgData)
    pngData : array of uchar = converter.get_png()
    
    // Output PNG
    print("Writing PNG to file...")
    var file = File.new_for_path("./tests/sgk2pngTest_logo.png")
    if file.query_exists()
        file.delete() // delete previous tests
    var file_stream = file.create(FileCreateFlags.NONE)
    var data_stream = new DataOutputStream (file_stream)
    for character in pngData
        data_stream.put_byte((uint8) character)
    
    print("Done!")
