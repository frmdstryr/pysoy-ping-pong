import datetime
import logging

def setup_logging():
    log = logging.getLogger()
    #hdlr = logging.FileHandler('../puzzle26_%s.log'%(datetime.datetime.now().strftime("%Y%h%d%H%M%S")))
    hdlr = logging.StreamHandler()
    formatter = logging.Formatter('%(levelname)s|%(message)s')
    #hdlr.setFormatter(formatter)
    hdlr.setFormatter(formatter)
    log.addHandler(hdlr)
    #log.addHandler(hdlr2)  
    log.setLevel(logging.DEBUG)