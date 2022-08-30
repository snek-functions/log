'''
Setup the proxy handler with `python3 -m log_prototype.proxy_handler`
'''

from .proxy import ProxyServer, ProxyMessage


def function_handler(message: ProxyMessage):
    import json

    log = message.data
    with open('../../../elk/mylog/default.log', 'a') as file:
        file.write(json.dumps(log) + '\n')
        return 'Success'

    return 'Unknown function'


ProxyServer().handle(function_handler)