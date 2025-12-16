const NetInfoMock = {
  isConnected: true,
  isInternetReachable: true,
  type: 'wifi',
  details: null,

  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: NetInfoMock.isConnected,
      isInternetReachable: NetInfoMock.isInternetReachable,
      type: NetInfoMock.type,
      details: NetInfoMock.details,
    })
  ),

  addEventListener: jest.fn((callback) => {
    return () => {};
  }),

  setConnected: (status: boolean) => {
    NetInfoMock.isConnected = status;
    NetInfoMock.isInternetReachable = status;
    NetInfoMock.fetch.mockResolvedValue({
      isConnected: status,
      isInternetReachable: status,
      type: NetInfoMock.type,
      details: NetInfoMock.details,
    });
  },
};

export default NetInfoMock;

