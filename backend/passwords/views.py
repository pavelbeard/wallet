from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


# Create your views here.


# protected test view
class PasswordViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["GET"])
    def test_password(self, request):
        return Response(
            [
                {
                    "id": 1,
                    "password": "<PASSWORD>",
                }
            ]
        )
