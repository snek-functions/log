from socket import *
import json
from typing import Any, Callable


class ProxyMessage:
    def __init__(self, raw_data: str):
        self.raw_data = raw_data.rstrip()
        self.fnName = None
        self.data: Any = None
        self.parse()

    def parse(self):
        data: dict = json.loads(self.raw_data)

        self.fnName = data.get('fnName', None)
        self.data = data.get('data', None)


class ProxyServer:
    def __init__(self, host: str = '0.0.0.0', port: int = 12000, setup_fn: Callable = None):

        print(f'Starting proxy server on {host}:{port}')

        if setup_fn:
            setup_fn()

        self.serverSocket = socket(AF_INET, SOCK_STREAM)
        self.serverSocket.bind((host, port))
        self.serverSocket.listen(1)

    def handle(self, fn: Callable[[ProxyMessage], Any]):

        while True:
            connectionSocket, addr = self.serverSocket.accept()

            print(f'Connection from {addr}')

            buffer = b''

            while True:
                data = connectionSocket.recv(1024)
                print(data)

                if not data:
                    break
                buffer += data

            message = ProxyMessage(buffer.decode('utf-8'))

            # Call the function
            response = fn(message)

            if not isinstance(response, str):
                response = json.dumps(response)

            # Stringify and encode the response
            response = response.encode()

            connectionSocket.send(response)
            connectionSocket.close()