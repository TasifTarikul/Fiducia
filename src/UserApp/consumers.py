from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        # user_id = self.scope['url_route']['kwargs']['userid']
        # print(user_id)
        self.group_name = 'client_notification'

        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )
        print('web socket disconnected')

    # Receive message from websocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send the message to the group
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'notification_message',
                'message': message
            }
        )
        print(text_data)
        # self.close(code=4123)

    # Receive message from group
    def notification_message(self, event):
        message = event['message']

        # Send message to Websocket
        self.send(text_data=json.dumps({
            'message': message,
        }))

        # self.close(code=4123)

