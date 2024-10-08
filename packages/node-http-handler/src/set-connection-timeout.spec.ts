import { setConnectionTimeout } from "./set-connection-timeout";

describe("setConnectionTimeout", () => {
  const reject = jest.fn();
  const clientRequest: any = {
    on: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("will not attach listeners if timeout is 0", () => {
    setConnectionTimeout(clientRequest, reject, 0);
    expect(clientRequest.on).not.toHaveBeenCalled();
  });

  it("will not attach listeners if timeout is not provided", () => {
    setConnectionTimeout(clientRequest, reject);
    expect(clientRequest.on).not.toHaveBeenCalled();
  });

  describe("when timeout is provided", () => {
    const timeoutInMs = 100;
    const mockSocket = {
      connecting: true,
      on: jest.fn(),
    };

    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers: true });
      setConnectionTimeout(clientRequest, reject, timeoutInMs);
    });

    afterEach(() => {
      jest.advanceTimersByTime(10000);
      jest.useRealTimers();
    });

    it("attaches listener", () => {
      expect(clientRequest.on).toHaveBeenCalledTimes(1);
      expect(clientRequest.on).toHaveBeenCalledWith("socket", expect.any(Function));
    });

    it("doesn't set timeout if socket is already connected", () => {
      clientRequest.on.mock.calls[0][1]({
        ...mockSocket,
        connecting: false,
      });
      expect(mockSocket.on).not.toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
    });

    it("rejects and aborts request if socket isn't connected by timeout", () => {
      clientRequest.on.mock.calls[0][1](mockSocket);
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), timeoutInMs);
      expect(mockSocket.on).toHaveBeenCalledTimes(1);
      expect(mockSocket.on).toHaveBeenCalledWith("connect", expect.any(Function));

      expect(clientRequest.destroy).not.toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();

      // Fast-forward until timer has been executed.
      jest.advanceTimersByTime(timeoutInMs);
      expect(clientRequest.destroy).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledWith(
        Object.assign(new Error(`Socket timed out without establishing a connection within ${timeoutInMs} ms`), {
          name: "TimeoutError",
        })
      );
    });

    it("calls socket operations directly if socket is available", async () => {
      const request = {
        on: jest.fn(),
        socket: {
          on: jest.fn(),
          connecting: true,
        },
        destroy() {},
      } as any;
      setConnectionTimeout(request, () => {}, 1);
      jest.runAllTimers();

      expect(request.socket.on).toHaveBeenCalled();
      expect(request.on).not.toHaveBeenCalled();
    });

    it("clears timeout if socket gets connected", () => {
      clientRequest.on.mock.calls[0][1](mockSocket);

      expect(clientRequest.destroy).not.toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(clearTimeout).not.toHaveBeenCalled();

      // Fast-forward for half the amount of time and call connect callback to clear timer.
      jest.advanceTimersByTime(timeoutInMs / 2);
      mockSocket.on.mock.calls[0][1]();

      expect(clearTimeout).toHaveBeenCalled();

      // Fast-forward until timer has been executed.
      jest.runAllTimers();
      expect(clientRequest.destroy).not.toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
    });
  });
});
