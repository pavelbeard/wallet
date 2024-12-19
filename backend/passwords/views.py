from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from stuff.utils import super_logger

from passwords.models import PasswordRecord
from passwords.serializers import PasswordRecordSerializer

# Create your views here.

logger = super_logger(__name__)


# protected test view
class PasswordViewSet(viewsets.ModelViewSet):
    queryset = PasswordRecord.objects.all()
    serializer_class = PasswordRecordSerializer

    def list(self, request):
        user = request.user
        queryset = PasswordRecord.objects.filter(wallet_user=user)
        serializer = PasswordRecordSerializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request):
        try:
            user = request.user.id
            serializer = PasswordRecordSerializer(
                data=request.data, context={"pk": user}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save

            return Response(status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.error(e, exc_info=True)
            return Response({"error": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
