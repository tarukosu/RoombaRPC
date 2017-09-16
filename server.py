import roomba.create as create
import time
import zerorpc

class RoombaRPC(object):
    def __init__(self, port):
        self.robot = create.Create(port)
        self.robot.toSafeMode()
        self.moving = False
        self.pause()

    def __del__(self):
        self.robot.close()

    def toSafeMode(self):
        self.robot.toSafeMode()

    def pause(self):
        if self.moving:
            self.move(0, 0)
            self.moving = False
        
    def move(self, x, theta):
        print("move: %f, %f" % (x, theta))
        self.robot.go(x, theta)
        self.moving = True

    def moveTo(self, x, theta):
        max_x = 20 # cm/s
        max_theta = 40 # deg/s
        self.move(x * max_x, theta * max_theta)
                
    
if __name__=='__main__':
    RPC_PORT = 6000
    ROOMBA_PORT = "/dev/ttyUSB0"
    s = zerorpc.Server(RoombaRPC(ROOMBA_PORT))
    s.bind("tcp://0.0.0.0:{0}".format(RPC_PORT))
    s.run()

